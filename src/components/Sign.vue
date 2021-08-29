<template>
  <div class="flex flex-col text-lg">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-xl text-center leading-6 font-medium text-gray-900">
          Запрос на проведение транзакции
        </h3>
      </div>

      <component :decoded="decoded" :is="transactionComponent"/>
    </div>

    <div class="w-full p-4">
      <div>
        <label class="block font-medium text-gray-700">Seed фраза или приватный ключ</label>
        <div class="mt-1">
          <input type="text"
                 v-model.trim="seedOrPrivateKey"
                 class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"/>
        </div>
      </div>

      <button type="button"
              class="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="!isSeedOrPrivateKeyValid"
              @click="handleAccept"
      >
        Подтвердить
      </button>

      <button type="button"
              class="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="handleReject"
      >
        Отклонить
      </button>
    </div>
  </div>
</template>

<script>
import {decodeLink, TX_TYPE} from 'minter-js-sdk';
import {padToEven} from 'ethjs-util';
import {createWallet, getNonce, sendToTab} from '../helpers';
import {Tx, TxDataBuySwapPool, TxDataSellSwapPool, TxSignature} from 'minterjs-tx';
import {integerToHexString} from 'minter-js-sdk/src/utils';
import {convertToPip} from 'minterjs-util';
import SellSwapPool from './Sign/SellSwapPool';
import BuySwapPool from './Sign/BuySwapPool';

export default {
  data: () => ({
    seedOrPrivateKey: '',
    accepted: false,
    rejected: false,
  }),
  computed: {
    wallet() {
      if (this.seedOrPrivateKey.length === 0) {
        return null;
      }

      return createWallet(this.seedOrPrivateKey);
    },
    isSeedOrPrivateKeyValid() {
      return this.wallet !== null;
    },
    encoded() {
      return this.$route.query.data;
    },
    decoded() {
      return decodeLink(this.encoded);
    },
    transactionComponent() {
      switch (this.decoded.type) {
        case padToEven(TX_TYPE.SELL_SWAP_POOL):
          return SellSwapPool;
        case padToEven(TX_TYPE.BUY_SWAP_POOL):
          return BuySwapPool;
      }

      return 'Неизвестный';
    },
  },
  created() {
    window.addEventListener('beforeunload', async () => {
      if (this.accepted || this.rejected) return;

      await this.handleReject();
    });
  },
  methods: {
    async handleAccept() {
      const tx = await this.createTx();
      const privateKey = Buffer.from(this.wallet.getPrivateKeyString().substring(2), 'hex');

      tx.signatureData = (new TxSignature()).sign(
        tx.hash(false),
        privateKey,
      ).serialize();

      const serializedTx = tx.serializeToString();

      await sendToTab({
        subject: 'sign:accept',
        body: serializedTx,
      }, this.$route.query.tabId);

      this.accepted = true;
      window.close();
    },
    async handleReject() {
      await sendToTab({
        subject: 'sign:reject',
      }, this.$route.query.tabId);
      this.rejected = true;
      window.close();
    },
    async createTx() {
      const nonce = await getNonce(this.wallet.getAddressString());
      const type = this.decoded.type;

      let data;

      switch (type) {
        case TX_TYPE.SELL_SWAP_POOL:
          data = this.createSellSwapPoolData();
          break;
        case TX_TYPE.BUY_SWAP_POOL:
          data = this.createBuySwapPoolData();
          break;
      }

      return new Tx({
        nonce: `0x${padToEven(nonce.toString(16))}`,
        chainId: `0x${padToEven('1'.toString(16))}`,
        gasPrice: '0x01',
        gasCoin: integerToHexString(this.decoded.gasCoin),
        type,
        data: data.serialize(),
        signatureType: '0x01',
      });
    },
    createSellSwapPoolData() {
      return new TxDataSellSwapPool({
        coins: this.decoded.data.coins.map(item => integerToHexString(item)),
        valueToSell: `0x${convertToPip(this.decoded.data.valueToSell, 'hex')}`,
        minimumValueToBuy: `0x${convertToPip(this.decoded.data.minimumValueToBuy, 'hex')}`,
      });
    },
    createBuySwapPoolData() {
      return new TxDataBuySwapPool({
        coins: this.decoded.data.coins.reverse().map(item => integerToHexString(item)),
        valueToBuy: `0x${convertToPip(this.decoded.data.valueToBuy, 'hex')}`,
        maximumValueToSell: `0x${convertToPip(this.decoded.data.maximumValueToSell, 'hex')}`,
      });
    },
  },
};
</script>

