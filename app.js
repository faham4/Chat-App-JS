let currentUser = 'John';
let recognition;
let isRecording = false;

// Set up event listeners
document.getElementById('john-selector').addEventListener('click', () => selectPerson('John'));
document.getElementById('jane-selector').addEventListener('click', () => selectPerson('Jane'));
document.getElementById('chat-form').addEventListener('submit', sendMessage);
document.getElementById('clear-chat').addEventListener('click', clearChat);
document.getElementById('voice-button').addEventListener('click', toggleVoiceRecognition);

function selectPerson(person) {
  currentUser = person;
  document.querySelector('.chat-header').innerText = `${currentUser} chatting...`;
  document.getElementById('chat-input').placeholder = `Type here, ${currentUser}...`;
  
  // Update button styles
  document.getElementById('john-selector').classList.toggle('active-person', person === 'John');
  document.getElementById('jane-selector').classList.toggle('active-person', person === 'Jane');
}

function sendMessage(event) {
  event.preventDefault();
  const chatInput = document.getElementById('chat-input');
  const messageText = chatInput.value.trim();

  if (messageText !== '') {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    displayMessage(currentUser, messageText, timestamp);
    chatInput.value = '';
  }
}

function displayMessage(sender, text, timestamp) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender === 'John' ? 'blue-bg' : 'gray-bg');

  messageElement.innerHTML = `
    <div class="message-sender">${sender}</div>
    <div class="message-text">${text}</div>
    <div class="message-timestamp">${timestamp}</div>
  `;

  const chatMessages = document.getElementById('chat-messages');
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = '';
}

// Voice recognition setup
function initializeVoiceRecognition() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('chat-input').value = transcript;
    toggleVoiceRecognition(); // Stop recording after result
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    toggleVoiceRecognition();
  };
}

// Toggle voice recognition on and off
function toggleVoiceRecognition() {
  if (!recognition) initializeVoiceRecognition();

  if (isRecording) {
    recognition.stop();
    isRecording = false;
    document.getElementById('voice-button').classList.remove('active');
  } else {
    recognition.start();
    isRecording = true;
    document.getElementById('voice-button').classList.add('active');
  }
}
