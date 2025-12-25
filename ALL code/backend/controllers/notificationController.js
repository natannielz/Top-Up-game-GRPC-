// server/controllers/notificationController.js

export const sendWhatsapp = (phone, message) => {
  console.log(`[WA-Gateway] Sending to ${phone}: "${message}"`);
  return true;
};
