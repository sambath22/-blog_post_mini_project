/* --------------------------------------------------------------
   1. CONFIG
   -------------------------------------------------------------- */
const API_BASE = "http://blogs.csm.linkpc.net/api/v1/categories";
const token = localStorage.getItem("token");

/* --------------------------------------------------------------
   2. DOM Elements
   -------------------------------------------------------------- */
const tbody = document.querySelector("#categoryTable tbody");
const errorBox = document.getElementById("categoryError");
const createModal = document.getElementById("createCategoryModal");
const editModal = document.getElementById("editCategoryModal");
const saveCreateBtn = document.getElementById("saveCategoryBtn");
const saveEditBtn = document.getElementById("saveEditBtn");
const createNameInput = document.getElementById("categoryName");
const editNameInput = document.getElementById("editCategoryName");
const editIdInput = document.getElementById("editCategoryId");
const deleteModal = document.getElementById("deleteCategoryModal");
const deleteConfirmBtn = document.getElementById("confirmDeleteBtn");
const deleteIdInput = document.getElementById("deleteCategoryId");
const searchBox = document.getElementById("searchCategory");
const searchBtn = document.getElementById("searchCategoryBtn");

/* --------------------------------------------------------------
   3. Show Error / Success
   -------------------------------------------------------------- */
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("d-none");
}
function showSuccess(msg) {
  const box = document.createElement("div");
  box.className = "alert alert-success mt-3";
  box.textContent = msg;
  document.querySelector(".card-body").prepend(box);
  setTimeout(() => box.remove(), 3000);
}

/* --------------------------------------------------------------
   4. READ – Load All Categories
   -------------------------------------------------------------- */
function loadCategories() {
  if (!token) return showError("Please login first");

  fetch(API_BASE, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const items = data.data?.items || [];
      renderCategories(items);
    })
    .catch((err) => showError("Load failed: " + err.message));
}

/* --------------------------------------------------------------
   5. Render Table
   -------------------------------------------------------------- */
function renderCategories(categories) {
  tbody.innerHTML = "";

  if (!categories.length) {
    tbody.innerHTML = `<tr><td colspan="2">No categories found</td></tr>`;
    return;
  }

  categories.forEach((cat) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(cat.name)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-warning me-1" onclick="openEditModal('${
          cat._id
        }', '${escapeHtml(cat.name)}')">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${
          cat._id
        }')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* --------------------------------------------------------------
   6. CREATE – Save New Category
   -------------------------------------------------------------- */
saveCreateBtn.addEventListener("click", () => {
  const name = createNameInput.value.trim();
  if (!name) return createNameInput.classList.add("is-invalid");

  fetch(API_BASE, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    })
    .then(() => {
      bootstrap.Modal.getInstance(createModal).hide();
      createNameInput.value = "";
      createNameInput.classList.remove("is-invalid");
      loadCategories();
      showSuccess("Category created!");
    })
    .catch((err) => showError(err.message));
});

/* --------------------------------------------------------------
   7. UPDATE – Open Edit Modal
   -------------------------------------------------------------- */
function openEditModal(id, name) {
  editIdInput.value = id;
  editNameInput.value = name;
  new bootstrap.Modal(editModal).show();
}

saveEditBtn.addEventListener("click", () => {
  const id = editIdInput.value;
  const name = editNameInput.value.trim();

  if (!name) return editNameInput.classList.add("is-invalid");

  fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then(() => {
      bootstrap.Modal.getInstance(editModal).hide();
      loadCategories();
      showSuccess("Category updated!");
    })
    .catch((err) => showError(err.message));
});

/* --------------------------------------------------------------
   8. DELETE – Remove Category
   -------------------------------------------------------------- */
function deleteCategory(id) {
  deleteIdInput.value = id;
  new bootstrap.Modal(deleteModal).show();
}

deleteConfirmBtn.addEventListener("click", () => {
  const id = deleteIdInput.value;

  fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    })
    .then(() => {
      bootstrap.Modal.getInstance(deleteModal).hide();
      loadCategories();
      showSuccess("Category deleted!");
    })
    .catch((err) => showError(err.message));
});

/* --------------------------------------------------------------
   9. Escape HTML
   -------------------------------------------------------------- */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* --------------------------------------------------------------
   10. SEARCH – FIXED (Button + Live Search)
   -------------------------------------------------------------- */
function filterCategoryTable(keyword) {
  const rows = document.querySelectorAll("#categoryTable tbody tr");

  rows.forEach((row) => {
    const name = row.querySelector("td:first-child").textContent.toLowerCase();
    row.style.display = name.includes(keyword) ? "" : "none";
  });
}

// Search button
searchBtn?.addEventListener("click", () => {
  const keyword = searchBox.value.toLowerCase().trim();
  filterCategoryTable(keyword);
});

// Live search
searchBox?.addEventListener("input", () => {
  const keyword = searchBox.value.toLowerCase().trim();
  filterCategoryTable(keyword);
});

/* --------------------------------------------------------------
   11. Load Category Table on Page Start
   -------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", loadCategories);

// method for load a profile that has been login take token ready!

function loadProfile() {
  fetch("http://blogs.csm.linkpc.net/api/v1/auth/profile", {
    headers: { Authorization: "Bearer " + token },
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var profile = data.data;

      document.getElementById("welcomeMessage").textContent =
        "Welcome, " + profile.firstName + " " + profile.lastName;

      document.getElementById("email").textContent = profile.email;

      document.getElementById("avatar").src =
        profile.avatar || "https://via.placeholder.com/150";
    })
    .catch(function (err) {
      console.error("Error loading profile:", err);
    });
}
loadProfile();
loadCategories();
