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
              {{ post.price }} TRX ≈ {{ price }} USD
            </li>
            <li
              class="text-danger cursor-pointer"
              v-if="mine"
              @click="removePost()"
            >
              Depublish
            </li>
          </ul>

          <h1>{{ post.title }}</h1>

          {{ content.length }}

          {{ post.content.length }}

          <h2 class="fs-3">
            By
            <nuxt-link class="text-secondary" :to="'/w/' + author.slug">
              {{ author.name }}
            </nuxt-link>
          </h2>
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
          v-if="!$route.hash && !mine"
        >
          <notice
            id="warning-0"
            data-aos="0"
            :price="post.price"
            :usd="+price"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2">
          <template v-for="(p, i) in content">
            <h2
              :key="'title' + i"
              v-if="p.title"
              class="fs-2"
              :class="historicProgress < p.progress ? 'fade-in-up' : false"
              :data-aos="historicProgress < p.progress ? 70 : undefined"
            >
              {{ p.title }}
            </h2>

            <p
              :key="i"
              :class="historicProgress < p.progress ? 'fade-in-up' : false"
              :data-aos="historicProgress < p.progress ? 70 : undefined"
              :data-progress="p.progress"
            >
              {{ p.content }}
            </p>

            <div
              class="w-100"
              v-if="+$route.hash.slice(2) === +p.progress"
              :id="'c' + p.progress"
              :key="'anchor' + i"
            >
              <notice
                v-if="!mine"
                :price="Math.ceil(post.price * ((100 - progress) / 100))"
                :usd="(+price * ((100 - progress) / 100)).toFixed(2)"
              />
            </div>
          </template>

          <p class="text-secondary" v-if="!mine">
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
      <div
        class="progress position-fixed bottom-0 start-0 end-0"
        v-if="$store.state.user.id !== author.id"
      >
        <div
          class="bar bg-primary h-100 left-0 position-absolute fw-bold"
          ref="bar"
        >
          <div class="label text-white align-end" v-if="progress > 4">
            {{ progress }} %&nbsp;
          </div>
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
      paid: 0,
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
    window.addEventListener("scroll", this.aos);
    let history = this.$store.state.user.history.find(
      (a) => a.id === this.post.id
    );

    if (history) {
      this.historicProgress = history.progress;
      this.progress = history.progress;
      this.paid = history.progress;
      this.updateBar();
    }
  },

  beforeDestroy() {
    console.log("destroy");
    console.log(+this.progress);
    if (this.post) {
      this.$store.commit("setProgress", {
        id: +this.post.id,
        progress: +this.progress,
      });
    }

    window.removeEventListener("scroll", this.aos);
  },

  watch: {
    progress: function (val) {
      if (val === 100) {
        this.$store.commit("updateViews", this.post.id);
      }
    },
    "$store.state.user": function () {
      if (this.$store.state.user == undefined) {
        this.$router.push("/");
      }
    },
  },

  computed: {
    maxTitleLength() {
      return this.$options.type === "article" ? 50 : 80;
    },

    mine() {
      // post is written by the user himself
      return this.$store.state.user.id === this.author.id;
    },

    content() {
      let parts = this.post.content.split(/(?:\r?\n)+/);

      let a = [];

      if (parts.length > 0) {
        let end = 0;
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) {
            let p = {};

            if (
              parts[i].toLowerCase().startsWith("chapter ") &&
              parts[i].length <= this.maxTitleLength
            ) {
              //title
              let title = parts[i];
              if (title.length > 0) {
                p["title"] = title;
                end += title.length;
                p["progress"] =
                  Math.round((end * 50) / this.post.content.length) * 2;

                this.numChapters += 1;

                if (parts[i + 1]) {
                  p["content"] = parts[i + 1];
                  end += p["content"].length;
                  p["progress"] =
                    Math.round((end * 50) / this.post.content.length) * 2;

                  i = i + 1; // skip next part
                }
              }
            } else {
              // content
              p["content"] = parts[i];
              end += p.content.length;
              p["n"] = p.content.length;
              p["progress"] =
                Math.round((end * 50) / this.post.content.length) * 2;
            }
            a.push(p);
          }
        }
      }
      // console.log(a.length);

      return a;
    },

    price() {
      return (this.post.price * this.trxusd).toFixed(2);
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
        // let p = Math.ceil((100 * this.progress) / this.post.content.length);
        let bar = this.$refs["bar"];

        if (bar) {
          bar.style.width = this.progress + "%";
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
          // if (target.id === "warning-0") {
          //   console.log("todo: nothing/ setReader");
          //   delete target.dataset.aos;
          // }

          if (!target.classList.contains("start-animation")) {
            target.classList.add("start-animation");

            if (target.dataset.progress) {
              this.progress = parseInt(target.dataset.progress);
              this.updateBar();

              // payment
              if (!this.mine) {
                let toPay =
                  (parseInt(this.progress - this.paid) / 100) * this.post.price;

                if (toPay > 0) {
                  console.log("todo: pay: " + toPay + " TRX");
                  this.paid = this.progress;
                }
              }
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

$fontsize: 12px;
.progress {
  height: 1.9vh;
  background-color: var(--bs-gray-400);
  z-index: 9;

  .bar {
    position: relative;
    width: 0;
    transition: width 0.8s ease-out;
    will-change: width;

    .label {
      padding-top: 2px;
      position: absolute;
      font-size: $fontsize;
      line-height: 1;
      width: 100%;
      left: 0;
      right: 0;
      top: 0;
      height: 100%;
      text-align: right;
    }
  }
}

.accordion-button {
  &::after {
    display: none;
  }
}
</style>
