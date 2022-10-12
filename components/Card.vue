<template>
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
        : paywall()
    "
    class="xxxcard position-relative"
  >
    <div v-if="borderTop && !hero" class="w-100 border-top d-md-none"></div>

    <div class="row gx-3 my-3 my-md-0">
      <div :class="hero ? 'col-12' : 'col-3 col-md-12'">
        <div class="ratio ratio-3x4">
          <div
            class="card-img position-absolute rounded bg-light"
            :style="{
              backgroundImage: visual,
            }"
          ></div>

          <div
            class="card-img-overlay rounded pb-3 px-3 px-lg-3 pb-lg-3"
            :class="hero ? 'd-flex' : 'd-none d-md-flex'"
          >
            <component
              :is="hero ? 'h1' : 'h2'"
              class="text-white"
              :class="hero ? 'display-4' : 'fs-4'"
            >
              {{ post.title }}
            </component>
            <span class="fw-bold text-white">{{ author }}</span>
          </div>

          <div
            class="blurb p-4 text-white rounded d-none"
            :class="hero ? false : 'd-md-block'"
          >
            <p>
              {{ post.intro }}
            </p>
          </div>
        </div>
        <span
          class="badge bg-light position-absolute m-1 top-0 end-0 lh-1"
          v-if="progress"
        >
          <i v-if="progress === 100" class="bi bi-check-lg"></i>
          <span v-else>{{ progress }} %</span>
        </span>
      </div>
      <div
        class="col-9 d-md-none align-self-center"
        :class="hero ? 'd-none' : false"
      >
        <h2 class="fs-5">{{ post.title }}</h2>
        <span class="fw-bold">{{ author }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import getImage from "@/utils/getImage.js";

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
    borderTop: {
      type: Boolean,
      default: true,
    },

    hero: {
      type: Boolean,
      default: false,
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

  computed: {
    visual() {
      return getImage(this.post.visual);
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

    author() {
      return this.$store.state.writers.find((w) => w.id === this.post.author)
        .name;
    },
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

<style lang="scss" scoped>
.card {
  overflow: hidden;

  &:hover .card-img {
    background-size: 120%;
  }
}

.card-img {
  height: 100%;
  overflow: hidden;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-size 0.4s 0.15s cubic-bezier(0.2, 0, 0.1, 1);
  background-size: 115%;
}

.card-img-overlay {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  // padding: 1.3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // align-items: flex-end;
  background: rgb(0, 0, 0);
  background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 59%);
  z-index: 3;
}

.blurb {
  width: 100%;
  height: 100%;
  z-index: 4;
  opacity: 0;
  background-color: var(--bs-primary);
  transition: opacity 0.4s 0.15s linear; //cubic-bezier(0.2, 0, 0.1, 1);
  overflow: hidden;

  &:hover {
    opacity: 1;
  }
}
</style>
