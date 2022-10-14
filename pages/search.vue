<template>
  <main>
    <div class="container-xl">
      <div class="row gx-3 gx-lg-5 mt-sm-3 mt-lg-5">
        <div class="col-12 col-md-9 xxxalign-items-center mb-5">
          <form class="form-inline my-2 my-lg-0 d-flex">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <div class="btn btn-secondary ms-2 my-2 my-sm-0">Search</div>
          </form>
        </div>

        <div class="col-12 col-md-9">
          <!-- <h1>Books</h1> -->

          <post-grid :posts="posts.slice(0, 30)" />
        </div>

        <div class="col-md-3 d-none d-md-block">
          <ul class="list-inline">
            <li
              v-for="(c, i) in categories"
              :key="i"
              class="mb-2 me-2 list-inline-item"
            >
              <nuxt-link :to="'/c/' + c.slug" class="btn btn-sm btn-secondary">
                {{ c.title }}
              </nuxt-link>
            </li>
          </ul>

          <h2 class="fs-5">Writers</h2>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$store.state.posts; // all posts
    },

    categories() {
      return this.$store.state.categories;
    },
  },
};
</script>

<style></style>
