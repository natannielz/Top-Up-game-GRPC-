// server/controllers/gameController.js

export const topUpGame = async (userId, zoneId, itemId) => {
  console.log(`[GameAPI] Top Up Request: User ${userId} (${zoneId}) - Item ${itemId}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        console.log('[GameAPI] Top Up Success');
        resolve({
          trx_id: `GAME-${Date.now()}`,
          status: 'SUCCESS',
          message: 'Top up berhasil'
        });
      } else {
        console.error('[GameAPI] Top Up Failed');
        reject(new Error('Provider Error or Invalid ID'));
      }
    }, 1500);
  });
};

export const checkNickname = async (userId, _gameCode) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        username: `ProPlayer_${userId.slice(-3)}`,
        valid: true
      });
    }, 800);
  });
};
