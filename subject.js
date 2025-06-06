// Subject guides
const subjectGuides = {
  "Physics": "Approach Physics questions using the I.S.E.E method: Identify the knowns/unknowns, Set up the relevant formulae, Execute the calculations, and Evaluate the result for correctness and units.",
  "Mathematics": "Use a structured problem-solving approach: Understand the question, Plan a method (equation, graph, formula), Solve it clearly, then Review the solution for accuracy.",
  "Further Mathematics": "Apply formal logic and theorem-based reasoning. Break complex problems into steps using derivations or I.S.E.E where applicable.",
  "Chemistry": "Start by identifying the concept (e.g., stoichiometry, bonding), write balanced chemical equations, do any necessary calculations, and provide clear scientific conclusions.",
  "Biology": "Describe biological processes in structured paragraphs. Use diagrams where possible, define terms, and give detailed yet concise explanations.",
  "English Language": "Carefully read instructions. For comprehension, analyze questions before reading the passage. For grammar and writing, follow rules of structure, clarity, and coherence.",
  "Literature in English": "Read the question carefully, identify the literary elements involved (theme, character, symbol), support answers with quotations, and offer critical interpretation.",
  "Government": "Define political terms, relate them to historical or current examples, and explain political systems or ideologies with clarity.",
  "Commerce": "Identify the area of commerce being asked (e.g., trade, finance, business organization) and explain with real-world business examples.",
  "Economics": "Define the economic terms clearly, draw relevant graphs if applicable, and analyze the problem using economic reasoning.",
  "Geography": "Interpret maps, diagrams, and data. Clearly describe physical or human geographical processes and apply to real-world contexts.",
  "CRS": "Quote relevant Bible verses, explain the context and meaning, and apply the moral lessons to Christian life and values.",
  "IRS": "Use Qur’an and Hadith references to support answers. Explain religious concepts and draw moral/social implications in context.",
  "Accounting": "Follow the accounting cycle: identify transactions, journalize, post to ledger, and prepare financial statements with accuracy.",
  "Computer Studies": "Start with the concept (e.g., data types, programming logic), use diagrams or code snippets where needed, and explain step-by-step.",
  "Civic Education": "Define civic terms, explain their implications, and relate them to real-life citizenship, governance, and responsibilities.",
  "Agricultural Science": "Identify the branch (e.g., crop, livestock, soil), explain the science behind it, and include real-life agricultural practices.",
  "Technical Drawing": "Interpret the drawing task, use the correct projection method, maintain scale and proportion, and label appropriately.",
  "Food and Nutrition": "Focus on nutrition concepts (e.g., diet planning, food classes), explain with examples, and consider hygiene and safety principles.",
  "Physical Education": "Describe activities or concepts (e.g., fitness, anatomy), use labeled diagrams if needed, and explain benefits and techniques.",
  "Music": "Identify the music concept (e.g., notation, tempo, dynamics), explain with theory and examples, and relate to performance context.",
  "Fine Arts": "Describe art elements, techniques, and media. Analyze artworks or tasks with creative interpretation and historical context.",
  "French": "Translate carefully. Focus on grammar, vocabulary, and syntax. For writing, plan structure before composing sentences.",
  "Arabic": "Focus on grammar rules, vocabulary, and pronunciation. Provide sentence examples and contextual meanings where needed.",
  "History": "Analyze the cause, effect, and significance of historical events. Write chronologically and use dates and names accurately.",
  "Social Studies": "Define terms, explain their societal relevance, and give modern examples. Be analytical and solution-oriented.",
  "Basic Science": "Identify the science area (e.g., biology, physics), explain in simple terms, and link the answer to practical experiences.",
  "Basic Technology": "Explain with clear reference to tools, systems, or machines. Use diagrams and describe step-by-step processes.",
  "Home Economics": "Outline principles of home management, nutrition, or hygiene. Use real-life applications and structured formats.",
  "Business Studies": "Define the business function (e.g., management, finance, marketing), then explain with practical business scenarios.",
  "Marketing": "Focus on marketing principles (e.g., 4Ps, branding). Use real examples, define clearly, and explain the business value.",
  "Office Practice": "Explain administrative functions and office systems (e.g., filing, communication) with real-world office applications."
};

// DOM Elements
const subjectTitle = document.getElementById('subject-title');
const chatContainer = document.getElementById('messages');
const inputElement = document.getElementById('input-message');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const themeToggle = document.getElementById('theme-toggle');
const clearChatBtn = document.getElementById('clear-chat');

// Get selected subject
const subject = localStorage.getItem("selectedSubject") || "Physics";
subjectTitle.innerText = `${subject} Assistant`;

// System prompt
const systemPrompt = `You are a helpful Nigerian secondary school teacher assisting a student with the subject "${subject}". ${subjectGuides[subject] || ""} Only answer questions related to this subject. If a question is unrelated (e.g., a Government question under Physics), politely tell the student to go back and select the correct subject. Do not answer off-topic questions. Respond clearly and concisely. Use LaTeX formatting where appropriate.`;

// Messages array
const messages = [{ role: "system", content: systemPrompt }];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Set up event listeners
  sendButton.addEventListener('click', sendMessage);
  inputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  themeToggle.addEventListener('click', toggleTheme);
  clearChatBtn.addEventListener('click', clearChat);
  
  // Load chat history
  loadChatHistory();
  
  // Set initial theme icon
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.innerHTML = `<i class="fas fa-${isLight ? 'moon' : 'sun'}"></i>`;
});

// Theme toggle functionality
function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.innerHTML = `<i class="fas fa-${isLight ? 'moon' : 'sun'}"></i>`;
  
  // Save theme preference
  localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
}

// Clear chat functionality
function clearChat() {
  if (confirm("Are you sure you want to clear the chat history?")) {
    // Keep only the system prompt
    messages.splice(1, messages.length - 1);
    chatContainer.innerHTML = '';
    localStorage.removeItem(`chatHistory-${subject}`);
    addMessage("Hello! I'm your AI assistant for " + subject + ". How can I help you today?", 'assistant');
  }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Format code with syntax highlighting
function formatCode(content, language = '') {
  let formattedCode = escapeHtml(content);
  
  // JavaScript highlighting
  if (language === 'javascript' || language === 'js') {
    formattedCode = formattedCode
      .replace(/\b(function|return|const|let|var|if|else|for|while|switch|case|break|class|new|this|async|await|export|default)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(console\.log|alert|prompt|document\.getElementById|fetch|JSON\.parse|JSON\.stringify)\b/g, '<span class="builtin">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="function">$1</span>(')
      .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
      .replace(/(\/\/.*)/g, '<span class="comment">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/([=!<>+\-*/%&|^~]+)/g, '<span class="operator">$1</span>');
  }
  // Python highlighting
  else if (language === 'python') {
    formattedCode = formattedCode
      .replace(/\b(def|class|return|if|elif|else|for|while|try|except|finally|with|as|import|from|lambda|yield|async|await)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(print|len|range|str|int|float|list|dict|set|tuple|input|open)\b/g, '<span class="builtin">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>')
      .replace(/#.*/g, '<span class="comment">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')
      .replace(/([=!<>+\-*/%&|^~]+)/g, '<span class="operator">$1</span>');
  }
  // HTML highlighting
  else if (language === 'html') {
    formattedCode = formattedCode
      .replace(/&lt;(\/?\w+)([^&]*)&gt;/g, '&lt;<span class="keyword">$1</span>$2&gt;')
      .replace(/\b(\w+)=/g, '<span class="function">$1</span>=')
      .replace(/&lt;\/?([\w:]+)/g, '&lt;/$1')
      .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>');
  }
  
  return formattedCode;
}

// Format message with code blocks and inline code
function formatMessage(content) {
  content = escapeHtml(content);
  
  // Process code blocks
  content = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const formattedCode = formatCode(code, lang);
    return `<div class="code-block">
              <div class="code-header">
                <span>${lang || 'code'}</span>
                <button class="copy-btn" onclick="copyCode(this)">Copy</button>
              </div>
              <pre>${formattedCode}</pre>
            </div>`;
  });
  
  // Process inline code
  content = content.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  // Replace newlines
  content = content.replace(/\n/g, '<br>');
  
  return content;
}

// Add message to chat
function addMessage(content, role) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(role === 'user' ? 'user-message' : 'ai-message');
  
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.innerHTML = formatMessage(content);
  
  const avatar = document.createElement('div');
  avatar.classList.add('message-avatar');
  const avatarIcon = document.createElement('i');
  avatarIcon.className = role === 'user' ? 'fas fa-user' : 'fas fa-robot';
  avatar.appendChild(avatarIcon);
  
  const timestampDiv = document.createElement('div');
  timestampDiv.classList.add('message-timestamp');
  timestampDiv.textContent = timestamp;
  
  messageDiv.appendChild(messageContent);
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(timestampDiv);
  
  chatContainer.appendChild(messageDiv);
  
  // Animate message appearance
  messageDiv.style.opacity = '0';
  messageDiv.style.transform = 'translateY(20px)';
  setTimeout(() => {
    messageDiv.style.transition = 'opacity 0.4s, transform 0.4s';
    messageDiv.style.opacity = '1';
    messageDiv.style.transform = 'translateY(0)';
  }, 10);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Copy code to clipboard
function copyCode(button) {
  const codeBlock = button.closest('.code-block');
  const code = codeBlock.querySelector('pre').textContent;
  
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = 'Copy';
    }, 2000);
  });
}

// Text-to-speech
function speak(text) {
  if ('speechSynthesis' in window && !document.getElementById('mute-toggle').checked) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = parseFloat(document.getElementById('speech-speed').value || "1");
    window.speechSynthesis.speak(utterance);
  }
}

// Save chat history
function saveChatHistory() {
  const maxMessages = 100;
  if (messages.length > maxMessages) {
    const systemMessage = messages.find(m => m.role === "system");
    const userMessages = messages.filter(m => m.role !== "system");
    const trimmed = userMessages.slice(userMessages.length / 2);
    messages.length = 0;
    messages.push(systemMessage, ...trimmed);
  }

  localStorage.setItem(`chatHistory-${subject}`, JSON.stringify(messages));
}

// Load chat history
function loadChatHistory() {
  const saved = localStorage.getItem(`chatHistory-${subject}`);
  const themePref = localStorage.getItem('themePreference');
  
  // Apply saved theme preference
  if (themePref === 'light') {
    document.body.classList.add('light-theme');
  }
  
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.forEach(entry => {
      if (entry.role !== 'system') {
        addMessage(entry.content, entry.role === 'user' ? 'user' : 'assistant');
        messages.push(entry);
      }
    });
  } else {
    // Add welcome message if no history
    addMessage("Hello! I'm your AI assistant for " + subject + ". How can I help you today?", 'assistant');
  }
}

// Send message to AI
function sendMessage() {
  const message = inputElement.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  messages.push({ role: "user", content: message });
  inputElement.value = '';
  
  // Show typing indicator
  typingIndicator.style.display = 'block';
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Simulate API delay
  setTimeout(() => {
    typingIndicator.style.display = 'none';
    
    // Call the AI chat function
    puter.ai.chat(messages)
      .then(response => {
        const aiResponse = response.message.content;
        addMessage(aiResponse, 'assistant');
        messages.push(response.message);
        speak(aiResponse);
        saveChatHistory();
      })
      .catch(error => {
        console.error("AI response error:", error);
        addMessage("⚠️ Failed to get response. Please try again.", 'assistant');
      });
  }, 1500);
}