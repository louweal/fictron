let libraryContractAddress = "THwEfPabQn3MtsuR7FT4c4XroyH7NeS4Y5";
let libraryContract = null;

export function requestAccounts() {
  tronLink.request({ method: "tron_requestAccounts" }); //???
}

export function getTronWebAddress() {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    console.log("tronWeb successfully detected!");
    return window.tronWeb.defaultAddress;
  } else {
    console.log("problem connecting to TronWeb");
    return undefined;
  }
}

export async function setLibraryContract() {
  libraryContract = await window.tronWeb.contract().at(libraryContractAddress);
}

export async function addFakeBook(author, price) {
  console.log("addFakeBook");
  let sunPrice = window.tronWeb.toSun(price);
  await libraryContract.addFakeBook(author, sunPrice).send({
    feeLimit: 100_000_000,
    callValue: 0,
    shouldPollResponse: true, // ?
  });
}

export async function payAuthor(bookId, value) {
  console.log("payAuthor");
  let sunValue = window.tronWeb.toSun(value);

  try {
    const result = await libraryContract.payAuthor(bookId).send({
      feeLimit: 100_000_000,
      callValue: sunValue, //tronWeb.toSun(value),
      shouldPollResponse: true,
    });

    console.log(`response: ${parseInt(result, 16)} %`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
