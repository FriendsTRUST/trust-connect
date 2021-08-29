<template>
  <component :is="componentName"/>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import Sign from '@/components/Sign.vue';

export default {
  components: {
    HelloWorld,
  },
  computed: {
    componentName() {
      const query = this.$route.query;

      if(!query || !query.type) {
        return HelloWorld;
      }

      if (query.type === 'sign') {
        return Sign;
      }

      return HelloWorld;
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchCoins');
  },
};
</script>

<style>
/* basic styles */
html {
  width: 400px;
  height: 400px;
}

/* purgecss start ignore */
@tailwind base;
@tailwind components;
/* purgecss end ignore */
@tailwind utilities;
</style>
