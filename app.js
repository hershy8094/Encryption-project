// establish global variables on page launch
  const textInput = document.getElementById('textInput')
  const encryptedInput = document.getElementById('encryptedInput')
  const encryptedResults = document.getElementById("encryptedResults")
  const decryptedResults = document.getElementById("decryptedResults")
  const key = document.getElementById("key")
//turn individual characters into a numeric value
const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n,;:\"'.\\/?~`!@#$%^&*()_+-=<>{}[]|";
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
    return [];
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
  if (encryptionArrStartingPoint.length === 0 || keyNumValue === null) {
    return;
  }
  let currentEncryptionArr = encryptionArrStartingPoint;
  // Encryption steps
  for(let i=0; i < 12; i++){
    const k = i * 8;
    // Encryption step 1
    const encryptionArrStep1 = currentEncryptionArr.map((num, index) => {
      const key = keyNumValue[k] + 1;
      const ind = index + 1;
      const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10); // Deterministic random value
      let result = num + ((key ** 4) * (ind ** 4)) + randomFactor;
      console.log("Step 1: " + result)
      return mapToRange(result);
    });
    //encryption step 2
      const encryptionArrStep2 = encryptionArrStep1.map((num, index, arr) => {
      const ind = index + 1
      const key = keyNumValue[k+1] + 1
      let result = num
      return mapToRange(result);
    });
    //encryption step 3
    const encryptionArrStep3 = encryptionArrStep2.map((num, index, arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+2] + 1;
      let result = num;
      return mapToRange(result);
    });
    //encryption step 4
    const encryptionArrStep4 = encryptionArrStep3.map((num, index, arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+3] + 1;
      let result = num;
      return mapToRange(result);
    });
    //encryption step 5
    const encryptionArrStep5 = encryptionArrStep4.map((num, index, arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+4] + 1;
      let result = num;
      return mapToRange(result);
    });
    //encryption step 6
    const encryptionArrStep6 = encryptionArrStep5.map((num, index, arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+5] + 1;
      let result = num;
      return mapToRange(result);
    });
    //encryption step 7
    const encryptionArrStep7 = encryptionArrStep6.map((num, index,arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+6] + 1;
      let result = num;
      return mapToRange(result);
    });
    //encryption step 8
    const encryptionArrStep8 = encryptionArrStep7.map((num, index, arr) => {
      const ind = index + 1;
      const key = keyNumValue[k+7] + 1;
      let result = num;
      return mapToRange(result);
    });
    currentEncryptionArr = encryptionArrStep8;
  }
  // Convert numbers back to characters
 
  const resultString = currentEncryptionArr.map((num) => getChar(num)).join("");
  encryptedResults.textContent = resultString; 
}
//processing decrption
function decryptMessage() {
  const keyNumValue = findKey(decryptedResults);
  const decryptionArrStartingPoint = turnInputStringToNumArr((encryptedInput.value), decryptedResults);
  if (decryptionArrStartingPoint.length === 0 || keyNumValue === null) {
    return;
  }
  // Reversion of encryption step 3
  const decryptionArrStep3 = [keyNumValue[1], ...decryptionArrStartingPoint].map((num, index, array) => {
    let result = num - ((keyNumValue[1] + 1) * (array[index - 1] + 1));
    return mapToRange(result);
  }).slice(1);
  //reversion of encryption step 2
  const decryptionArrStep2 = decryptionArrStartingPoint.map((num, index) => {
    const ind = index + 3;
    const key = keyNumValue[1] + 3;
    let result = (num ^ (key * ind)) / (key + ind); // XOR operation
    return mapToRange(result);
  });

  // Reversion of encryption step 1
  const decryptionArrStep1 = decryptionArrStartingPoint.map((num, index) => {
    const ind = index + 2;
    const key = keyNumValue[0] + 2;
    const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10); // Same deterministic random value
    let result = num - ((key ** 3) * (ind ** 3)) - randomFactor;
    return mapToRange(result);
  });
  console.log( decryptionArrStep1)
  // Convert numbers back to characters
  const resultString = decryptionArrStep1.map((num) => getChar(num)).join("");
  decryptedResults.textContent = resultString; 
}
//button to create a random key
function createKey() {
  let randomKey = []
  for (let i = 0; i < 96; i++) {
    randomKey.push(Math.floor(Math.random() * charSetArr.length))
  }
  const keyString = randomKey.map((num) => getChar(num)).join("")
  key.value = keyString
}
function findKey(result) {
  const keyCharValue = key.value;
  if (keyCharValue.length < 96) {
    result.innerHTML = "Please enter a valid encryption key.";
    return null;
  } else {
    const keyNumValue = turnInputStringToNumArr(keyCharValue, result); 
    return keyNumValue;
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
