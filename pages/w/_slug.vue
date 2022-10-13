<template>
  <main>
    <div class="container-xl">
      <div class="hstack gap-3 mt-2 d-md-none">
        <h1>{{ writer.name }}</h1>
        <div class="btn btn-sm btn-secondary" @click="updateWriters()">
          {{ following ? "Unfollow" : "Follow" }}
        </div>
      </div>
      <span class="d-md-none">{{ posts.length }} {{ $options.type }}</span>

      <div class="row gx-3 gx-lg-5 mt-2 mt-lg-4">
        <div class="col-12 col-md-9">
          <template v-for="(c, i) in new Set(posts.map((p) => p.category))">
            <h2 class="fs-3" :key="i">
              Publications in
              <nuxt-link :to="'/c/' + c" class="text-secondary">
                {{ categories.find((cat) => cat.slug === c).title }}
              </nuxt-link>
            </h2>

            <post-grid
              :posts="posts.filter((p) => p.category === c)"
              :key="i"
            />
          </template>
        </div>

        <div class="col-md-3 d-none d-md-block">
          <img
            :src="`${require('@/images/authors/' +
              writer.gender +
              '/' +
              writer.avatar +
              '.jpg')}`"
            :alt="writer.name"
            class="rounded-circle"
            width="100"
          />
          <h2>{{ writer.name }}</h2>
          <p>{{ posts.length }} {{ $options.type }}</p>

          <div class="btn btn-sm btn-secondary" @click="updateWriters()">
            {{ following ? "Unfollow" : "Follow" }}
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  type: "stories", //"articles",

  computed: {
    writer() {
      return this.$store.state.writers.find(
        (a) => a.slug === this.$route.params.slug
      );
    },

    posts() {
      return this.$store.state.posts.filter((a) => a.author === this.writer.id);
    },

    categories() {
      return this.$store.state.categories;
    },

    following() {
      return this.$store.state.user.writers.includes(this.writer.id);
    },
  },

  methods: {
    updateWriters() {
      if (this.following) {
        this.$store.commit("removeWriter", this.writer.id);
      } else {
        this.$store.commit("addWriter", this.writer.id);
      }
    },
  },
};
</script>

<style></style>
