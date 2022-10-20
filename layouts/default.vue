<template>
  <div>
    <pre-loader />

    <div id="page">
      <!-- <characters /> -->

      <Header />
      <div class="min-vh-100 d-flex flex-column justify-content-between">
        <div id="pushdown" class="mb-2 mb-md-3 mb-lg-4"></div>

        <Nuxt />

        <Footer />
      </div>
    </div>

    <modal />
  </div>
</template>

<script>
// import { posts } from "@/utils/newsGenerator.js";
// import categories from "@/data/channels.json";

import {
  getTronWeb,
  setLibraryContract,
  fetchAllPosts,
} from "~/utils/tronUtils.js";

import { posts } from "@/utils/storyGenerator.js";
import categories from "@/data/genres.json";

import writers from "@/data/writers.json";

export default {
  categories,
  writers,

  created() {
    this.$store.commit("SET_CATEGORIES", this.$options.categories);
    this.$store.commit("SET_WRITERS", this.$options.writers);
    this.$store.commit("SET_POSTS", []); //delete any previous posts

    let n = 4;
    let dummyPosts = posts(n);

    for (let i = 0; i < n; i++) {
      this.$store.commit("addPost", { id: i, ...dummyPosts[i] });
    }

    //todo (elsewhere): sort posts and add to contracts
  },

  async mounted() {
    // await getTronWeb();

    // await setLibraryContract();

    // fetch all books
    // const posts = await fetchAllPosts();

    // console.log(books);

    // console.log("The total number of Books: " + posts.length);

    let headerHeight = document.querySelector("#header").offsetHeight; //refs ?
    let pushdown = document.querySelector("#pushdown"); // refs?
    pushdown.style.height = headerHeight + "px";

    // this.$store.commit("setUser", {
    //   id: 1,
    //   name: "Anneloes Louwe",
    //   categories: ["dogs", "hiking", "chess", "save-ukraine"],
    //   writers: [],
    //   history: [],
    // });
  },

  watch: {
    "$store.state.showModal": function (show) {
      if (show) {
        this.posY = window.scrollY;
        document.body.style.top = `-${window.scrollY}px`;
      }
      document.body.classList.toggle("modal-open");

      if (!show && !this.$store.state.user) {
        //after closing modal without sigin
        window.scrollTo(0, this.posY);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#pushdown {
  width: 100%;
}
</style>
