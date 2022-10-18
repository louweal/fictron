<template>
  <main>
    <div class="container-xl">
      <div class="row">
        <div
          :class="
            $options.ratio.w > $options.ratio.h
              ? 'col-12 col-md-10 offset-md-1'
              : 'col-4 col-md-2 offset-sm-1 offset-lg-2'
          "
        >
          <form>
            <div class="form-group d-grid">
              <div
                class="ratio field--upload rounded image cursor-pointer bg-light"
                :class="'ratio-' + $options.ratio.w + 'x' + $options.ratio.h"
                @click="toggleModal"
                :style="{
                  backgroundImage:
                    image !== -1
                      ? `url(${require('@/images/' +
                          path +
                          '/' +
                          image +
                          '.jpg')})`
                      : false,
                }"
              >
                <p v-if="image === -1">Click to select an image</p>
              </div>
            </div>
          </form>
        </div>

        <div
          class=""
          :class="
            $options.ratio.w > $options.ratio.h
              ? 'col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2'
              : 'col-12 col-md-8 col-lg-6 mb-5 align-self-center'
          "
        >
          <div class="badge bg-secondary">
            {{ categoryName }}
          </div>

          <ul class="bullet-list-inline mt-1 mb-1">
            <li>{{ today }}</li>

            <li v-if="post.content">
              <i class="bi bi-piggy-bank"></i>
              {{ (post.content.length / 1000).toFixed(2) }} TRX ≈
              {{ price }} USD
            </li>
          </ul>

          <form class="gy-3">
            <div class="form-group">
              <textarea
                class="form-control fs-2 fw-bold"
                id="title"
                rows="2"
                @input="(e) => setTitle(e.target.value)"
                placeholder="Title"
              ></textarea>
            </div>

            <h2 class="fs-3 mt-3">
              By
              <span class="text-secondary">
                {{ me }}
              </span>
            </h2>
          </form>
        </div>
        <div class="col-12 col-sm-10 col-lg-8 offset-sm-1 offset-lg-2">
          <div class="form-group">
            <p class="bg-info rounded p-2 mt-3">
              <b>Important:</b> Each chapter title has to start with 'Chapter '
              or 'CHAPTER ' and has to be shorter than 80 characters.
            </p>
            <!-- <p>
                  <b>Tip:</b> To create a sub heading, add two asterisks before
                  and after the title: e.g. <b>**Lorem ipsum**</b>.
                </p> -->
            <textarea
              class="form-control"
              id="content"
              rows="33"
              @input="(e) => setText(e.target.value)"
              placeholder="Text"
            ></textarea>

            <ul class="bullet-list-inline">
              <li>{{ post.content ? post.content.length : 0 }} characters</li>
              <li v-if="numChapters > 0 && post.type === 'book'">
                {{ numChapters }} chapter<span v-if="numChapters > 1">s</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- </form> -->
      </div>

      <div class="mt-4"></div>

      <div class="col-12 col-md-8 offset-md-2">
        <form>
          <div class="form-group">
            <select
              class="form-select"
              aria-label="category select"
              id="category"
              @change="setCategory($event)"
            >
              <option selected>Select genre</option>
              <option
                :value="c.slug"
                v-for="(c, i) in [...categories].sort((a, b) =>
                  a.title > b.title ? 1 : -1
                )"
                :key="i"
              >
                {{ c.title }}
              </option>
            </select>
          </div>
          <div class="form-group mt-3">
            <p class="mb-0">
              <span
                class="text-danger"
                v-if="post.intro.length < $options.introMin"
              >
                The minimum length is {{ $options.introMin }} characters.
              </span>
              <span
                class="text-danger"
                v-if="post.intro.length > $options.introMax"
              >
                The maximum length is {{ $options.introMax }} characters.
              </span>
            </p>
            <textarea
              class="form-control"
              id="intro"
              rows="8"
              :placeholder="post.type === 'article' ? 'Introduction' : 'Blurb'"
              @input="(e) => setIntro(e.target.value)"
            ></textarea>
            <span id="characters">{{ post.intro.length }}</span
            >/{{ $options.introMax }} characters
          </div>

          <div
            class="btn btn-secondary mt-2"
            @click="validFields ? publishPost() : false"
            :style="validFields ? 'opacity-100' : 'opacity-25'"
          >
            Publish
          </div>
        </form>
      </div>
    </div>

    <div class="modal" :class="showModal ? 'modal--active' : 'modal--inactive'">
      <div class="modal__bg" @click="toggleModal"></div>
      <div class="modal__inner">
        <div class="modal__content p-2 rounded border">
          <div class="d-flex justify-content-between">
            <h2 class="fs-5">Select image (demo)</h2>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="toggleModal"
            ></button>
          </div>
          <div class="row g-1">
            <div
              :class="$options.ratio.w > $options.ratio.h ? 'col-4' : 'col-3'"
              v-for="i in 12"
              :key="i"
            >
              <div
                class="ratio cursor-pointer"
                :class="'ratio-' + $options.ratio.w + 'x' + $options.ratio.h"
              >
                <div
                  class="position-absolute rounded bg-light image"
                  @click="selectImage(i)"
                  :style="{
                    backgroundImage: `url(${require('@/images/' +
                      path +
                      '/' +
                      i +
                      '.jpg')})`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Vue from "vue";
import getUSD from "@/utils/getUSD.js";

export default {
  data() {
    return {
      showModal: false,
      image: -1,
      category: undefined,
      post: { intro: "" },
      categoryName: "genre",
      trxusd: 1,
    };
  },

  ratio: {
    w: 3,
    h: 4,
  },

  introMin: 250, //100
  introMax: 500, //200

  async created() {
    Vue.set(this.post, "author", 43);
    Vue.set(this.post, "type", "book"); // story stories
    this.trxusd = await getUSD();
  },

  async fetch() {
    await this.validatePage();
  },

  computed: {
    today() {
      return this.dateToString(new Date());
    },

    path() {
      return this.$options.ratio.w > this.$options.ratio.h
        ? "landscape"
        : "portrait";
    },

    price() {
      return this.post.content
        ? ((this.post.content.length / 1000) * this.trxusd).toFixed(2)
        : -1;
    },

    numChapters() {
      return this.post.content
        ? this.post.content
            .toLowerCase()
            .split(/(?:\r?\n)+/)
            .filter((p) => p.startsWith("chapter ")).length
        : "0";
    },

    me() {
      if (this.$store.state.user) {
        return this.$store.state.user.name; // todo
      }
      return undefined;
    },

    categories() {
      return this.$store.state.categories;
    },

    validFields() {
      return (
        this.post.intro &&
        this.post.intro.length >= this.$options.introMin &&
        this.post.intro.length <= this.$options.introMax &&
        this.post.title &&
        this.post.title.length > 0 &&
        this.post.visual &&
        this.post.category &&
        this.post.content
      );
    },
  },

  methods: {
    validatePage() {
      if (this.$store.state.user == undefined) {
        return this.$nuxt.error({
          statusCode: 403,
          message: "Access denied",
        });
      }
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },

    selectImage(i) {
      this.image = i;
      Vue.set(this.post, "visual", { name: i, path: this.path });

      this.showModal = !this.showModal;
    },

    setTitle(e) {
      Vue.set(this.post, "title", e);
      let slug = e.toLowerCase().replace(" ", "-");
      Vue.set(this.post, "slug", slug);
    },

    setIntro(e) {
      Vue.set(this.post, "intro", e);
    },

    // parseContent() {
    //   let parts = e.split(/(?:\r?\n)+/);

    //   if (parts.length > 0) {
    //     let a = [];
    //     let end = 0;
    //     let chapters = 0;
    //     for (let i = 0; i < parts.length; i++) {
    //       if (parts[i]) {
    //         let p = {};

    //         // let p = paragraphs[i];
    //         if (parts[i].startsWith("**")) {
    //           //title
    //           let title = parts[i].replaceAll("**", "");
    //           if (title.length > 0) {
    //             p["title"] = title;
    //             end += title.length;
    //             p["titleEnd"] = end;

    //             chapters += 1;

    //             if (parts[i + 1]) {
    //               p["content"] = parts[i + 1];
    //               end += p["content"].length;
    //               p["end"] = end;

    //               i = i + 1; // skip next part
    //             }
    //           }
    //         } else {
    //           // content
    //           p["content"] = parts[i];
    //           end += p.content.length;
    //           p["end"] = end;
    //         }
    //         a.push(p);
    //       }
    //     }
    //   }
    // },

    setText(e) {
      Vue.set(this.post, "content", e);
    },

    setCategory(e) {
      console.log(e.target.value);
      this.categoryName = this.$store.state.categories.find(
        (c) => c.slug === e.target.value
      ).title;
      Vue.set(this.post, "category", e.target.value);
    },

    dateToString(date) {
      return date.toLocaleDateString("us-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },

    publishPost() {
      let id = this.$store.state.posts.length + 1;

      Vue.set(this.post, "id", id);
      Vue.set(this.post, "date", new Date().getTime() / 1000);
      Vue.set(this.post, "views", 0);

      this.$store.commit("addPost", this.post);

      console.log(this.post);
      this.$router.push("/a/" + this.post.slug);
    },
  },
};
</script>

<style lang="scss" scoped>
.field--upload {
  background-color: #f4f4f4;
  border: 1px solid var(--bs-gray-400);
  overflow: hidden;

  p {
    display: block;
    width: 100%;
    text-align: center;
    transform: translateY(calc(50% - 1rem));
  }
}

.image {
  background-size: 120%;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
