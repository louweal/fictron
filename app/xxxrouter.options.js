export default {
  scrollBehavior(to) {
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
    return window.scrollTo({ top: 0, behavior: "auto" }); // to disable smooth scrolling on route change!!
  },
};
