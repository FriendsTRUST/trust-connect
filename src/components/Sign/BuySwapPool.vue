<template>
  <div class="border-t border-gray-200">
    <dl>
      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-base font-medium text-gray-500">
          Тип транзакции
        </dt>
        <dd class="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
          Покупка монет через пулы ликвидности
        </dd>
      </div>
      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-base font-medium text-gray-500">
          Маршрут
        </dt>
        <dd class="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
          {{ coins.join(' -> ') }}
        </dd>
      </div>
      <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-base font-medium text-gray-500">
          Сумма покупки
        </dt>
        <dd class="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
          {{ decoded.data.valueToBuy }}
          {{ coinToSell }}
        </dd>
      </div>
      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt class="text-base font-medium text-gray-500">
          Максимальная сумма продажи
        </dt>
        <dd class="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">
          {{ decoded.data.maximumValueToSell }}
          {{ coinToBuy }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    decoded: {
      type: Object,
      required: true,
    },
  },
  computed: {
    coins() {
      return this.decoded.data.coins.map((id) => {
        return this.$store.getters.getCoin(id)?.symbol ?? id;
      });
    },
    coinToSell() {
      return this.$store.getters.getCoin(this.decoded.data.coins[this.decoded.data.coins.length - 1])?.symbol ?? id;
    },
    coinToBuy() {
      return this.$store.getters.getCoin(this.decoded.data.coins[0])?.symbol ?? id;
    },
  },
};
</script>

<style scoped>

</style>
