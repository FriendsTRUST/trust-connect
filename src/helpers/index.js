import {walletFromMnemonic, walletFromPrivateKey} from 'minterjs-wallet';
import axios from 'axios';

export let sendToTab = async (message, tabId = 0) => {
  try {
    if (!tabId) {
      const tabs = await browser.tabs.query(
        {active: true, currentWindow: true});

      if (!tabs[0].id || !tabs[0].url) return;

      tabId = tabs[0].id;
    }

    browser.tabs.sendMessage(Number(tabId), message);
  } catch (e) {
    console.error(e);
  }
};

export function createWallet(seedOrPrivate) {
  try {
    return walletFromMnemonic(seedOrPrivate);
  } catch (e) {
    return walletFromPrivateKey(
      Buffer.from(seedOrPrivate, 'hex'),
    );
  }
}

export let getNonce = async (address) => {
  const {data} = await axios.get(
    `https://api.minter.one/v2/address/${address}`,
  );

  return Number(data.transaction_count) + 1;
};

export function popupWindow(url, windowName, win, w, h) {
  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ?
    window.screenLeft :
    window.screenX;
  const dualScreenTop = window.screenTop !== undefined ?
    window.screenTop :
    window.screenY;

  const width = window.innerWidth ?
    window.innerWidth :
    document.documentElement.clientWidth ?
      document.documentElement.clientWidth :
      screen.width;
  const height = window.innerHeight ?
    window.innerHeight :
    document.documentElement.clientHeight ?
      document.documentElement.clientHeight :
      screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(url, windowName,
    `
      toolbar=no,
      location=no,
      directories=no,
      status=no,
      menubar=no,
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `,
  );

  if (window.focus) newWindow.focus();
}
