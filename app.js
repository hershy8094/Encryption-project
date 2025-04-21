// establish global variables on page launch
const textInput = document.getElementById('textInput');
const encryptedInput = document.getElementById('encryptedInput');
const encryptedResults = document.getElementById("encryptedResults");
const decryptedResults = document.getElementById("decryptedResults");
const key = document.getElementById("key");
const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n,;:\"'.\\/?~`!@#$%^&*()_+-=<>{}[]|";
const charSetArr = charSet.split('');

//helper functions
function getNumValue(char) {
  return charSetArr.indexOf(char);
}

function getChar(num) {
  return charSetArr[num];
}

function turnInputStringToNumArr(rawTextInput) {
  return rawTextInput.split('').map(getNumValue);
}

function mapToRange(num) {
  return ((num % charSetArr.length) + charSetArr.length) % charSetArr.length;
}

function legitemacyCheck(resultField, input) {
  if (key.value.length < 96) {
    resultField.textContent = "Please enter a valid encryption key.";
    return false;
  }
  else if (input.value === '') {
    resultField.textContent = "Please enter text to process.";
    return false;
  }
  return true;
}

//Main functionality
function encryptMessage() {
  if (!legitemacyCheck(encryptedResults, textInput)) return;
  const keyNumValue = turnInputStringToNumArr(key.value);
  const encryptionArrStartingPoint = turnInputStringToNumArr(textInput.value, encryptedResults);

  let currentEncryptionArr = encryptionArrStartingPoint;

  for (let i = 0; i < 12; i++) {
    const k = i * 8;

    const encryptionArrStep1 = currentEncryptionArr.map((num, index) => {
      const key = keyNumValue[k] + 1;
      const ind = index + 1;
      const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10);
      return mapToRange(num + randomFactor);
    });

    const encryptionArrStep2 = [];
    const key = keyNumValue[k + 1] + 1;
    let previousValue = key;
    for (let index = 0; index < currentEncryptionArr.length; index++) {
      const num = encryptionArrStep1[index];
      const result = num + previousValue;
      encryptionArrStep2.push(mapToRange(result));
      previousValue = result;
    }
    
    const encryptionArrStep3 = encryptionArrStep2.map((num, index) => {
      const ind = index + 1;
      const key = keyNumValue[k] + 1;
      return mapToRange(num + ((key ** 2) * (ind ** 2)));
    }
    );
    currentEncryptionArr = encryptionArrStep3;
  }

  encryptedResults.textContent = currentEncryptionArr.map(getChar).join("");
}

function decryptMessage() {
  if (!legitemacyCheck(decryptedResults, encryptedInput)) return;
  const keyNumValue = turnInputStringToNumArr(key.value);
  const decryptionArrStartingPoint = turnInputStringToNumArr(encryptedInput.value, decryptedResults);
  if (decryptionArrStartingPoint.length === 0 || keyNumValue === null) return;

  let currentDecryptionArr = decryptionArrStartingPoint;

  for (let i = 11; i >= 0; i--) {
    const k = i * 8;
    const decryptionArrStep3 = currentDecryptionArr.map((num, index) => {
      const ind = index + 1;
      const key = keyNumValue[k] + 1;
      return mapToRange(num - ((key ** 2) * (ind ** 2)));
    });

    const decryptionArrStep2 = [];
    const key = keyNumValue[k + 1] + 1;
    let previousValue = key;

    for (let index = 0; index < currentDecryptionArr.length; index++) {
      const num = decryptionArrStep3[index];
      const result = mapToRange(num - previousValue);
      decryptionArrStep2.push(result);
      previousValue = mapToRange(previousValue + result);
    }

    const decryptionArrStep1 = decryptionArrStep2.map((num, index) => {
      const ind = index + 1;
      const key = keyNumValue[k] + 1;
      const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10);
      return mapToRange(num - randomFactor);
    });

    currentDecryptionArr = decryptionArrStep1;
  }

  decryptedResults.textContent = currentDecryptionArr.map(getChar).join("");
}

//DOM Functionality
function createKey() {
  const randomKey = Array.from({ length: 96 }, () => Math.floor(Math.random() * charSetArr.length));
  key.textContent = randomKey.map(getChar).join("");
  key.value = randomKey.map(getChar).join("");
}

function copyResults(resultId) {
  const resultElement = document.getElementById(resultId);
  if (resultElement.textContent.trim() === '') {
    showNotification('There\'s nothing to copy!');
    return;
  }
  navigator.clipboard.writeText(resultElement.textContent)
    .then(() => showNotification('Copied to clipboard!'))
    .catch(() => showNotification('Failed to copy.'));}

function downloadResults(resultId) {
  const resultElement = document.getElementById(resultId);
  if (resultElement.textContent.trim() === '') {
    showNotification('No results to download!');
    return;
  }
  const result = document.getElementById(resultId).textContent;
  const blob = new Blob([result], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${resultId}.txt`;
  link.click();
}

function toggleSection(section) {
  const encryptionSection = document.getElementById('encryptionSection');
  const decryptionSection = document.getElementById('decryptionSection');
  const showEncryption = document.getElementById('showEncryption');
  const showDecryption = document.getElementById('showDecryption');


  if (section === 'encryption') {
    decryptionSection.style.animation = 'slideOutToRight 0.4s forwards';
    encryptionSection.style.animation = 'slideInFromLeft 0.4s forwards';
    showEncryption.classList.add('active');
    showDecryption.classList.remove('active');
  } else if (section === 'decryption') {
    encryptionSection.style.animation = 'slideOutToLeft 0.4s forwards';
    decryptionSection.style.animation = 'slideInFromRight 0.4s forwards';
    showEncryption.classList.remove('active');
    showDecryption.classList.add('active');
  }
}

function showHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.style.visibility = 'visible';
}

function closeHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.style.visibility = 'none';
}

function showNotification(message) {
  const notificationContainer = document.getElementById('notificationContainer');
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notificationContainer.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}