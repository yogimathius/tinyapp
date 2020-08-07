const checkForUserByEmail = (email, database) => {
  for (const userId in database) {
    if (database[userId].email === email) {
      console.log(database[userId]);
      return database[userId];
    }
  }
  return false;
};

const checkForEmailInDatabase = (email, database) => {
  for (const userId in database) {
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
    for (const userId in database) {
      if (database[userId].email === email) {
        console.log(database[userId]);
        return database[userId].id;
      }
    }
  }
};

const generateRandomString = () => {
  return Math.random().toString(36).substr(2, 6);
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


/* FOR STRETCH */
const timeStamp = () => {
  const [date] = (new Date()).toLocaleDateString().split("/");
  return date;
};


module.exports = { checkForUserByEmail, getUserByEmail, generateRandomString, urlsForUserID, checkForEmailInDatabase, timeStamp };