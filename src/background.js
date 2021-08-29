import {popupWindow} from './helpers';

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const tabId = `${sender.tab?.id}`;

  if (request && request.type) {
    popupWindow(
      `popup.html?type=${request.type}&tabId=${tabId}&data=${request.detail.data}`,
      'extension_popup', window,
      420,
      750,
    );
  }
});

