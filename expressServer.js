const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {
  let randomStr = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTOUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomStr;
};

const checkForUserByEmail = (email) => {
  for (let userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return false;
};

// const checkUserPassword = (password) => {
//   for (let userId in users) {
//     if (users[userId].password === password) {
//       return true;
//     }
//   }
//   return false;
// };


const checkValidUser = (email, password) => {
  const validUser = checkForUserByEmail(email);
  if (validUser.password === password) {
    return validUser;
  } else {
    return false;
  }
};

const newUser = (email, password) => {
	
  const userID = generateRandomString();
	
  const newUser = {
    id: userID,
    email,
    password
  };
	
  users[userID] = newUser;
	
  return userID;
};
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(302, "/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const editFromUser = req.body.longURL;
  console.log('editFromUser', editFromUser);
  const shortURL = req.params.shortURL;
  // const urlData = urlDatabase[shortURL];
  urlDatabase[shortURL] = editFromUser;
  res.redirect(303, `/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies['user_id']];

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],
    user
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.body);
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(302, longURL);
});
	
app.get("/urls/new", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_new", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
	
  if (password === null) {
    res.status(400).send('<h1>Status of 400: Bad Request. Cannot leave Email or Password blank');
  }
	
  const user = checkForUserByEmail(email);
	
  if (!user) {
    const userId = newUser(email, password);
		
    res.cookie('user_id', userId);
    console.log(users);
    res.redirect('/urls');
  } else {
    res.status(400).send('<h1>Status of 400: Bad Request. Email Already In Use</h1>');
  }
});


app.get("/register", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('register' ,templateVars);
});

app.get("/logout", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('logout' ,templateVars);
});

app.post("/logout", (req, res) => {
  const userEmail = req.body.email;
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
	
  const validUser = checkValidUser(email, password);
  console.log(email, password, validUser);
  if (validUser) {
    res.cookie('user_id', validUser.id);
    res.redirect('/urls');
  } else {
    res.status(403).send('<h1> Error 403. Forbidden. Invalid Credentials.');
  }

});

app.get("/login", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    user
  };
  res.render('login' ,templateVars);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const user = users[req.cookies['user_id']];
  let templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_index", templateVars);
});
	
app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longUrl;
  res.redirect(303, `/urls/${shortURL}`);
});
app.get("/", (req, res) => {
  res.redirect('/urls');
});
// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



/* TODOS

At this point we should see cURL and our browser make redirected GET requests to the longURL. We can now review our code and consider edge cases such as:

What would happen if a client requests a non-existent shortURL?
What happens to the urlDatabase when the server is restarted?
What type of status code do our redirects have? What does this status code mean?

*/
