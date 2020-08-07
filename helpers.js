const checkForUserByEmail = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      console.log(database[userId]);
      return database[userId];
    }
  }
  return false;
};

const checkForEmailInDatabase = (email, database) => {
  for (let userId in database) {
    if (database[userId].email === email) {
      return true;
    }
  }
  return false;
};


const getUserByEmail = (email, database) => {
  if (email === null) {
    return undefined;
  } else {
    for (let userId in database) {
      if (database[userId].email === email) {
        console.log(database[userId]);
        return database[userId].id;
      }
    }
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

module.exports = { checkForUserByEmail, getUserByEmail, generateRandomString, urlsForUserID, checkForEmailInDatabase };