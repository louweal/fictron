export const state = () => ({
  showModal: false,
  posts: [],
  categories: [],
  writers: [],
  clickedPost: undefined,
  user: undefined,
});

export const mutations = {
  toggleModal(state) {
    state.showModal = !state.showModal;
  },

  SET_POSTS(state, payload) {
    state.posts = payload;
  },

  SET_CATEGORIES(state, payload) {
    state.categories = payload;
  },

  SET_WRITERS(state, payload) {
    state.writers = payload; //
  },

  addPost(state, payload) {
    let post = {
      slug: payload.title.toLowerCase().replaceAll(" ", "-"),
      ...payload,
    };
    state.posts.push(post);

    if (localStorage.getItem("browserPosts")) {
      let browserPosts = JSON.parse(localStorage.getItem("browserPosts"));
      browserPosts.push(post);
      localStorage.setItem("browserPosts", JSON.stringify(browserPosts));
    } else {
      let userPost = [post];
      localStorage.setItem("browserPosts", JSON.stringify(userPost));
    }
  },

  // id, progress
  setProgress(state, payload) {
    if (state.user) {
      // console.log(state.user.history.map((i) => i.id));
      if (state.user.history.map((i) => i.id).includes(payload.id)) {
        //update
        state.user.history.forEach(
          (i) =>
            (i.progress = i.id === payload.id ? payload.progress : i.progress)
        );
      } else {
        // add history item
        state.user.history.push({
          id: payload.id,
          progress: payload.progress,
        });
      }
    }
  },

  setUser(state, payload) {
    state.user = payload;
    console.log("set!");
    if (payload) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },

  addWriter(state, payload) {
    console.log(state.writers.find((w) => w.id === payload.id));
    if (state.writers.find((w) => w.id === payload.id) === undefined) {
      console.log("add!!");
      state.writers.push(payload);

      // update browser storage
      localStorage.setItem(
        "browserWriters",
        JSON.stringify(state.writers.slice(42))
      );
    }
  },

  setUserName(state, payload) {
    state.user.name = payload;
    state.user.slug = payload.toLowerCase().replaceAll(" ", "-");
    localStorage.setItem("user", JSON.stringify(state.user));

    state.writers.forEach((w) => {
      w.name = w.id === state.user.id ? state.user.name : w.name;
      w.slug = w.id === state.user.id ? state.user.slug : w.slug;
    });

    // update browser storage
    localStorage.setItem(
      "browserWriters",
      JSON.stringify(state.writers.slice(42))
    );
  },

  updateViews(state, id) {
    state.posts.forEach((a) => (a.views = a.id === id ? a.views + 1 : a.views));
  },

  addUserCategory(state, payload) {
    state.user.categories.push(payload);
    localStorage.setItem("user", JSON.stringify(state.user));
  },

  removeUserCategory(state, payload) {
    state.user.categories = state.user.categories.filter((c) => c !== payload);
    localStorage.setItem("user", JSON.stringify(state.user));
  },

  addUserWriter(state, payload) {
    state.user.writers.push(payload);
    localStorage.setItem("user", JSON.stringify(state.user));
  },

  removeUserWriter(state, payload) {
    state.user.writers = state.user.writers.filter((c) => c !== payload);
    localStorage.setItem("user", JSON.stringify(state.user));
  },

  setClickedPost(state, payload) {
    state.clickedPost = payload;
  },
};
