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
import categories from "@/data/genres.json";
import posts from "@/data/posts.json";
import writers from "@/data/writers.json";

export default {
  categories,
  writers,
  posts,

  // : writers.map((name, index) => ({
  //   id: index,
  //   name,
  //   slug: name.toLowerCase().replace(" ", "-"),
  // })),

  created() {
    this.$store.commit("SET_CATEGORIES", this.$options.categories);

    this.$store.commit(
      "SET_WRITERS",
      this.combinedData(this.$options.writers, "browserWriters")
    );

    this.$store.commit(
      "SET_POSTS",
      this.combinedData(this.$options.posts, "browserPosts")
    );
  },

  async mounted() {
    // await getTronWeb();

    let headerHeight = document.querySelector("#header").offsetHeight; //refs ?
    let pushdown = document.querySelector("#pushdown"); // refs?
    pushdown.style.height = headerHeight + "px";
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

  methods: {
    combinedData(staticData, lsKey) {
      let data = localStorage.getItem(lsKey);
      let browserData = data !== null ? JSON.parse(data) : [];
      return [...staticData, ...browserData];
    },
  },
};
</script>

<style lang="scss" scoped>
#pushdown {
  width: 100%;
}
</style>
