// RETURNS A USER ID BY EMAIL PROVIDED IN THE REQ.BODY OR ELSEWHERE

const checkForUserByEmail = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email) {
      console.log(database[userId]);
      return database[userId];
    }
  }
  return false;
};

// CHECKS FOR AN EMAIL IN THE USER DATABASE, RETURNS TRUE OR FALSE
const checkForEmailInDatabase = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email) {
      return true;
    }
  }
  return false;
};

// RETURNS FULL OBJECT OF USER IN USER DATABASE, BY EMAIL
const getUserByEmail = (email, database) => {
  if (email === null) {
    return undefined;
  } else {
    for (const userId in database) {
      if (database[userId].email === email) {
        console.log(database[userId]);
        return database[userId].id;
      }
    }
  }
};

// RANDOM STRING GENERATOR FOR CREATING USER IDS AND SHORTURLS (6 CHARACTERS LONG)
const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
};

// FILTERS URLS IN THE URL DATABASE BY THE USER ID IT BELONGS TO
const urlsForUserID = (ID, database) => {
  let userURLs = {};
  for (let url in database) {
    if (database[url].userID === ID) {
      userURLs[url] = {
        longURL: database[url].longURL,
        userID: database[url].userID
      };
    }
  }
  return userURLs;
};


/* FOR STRETCH */

// CREATES A TIMESTAMP TO TRACK WHEN URLS ARE CREATED, OR WHEN VISITORS HAVE GONE TO CERTAIN SHORTURLS
const timeStamp = () => {
  let date = new Date(Date.now());
  return date.toLocaleString('en-GB', { hour12:false });
};

console.log(timeStamp());

module.exports = { checkForUserByEmail, getUserByEmail, generateRandomString, urlsForUserID, checkForEmailInDatabase, timeStamp };