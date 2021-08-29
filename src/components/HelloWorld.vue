<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-400">
    <img src="../assets/logo.png" class="w-24 h-24"/>
    <div class="font-bold text-xl">TRUST Connect</div><br/><br/>

    <div class="text-base">An extension by <a href="https://friendstrust.club" target="_blank">FriendsTRUST</a></div>
    {{ $store.state.page }}
  </div>
</template>

<script>
export default {
}
</script>
