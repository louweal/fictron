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
              Connect your TRON wallet to start reading. Fictronners only pay
              for what they read, not for what they don't read.
            </p>
            <div class="d-grid gap-2 mb-3">
              <div class="btn btn-secondary cursor-pointer" @click="signIn">
                TronLink
              </div>
            </div>

            <p class="text-danger text-center" v-if="error">
              Unable to detect your TronLink wallet. Install the
              <a
                href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                target="_blank"
                >TronLink
                <i class="bi bi-box-arrow-up-right"></i>
              </a>
              browser extension from the Chrome Web Store and sign in.
            </p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { getTronWeb } from "~/utils/tronUtils.js";

export default {
  type: "books", // articles

  data() {
    return {
      error: false,
    };
  },

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
      let address = getTronWeb();

      if (address === undefined) {
        // this.toggleModal();
        this.error = true;
        return;
      }
      // return;
      this.error = false;

      let localStorageUser;

      if (localStorage.getItem("user")) {
        localStorageUser = JSON.parse(localStorage.getItem("user"));
      }

      if (localStorageUser && localStorageUser.id === address.base58) {
        this.$store.commit("setUser", localStorageUser);
      } else {
        let id = address.base58;
        let name = address.name;
        let slug = address.name.toLowerCase().replaceAll(" ", "-");
        this.$store.commit("setUser", {
          id,
          name,
          slug,
          categories: [],
          writers: [],
          history: [],
        });

        // also add writer (if not exists yet
        console.log("to add!!");

        this.$store.commit("addWriter", {
          id,
          name,
          slug,
        });
      }

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
