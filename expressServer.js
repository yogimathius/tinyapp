const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const generateRandomString = () => {
  let randomStr = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTOUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomStr;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longUrl;
  res.redirect(303, `/urls/${shortURL}`);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.body);
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(302, longURL);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const editFromUser = req.body.longURL;
  console.log('editFromUser', editFromUser);
  const shortURL = req.params.shortURL;
  const urlData = urlDatabase[shortURL];
	
  urlDatabase[shortURL] = editFromUser;
  res.redirect(303, `/urls/${shortURL}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(302, "/urls");
});

// app.post("/urls/<%= longURL %>/add", (req, res) => {
	
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



/* TODOS

At this point we should see cURL and our browser make redirected GET requests to the longURL. We can now review our code and consider edge cases such as:

What would happen if a client requests a non-existent shortURL?
What happens to the urlDatabase when the server is restarted?
What type of status code do our redirects have? What does this status code mean?

*/
