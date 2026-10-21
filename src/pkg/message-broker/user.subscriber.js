const {
  reciverMessageData,
  reprocessDLQMessages,
} = require("./message-broker.pkg");
const {
  getChannel,
  onChannelReady,
} = require("../../config/message-broker.config");
const { DetailUsers, TblUserLoginHistory } = require("../../models");
const { UAParser } = require("ua-parser-js");

let consumerRegistered = false;

const consumeUserActivatedQueue = async () => {
  await reciverMessageData("user_activated", async (msg) => {
    if (!msg) return;

    const payload = JSON.parse(msg.content.toString());
    console.log("[user-service] Received 'user_activated' payload:", payload);

    const { uuid, username, email } = payload;
    if (!uuid) {
      console.warn("[user-service] Missing uuid in message payload");
      return;
    }

    const existingDetail = await DetailUsers.findOne({ where: { uuid } });
    if (!existingDetail) {
      await DetailUsers.create({
        uuid,
        username,
        email,
        firstName: "",
        lastName: "",
        phone: "",
        gender: "tidak ada",
        link_pict: "",
      });
      console.log(
        `[user-service] Successfully created DetailUsers record for uuid: ${uuid}`,
      );
    } else {
      console.log(
        `[user-service] DetailUsers record for uuid ${uuid} already exists.`,
      );
    }
  });
};

const consumeUserLoginHistoryQueue = async () => {
  await reciverMessageData("user_login_history", async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      console.log(
        "[user-service] Received 'user_login_history' payload:",
        payload,
      );

      let browser = payload.browser || "Unknown Browser";
      let os = payload.os || "Unknown OS";
      let device = payload.device || "Desktop";

      if (payload.user_agent) {
        try {
          const parser = new UAParser(payload.user_agent);
          const ua = parser.getResult();
          if (ua.browser && ua.browser.name) {
            browser = `${ua.browser.name} ${ua.browser.version || ""}`.trim();
          }
          if (ua.os && ua.os.name) {
            os = `${ua.os.name} ${ua.os.version || ""}`.trim();
          }
          if (ua.device && ua.device.type) {
            device =
              ua.device.type.charAt(0).toUpperCase() + ua.device.type.slice(1);
          }
        } catch (uaErr) {
          console.warn(
            "[user-service] Failed parsing user agent:",
            uaErr.message,
          );
        }
      }

      let validUuidUser = null;
      if (payload.uuid_user) {
        let userExists = await DetailUsers.findOne({
          where: { uuid: payload.uuid_user },
          attributes: ["uuid"],
        });
        if (!userExists && payload.email) {
          try {
            userExists = await DetailUsers.create({
              uuid: payload.uuid_user,
              username: payload.username || payload.email.split("@")[0],
              email: payload.email,
              firstName: "",
              lastName: "",
              phone: "",
              gender: "tidak ada",
              link_pict: "",
            });
          } catch (createErr) {
            console.warn(
              "[user-service] Auto-create DetailUsers on login history failed:",
              createErr.message,
            );
          }
        }
        if (userExists) {
          validUuidUser = payload.uuid_user;
        }
      }

      await TblUserLoginHistory.create({
        uuid_user: validUuidUser,
        email: payload.email || null,
        ip_address: payload.ip_address || "Unknown",
        device: device,
        browser: browser,
        os: os,
        city: payload.city || null,
        region: payload.region || null,
        country: payload.country || null,
        timezone: payload.timezone || null,
        lat: payload.lat !== undefined ? payload.lat : null,
        lng: payload.lng !== undefined ? payload.lng : null,
        address: payload.address || null,
        user_agent: payload.user_agent || null,
        status: payload.status || "SUCCESS",
        failure_reason: payload.failure_reason || null,
        login_at: payload.login_at || new Date(),
      });

      console.log(
        `[user-service] Successfully created login history record for user: ${payload.email || payload.uuid_user}`,
      );
    } catch (err) {
      console.error(
        "[user-service] Error saving login history record:",
        err.message,
      );
    }
  });
};

/**
 * Listens to 'user_activated' queue from RabbitMQ
 * and creates a new DetailUsers record in database.
 * Also attempts to reprocess any DLQ messages when listener starts.
 */
const listenUserActivatedQueue = async () => {
  if (consumerRegistered) return;
  consumerRegistered = true;

  const startListener = async () => {
    await consumeUserActivatedQueue();
    await consumeUserLoginHistoryQueue();
    setTimeout(async () => {
      try {
        await reprocessDLQMessages("user_activated");
        await reprocessDLQMessages("user_login_history");
      } catch (dlqErr) {
        console.error("[user-service] Auto DLQ replay error:", dlqErr.message);
      }
    }, 3000);
  };

  onChannelReady(startListener);

  try {
    if (getChannel()) await startListener();
  } catch (error) {
    console.error(
      "[user-service] Failed to start 'user_activated' listener:",
      error.message,
    );
  }
};

module.exports = {
  listenUserActivatedQueue,
  consumeUserLoginHistoryQueue,
};
