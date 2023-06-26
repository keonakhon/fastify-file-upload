// Generate UUID in Number by Timestamp and Random 6 characters number
const generateRandomNumber = (length: number) => {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `${Date.now()}${result}`;
};

export { generateRandomNumber };
