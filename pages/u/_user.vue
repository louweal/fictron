<template>
  <main>
    <div class="container-xl" v-if="$store.state.user">
      <div class="row g-3 g-lg-5">
        <!-- <div class="col-12 col-md-9">

        </div>

        <div class="col-md-3 align-self-center"></div> -->

        <div
          class="col-12 col-md-3 order-md-3"
          v-if="writers.length > 0 || categories.length > 0"
        >
          <!-- <h2 class="fs-3 mb-3">Writers & Genres</h2> -->

          <div
            class="border bg-white shadow-sm rounded py-3 px-3 xxxmb-3"
            v-if="writers.length > 0"
          >
            <h2 class="fs-5">Following</h2>

            <div
              class="py-2"
              v-for="(w, i) in [...writers].sort((a, b) =>
                a.numBooks > b.numBooks ? -1 : 1
              )"
              :key="i"
              :class="i > 0 ? 'border-top' : false"
            >
              <nuxt-link :to="'/w/' + w.slug" class="">
                <h3 class="fw-bold fs-6 mb-0 text-secondary">{{ w.name }}</h3>
                <span
                  >{{ w.numBooks }} book<span v-if="w.numBooks > 1"
                    >s</span
                  ></span
                >
              </nuxt-link>
            </div>
          </div>

          <div v-for="(c, i) in categories" class="my-3" :key="i">
            <category-card :category="c" :borderTop="i !== 0" />
          </div>
        </div>

        <div class="col-12 col-md-9 order-md-2">
          <h1>{{ me.name }}</h1>

          <nuxt-link :to="'/w/' + me.slug"
            ><i class="bi bi-book-half"></i> View profile</nuxt-link
          >

          <div class="hstack gap-2">
            <span
              class="cursor-pointer btn btn-sm text-white"
              style="background-color: var(--bs-secondary)"
              @click="toggleModal()"
              >Change username</span
            >
            <span
              @click="$store.commit('setUser', undefined)"
              class="xxxcursor-pointer btn btn-primary btn-sm"
            >
              <i class="bi bi-box-arrow-right"></i>
              Disconnect<span class="d-none d-md-inline"> wallet</span>
            </span>
          </div>

          <div class="my-4"></div>

          <template v-if="reading.length > 0">
            <h2 class="fs-3 mb-3">Continue reading</h2>

            <post-grid :posts="reading" />
          </template>

          <template v-if="read.length > 0">
            <h2 class="fs-3 mt-4 mb-3">Read again</h2>

            <!-- <p>Reading books again is always free.</p> -->

            <post-grid :posts="read" />
          </template>
        </div>
      </div>
    </div>

    <div class="modal" :class="showModal ? 'modal--active' : 'modal--inactive'">
      <div class="modal__bg" @click="toggleModal"></div>
      <div class="modal__inner">
        <div class="modal__content p-2 rounded border">
          <div class="d-flex justify-content-between">
            <h2 class="fs-5">Change username</h2>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="toggleModal"
            ></button>
          </div>
          <div class="">
            <div class="form-inline d-flex">
              <input
                event=""
                class="form-control me-2"
                type="text"
                placeholder="New username"
                :value="username"
                @input="(e) => (username = e.target.value)"
              />

              <div class="btn btn-secondary" @click="changeUsername()">
                Update
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      username: "",
    };
  },
  watch: {
    "$store.state.user": function () {
      if (this.$store.state.user == undefined) {
        this.$router.push("/");
      }
    },
  },

  async fetch() {
    await this.validateAccess();
  },

  computed: {
    me() {
      return this.$store.state.user;
    },
    writers() {
      let following = this.$store.state.user.writers;

      let writers = this.$store.state.writers.filter((w) =>
        following.includes(w.id)
      );

      writers.forEach(
        (w) =>
          (w["numBooks"] = this.$store.state.posts.filter(
            (p) => p.author === w.id
          ).length)
      );

      return writers.filter((w) => w.numBooks > 0);
    },

    reading() {
      let history = this.$store.state.user.history.filter(
        (h) => h.progress > 0
      );
      let historyIds = history.map((h) => h.id);

      return this.$store.state.posts.filter(
        (p) =>
          historyIds.includes(p.id) &&
          Math.ceil(
            (100 * history.find((h) => h.id == p.id).progress) /
              p.content.length
          ) < 100
      );
    },

    read() {
      let history = this.$store.state.user.history;
      let historyIds = this.$store.state.user.history.map((h) => h.id);

      return this.$store.state.posts.filter(
        (p) =>
          historyIds.includes(p.id) &&
          Math.ceil(
            (100 * history.find((h) => h.id == p.id).progress) /
              p.content.length
          ) === 100
      );
    },

    categories() {
      let subs = this.$store.state.user.categories;

      return this.$store.state.categories.filter((c) => subs.includes(c.slug));
    },
  },

  methods: {
    validateAccess() {
      console.log(this.$store.state.user);
      if (this.$store.state.user == undefined) {
        return this.$nuxt.error({
          statusCode: 403,
          message: "Access denied",
        });
      }
    },

    changeUsername() {
      if (this.username.length > 1) {
        this.$store.commit("setUserName", this.username);
      }
      this.toggleModal();
    },

    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>

<style></style>
