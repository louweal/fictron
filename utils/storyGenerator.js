import loremIpsum from "~/data/lorem-ipsum.json";
import categories from "~/data/genres.json";

function shuffledLorem() {
  return loremIpsum.text
    .split(". ")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .join(". ");
}

function getWords(x) {
  return shuffledLorem().split(/[ ,]+/).slice(0, x).join(" ");
}

function makeParagraphs(n) {
  let a = [];
  let end = 0;
  let chapter = 1;
  for (let i = 0; i < n; i++) {
    let p = {};

    if (i === 0 || Math.ceil(Math.random() * 5) == 5) {
      // add chapter title above paragraph (1/5 prob)
      p["title"] =
        "Chapter " +
        chapter +
        ": " +
        getWords(Math.ceil(Math.random() * 4)).replaceAll(".", "");
      end += p.title.length;
      p["titleEnd"] = end;
      chapter += 1;
    }
    p["content"] = getWords(200 + Math.floor(Math.random() * 50));
    end += p.content.length;
    p["end"] = end;
    a.push(p);
  }
  return { a, end, chapter };
}

export function posts(n) {
  let numCategories = categories.length;
  let categorySlugs = categories.map((c) => c.slug);

  let a = [];
  for (let i = 0; i < n; i++) {
    let title = getWords(Math.floor(Math.random() * 2) + 4).replaceAll(".", "");
    let slug = title.toLowerCase().replaceAll(" ", "-");
    let existingSlugSet = new Set(a.map((a) => a.slug));

    if (existingSlugSet.has(slug)) {
      console.log("duplicate!");
      n += 1;
      continue; // do not add post with duplicate title/slug
    }

    let author = Math.ceil(Math.random() * 42);
    title = title.charAt(0) + title.slice(1).toLowerCase();
    let content = makeParagraphs(37 + Math.ceil(Math.random() * 15));
    let category = categorySlugs[author % numCategories];
    let numImages = categories.find((c) => c.slug === category).images;

    a.push({
      author: author, // the data/writers.json contains 42 writers, with ids 1-42
      id: i,
      title: title,
      intro: getWords(100 + Math.ceil(Math.random() * 100)), // book blurb is 100-200 words
      slug: slug,
      visual: { name: Math.ceil(Math.random() * numImages), path: category },
      category: category,
      content: content.a,
      total: content.end,
      chapters: content.chapter,
      date: new Date((1662031747 + Math.ceil(Math.random() * 2592000)) * 1000), // 1 sept 2022 + 1 month
      views: Math.ceil(Math.random() * 777),
    });
  }

  return a;
}
