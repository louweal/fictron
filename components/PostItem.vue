<template>
  <div class="w-100 m-1 py-2">
    <nuxt-link :to="'/w/' + author.slug">
      <small class="text-secondary fw-bold mb-1">
        {{ author.name }}
      </small>
    </nuxt-link>

    <nuxt-link
      :to="{
        path: '/a/' + post.slug,
        hash: historicProgress !== 0 ? '#' + historicProgress : false,
      }"
      event=""
      @click.native="
        $store.state.user
          ? $router.push({
              path: '/a/' + post.slug,
              hash: historicProgress !== 0 ? '#' + historicProgress : false,
            })
          : paywall(post)
      "
    >
      <h3 class="fs-6 fw-light mb-0">
        <span class="badge bg-secondary" v-if="progress">
          <i v-if="progress === 100" class="bi bi-check-lg"></i>
          <span v-else>{{ progress }}%</span>
        </span>
        {{ post.title }}
      </h3>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0,
    };
  },

  props: {
    post: {
      type: [Array, Object],
      default: () => [],
    },
  },

  computed: {
    author() {
      return this.$store.state.writers.find((a) => a.id === this.post.author);
    },
    historicProgress() {
      if (this.$store.state.user) {
        let history = this.$store.state.user.history.find(
          (a) => a.id === this.post.id
        );
        if (history) {
          return history.progress;
        }
      }
      return 0;
    },
  },

  mounted() {
    if (this.$store.state.user && this.post) {
      let history = this.$store.state.user.history.find(
        (a) => a.id === this.post.id
      );
      if (history) {
        this.progress = parseInt((100 * history.progress) / this.post.total);
      }
    }
  },

  methods: {
    paywall() {
      this.$store.commit("toggleModal");
      this.$store.commit("setClickedPost", "/a/" + this.post.slug);
      document.getElementById("page").classList.toggle("is-blurred");
    },
  },
};
</script>

<style></style>

<style lang="scss" scoped>
a {
  transition: color 0.2s ease-in;
  &:hover {
    color: var(--bs-secondary);
  }
}
</style>
