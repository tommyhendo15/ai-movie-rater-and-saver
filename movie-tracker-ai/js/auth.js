const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Profile render (safe)
const profileBox = document.getElementById("profileInfo");
if (profileBox && currentUser) {
  profileBox.innerHTML = `
    <p><strong>Name:</strong> ${currentUser.name}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
  `;
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Login handler (safe)
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(u => u.email === email && u.password === password);

    const message = document.getElementById("loginMessage");

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.href = "profile.html";
    } else {
      if (message) message.innerText = "Invalid login";
    }
  });
}