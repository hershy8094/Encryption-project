// establish global variables on page launch
const textInput = document.getElementById('textInput');
const encryptedInput = document.getElementById('encryptedInput');
const encryptedResults = document.getElementById("encryptedResults");
const decryptedResults = document.getElementById("decryptedResults");
const key = document.getElementById("key");
const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n,;:\"'.\\/?~`!@#$%^&*()_+-=<>{}[]|";
const charSetArr = charSet.split('');
let output = false;
//helper functions
const getNumValue = char => charSetArr.indexOf(char);

const getChar = num => charSetArr[num];

const turnInputStringToNumArr = rawTextInput => rawTextInput.split('').map(getNumValue);

const mapToRange = num => ((num % charSetArr.length) + charSetArr.length) % charSetArr.length;

function legitemacyCheck(resultField, input) {
  if (key.value.length < 96) {
    resultField.textContent = "Please enter a valid encryption key.";
    output = false;
    return false;
  }
  else if (input.value === '') {
    resultField.textContent = "Please enter text to process.";
    output = false;
    return false;
  } else if (!isOnlyCharSet(input.value)) {
    resultField.textContent = "Input contains unsupported characters!";
    output = false;
    return false;
  }
  output = true;
  return true;
}

function isOnlyCharSet(str) {
  const escaped = charSet.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
  const regex = new RegExp(`^[${escaped}]*$`);
  return regex.test(str);
}

const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const shuffleArray = (arr, keySeed) => {
  const result = arr.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const rand = seededRandom(keySeed + i);
    const j = Math.floor(rand * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const unshuffleArray = (arr, keySeed) => {
  const result = arr.slice();
  // Store the swaps to reverse them
  const swaps = [];
  for (let i = result.length - 1; i > 0; i--) {
    const rand = seededRandom(keySeed + i);
    const j = Math.floor(rand * (i + 1));
    swaps.push([i, j]);
  }
  // Reverse the swaps
  for (let k = swaps.length - 1; k >= 0; k--) {
    const [i, j] = swaps[k];
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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
      const randomFactor = Math.floor(seededRandom(key + ind) * 10);
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
      const key = keyNumValue[k + 2] + 1;
      return mapToRange(num + ((key ** 2) * (ind ** 2)));
    }
    );
    const encryptionArrStep4 = shuffleArray(encryptionArrStep3, keyNumValue[k + 3] + 1);
    currentEncryptionArr = encryptionArrStep4;
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

    const decryptionArrStep4 = unshuffleArray(currentDecryptionArr, keyNumValue[k + 3] + 1);

    const decryptionArrStep3 = decryptionArrStep4.map((num, index) => {
      const ind = index + 1;
      const key = keyNumValue[k + 2] + 1;
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
      const randomFactor = Math.floor(seededRandom(key + ind) * 10);
      return mapToRange(num - randomFactor);
    });

    currentDecryptionArr = decryptionArrStep1;
  }

  decryptedResults.textContent = currentDecryptionArr.map(getChar).join("");
}

//DOM Functionality
document.getElementById('submitText').addEventListener('click', encryptMessage);
document.getElementById('submitEncrypted').addEventListener('click', decryptMessage);
document.getElementById('createKey').addEventListener('click', createKey);
document.getElementById('copyEncryptedResults').addEventListener('click', () => copyResults('encryptedResults'));
document.getElementById('copyDecryptedResults').addEventListener('click', () => copyResults('decryptedResults'));
document.getElementById('copyKey').addEventListener('click', () => copyResults('key'));
document.getElementById('downloadEncryptedResults').addEventListener('click', () => downloadResults('encryptedResults'));
document.getElementById('downloadDecryptedResults').addEventListener('click', () => downloadResults('decryptedResults'));
const showEncryption = document.getElementById('showEncryption');
const showDecryption = document.getElementById('showDecryption');
showEncryption.addEventListener('click', () => toggleSection('encryption'));
showDecryption.addEventListener('click', () => toggleSection('decryption'));
document.getElementById('helpButton').addEventListener('click', showHelp);
document.getElementById('closeHelp').addEventListener('click', closeHelp);
document.getElementById('closeHelpButton').addEventListener('click', closeHelp);

function createKey() {
  const randomKey = Array.from({ length: 96 }, () => Math.floor(Math.random() * charSetArr.length));
  key.value = randomKey.map(getChar).join("");
}

function copyResults(resultId) {
  const resultElement = document.getElementById(resultId);
  const textToCopy = resultElement.value !== undefined ? resultElement.value : resultElement.textContent;
  if ((!output && resultId !== 'key') || !textToCopy.trim()) {
    showNotification('There\'s nothing to copy!');
    return;
  }
  navigator.clipboard.writeText(textToCopy)
    .then(() => showNotification('Copied to clipboard!'))
    .catch(() => showNotification('Failed to copy.'));
}

function downloadResults(resultId) {
  const resultElement = document.getElementById(resultId);
  const result = resultElement.value !== undefined ? resultElement.value : resultElement.textContent;
  if (!output || !result.trim()) {
    showNotification('No results to download!');
    return;
  }
  const blob = new Blob([result], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${resultId}.txt`;
  link.click();
}

function toggleSection(section) {
  const encryptionSection = document.getElementById('encryptionSection');
  const decryptionSection = document.getElementById('decryptionSection');


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
  helpModal.style.display = 'block';
}

function closeHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.style.display = 'none';
}

function showNotification(message) {
  const container = document.getElementById('notificationContainer');
  container.textContent = '';
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  container.appendChild(notification);

  setTimeout(() => {
    if (container.contains(notification)) {
      container.removeChild(notification);
    }
  }, 2000);
}