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

    localStorage.setItem(
      "browserPosts",
      JSON.stringify(state.posts.filter((p) => p.id >= 140))
    );
  },

  // id, progress
  setProgress(state, payload) {
    if (state.user) {
      if (state.user.history.map((i) => i.id).includes(payload.id)) {
        //update
        state.user.history.forEach(
          (i) =>
            (i.progress = i.id === payload.id ? payload.progress : i.progress)
        );

        updateLocalStorageHistory("users", state.user.id, payload);
      } else {
        // add history item
        state.user.history.push(payload);

        addLocalStorageProp("users", state.user.id, "history", payload);
      }
    }
  },

  setUser(state, payload) {
    state.user = payload;
    if (payload) {
      appendLocalStorage("users", state.user);
    }
  },

  addWriter(state, payload) {
    if (state.writers.find((w) => w.id === payload.id) === undefined) {
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

    // also update username in localstorage
    let users = JSON.parse(localStorage.getItem("users"));
    users.forEach((w) => {
      w.name = w.id === state.user.id ? state.user.name : w.name;
      w.slug = w.id === state.user.id ? state.user.slug : w.slug;
    });
    localStorage.setItem("users", JSON.stringify(users));

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
    addLocalStorageProp("users", state.user.id, "categories", payload);
  },

  removeUserCategory(state, payload) {
    state.user.categories = state.user.categories.filter((c) => c !== payload);
    removeLocalStorageProp("users", state.user.id, "categories", payload);
  },

  addUserWriter(state, payload) {
    state.user.writers.push(payload);
    addLocalStorageProp("users", state.user.id, "writers", payload);
  },

  removeUserWriter(state, payload) {
    state.user.writers = state.user.writers.filter((c) => c !== payload);
    removeLocalStorageProp("users", state.user.id, "writers", payload);
  },
};

function appendLocalStorage(key, data) {
  if (localStorage.getItem(key)) {
    let obj = JSON.parse(localStorage.getItem(key));
    if (!obj.find((o) => o.id === data.id)) {
      obj.push(data);
      localStorage.setItem(key, JSON.stringify(obj));
    }
  } else {
    localStorage.setItem(key, JSON.stringify([data]));
  }
}

function addLocalStorageProp(key, id, propName, item) {
  let data = JSON.parse(localStorage.getItem(key));
  let prop = data.find((d) => d.id == id)[propName];
  prop.push(item);

  data.forEach((w) => {
    w[propName] = w.id === id ? prop : w[propName];
  });
  localStorage.setItem(key, JSON.stringify(data));
}

// todo:  for history/progress
function updateLocalStorageHistory(key, id, updatedObj) {
  let data = JSON.parse(localStorage.getItem(key));
  let newHistory = data.find((d) => d.id == id).history;
  newHistory.forEach(
    (o) =>
      (o.progress = o.id == updatedObj.id ? updatedObj.progress : o.progress)
  );

  data.forEach((w) => {
    w.history = w.id === id ? newHistory : w.history;
  });
  localStorage.setItem(key, JSON.stringify(data));
}

function removeLocalStorageProp(key, id, propName, item) {
  let data = JSON.parse(localStorage.getItem(key));
  data.forEach((w) => {
    w[propName] =
      w.id === id ? w[propName].filter((i) => i !== item) : w[propName];
  });
  localStorage.setItem(key, JSON.stringify(data));
}
