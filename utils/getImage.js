export default function getImage(visual) {
  return `url(${visual}`;
  // return `url(${"/_nuxt/images/" + visual.path + "/" + visual.name + ".jpg"})`;
  try {
    return `url(${require("@/images/" + visual + ".webp")})`;
  } catch {
    try {
      return `url(${require("@/images/" + visual + ".jpg")})`;
    } catch {
      return "none";
    }
  }
}

// export default function getImage(visual) {
//   try {
//     return `url(${require("@/images/" +
//       visual.path +
//       "/" +
//       visual.name +
//       ".webp")})`;
//   } catch {
//     try {
//       return `url(${require("@/images/" +
//         visual.path +
//         "/" +
//         visual.name +
//         ".jpg")})`;
//     } catch {
//       return "none";
//     }
//   }
// }
