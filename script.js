// ==================== LOGIN CHECK ====================

// Redirect to Login Page if Not Logged In
function checkLogin() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id && !window.location.pathname.endsWith('login.html')) {
      window.location.href = 'login.html'; // Redirect to login page
    }
  }
  
  // Run Login Check When the Page Loads
  
  
  // ==================== LOGIN FUNCTIONALITY ====================
  
  // Login Form
  document.getElementById('login-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log('Sending login request:', { username, password }); // Debugging
  
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Login response:', data); // Debugging
  
      if (data.message) {
        alert(data.message); // Show success message
        window.location.href = 'index.html'; // Redirect to home page
      } else {
        alert(data.error); // Show error message
      }
    } catch (error) {
      console.error('Fetch error:', error); // Debugging
      alert('Failed to connect to the server. Please try again.');
    }
  });
  
    
  
  // ==================== HOME PAGE FUNCTIONALITY ====================
  
  // Fetch Expenses from Backend
  async function fetchExpenses() {
    const user_id = localStorage.getItem('user_id');
    const response = await fetch(`http://127.0.0.1:5000/expenses/${user_id}`);
    const data = await response.json();
    return data.expenses;
  }
  
  // Load Data and Render Home Page
  async function loadData() {
    const expenses = await fetchExpenses();
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
    // Update the Table
    const tbody = document.getElementById('expense-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows
  
    expenses.forEach((expense) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${expense.category}</td>
        <td>$${expense.amount.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  
    // Update Total Expense and Savings
    document.getElementById('total-expense').textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById('savings').textContent = `$${(1000 - totalExpense).toFixed(2)}`; // Example savings calculation
  
    // Render Pie Chart
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: expenses.map((expense) => expense.category),
        datasets: [{
          data: expenses.map((expense) => expense.amount),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
          ],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Monthly Expenses'
          }
        }
      }
    });
  }
  
  // Load Data When Home Page is Loaded
  if (window.location.pathname.endsWith('index.html')) {
    loadData();
  }

// ==================== LOGOUT FUNCTIONALITY ====================

// Logout Button
document.getElementById('logout')?.addEventListener('click', function () {
    localStorage.removeItem('user_id'); // Remove user_id from localStorage
    window.location.href = 'login.html'; // Redirect to login page
  });

  // ==================== SIGN UP FUNCTIONALITY ====================

// Sign Up Form
document.getElementById('register-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    console.log('Sending sign up request:', { username, password }); // Debugging
  
    const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }),

     // Required for authentication
      });
      
      
  
    const data = await response.json();
    console.log('Sign up response:', data); // Debugging
  
    if (response.ok) {
      alert(data.message); // Show success message
      window.location.href = 'login.html'; // Redirect to login page
    } else {
      alert(data.error); // Show error message
    }
  });