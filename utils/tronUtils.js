let contractAddress = "TTjv9ogoQFUbBzVjpwFzZcWcpnaue74kM3"; // Library: "THwEfPabQn3MtsuR7FT4c4XroyH7NeS4Y5";
let contract = null;

const clgstyle = [
  "color: #771414",
  "font-weight: bold",
  "font-size: 0.9rem",
  "padding: 4px 15px",
].join(";");
const dot = String.fromCodePoint("0x1F534");

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

export async function setContract() {
  contract = await window.tronWeb.contract().at(contractAddress);
}

export async function payWriter(address, bookId, value) {
  // let message = undefined;
  // let success = false;
  if (contract === null) {
    // try to get the contract again
    contract = await window.tronWeb.contract().at(contractAddress);
  }

  let result = await contract
    .payWriter(address)
    .send({
      feeLimit: 100_000_000,
      callValue: window.tronWeb.toSun(value),
      shouldPollResponse: false,
    })
    .then(() => {
      // console.log(response);
      let message = `Succesfully transferred ${value} TRX`;
      return { success: true, message };
    })
    .catch((err) => {
      let message;

      // rewrite some common error messages to more comprehensive messages
      if (
        err.message ===
        "Contract validate error : Validate InternalTransfer error, balance is not sufficient."
      ) {
        message = "Account balance is not sufficient.";
      } else if (
        err.message === "Contract validate error : account does not exist"
      ) {
        message = "Account balance is 0 or account doesn't exist.";
      } else {
        message = err.message || err;
      }
      return { success: false, message };
    });
  return { success: result.success, message: result.message };
}

// export async function addFakeBook(author, price) {
//   console.log("addFakeBook");
//   let sunPrice = window.tronWeb.toSun(price);
//   await libraryContract.addFakeBook(author, sunPrice).send({
//     feeLimit: 100_000_000,
//     callValue: 0,
//     shouldPollResponse: true, // ?
//   });
// }

// export async function payAuthor(bookId, value) {
//   console.log("payAuthor");
//   let sunValue = window.tronWeb.toSun(value);

//   try {
//     const result = await libraryContract.payAuthor(bookId).send({
//       feeLimit: 100_000_000,
//       callValue: sunValue, //tronWeb.toSun(value),
//       shouldPollResponse: true,
//     });

//     console.log(`response: ${parseInt(result, 16)} %`);
//     return true;
//   } catch (message) {
//     console.log(message);
//     return false;
//   }
// }
