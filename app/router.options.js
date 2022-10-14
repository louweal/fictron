export default {
  scrollBehavior(to) {
    // if (to.hash) {
    //   return window.scrollTo({
    //     top: document.querySelector(to.hash).offsetTop + window.innerHeight, //useless offset!??
    //     behavior: "smooth",
    //   });
    // }
    // return window.scrollTo({ top: 0, behavior: "auto" }); // to disable smooth scrolling on route change!!

    let position = {};
    console.log("router.options");
    if (to.hash) {
      console.log("to hash yes");
      position = {
        selector: to.hash,
        offset: { x: 0, y: 800 },
        behavior: "smooth",
      };
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(position);
        }, 100);
      });
    }
    // else {
    //   position = { x: 0, y: 0 };
    // }

    return window.scrollTo({ top: 0, behavior: "auto" }); // to disable smooth scrolling on route change!!
  },
};
