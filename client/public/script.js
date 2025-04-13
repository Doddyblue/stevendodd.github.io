// Show Stock List
function toggleStockList() {
  const container = document.getElementById("stock-list-container");
  const button = document.querySelector("button[onclick='toggleStockList()']");

  if (container.style.display === "none") {
    container.style.display = "block";
    button.innerText = "Hide Stock List";
    getStockList(); // Get stock list when shown
  } else {
    container.style.display = "none";
    button.innerText = "Show Stock List";
  }
}

//Get Stock List
function getStockList() {
  fetch('/api/stocks')
    .then(response => response.json())
    .then(data => {
      const list = document.getElementById('stock-list');
      list.innerHTML = ""; //  Clear list before adding new items
      const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });//format currency to Euro

      data.forEach(stock => {
        const item = document.createElement('li');
        item.textContent = `${stock.name} (Quantity: ${stock.quantity}, Price: ${formatter.format(stock.price)})`;
        list.appendChild(item);
      });
    })
    .catch(error => console.error('Error could not fetch stock list:', error));
}

// Get Stock by ID
function fetchStockById() {
  const stockId = document.getElementById('stock-id-input').value.trim();
  if (!stockId) {
    alert('Please enter a Stock ID');
    return;
  }
  fetch(`/api/stocks/${stockId}`)
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json();
    })
    .then(data => {
      const formatter = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
      document.getElementById('stock-result').innerHTML = `
        <strong>Name:</strong> ${data.name} <br>
        <strong>Quantity:</strong> ${data.quantity} <br>
        <strong>Price:</strong> ${formatter.format(data.price)}
      `;
    })
    .catch(error => {
      document.getElementById('stock-result').innerText = error.message;
      console.error('Error could not fetch stock item:', error);
    });
}

// Chat Pop-Up open and close functioons
function openChat() { document.getElementById("chatPopup").style.display = "block"; }
function closeChat() { document.getElementById("chatPopup").style.display = "none"; }

// Send Chat Message via API
function sendChat() {
  const user = document.getElementById("chat-user").value.trim();
  const message = document.getElementById("chat-message").value.trim();
  if (!user || !message) {
    alert("Please enter both your name and a message!");
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
      // Append both the user's message and the server's response
      const chatDisplay = document.getElementById("chat-display");
      chatDisplay.innerHTML += `<p><strong>${user}:</strong> ${message}</p>`;
      chatDisplay.innerHTML += `<p><em>Stock Robot:</em> ${data.response}</p>`;

      // Clear the input box after sending message
      document.getElementById("chat-message").value = '';
    })
    .catch(error => {
      console.error("Error sending chat message:", error);
      alert("Chat error: " + error.message);
    });
}
