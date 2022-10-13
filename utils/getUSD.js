export default async function getUSD(currency = "TRX") {
  let response = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${currency}&tsyms=USD`
  );
  let ccdata = await response.json();
  console.log(ccdata);
  return ccdata["USD"];
}
