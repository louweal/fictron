<template>
  <div
    class="modal"
    :class="$store.state.showModal ? 'modal--active' : 'modal--inactive'"
  >
    <div class="modal__bg cursor-pointer" @click="toggleModal"></div>
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
          <div class="modal-body px-1">
            <p class="text-center">
              Can you imagine a world where you can start reading as many books
              as you like and only pay for the pages you read? Connect your TRON
              wallet and let your imagination become reality.
            </p>
            <div class="d-grid gap-2 mb-1">
              <div
                class="btn btn-secondary cursor-pointer d-none d-md-block"
                @click="signIn"
              >
                TronLink
              </div>
              <div
                class="btn btn-secondary cursor-pointer d-md-none opacity-50"
              >
                TronLink
              </div>
            </div>
            <div class="text-center mt-2 d-md-none">
              <p class="text-danger">
                TronLink is currently not available for mobile browsers
              </p>
            </div>

            <div class="text-center mt-2" v-if="error">
              <p class="text-danger">
                Unable to connect your TronLink wallet. Install the
                <a
                  href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec"
                  target="_blank"
                  >TronLink
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
                browser extension, sign in to your TRON wallet and select the
                Nile or Shasta testnet. Then click the button above again and
                accept the connection request.
              </p>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { getTronWebAddress } from "~/utils/tronUtils.js";
import { setContract } from "@/utils/tronUtils";

export default {
  data() {
    return {
      error: false,
    };
  },

  methods: {
    toggleModal() {
      this.$store.commit("toggleModal");
      document.getElementById("page").classList.toggle("is-blurred");
      this.error = false;
    },

    setUser(id, address, name, slug) {
      this.$store.commit("setUser", {
        id,
        address,
        name,
        slug,
        categories: [],
        writers: [],
        history: [],
      });
    },

    async signIn() {
      let tronAddress = await getTronWebAddress();
      if (!tronAddress) {
        this.error = true;
        return;
      }

      let success = await setContract();
      if (!success) {
        this.error = true;
        return;
      }

      let users = JSON.parse(localStorage.getItem("users"));
      let user = users
        ? users.find((u) => u.address === tronAddress.base58)
        : undefined;

      if (user) {
        this.$store.commit("setUser", user);
      } else {
        let numUsers = users ? users.length : 0;
        let id = 42 + numUsers;
        let address = tronAddress.base58;
        let name = tronAddress.name;
        let slug = tronAddress.name.toLowerCase().replaceAll(" ", "-");
        this.setUser(id, address, name, slug);
        this.$store.commit("addWriter", { id, address, name, slug });
      }
      this.toggleModal();
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
