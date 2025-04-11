// Function to fetch the stock list (existing code)
fetch('/api/stocks')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('stock-list');
    const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }); // Format as € currency

    data.forEach(stock => {
      const item = document.createElement('li');
      item.textContent = `${stock.name} (Quantity: ${stock.quantity}, Price: ${formatter.format(stock.price)})`;
      list.appendChild(item);
    });
  })
  .catch(error => console.error('Error fetching stock list:', error));

function fetchStockById() {
  const stockId = document.getElementById('stock-id-input').value.trim();
  fetch(`/api/stocks/${stockId}`)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json();
    })
    .then(data => {
      const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }); // Format as € currency
      const resultContainer = document.getElementById('stock-result');
      resultContainer.innerHTML = `
        <strong>Name:</strong> ${data.name} <br>
        <strong>Quantity:</strong> ${data.quantity} <br>
        <strong>Price:</strong> ${formatter.format(data.price)}
      `;
    })
    .catch(error => {
      document.getElementById('stock-result').innerText = error.message;
      console.error('Error fetching stock item:', error);
    });
}

// Function to send a chat message via a POST request to /api/chat
function sendChat() {
  const user = document.getElementById('chat-user').value.trim();
  const message = document.getElementById('chat-message').value.trim();
  if (!user || !message) {
    alert('Please enter both your name and a message.');
    return;
  }
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, message })
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(text); });
    }
    return response.json();
  })
  .then(data => {
    // Display the server's response in the chat display area.
    const chatDisplay = document.getElementById('chat-display');
    // Append both the user's message and the chat service reply.
    chatDisplay.innerHTML += `<p><strong>${user}:</strong> ${message}</p>`;
    chatDisplay.innerHTML += `<p><em>Server:</em> ${data.response}</p>`;
    // Optionally, clear the input box.
    document.getElementById('chat-message').value = '';
  })
  .catch(error => {
    console.error('Error sending chat message:', error);
    alert('Chat error: ' + error.message);
  });
}
