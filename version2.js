//turn individual characters into a numeric value
const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz,;:\"'.\\/?~!@#$%^&*()_+-=<>{}[]|"
const charSetArr = charSet.split('')
const charSetValues = charSetArr.map((char, index) => {return index})
//getting the numeric value of a character
function getNumValue(char){
  let numValue = charSetArr.indexOf(char)
  return numValue
}
//reverting number values to characters
function getChar(num){
  let char = charSetArr[num]
  return char
}
//getting the input text ready to encrypt
let inputNumberValues 
let finalNumArr 
let encryptionArrStep1 

function prepareInput (rawTextInput){
  inputNumberValues = []
  for (let i=0; i<rawTextInput.length; i++){
    inputNumberValues.push(getNumValue(rawTextInput[i]))
  } return inputNumberValues
}
function mapToRange(num) {
  // Ensure the result is always positive
  return ((num % 92) + 92) % 92;
}
//processing encryption
function encryptMessage (){
const key = document.getElementById("key")
const keyCharValue = key.value
const keyNumValue = prepareInput(keyCharValue)
const input = document.getElementById('textInput')
const result = document.getElementById("results")
const updates = input.value
//checking if the input is empty
if (keyCharValue.length < 9){
    result.innerHTML = "Please enter a valid encrypyion key."
}else if(updates.length === 0){
  result.innerHTML = "Please enter text to encrypt."
}else {
    console.log(keyCharValue, keyNumValue)
//encryption step 1
encryptionArrStep1 = prepareInput(updates)
.map((num) => { let result = num + keyNumValue;
  return mapToRange(result)
})
//encryption step 2
encryptionArrStep2 = encryptionArrStep1.map((num) => {
 
}
)
finalNumArr = encryptionArrStep1
const resultCharArr = finalNumArr.map((num) => {return getChar(num)})
result.innerHTML = resultCharArr.join("")}
}
//processing decrption
function decryptMessage (){
    const key = document.getElementById("key")
    const keyCharValue = key.value
    const keyNumValue = getNumValue(keyCharValue)
const input = document.getElementById('encryptedInput')
const result = document.getElementById("decryptedResults")
const updates = input.value
//reversion of encryption step 1
decryptionArrStep1 = prepareInput(updates).map((num) => {
  let result = num - keyNumValue ;
  return mapToRange(result)
 })
 finalNumArr = decryptionArrStep1
 const resultCharArr = finalNumArr.map((num) => {return getChar(num)})
 //checking if the input is empty
 if (updates.length === 0){
   result.innerHTML = "Please enter text to decrypt."
 }else{result.innerHTML = resultCharArr.join("")}
} 
