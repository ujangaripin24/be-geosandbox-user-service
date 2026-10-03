const { reciverMessageData, reprocessDLQMessages } = require("./message-broker.pkg");
const { getChannel, onChannelReady } = require("../../config/message-broker.config");
const { DetailUsers } = require("../../models");

let consumerRegistered = false;

const consumeUserActivatedQueue = async () => {
  await reciverMessageData("user_activated", async (msg) => {
    if (!msg) return;
    
    const payload = JSON.parse(msg.content.toString());
    console.log(
      "[user-service] Received 'user_activated' payload:",
      payload,
    );

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
    // Attempt automatic replay of any leftover messages from DLQ after listener starts
    setTimeout(async () => {
      try {
        await reprocessDLQMessages("user_activated");
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
};
