const handlers = {
  'sign:accept': (tx) => {
    const event = new CustomEvent('trustConnect:sign:accept', {
      detail: {
        tx,
      },
    });

    document.dispatchEvent(event);

    return false;
  },
  'sign:reject': () => {
    const event = new CustomEvent('trustConnect:sign:reject');

    document.dispatchEvent(event);

    return false;
  },
};

document.addEventListener('DOMContentLoaded', async () => {
  document.addEventListener('trustConnect:sign', function(e) {
    browser.runtime.sendMessage({
      type: 'sign',
      detail: e.detail,
    });
  });

  browser.runtime.onMessage.addListener((message) => {
    try {
      return handlers[message.subject](message.body);
    } catch (e) {
      throw new Error(`Unknown message type: ${message.subject}. Error ${e}`);
    }
  });
});
