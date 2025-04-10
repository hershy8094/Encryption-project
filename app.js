// establish global variables on page launch
const textInput = document.getElementById('textInput');
const encryptedInput = document.getElementById('encryptedInput');
const encryptedResults = document.getElementById("encryptedResults");
const decryptedResults = document.getElementById("decryptedResults");
const key = document.getElementById("key");

const charSet = "0123456789 AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz\n,;:\"'.\\/?~`!@#$%^&*()_+-=<>{}[]|";
const charSetArr = charSet.split('');

function getNumValue(char) {
  return charSetArr.indexOf(char);
}

function getChar(num) {
  return charSetArr[num];
}

function turnInputStringToNumArr(rawTextInput, resultField) {
  if (rawTextInput.length === 0) {
    resultField.innerHTML = "Please enter text to encrypt.";
    return [];
  } else {
    return rawTextInput.split('').map(getNumValue);
  }
}

function mapToRange(num) {
  return ((num % charSetArr.length) + charSetArr.length) % charSetArr.length;
}

function encryptMessage() {
  const keyNumValue = findKey(encryptedResults);
  const encryptionArrStartingPoint = turnInputStringToNumArr(textInput.value, encryptedResults);
  if (encryptionArrStartingPoint.length === 0 || keyNumValue === null) return;

  let currentEncryptionArr = encryptionArrStartingPoint;

  for (let i = 0; i < 12; i++) {
    const k = i * 8;

    const encryptionArrStep1 = currentEncryptionArr.map((num, index) => {
      const key = keyNumValue[k] + 1;
      const ind = index + 1;
      const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10);
      return mapToRange(num + ((key ** 4) * (ind ** 4)) + randomFactor);
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

    currentEncryptionArr = encryptionArrStep2;
  }

  encryptedResults.textContent = currentEncryptionArr.map(getChar).join("");
}

function decryptMessage() {
  const keyNumValue = findKey(decryptedResults);
  const decryptionArrStartingPoint = turnInputStringToNumArr(encryptedInput.value, decryptedResults);
  if (decryptionArrStartingPoint.length === 0 || keyNumValue === null) return;

  let currentDecryptionArr = decryptionArrStartingPoint;

  for (let i = 11; i >= 0; i--) {
    const k = i * 8;

    const decryptionArrStep2 = [];
    const key = keyNumValue[k + 1] + 1;
    let previousValue = key;

    for (let index = 0; index < currentDecryptionArr.length; index++) {
      const num = currentDecryptionArr[index];
      const result = mapToRange(num - previousValue);
      decryptionArrStep2.push(result);
      previousValue = mapToRange(previousValue + result);
    }

    const decryptionArrStep1 = decryptionArrStep2.map((num, index) => {
      const ind = index + 1;
      const key = keyNumValue[k] + 1;
      const randomFactor = Math.floor((Math.sin(key + ind) * 10000) % 10);
      return mapToRange(num - ((key ** 4) * (ind ** 4)) - randomFactor);
    });

    currentDecryptionArr = decryptionArrStep1;
  }

  decryptedResults.textContent = currentDecryptionArr.map(getChar).join("");
}

function createKey() {
  const randomKey = Array.from({ length: 96 }, () => Math.floor(Math.random() * charSetArr.length));
  key.value = randomKey.map(getChar).join("");
}

function findKey(result) {
  const keyCharValue = key.value;
  if (keyCharValue.length < 96) {
    result.textContent = "Please enter a valid encryption key.";
    return null;
  } else {
    return turnInputStringToNumArr(keyCharValue, result);
  }
}

function clearResults() {
  document.getElementById("results").innerHTML = "";
}

function copyKey() {
  if (key.value.trim() === '') {
    showNotification('No key to copy!');
    return;
  }
  navigator.clipboard.writeText(key.value)
    .then(() => showNotification('Key copied to clipboard!'))
    .catch(() => showNotification('Failed to copy key.'));
}

function copyResults(resultId) {
  const resultElement = document.getElementById(resultId);
  if (resultElement.textContent.trim() === '') {
    showNotification('No results to copy!');
    return;
  }
  navigator.clipboard.writeText(resultElement.textContent)
    .then(() => showNotification('Results copied to clipboard!'))
    .catch(() => showNotification('Failed to copy results.'));
}

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

  encryptionSection.classList.remove('no-animation');
  decryptionSection.classList.remove('no-animation');

  if (section === 'encryption') {
    decryptionSection.style.animation = 'slideOutToRight 0.3s forwards';
    encryptionSection.style.animation = 'slideInFromLeft 0.3s forwards';
    encryptionSection.style.display = 'block';
    setTimeout(() => {
      decryptionSection.classList.add('hidden');
      decryptionSection.style.display = 'none';
    }, 300);
    showEncryption.classList.add('active');
    showDecryption.classList.remove('active');
  } else if (section === 'decryption') {
    encryptionSection.style.animation = 'slideOutToLeft 0.3s forwards';
    decryptionSection.style.animation = 'slideInFromRight 0.3s forwards';
    decryptionSection.style.display = 'block';
    setTimeout(() => {
      encryptionSection.classList.add('hidden');
      encryptionSection.style.display = 'none';
    }, 300);
    showEncryption.classList.remove('active');
    showDecryption.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const encryptionSection = document.getElementById('encryptionSection');
  const decryptionSection = document.getElementById('decryptionSection');
  encryptionSection.classList.add('no-animation');
  decryptionSection.classList.add('no-animation');
  encryptionSection.style.display = 'block';
  decryptionSection.style.display = 'none';
  toggleSection('encryption');
});

function showHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.classList.remove('hidden');
  helpModal.style.display = 'block';
}

function closeHelp() {
  const helpModal = document.getElementById('helpModal');
  helpModal.classList.add('hidden');
  helpModal.style.display = 'none';
}

function showNotification(message) {
  const notificationContainer = document.getElementById('notificationContainer');

  // Create a new notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  // Append the notification to the container
  notificationContainer.appendChild(notification);

  // Remove the notification after 2 seconds
  setTimeout(() => {
    notification.remove();
  }, 2000);
}