// Add click event to subject cards
document.querySelectorAll('.subject-card').forEach(card => {
  card.addEventListener('click', function() {
    // Remove selected class from all cards
    document.querySelectorAll('.subject-card').forEach(c => {
      c.classList.remove('selected');
    });
    
    // Add selected class to clicked card
    this.classList.add('selected');
    
    // Set the select value
    const subject = this.getAttribute('data-subject');
    document.getElementById('subject-select').value = subject;
  });
});

// Add click event to start button
document.querySelector('.start-btn').addEventListener('click', startAssistant);

function startAssistant() {
  const subject = document.getElementById("subject-select").value;
  if (!subject || subject === "Select subject from dropdown...") {
    alert("Please select a subject to continue.");
    return;
  }
  localStorage.setItem("selectedSubject", subject);
  window.location.href = "subject.html";
}

// Add keyboard support
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    startAssistant();
  }
});