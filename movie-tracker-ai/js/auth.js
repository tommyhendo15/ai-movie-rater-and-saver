/* =========================
   REGISTER
========================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user = {
      id: "user-" + Date.now(),
      name,
      email,
      password
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    document.getElementById("message").innerText =
      "Account created successfully! Redirecting...";

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1000);
  });
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      window.location.href = "profile.html";
    } else {
      document.getElementById("loginMessage").innerText =
        "Invalid login";
    }
  });
}

/* =========================
   PROFILE DISPLAY
========================= */
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

const profileBox = document.getElementById("profileInfo");

if (profileBox && currentUser) {
  profileBox.innerHTML = `
    <p><strong>Name:</strong> ${currentUser.name}</p>
    <p><strong>Email:</strong> ${currentUser.email}</p>
  `;
}

/* =========================
   LOGOUT
========================= */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}