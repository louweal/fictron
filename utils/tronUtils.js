//import LibraryABI from './libraryABI'

let account = null;
let libraryContractAddress = "TGcg2angYestWUkkWZKQ2gz8srqnfCHpME"; // Paste Contract address here
let libraryContract = null;

export const accountAddress = () => {
  return account;
};

export function getTronWeb() {
  // Obtain the tronweb object injected by tronLink
  var obj = setInterval(async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      clearInterval(obj);
      console.log("tronWeb successfully detected!");
    }
  }, 10);
}

export async function setLibraryContract() {
  // TODO: abtain contract Object

  libraryContract = await window.tronWeb.contract().at(libraryContractAddress);
}

export async function fetchAllPosts() {
  // TODO: call bookId func of library contract to abtain total books number
  // iterate till book Id
  // push each object to books array
  const posts = [];

  const numPosts = await libraryContract.postId().call();
  //iterate from 0 till bookId
  for (let i = 0; i < numPosts; i++) {
    const post = await libraryContract.posts(i).call();

    // // on scroll at post page
    // const postContractAddress = await libraryContract.postContracts(i).call();
    // let postContract = await window.tronWeb.contract().at(postContractAddress);

    // let pages = [];
    // const numPages = await postContract.pageId().call();
    // for(let j = 0; j < numPages; j++) {
    //   const page = await postContract.pages(i).call();
    //   pages.push(page);
    // }

    posts.push({
      id: i,
      title: post.title,
      intro: post.intro,
      category: post.category,
      content: [],
    });
  }

  return posts;
}
