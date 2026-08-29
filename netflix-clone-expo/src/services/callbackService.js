export class CallbackService {
  static async sendPlaybackProgress(callbackUrl, payload) {
    if (!callbackUrl || !callbackUrl.startsWith('http')) {
      console.log('[LOCAL CALLBACK SIMULATION]', payload);
      return { success: true, local: true };
    }

    try {
      const response = await fetch(callbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString()
        })
      });
      const data = await response.json();
      console.log('[CALLBACK SUCCESS]', data);
      return { success: true, data };
    } catch (err) {
      console.warn('[CALLBACK ERROR]', err.message);
      return { success: false, error: err.message };
    }
  }
}
