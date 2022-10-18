<template>
  <div
    class="modal"
    :class="$store.state.showModal ? 'modal--active' : 'modal--inactive'"
  >
    <div class="modal__bg" @click="toggleModal"></div>
    <div class="modal__inner">
      <div class="modal__content p-2 rounded border">
        <slot>
          <div class="d-flex justify-content-between mb-3">
            <div class="p-3"></div>
            <h5 class="modal-title fs-5 align-self-center">Connect wallet</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="toggleModal"
            ></button>
          </div>
          <div class="modal-body px-4">
            <p class="text-center">
              Connect your TRON wallet to get full access. Reading books costs 1
              TRX per 1000 characters. Publishing books is free.
            </p>
            <div class="d-grid gap-2 mb-3">
              <div class="btn btn-secondary cursor-pointer" @click="signIn">
                TronLink
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  type: "books", // articles

  methods: {
    toggleModal() {
      this.$store.commit("toggleModal");
      document.getElementById("page").classList.toggle("is-blurred");
      this.$store.commit("setClickedPost", undefined);
    },

    closeAndClick() {
      this.toggleModal();
      this.$router.push(path);
    },
    signIn() {
      this.$store.commit("setUser", {
        id: 1,
        name: "Anneloes Louwe",
        categories: ["fantasy", "sci-fi"], // ["dogs", "hiking", "chess", "save-ukraine"],
        writers: [1, 3, 7, 9, 13, 15, 21, 23],
        history: [],
      });

      // console.log(this.$route.path);

      let goto = this.$store.state.clickedPost
        ? this.$store.state.clickedPost
        : this.$route.path;

      if (this.$route.path === goto) {
        // stay on same page
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.toggleModal();
      } else {
        this.toggleModal();

        this.$router.push(goto);
      }
      this.$store.commit("setClickedPost", undefined);
    },
  },
};
</script>

<style lang="scss">
.modal {
  width: 100%;
  height: 100vh;
  z-index: 1055;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  visibility: hidden;

  &__bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(222, 222, 222, 0.6);
    opacity: 0;
    visibility: hidden;
  }

  &__inner {
    width: 500px;
    margin: 1rem auto;
    min-height: calc(100% - 2rem);
    padding: 6px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  &__content {
    background-color: #fff;
    width: 100%;
    transform: translateY(100px);
    visibility: hidden;
  }

  &--active {
    visibility: visible;

    .modal__bg {
      opacity: 1;
      visibility: visible;
      transition: all 0.5s linear;
    }

    .modal__content {
      visibility: visible;
      transform: translateY(0);
      transition: all 0.4s 0.4s cubic-bezier(0.2, 0, 0.1, 1);
    }
  }

  &--inactive {
    visibility: hidden;

    .modal__bg {
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s 0.15s linear;
    }

    .modal__content {
      visibility: hidden;
      opacity: 0;
      transform: translateY(100px);
      transition: all 0.3s cubic-bezier(0.2, 0, 0.1, 1);
    }
  }
}
</style>
