<template>
  <main>
    <div class="container-xl">
      <div class="row min-vh-100 pb-5">
        <div
          :class="
            $options.ratio.w > $options.ratio.h
              ? 'col-12 col-md-10 offset-md-1'
              : 'col-4 col-sm-3 col-md-2 offset-md-1 offset-lg-2 align-self-center'
          "
        >
          <div
            class="post-img ratio rounded mb-2 bg-light"
            :class="'ratio-' + $options.ratio.w + 'x' + $options.ratio.h"
            :style="{
              backgroundImage: visual,
            }"
          ></div>
        </div>

        <div
          class=""
          :class="
            $options.ratio.w > $options.ratio.h
              ? 'col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2'
              : 'col-12 col-sm-8 col-lg-6 mb-5 align-self-center'
          "
        >
          <nuxt-link :to="'/c/' + post.category" class="badge bg-secondary">
            {{ categoryName }}
          </nuxt-link>

          <ul class="bullet-list-inline mt-1 mb-1">
            <li>
              {{ formatDate(post.date) }}
            </li>
            <!-- <li v-if="post.chapters && post.chapters > 0">
              {{ post.chapters }} chapter<span v-if="post.chapters > 1">s</span>
            </li> -->

            <li><i class="bi bi-eye"></i> {{ post.views }}</li>
            <li>
              <i class="bi bi-piggy-bank"></i>
              {{ (post.total / 1000).toFixed(2) }} TRX ≈ {{ price }} USD
            </li>
          </ul>

          <h1>{{ post.title }}</h1>

          <h2 class="fs-3">
            By
            <nuxt-link class="text-secondary" :to="'/w/' + author.slug">
              {{ author.name }}
            </nuxt-link>
          </h2>
        </div>

        <div class="col-12 col-sm-10 col-lg-6 offset-sm-1 offset-lg-4">
          <div class="accordion mb-4">
            <div class="accordion-item">
              <h2 class="accordion-header" @click="toggleAccordion('blurb')">
                <div class="accordion-button cursor-pointer">Blurb</div>
              </h2>
              <transition>
                <div class="accordion-collapse" v-if="showBlurb">
                  <div class="accordion-body">
                    <p>{{ post.intro }}</p>
                  </div>
                </div>
              </transition>
            </div>
            <div
              class="accordion-item"
              v-if="post.chapters && post.chapters > 0"
            >
              <h2 class="accordion-header" @click="toggleAccordion('contents')">
                <div class="accordion-button cursor-pointer">
                  Contents ({{ post.chapters }} chapter<span
                    v-if="post.chapters > 1"
                    >s</span
                  >)
                </div>
              </h2>
              <transition>
                <div class="accordion-collapse" v-if="showContents">
                  <div class="accordion-body">
                    <ul class="m-3 list-unstyled">
                      <template v-for="(p, i) in post.content">
                        <li v-if="p.title" :key="i">
                          {{ p.title }}
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div
          class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2"
          v-if="!$route.hash"
        >
          <div class="w-100 p-2 bg-secondary rounded mb-3">
            <p class="text-center mb-0">
              Scroll down to start reading. <br />
              <b><i class="bi bi-piggy-bank-fill"></i> Warning: </b> Reading
              further costs 1 TRX/1000 characters.
            </p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2">
          <template v-for="(p, i) in post.content">
            <h2
              :key="'title' + i"
              v-if="p.title"
              class="fs-2"
              :class="historicProgress < p.titleEnd ? 'fade-in-up' : false"
              :data-aos="historicProgress < p.titleEnd ? 70 : undefined"
              :data-end="p.titleEnd"
            >
              {{ p.title }}
            </h2>

            <p
              :key="i"
              :class="[
                historicProgress < p.end ? 'fade-in-up' : false,
                +$route.hash.slice(1) == p.end ? 'bg-light' : false,
              ]"
              :data-aos="historicProgress < p.end ? 70 : undefined"
              :data-end="p.end"
            >
              {{ p.content }}
            </p>

            <div
              class="w-100"
              v-if="$route.hash.slice(2) == p.end"
              :id="'c' + p.end"
              :key="'anchor' + i"
            >
              <div class="p-2 bg-secondary rounded my-3 mt-5">
                <p class="text-center mb-0">
                  Scroll down to continue reading. <br />
                  <b><i class="bi bi-piggy-bank-fill"></i> Warning: </b> Reading
                  further costs 1 TRX/1000 characters.
                </p>
              </div>
            </div>
          </template>

          <p class="text-secondary">
            Thank you for supporting
            <b>
              <nuxt-link :to="'/w/' + author.slug" class="text-secondary">
                {{ author.name }}
              </nuxt-link> </b
            >!
          </p>

          <social-share :title="post.title" />
        </div>
      </div>

      <h2 class="fs-5">Related</h2>

      <div class="row gy-0 g-md-3 pt-1">
        <div
          class="col-12 col-md"
          v-for="(a, i) in posts
            .filter((a) => a.category === post.category && a.id !== post.id)
            .slice(0, 5)"
          :key="i"
        >
          <card :post="a" :showIntro="false" :borderTop="i !== 0" />
        </div>
      </div>
      <div class="progress position-fixed bottom-0 start-0 end-0">
        <div
          class="bar bg-secondary h-100 left-0 position-absolute fw-bold text-end"
          ref="bar"
        >
          {{ progress / 1000 }} TRX
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import getImage from "@/utils/getImage.js";
import getUSD from "@/utils/getUSD.js";

export default {
  transition: "post",

  data() {
    return {
      scrollHeight: 0,
      scrollY: 0,
      prevPosY: 0,
      progress: 0,
      historicProgress: 0,
      posts: () => {},
      post: () => {},
      categoryName: "Genre",
      trxusd: 1,
      showBlurb: true,
      showContents: false,
    };
  },

  ratio: {
    w: 3, //16
    h: 4, //9
  },

  async created() {
    this.posts = this.$store.state.posts;
    this.post = this.posts.find((a) => a.slug === this.$route.params.post);

    this.categoryName = this.$store.state.categories.find(
      (c) => c.slug === this.post.category
    ).title;

    this.trxusd = await getUSD();
  },

  async mounted() {
    await this.validatePage();
    this.scrollHeight = document.body.scrollHeight;
    window.addEventListener("scroll", this.aos);

    let history = this.$store.state.user.history.find(
      (a) => a.id === this.post.id
    );

    if (history) {
      this.historicProgress = history.progress;
      this.progress = history.progress;
    }

    this.updateBar();
  },

  beforeDestroy() {
    if (this.post) {
      this.$store.commit("setProgress", {
        id: +this.post.id,
        progress: this.progress,
      });
    }

    window.removeEventListener("scroll", this.aos);
  },

  watch: {
    progress: function (val) {
      let p = parseInt((val * 100) / this.post.total);
      if (p === 100) {
        this.$store.commit("updateViews", this.post.id);
      }
    },
  },

  computed: {
    visual() {
      if (this.post.visual) {
        return getImage(this.post.visual);
      }
      return "none";
    },

    price() {
      return ((this.post.total / 1000) * this.trxusd).toFixed(2);
    },

    author() {
      return this.$store.state.writers.find((a) => a.id === this.post.author);
    },
  },

  methods: {
    toggleAccordion(item) {
      this.showContents = !this.showContents;
      this.showBlurb = !this.showBlurb;
    },
    validatePage() {
      if (!this.post) {
        this.$nuxt.error({
          statusCode: 404,
          message: "Article not found",
        });
      }
    },

    formatDate(date) {
      return date.toLocaleDateString("us-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    updateBar() {
      if (this.post) {
        let p = (100 * this.progress) / this.post.total;
        let bar = this.$refs["bar"];

        if (bar) {
          bar.style.width = p + "%";
        }
      }
    },

    aos() {
      let scrollY = window.pageYOffset;
      let direction = scrollY > this.prevPosY ? "down" : "up";
      // console.log(this.prevPosY);
      // console.log(direction);

      if (this.prevPosY === 0 || direction === "up") {
        this.prevPosY = window.scrollY;
        return;
      }

      let animTargets = document.querySelectorAll("[data-aos]");
      [].forEach.call(animTargets, (target) => {
        let startAt = parseInt(target.dataset.aos);
        let rect = target.getBoundingClientRect();
        let elemTop = rect.top;

        // target.style.opacity = "0"; // hide element by default

        let startTrigger =
          elemTop < window.innerHeight * (startAt / 100) && elemTop > 0;

        if (startTrigger) {
          if (!target.classList.contains("start-animation")) {
            target.classList.add("start-animation");

            if (target.dataset.end) {
              this.progress = parseInt(target.dataset.end);
              this.updateBar();
            }
          }
        }
      });
      this.prevPosY = window.scrollY;
    },
  },
};
</script>

<style lang="scss" scoped>
.post-img {
  width: 100%;
  height: auto;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-size 0.3s 0.15s cubic-bezier(0.2, 0, 0.1, 1);
  background-size: 115%;
}

$fontsize: 13px;
.progress {
  height: 1.9vh;
  background-color: var(--bs-gray-400);
  z-index: 9;

  .bar {
    transition: width 0.8s ease-out;
    will-change: width;
    padding-right: 4px;
    padding-top: 2px; //calc(50% - $fontsize / 2);
    font-size: $fontsize;
    line-height: 1;
  }
}

// :root {
//   --bs-accordion-btn-icon-transform: rotate(0deg);
// }

.accordion-button {
  &::after {
    display: none;
  }
}

// .accordion-body {
//   height: 0;
//   overflow: hidden;
//   padding: 0;
//   transition: max-height 0.3s cubic-bezier(0.19, 1, 0.22, 1);

//   &.show {
//     max-height: auto;
//   }
// }

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
