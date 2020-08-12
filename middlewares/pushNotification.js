const { Expo } = require('expo-server-sdk');
let expo = new Expo();

const pushNotification = async (tokens, content, data) => {
  // Create the messages that you want to send to clients
  let messages = [];
  for (let pushToken of tokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: 'default',
      title: content.title,
      body: content.body,
      data: { data },
    });
  }
  try {
    const receipts = await expo.sendPushNotificationsAsync(messages);
    console.log(receipts);
  } catch (e) {
    console.error(`error sending the push notification :( ${e}`);
  }
};

module.exports = pushNotification;
