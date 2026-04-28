'use strict';

// Notifier acoplado a envio de e-mail e SMS.
class Notifier {
  constructor() {
    this.sent = [];
  }

  sendEmail(to, subject, body) {
    this.sent.push({ channel: 'email', to, subject, body, at: Date.now() });
    return true;
  }

  sendSms(to, body) {
    this.sent.push({ channel: 'sms', to, body, at: Date.now() });
    return true;
  }
}

module.exports = { Notifier };
