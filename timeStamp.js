const timeStamp = () => {
  let [date] = (new Date()).toLocaleDateString().split("/");
  console.log(date);
};


timeStamp();