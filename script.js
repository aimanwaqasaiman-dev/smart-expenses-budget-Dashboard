// Local variables to store app state
let currentBudget = 0;
let expensesList = [...initialExpenses]; // Initial data from data.js

// DOM Elements Selection
const budgetInput = document.getElementById("budget-input");
const setBudgetBtn = document.getElementById("set-budget-btn");

const totalBudgetDisplay = document.getElementById("total-budget-display");
const totalExpenseDisplay = document.getElementById("total-expense-display");
const remainingBalanceDisplay = document.getElementById("remaining-balance-display");

const expenseForm = document.getElementById("expense-form");
const expenseTitleInput = document.getElementById("expense-title");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategorySelect = document.getElementById("expense-category");

const filterCategorySelect = document.getElementById("filter-category");
const expenseListTbody = document.getElementById("expense-list-tbody");
const alertBox = document.getElementById("alert-box");

// 1. Populate Category Dropdowns on Page Load
function populateCategories() {
  // Add options to Form Category Select
  expenseCategorySelect.innerHTML = `<option value="" selected disabled>Select Category</option>`;
  categories.forEach(cat => {
    expenseCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  // Add options to Filter Category Select
  filterCategorySelect.innerHTML = `<option value="All">All Categories</option>`;
  categories.forEach(cat => {
    filterCategorySelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// 2. Set Budget Event
setBudgetBtn.addEventListener("click", () => {
  const budgetValue = parseFloat(budgetInput.value);

  if (isNaN(budgetValue) || budgetValue <= 0) {
    showAlert("Please enter a valid budget amount!", "warning");
    return;
  }

  currentBudget = budgetValue;
  budgetInput.value = "";
  updateUI();
  showAlert("Budget updated successfully!", "success");
});

// 3. Add New Expense Event
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = expenseTitleInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategorySelect.value;

  if (!title || isNaN(amount) || amount <= 0 || !category) {
    showAlert("Please fill in all the fields correctly!", "warning");
    return;
  }

  const newExpense = {
    id: Date.now(),
    title: title,
    amount: amount,
    category: category
  };

  expensesList.push(newExpense);

  // reset form
  expenseTitleInput.value = "";
  expenseAmountInput.value = "";
  expenseCategorySelect.value = "";

  updateUI();
  showAlert("Expense added successfully!", "success");
});

// 4. Delete Expense Function
function deleteExpense(id) {
  expensesList = expensesList.filter(item => item.id !== id);
  updateUI();
  showAlert("Expense deleted successfully!", "info");
}

// 5. Filter Expense Event
filterCategorySelect.addEventListener("change", () => {
  renderTable();
});

// 6. Calculate Totals and Render UI
function updateUI() {
  const totalExpenses = expensesList.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBalance = currentBudget - totalExpenses;

  // Update Summary Cards
  if (totalBudgetDisplay) totalBudgetDisplay.innerText = `$${currentBudget}`;
  if (totalExpenseDisplay) totalExpenseDisplay.innerText = `$${totalExpenses}`;
  if (remainingBalanceDisplay) remainingBalanceDisplay.innerText = `$${remainingBalance}`;

  // Balance Card Color Logic
  const balanceCard = document.getElementById("balance-card");
  if (balanceCard) {
    if (remainingBalance < 0) {
      balanceCard.className = "card bg-danger text-white p-3 shadow-sm text-center";
    } else {
      balanceCard.className = "card bg-success text-white p-3 shadow-sm text-center";
    }
  }

  renderTable();
}

// 7. Render Expense Table Rows
function renderTable() {
  if (!expenseListTbody) return;

  const selectedCategory = filterCategorySelect ? filterCategorySelect.value : "All";

  const filteredList = (selectedCategory === "All")
    ? expensesList
    : expensesList.filter(item => item.category === selectedCategory);

  expenseListTbody.innerHTML = "";

  if (filteredList.length === 0) {
    expenseListTbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No expenses found.</td></tr>`;
    return;
  }

  filteredList.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="fw-bold">${item.title}</td>
      <td>$${item.amount}</td>
      <td><span class="badge bg-secondary">${item.category}</span></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${item.id})">Delete</button>
      </td>
    `;
    expenseListTbody.appendChild(row);
  });
}

// Helper: Show Alert Messages
function showAlert(message, type) {
  if (!alertBox) return;
  alertBox.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mb-4" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// App Initialization
populateCategories();
updateUI();