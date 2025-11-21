// ========================= TOKEN CHECK =========================
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

// ========================= PROFILE DROPDOWN =========================
function toggleDropdown() {
  const dp = document.getElementById("profileDropdown");
  dp.style.display = dp.style.display === "block" ? "none" : "block";
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  const trigger = document.querySelector(".profile-trigger");
  const dropdown = document.getElementById("profileDropdown");

  if (
    dropdown &&
    trigger &&
    !trigger.contains(e.target) &&
    !dropdown.contains(e.target)
  ) {
    dropdown.style.display = "none";
  }
});

// ========================= LOGOUT MODAL =========================
function openLogoutModal() {
  document.getElementById("logoutModal").style.display = "flex";
}

function closeLogoutModal() {
  document.getElementById("logoutModal").style.display = "none";
}

function confirmLogout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ========================= PAGE LOAD =========================
document.addEventListener("DOMContentLoaded", () => {
  // ========== Load Profile ==========
  fetch("http://blogs.csm.linkpc.net/api/v1/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const p = data.data;
      document.getElementById(
        "welcomeMessage"
      ).innerText = `Welcome, ${p.firstName} ${p.lastName}`;
      document.getElementById("email").innerText = p.email;
      document.getElementById("avatar").src =
        p.avatar || "../assets/img/default-avatar.jpg";
    })
    .catch((err) => console.error("Profile Load Error:", err));

  // ========== Load Categories ==========
  const categorySelect = document.getElementById("categoryId");

  fetch("http://blogs.csm.linkpc.net/api/v1/categories?_per_page=100", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      categorySelect.innerHTML = '<option value="">Select Category</option>';

      data.data.items.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      });
    })
    .catch((err) => console.error("Category Load Error:", err));
});
