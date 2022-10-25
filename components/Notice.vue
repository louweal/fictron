<template>
  <div
    class="w-100 p-4 xxxbg-primary rounded mb-3 notice text-white"
    style="background-color: var(--bs-secondary)"
  >
    <p class="text-center mb-0">
      <slot>
        <b><i class="bi bi-piggy-bank-fill"></i> Warning: </b> Scrolling further
        may cost you up to {{ price }} TRX (≈ {{ usd }} USD).
      </slot>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    price: {
      type: Number,
      default: 0,
    },
    usd: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
// .notice {
//   animation: hue-rotate 8s 0.2s linear infinite;
// }

// @keyframes hue-rotate {
//   to {
//     filter: hue-rotate(360deg);
//   }
// }
</style>
