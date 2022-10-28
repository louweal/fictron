<template>
  <div
    class="w-100 p-4 rounded mb-3 notice text-white"
    style="background-color: var(--bs-secondary)"
  >
    <p class="text-center mb-0">
      <slot>
        <b><i class="bi bi-piggy-bank-fill"></i> Warning: </b> Scrolling further
        may cost you up to {{ price }} TRX ≈ ${{ usd }} (+ transaction fees).
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
