/// Google Gemini Configuration
// Google Gemini Configuration
const GOOGLE_API_KEY = "AIzaSyABhmkmSpLfudsMW6XPP5-RnEwWknS7zt8";
const GOOGLE_GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runBtn = document.getElementById('run-code');
const fileUpload = document.getElementById('file-upload');

// Add message to chat
function addMessage(content, isAI = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isAI ? 'ai' : 'user'}`;
    messageDiv.textContent = content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle file upload
fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            addMessage(`Uploaded file: ${file.name}`, false);
            if (file.type.startsWith('text/')) {
                codeInput.value = e.target.result;
            }
        };
        reader.readAsText(file);
    }
});

// Execute code
runBtn.addEventListener('click', () => {
    const code = codeInput.value;
    try {
        const output = eval(code);
        codeOutput.textContent = String(output);
        codeOutput.style.color = 'inherit';
    } catch (error) {
        codeOutput.textContent = `Error: ${error.message}`;
        codeOutput.style.color = 'var(--error-color)';
    }
});

// Handle chat messages
sendBtn.addEventListener('click', async () => {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, false);
    userInput.value = '';

    try {
        const response = await fetch(GOOGLE_GEMINI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error?.message || 'API request failed');
        }

        const aiResponse = responseData.candidates[0].content.parts[0].text;
        addMessage(aiResponse, true);

    } catch (error) {
        console.error('Error:', error);
        addMessage(`Error: ${error.message}`, true);
    }
});

// Clear chat
document.getElementById('clear-chat').addEventListener('click', () => {
    chatContainer.innerHTML = '';
    codeInput.value = '';
    codeOutput.textContent = '';
});