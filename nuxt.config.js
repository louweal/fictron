export default {
  ssr: false,

  modern: "client",
  target: "static",
  router: {
    base: "/",
  },
  head: {
    title: "Fictron",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Connects everyone with everyone",
      },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
  },

  css: ["@/assets/css/main.scss"],

  messages: {
    error_404: "Page not found",
  },

  components: true,
  buildModules: [],
  build: {},

  // router: {
  //   scrollBehavior(to) {
  //     // this is deprecated but app/router.scrollBehavior.js doesnt work!!
  //     // if (to.hash) {
  //     //   console.log(document.querySelector(to.hash));
  //     //   return window.scrollTo({
  //     //     top: document.querySelector(to.hash).offsetTop + window.innerHeight, //useless offset!??
  //     //     behavior: "smooth",
  //     //   });
  //     // }
  //     // return window.scrollTo({ top: 0, behavior: "auto" }); // to disable smooth scrolling on route change!!

  //     if (to.hash) {
  //       return {
  //         el: to.hash,
  //         behavior: "auto",
  //       };
  //     }
  //     // let position = {};
  //     // console.log("router.options");
  //     // console.log(window.innerHeight);
  //     // if (to.hash) {
  //     //   console.log("to hash yes");
  //     //   position = {
  //     //     selector: to.hash,
  //     //     offset: { x: 0, y: 0 },
  //     //     behavior: "smooth",
  //     //   };
  //     //   return new Promise((resolve) => {
  //     //     setTimeout(() => {
  //     //       resolve(position);
  //     //     }, 100);
  //     //   });
  //     // }
  //     // else {
  //     //   position = { x: 0, y: 0 };
  //     // }

  //     return window.scrollTo({ top: 0, behavior: "auto" }); // to disable smooth scrolling on route change!!
  //   },
  // },

  generate: {
    fallback: true, // for error pages on Netlify
  },
};
