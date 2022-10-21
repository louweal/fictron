<template>
  <main>
    <div class="container-xl" v-if="post">
      <div class="row min-vh-100 pb-5">
        <div
          :class="
            $options.type === 'article'
              ? 'col-12 col-md-10 offset-md-1'
              : 'col-4 col-sm-3 col-md-2 offset-md-1 offset-lg-2 align-self-center'
          "
        >
          <div
            class="post-img ratio rounded mb-2 bg-light"
            :class="$options.type === 'article' ? 'ratio-3x1' : 'ratio-3x4'"
            :style="{
              backgroundImage: `url(${require('@/images/' + post.visual)}`,
            }"
          ></div>
        </div>

        <div
          :class="
            $options.type === 'article'
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
            <li v-if="post.views">
              <i class="bi bi-eye"></i> {{ post.views }}
            </li>
            <li>
              <i class="bi bi-piggy-bank"></i>
              {{ (post.content.length / 1000).toFixed(3) }} TRX ≈
              {{ price }} USD
            </li>
          </ul>

          <h1>{{ post.title }}</h1>

          <h2 class="fs-3" v-if="$store.state.user.id !== author.id">
            By
            <nuxt-link class="text-secondary" :to="'/w/' + author.slug">
              {{ author.name }}
            </nuxt-link>
          </h2>
          <div class="text-danger cursor-pointer" v-else @click="removePost()">
            <i class="bi bi-x"></i> Depublish
          </div>
        </div>

        <div class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2 mt-3">
          <div class="accordion mb-4">
            <div class="accordion-item">
              <h2 class="accordion-header" @click="toggleAccordion('blurb')">
                <div class="accordion-button cursor-pointer">
                  {{ $options.type === "article" ? "Introduction" : "Blurb" }}
                </div>
              </h2>
              <div class="accordion-collapse" v-if="showBlurb">
                <div class="accordion-body">
                  <p>{{ post.intro }}</p>
                </div>
              </div>
            </div>
            <div
              class="accordion-item"
              v-if="$options.type === 'book' && numChapters && numChapters > 0"
            >
              <h2 class="accordion-header" @click="toggleAccordion('contents')">
                <div class="accordion-button cursor-pointer">
                  Contents ({{ numChapters }} chapter<span
                    v-if="numChapters > 1"
                    >s</span
                  >)
                </div>
              </h2>
              <div class="accordion-collapse" v-if="showContents">
                <div class="accordion-body" style="min-height: 300px">
                  <ul class="m-3 list-unstyled">
                    <template v-for="(p, i) in content">
                      <li v-if="p.title" :key="i">
                        {{ p.title }}
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2"
          v-if="!$route.hash"
        >
          <notice id="warning-0" data-aos="70" />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2">
          <template v-for="(p, i) in content">
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
              :class="historicProgress < p.end ? 'fade-in-up' : false"
              :data-aos="historicProgress < p.end ? 70 : undefined"
              :data-end="p.end"
              :data-n="p.n"
            >
              {{ p.content }}

              {{ p.end }}
            </p>

            <div
              class="w-100"
              v-if="+$route.hash.slice(2) === +p.end"
              :id="'c' + p.end"
              :key="'anchor' + i"
            >
              <notice />
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
          v-if="progress > 0"
        >
          {{ progress / 1000 }} TRX
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import getUSD from "@/utils/getUSD.js";

export default {
  transition: "post", // important for scroll position on page load!

  type: "book", // article

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
      numChapters: 0,
    };
  },

  async created() {
    this.posts = this.$store.state.posts;
    this.post = this.posts.find((a) => a.slug === this.$route.params.post);

    if (this.post) {
      this.categoryName = this.$store.state.categories.find(
        (c) => c.slug === this.post.category
      ).title;

      this.trxusd = await getUSD();
    }
  },

  async fetch() {
    await this.validateAccess();
    await this.validatePage();
  },

  async mounted() {
    if (!this.$store.state.user) {
      return;
    }

    this.scrollHeight = document.body.scrollHeight;
    window.addEventListener("scroll", this.aos); // todo wrap in debounce?

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
      let p = parseInt((val * 100) / this.post.content.length);
      if (p === 100) {
        this.$store.commit("updateViews", this.post.id);
      }
    },
  },

  computed: {
    maxTitleLength() {
      return this.$options.type === "article" ? 50 : 80;
    },

    content() {
      let parts = this.post.content.split(/(?:\r?\n)+/);

      let a = [];

      if (parts.length > 0) {
        let end = 0;
        // let chapters = 0;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) {
            let p = {};

            if (
              parts[i].toLowerCase().startsWith("chapter ") &&
              parts[i].length <= this.maxTitleLength
            ) {
              //title
              let title = parts[i]; //.replaceAll("**", ""); // todo
              if (title.length > 0) {
                p["title"] = title;
                end += title.length;
                p["titleEnd"] = end;

                this.numChapters += 1;

                if (parts[i + 1]) {
                  p["content"] = parts[i + 1];
                  end += p["content"].length;
                  p["n"] = p.content.length;
                  p["end"] = end;

                  i = i + 1; // skip next part
                }
              }
            } else {
              // content
              p["content"] = parts[i];
              end += p.content.length;
              p["n"] = p.content.length;
              p["end"] = end;
            }
            a.push(p);
          }
        }
      }
      // console.log(a.length);

      return a;
    },

    price() {
      return ((this.post.content.length / 1000) * this.trxusd).toFixed(2);
    },

    author() {
      return this.$store.state.writers.find((a) => a.id === this.post.author);
    },
  },

  methods: {
    toggleAccordion() {
      this.showContents = !this.showContents;
      this.showBlurb = !this.showBlurb;
    },
    validatePage() {
      if (!this.post) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Book not found",
        });
      }
    },
    validateAccess() {
      if (this.$store.state.user == undefined) {
        return this.$nuxt.error({
          statusCode: 403,
          message: "Access denied",
        });
      }
    },

    removePost() {
      console.log("todo: call contract func removePost");
    },

    formatDate(date) {
      return new Date(date * 1000).toLocaleDateString("us-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    updateBar() {
      if (this.post) {
        let p = (100 * this.progress) / this.post.content.length;
        let bar = this.$refs["bar"];

        if (bar) {
          bar.style.width = p + "%";
        }
      }
    },

    aos() {
      let scrollY = window.pageYOffset;
      let direction = scrollY > this.prevPosY ? "down" : "up";

      if (this.prevPosY === 0 || direction === "up") {
        this.prevPosY = window.scrollY;
        return;
      }

      let animTargets = document.querySelectorAll("[data-aos]");
      // console.log(animTargets.length);

      for (let i = 0; i < animTargets.length; i++) {
        let target = animTargets[i];
        let top = target.getBoundingClientRect().top;

        let startTrigger =
          top < window.innerHeight * (+target.dataset.aos / 100) && top > 0;

        if (startTrigger) {
          if (target.id === "warning-0") {
            console.log("todo: nothing/ setReader");
            delete target.dataset.aos;
          }

          if (!target.classList.contains("start-animation")) {
            target.classList.add("start-animation");

            if (target.dataset.end) {
              this.progress = parseInt(target.dataset.end);
              this.updateBar();
            }

            if (target.dataset.n) {
              console.log(`todo: payWriter(${target.dataset.n})`);
            }
            delete target.dataset.aos;
          }
          // break; // --> at most one animation per scroll event !
        }
      }
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
    width: 0;
    transition: width 0.8s ease-out;
    will-change: width;
    padding-right: 4px;
    padding-top: 2px; //calc(50% - $fontsize / 2);
    font-size: $fontsize;
    line-height: 1;
  }
}

.accordion-button {
  &::after {
    display: none;
  }
}
</style>
