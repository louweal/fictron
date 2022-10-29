let libraryContractAddress = "TC5Vy6nYvxr537deGrPPPRWqwe9vjZzbTE"; // Library: "THwEfPabQn3MtsuR7FT4c4XroyH7NeS4Y5";
let libraryContract = null;

const clgstyle = [
  "color: #771414",
  "font-weight: bold",
  "font-size: 0.9rem",
  "padding: 4px 15px",
].join(";");
const dot = String.fromCodePoint("0x1F534");

export function requestAccounts() {
  tronLink.request({ method: "tron_requestAccounts" }); //???
}

export async function getTronWebAddress() {
  let tw = await window.tronWeb;

  if (tw === false) {
    console.log("Unknown problem connecting to TronWeb");
    return undefined;
  }

  const requestAccountsResponse = await tronLink.request({
    method: "tron_requestAccounts",
  });

  if (
    requestAccountsResponse.code === 4001 ||
    requestAccountsResponse.code === 4000
  ) {
    console.log(`%c ${dot} ${requestAccountsResponse.message}`, clgstyle);

    return undefined;
  }

  console.log(
    `%c ${dot} TronWeb successfully connected to your wallet`,
    clgstyle
  );

  return tw.defaultAddress;
}

export async function setLibraryContract() {
  libraryContract = await window.tronWeb.contract().at(libraryContractAddress);
  // let result = await libraryContract
  //   .setReader()
  //   .send()
  //   .then((response) => console.log(response))
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // console.log("result: ", result);
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

export async function payWriter(address, value, price) {
  let error = undefined;
  if (libraryContract === null) {
    error = "Contract 404";
    return { success: false, error };
  }
  await libraryContract
    .payWriter(address)
    .send({
      feeLimit: 100_000_000,
      callValue: window.tronWeb.toSun(value),
      shouldPollResponse: false,
    })
    .then((response) => {
      // console.log(response);
    })
    .catch(async (err) => {
      // console.log(err);
      error = err.error ? "Account balance might be insufficient" : err;
    });
  return error ? { success: false, error: error } : { success: true };
}
