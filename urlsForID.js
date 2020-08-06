const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const urlsForUserID = (userID) => {
  let userURLs = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      userURLs[url] = {
        longURL: urlDatabase[url].longURL,
        userID: urlDatabase[url].userID
      };
    }
  }
  console.log(userURLs);
  return userURLs;
};

urlsForUserID("aJ48lW");
