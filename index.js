const billItemsContainer = document.getElementById('billItems');
const totalDisplay = document.getElementById('total');
const clearBtn = document.getElementById('clear');
const printBtn = document.getElementById('print'); // Print button
const itemButtons = document.querySelectorAll('.items button');
const currentOrderIdElement = document.getElementById('currentOrderId');

let billItems = [];
let currentOrderId = ''; // To store the current order ID

// Function to generate a unique order ID
function generateOrderId() {
  const timestamp = Date.now(); // current timestamp
  const randomNum = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${randomNum}`;
}

// Function to update the bill and generate new order ID
function updateBill() {
  billItemsContainer.innerHTML = '';
  let totalCost = 0;

  billItems.forEach(item => {
    const row = document.createElement('tr');

    // Item name cell
    const nameCell = document.createElement('td');
    nameCell.innerText = item.name;

    // Price cell
    const priceCell = document.createElement('td');
    priceCell.innerText = `Rs.${item.price}`; // Updated to show Rs.

    // Quantity adjustment buttons cell
    const qtyCell = document.createElement('td');

    const decreaseBtn = document.createElement('button');
    decreaseBtn.innerText = '−'; // minus sign
    decreaseBtn.setAttribute('aria-label', `Decrease quantity of ${item.name}`);
    decreaseBtn.addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
        updateBill();
      }
    });

    const qtySpan = document.createElement('span');
    qtySpan.innerText = ` ${item.quantity} `; // show current quantity

    const increaseBtn = document.createElement('button');
    increaseBtn.innerText = '+';
    increaseBtn.setAttribute('aria-label', `Increase quantity of ${item.name}`);
    increaseBtn.addEventListener('click', () => {
      item.quantity += 1;
      updateBill();
    });

    // Append buttons and display
    qtyCell.appendChild(decreaseBtn);
    qtyCell.appendChild(qtySpan);
    qtyCell.appendChild(increaseBtn);

    // Total price cell for this item
    const totalCell = document.createElement('td');
    const itemTotal = item.price * item.quantity;
    totalCell.innerText = `Rs.${itemTotal}`; // Updated to show Rs.

    // Remove button
    const actionsCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Remove';
    removeBtn.setAttribute('aria-label', `Remove ${item.name}`);
    removeBtn.addEventListener('click', () => {
      billItems = billItems.filter(i => i.name !== item.name);
      updateBill();
    });
    actionsCell.appendChild(removeBtn);

    row.appendChild(nameCell);
    row.appendChild(priceCell);
    row.appendChild(qtyCell);
    row.appendChild(totalCell);
    row.appendChild(actionsCell);

    billItemsContainer.appendChild(row);

    totalCost += item.price * item.quantity;
  });

  totalDisplay.innerText = `Total: Rs.${totalCost}`; // Updated to show Rs.
}

// Update ARIA-pressed state helper
function updateButtonPressedStates() {
  itemButtons.forEach(btn => {
    const name = btn.dataset.name;
    const found = billItems.find(item => item.name === name);
    btn.setAttribute('aria-pressed', !!found);
  });
}

// Add or increment items from menu buttons
itemButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);
    const existingItem = billItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      billItems.push({ name, price, quantity: 1 });
    }
    updateBill();
    updateButtonPressedStates();
    
    // Generate and display a new order ID
    currentOrderId = generateOrderId();
    currentOrderIdElement.innerText = `Order ID: ${currentOrderId}`;
  });
});

// Clear bill and reset order ID
clearBtn.addEventListener('click', () => {
  billItems = [];
  updateBill();
  // Reset order ID as well
  currentOrderId = '';
  currentOrderIdElement.innerText = `Order ID: `;
});

// Print bill function
printBtn.addEventListener('click', () => {
  window.print(); // Open the print dialog
});

// Initialize
updateBill();
updateButtonPressedStates();
