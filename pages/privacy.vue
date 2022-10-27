<template>
  <div id="top">
    <div class="container-xl">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3">
          <h1 class="fs-2">Privacy statement</h1>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
            accusantium odit ipsam obcaecati rem qui quod ab, consectetur et
            repellat dolores labore vitae ducimus nulla possimus corrupti
            eveniet enim quo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { fakeBooks } from "@/utils/fakeBookGenerator";
import { setLibraryContract, addFakeBook } from "@/utils/tronUtils";

export default {
  async created() {
    // let bookset = fakeBooks(140);
    // console.log(bookset);

    return;
    await setLibraryContract();

    let posts = this.$store.state.posts;
    let writers = this.$store.state.writers;

    for (let i = 0; i < 1; i++) {
      console.log(posts[i].id);
      console.log(posts[i].author);
      console.log(posts[i].price);

      let address = writers.find((w) => w.id === posts[i].id).address;
      console.log(address);
      await addFakeBook(address, posts[i].price);
    }
  },
};
</script>

<style></style>
