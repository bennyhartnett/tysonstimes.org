const ARTICLE_OVERRIDES = {
  "don-beyer-wins-virginia-8th-democratic-primary-2d7e2c2b": {
    hero: {
      alt: "Official portrait of Rep. Don Beyer",
      caption: "Official portrait of Rep. Don Beyer.",
      credit: "U.S. House of Representatives / Wikimedia Commons (public domain)",
      width: 960,
      height: 1200,
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg/960px-Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg",
      srcSet: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg/500px-Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg 500w, https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg/960px-Rep._Don_Beyer%2C_official_portrait_%28118th_Congress%29.jpg 960w",
      srcSetType: "image/jpeg",
      fit: "contain",
    },
  },
};

export function applyArticleOverrides(article) {
  const override = ARTICLE_OVERRIDES[article.id];
  if (!override) return article;

  return {
    ...article,
    ...override,
    hero: { ...article.hero, ...override.hero },
  };
}
