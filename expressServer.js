const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');

const { checkForUserByEmail, checkForEmailInDatabase, generateRandomString, urlsForUserID, timeStamp } = require('./helpers');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", timeCreated: [ 'Fri Aug 07 2020 04:22:56 GMT+0000 (UTC)' ] },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW", timeCreated: [ 'Fri Aug 07 2020 04:22:56 GMT+0000 (UTC)' ] }
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


app.get('/urls', (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect('/login');
    return;
  }
  const filteredURLS = urlsForUserID(req.session.user_id, urlDatabase);
  let templateVars = {
    urls: filteredURLS,
    user
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const userID = req.session.user_id;
  /* FOR STRETCH */
  // const urlTimeStamp = timeStamp();
  // console.log("time stamp is:", urlTimeStamp);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL, userID,};
  console.log(urlDatabase[shortURL]);
  res.redirect(303, `/urls/${shortURL}`);
});

app.delete('/urls/:shortURL/', (req, res) => {
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect(302, '/urls');
  } else {
    res.status(400).send('Invalid credentials.');
  }
});

app.post('/urls/:shortURL/', (req, res) => {
  const shortURL = req.params.shortURL;
  if (shortURL) {
    if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
      const editFromUser = req.body.longURL;
      urlDatabase[shortURL].longURL = editFromUser;
      res.redirect('/urls/');
    } else {
      res.status(400).send('<h1>Unable to access this data. Please login with the valid credentials to view this page.<h1>');
    }
  } else {
    res.status(400).send('<h1>Url does not exist!<h1>');
  }
});

app.get('/urls/new', (req, res) => {
  const user = users[req.session.user_id];
  let templateVars = {
    user
  };
  if (!user) {
    res.redirect('/urls');
  }
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const user = users[req.session.user_id];
  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user
    };
    res.render('urls_show', templateVars);
  } else {
    res.status(400).send('<h1>Invalid User Credentials. Please login with the appropriate credentials to view this page.<h1>');
  }
});

app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(302, longURL);
});
	
app.post('/login', (req, res) => {
  const password = req.body.password;
  const user = checkForUserByEmail(req.body.email, users);
  if (!user) {
    return res.status(401).send('No user with that email found');
  }
  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (result) {
        req.session.user_id = user.id;
        req.session.user = user.email;
        res.redirect('/urls');
      } else {
        res.status(401).send('<h1> Error 401. Forbidden. Invalid Credentials.');
      }
    });
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateRandomString();
  const userDB = checkForEmailInDatabase(email, users);

  if (!email || !password) {
    res.status(400).send('<h1>Email or Password fields cannot be left blank.</h1>');
  } else if (userDB === true) {
    res.status(400).send('<h1>Email is already in use!<h1>');
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        return bcrypt.hashSync(password, salt);
      })
      .then((hash) => {
        users[userID] = {
          id: userID,
          email,
          password: hash
        };
        req.session.user_id = userID;
        res.redirect('/urls');
      });
  }
});

app.get('/register', (req, res) => {
  const user = users[req.session.user_id];

  let templateVars = {
    user
  };
  if (user) {
    res.redirect('/urls');
  } else {
    res.render('register' ,templateVars);
  }
});

app.get('/logout', (req, res) => {
  const user = users[req.session.user_id];
  let templateVars = {
    user
  };
  res.render('logout' ,templateVars);
});

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {

  const user = users[req.session.user_id];
  let templateVars = {
    user
  };
  if (user) {
    res.redirect('/urls');
  } else {
    res.render('login' ,templateVars);
  }
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/"', (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
