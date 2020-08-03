const generateRandomString = () => {
  let randomStr = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTOUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < 6; i++) {
    randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  console.log(randomStr);
};


generateRandomString();