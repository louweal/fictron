<template>
  <div class="w-100 p-2 bg-secondary rounded mb-3 notice">
    <p class="text-center mb-0">
      <slot>
        <b><i class="bi bi-piggy-bank-fill"></i> Warning: </b> Scrolling further
        costs 1 TRX/1000 characters.
      </slot>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.notice {
  animation: hue-rotate 8s 0.2s linear infinite;
}

@keyframes hue-rotate {
  to {
    filter: hue-rotate(360deg);
  }
}
</style>
