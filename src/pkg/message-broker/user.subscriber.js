const { reciverMessageData } = require("./message-broker.pkg");
const { DetailUsers } = require("../../models");

/**
 * Listens to 'user_activated' queue from RabbitMQ
 * and creates a new DetailUsers record in database.
 */
const listenUserActivatedQueue = async () => {
  try {
    await reciverMessageData("user_activated", async (msg) => {
      if (!msg) return;
      try {
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

        const existingDetail = await DetailUsers.findOne({
          where: { uuid },
        });
        if (!existingDetail) {
          await DetailUsers.create({
            uuid: uuid,
            username: username,
            email: email,
            firstName: "",
            lastName: "",
            phone: "",
            gender: "tidak ada",
            address: "",
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
      } catch (err) {
        console.error(
          "[user-service] Error processing 'user_activated' message:",
          err.message,
        );
      }
    });
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
