// establish global variables on page launch
  const textInput = document.getElementById('textInput')
  const encryptedInput = document.getElementById('encryptedInput')
  const encryptedResults = document.getElementById("encryptedResults")
  const decryptedResults = document.getElementById("decryptedResults")
  const key = document.getElementById("key")
//turn individual characters into a numeric value
const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n,;:\"'.\\/?~`!@#$%^&*()_+-=<>{}[]|"
const charSetArr = charSet.split('');
const charSetValues = charSetArr.map((char, index) => { return index })
//getting the numeric value of a character
function getNumValue(char) {
  let numValue = charSetArr.indexOf(char)
  return numValue
}
//reverting number values to characters
function getChar(num) {
  let char = charSetArr[num]
  return char
}
//getting the input text ready to encrypt
function turnInputStringToNumArr(rawTextInput, resultField) {
  if (rawTextInput.length === 0) {
    resultField.innerHTML = "Please enter text to encrypt."
  } else {
  let inputNumberValues = []
  for (let i = 0; i < rawTextInput.length; i++) {
    inputNumberValues.push(getNumValue(rawTextInput[i]))
  } //console.log(inputNumberValues)
  return inputNumberValues}
}
function mapToRange(num) {
  // Ensure the result is always positive
  reducedNum = ((num % (charSetArr.length)) + (charSetArr.length)) % (charSetArr.length);
  return reducedNum;
}
//processing encryption
function encryptMessage() {
  const keyNumValue = findKey(encryptedResults);
  const encryptionArrStartingPoint = turnInputStringToNumArr((textInput.value), encryptedResults);
  // Encryption step 1
  const encryptionArrStep1 = encryptionArrStartingPoint.map((num, index) => {
  let result = num + ((keyNumValue[0] + 3) * (index + 8));
    return mapToRange(result);
  });
  //encryption step 2
  const encryptionArrStep2 = encryptionArrStep1.unshift(keyNumValue[1]).map((num, index, array) => {
    let result = num + ((keyNumValue[1] + 1) * (array[index - 1] + 1));
    return mapToRange(result);
  }).shift();
  // Convert numbers back to characters
  console.log(encryptionArrStep1, encryptionArrStep2)
  const resultString = encryptionArrStep2.map((num) => getChar(num)).join("");
  encryptedResults.textContent = resultString;
}
//processing decrption
function decryptMessage() {
  const keyNumValue = findKey(decryptedResults);
  const decryptionArrStartingPoint = turnInputStringToNumArr((encryptedInput.value), decryptedResults);
  //reversion of encryption step 2
  const decryptionArrStep2 = decryptionArrStartingPoint.unshift(keyNumValue[1]).map((num, index, array) => {
    let result = num - ((keyNumValue[1] + 1) * (array[index - 1] + 1));
    return mapToRange(result);
  }).shift();
  // Reversion of encryption step 1
  const decryptionArrStep1 = decryptionArrStep2.map((num, index) => {
    let result = num - ((keyNumValue[0] + 3) * (index + 8));
    return mapToRange(result);
  });

  // Convert numbers back to characters
  const resultCharArr = decryptionArrStep1.map((num) => getChar(num));
  decryptedResults.textContent = resultCharArr.join("");
}
//button to create a random key
function createKey() {
  let randomKey = []
  for (let i = 0; i < 9; i++) {
    randomKey.push(Math.floor(Math.random() * charSetArr.length))
  }
  console.log(randomKey)
  const keyString = randomKey.map((num) => getChar(num)).join("")
  key.value = keyString
}
function findKey(result) {
  const keyCharValue = key.value
  if (keyCharValue.length < 9) {
    result.innerHTML = "Please enter a valid encrypyion key."
  } else {
    const keyNumValue = turnInputStringToNumArr(keyCharValue)
    //console.log(keyNumValue)
    return keyNumValue
  }
}
//button to clear the results
function clearResults() {
  const result = document.getElementById("results")
  result.innerHTML = ""
}
//button to copy the results to the clipboard 
function copyResults() {
  const result = document.getElementById("results")
  navigator.clipboard.writeText(result.innerHTML)
  alert("Results copied to clipboard")
}
