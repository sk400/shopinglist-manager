// DOM elements
const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItemBtn");
const shoppingList = document.getElementById("shoppingList");
const clearListButton = document.getElementById("clearListBtn");

// Save to localStorage
const saveToLocalStorage = (item) => {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

// Delete item
const deleteItem = (event) => {
  const deleteConfirmed = confirm("Are you sure you want to delete this item?");

  if (deleteConfirmed) {
    const id = event.target.dataset.id;

    event.target.parentElement.remove();
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const filteredItems = items.filter((item) => item.id != id);
    localStorage.setItem("items", JSON.stringify(filteredItems));
    toggleClearList();
  }
};

// Mark item as purchased

const markItemPurchased = (event) => {
  const checked = event.target.checked;
  const id = event.target.dataset.id;

  const items = JSON.parse(localStorage.getItem("items")) || [];

  items.map((item) => (item.id == id ? (item.purchased = checked) : item));
  localStorage.setItem("items", JSON.stringify(items));
};

// Update item

const updateItem = (event) => {
  // console.log(event.target.value);
  const id = event.target.dataset.id;
  const value = event.target.value;
  const type = event.target.name;

  let keyToUpdate = "";

  switch (type) {
    case "price":
      keyToUpdate = "expectedPrice";

      break;
    case "amount":
      keyToUpdate = "amount";

      break;

    case "name":
      keyToUpdate = "value";

      break;

    default:
      break;
  }

  const items = JSON.parse(localStorage.getItem("items")) || [];
  items.map((item) => (item.id == id ? (item[keyToUpdate] = value) : item));
  localStorage.setItem("items", JSON.stringify(items));
};

// Clear list
const clearList = () => {
  shoppingList.innerHTML = "";
  localStorage.removeItem("items");
};

const toggleClearList = () => {
  const items = JSON.parse(localStorage.getItem("items")) || [];

  if (!items.length) {
    clearListButton.style.display = "none";
  } else {
    clearListButton.style.display = "block";
  }
};

// Create item
const createItem = ({ value, id, amount, expectedPrice, purchased }) => {
  const newLi = document.createElement("li");
  newLi.innerHTML = `
        <div class="shopping-item-card">
          <input
            type="text"
            class="item-name"
            value="${value}"
            data-id="${id}"
            name="name"
            placeholder="Item name"
            onkeyup="updateItem(event)"
           
          />
          
          <input type="text" class="amount" value="${amount}" data-id="${id}" 
          placeholder="Amount"
          name="amount"
          onkeyup="updateItem(event)"
           />
          <input
            type="text"
            class="expected-price"
            value="${expectedPrice}"
            data-id="${id}"
            name="price"
            placeholder="Expected Price"
            onkeyup="updateItem(event)"
            
          />
          <input type="checkbox" class="purchased-checkbox" 
          ${purchased ? "checked" : ""}
          data-id="${id}"
          onclick="markItemPurchased(event)"
          />
          <button class="delete-btn" data-id="${id}" onclick="deleteItem(event)">Delete</button>
        </div>
    `;

  return newLi;
};

// Add item
const addItem = () => {
  const value = itemInput.value;
  const id = Date.now();

  if (value.length) {
    const itemObject = {
      value,
      id,
      purchased: false,
      amount: 0,
      expectedPrice: 0,
    };

    const item = createItem(itemObject);
    itemInput.value = "";
    shoppingList.appendChild(item);
    saveToLocalStorage(itemObject);
    toggleClearList();
  }
};

// Make item purchased

window.onload = () => {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  toggleClearList();

  items.forEach((item) => {
    const itemElement = createItem(item);
    shoppingList.appendChild(itemElement);
  });
};

addItemBtn.onclick = addItem;
clearListButton.onclick = clearList;
