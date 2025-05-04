const poemsPerPage = 21;
let currentPage = 1;
let filteredPoems = poems; // global var from poems.js

const searchInput = document.getElementById("search");
const poemContainer = document.getElementById("poem-container");
const pagination = document.getElementById("pagination");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");
const modalClose = document.getElementById("modal-close");

const toggleBtn = document.getElementById("dark-toggle");

let currentPoemIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  goToPage(1);
});

// Search setup
function setupSearch() {
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredPoems = poems.filter(
      (poem) =>
        poem.kagga_eng.toLowerCase().includes(query) ||
        poem.kagga_kn.toLowerCase().includes(query) ||
        poem.kagga_latn.toLowerCase().includes(query)
    );
    goToPage(1);
  });
}

// Pagination logic
function goToPage(pageNumber) {
  const totalPages = Math.ceil(filteredPoems.length / poemsPerPage);
  currentPage = Math.max(1, Math.min(pageNumber, totalPages));

  const start = (currentPage - 1) * poemsPerPage;
  const end = start + poemsPerPage;
  const poemsToShow = filteredPoems.slice(start, end);

  renderPoems(poemsToShow);
  renderPagination(currentPage, totalPages);

  document
    .getElementById("poem-container")
    ?.scrollIntoView({ behavior: "smooth" });
}

// Render poems for current page
function renderPoems(isDark = false) {
  poemContainer.innerHTML = "";
  const start = (currentPage - 1) * poemsPerPage;
  const end = start + poemsPerPage;
  const currentPoems = filteredPoems.slice(start, end);

  currentPoems.forEach((poem, index) => {
    const card = createPoemCard(poem, index + start);
    poemContainer.appendChild(card);
  });
}

// Create poem card
function createPoemCard(poem, index) {
  const isDark = document.documentElement.classList.contains("dark");
  const gradient = generateGradient(index, isDark);
  const card = document.createElement("div");
  //   card.className = `rounded-2xl shadow p-6 bg-gradient-to-br ${gradient} transition hover:scale-[1.02] cursor-pointer min-w-[280px] md:min-w-[360px] xl:min-w-[420px] whitespace-pre-wrap`;
  card.className = `rounded-2xl shadow p-6 bg-gradient-to-br ${gradient} transition hover:scale-[1.02] cursor-pointer min-w-[280px] md:min-w-[360px] xl:min-w-[420px] whitespace-pre-wrap text-gray-900 dark:text-gray-100`;

  const poemKannada = document.createElement("pre");
  poemKannada.textContent = poem.kagga_kn;
  // centered poemKannada.className = "font-bold text-lg whitespace-pre-wrap text-center leading-relaxed";
  //   poemKannada.className = "font-bold text-lg whitespace-pre-wrap";
  poemKannada.className = `font-bold text-lg whitespace-pre-wrap text-center leading-relaxed ${isDark ? "text-glow-light" : "text-glow-dark"
    }`;

  const descEnglish = document.createElement("p");
  descEnglish.textContent = truncateText(poem.kagga_eng, 60);
  //   descEnglish.className = "mt-2 text-sm text-gray-800";
  descEnglish.className = "mt-2 text-sm text-gray-800 dark:text-gray-100";

  const readMore = document.createElement("button");
  readMore.textContent = "Read more";
  readMore.className = "mt-2 text-blue-600 underline text-sm";
  readMore.onclick = (e) => {
    e.stopPropagation();
    openModal(poem, index);
  };

  card.appendChild(poemKannada);
  card.appendChild(descEnglish);
  if (poem.kagga_eng.split("\n").length > 6 || poem.kagga_eng.length > 300) {
    descEnglish.appendChild(readMore);
  }

  card.onclick = () => openModal(poem, index);

  return card;
}

// Truncate description to 6 lines
function truncateText(text, maxLines) {
  const lines = text.split(" ");
  if (lines.length <= maxLines) return text;
  return lines.slice(0, maxLines).join(" ") + "...   ";
}

// Render pagination
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const navButtons = [
    { label: "⏮️ First", page: 1 },
    { label: "◀️ Prev", page: Math.max(1, currentPage - 1) },
  ];

  const nextButtons = [
    { label: "Next ▶️", page: Math.min(totalPages, currentPage + 1) },
    { label: "Last ⏭️", page: totalPages },
  ];

  navButtons.forEach(({ label, page }) => {
    const btn = createPaginationButton(label, page, false, 1 == currentPage);
    pagination.appendChild(btn);
  });

  // Page numbers
  const range = 2;
  const start = Math.max(1, currentPage - range);
  const end = Math.min(totalPages, currentPage + range);
  for (let i = start; i <= end; i++) {
    const btn = createPaginationButton(i, i, i === currentPage);
    pagination.appendChild(btn);
  }

  nextButtons.forEach(({ label, page }) => {
    const btn = createPaginationButton(
      label,
      page,
      false,
      totalPages == currentPage
    );
    pagination.appendChild(btn);
  });
  // Create pagination buttons
  function createPaginationButton(label, page, isActive, disabled) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = `
      px-3 py-1 rounded-lg border 
      transition-transform transform duration-200
      ${isActive
        ? "bg-blue-500 text-white dark:bg-blue-600"
        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
      }
      hover:scale-105 active:scale-95 shadow-sm
    `;
    btn.disabled = disabled;
    if (!disabled) {
      btn.addEventListener("click", () => {
        goToPage(page);
      });
    }
    return btn;
  }
}

toggleBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  if (isDark) {
    toggleBtn.innerHTML = "🌙";
  } else {
    toggleBtn.innerHTML = "☀️";
  }
  renderPoems(isDark); // re-render with right gradients
});

// Generate pleasant gradients
function generateGradient(index, isDark) {
  const lightGradients = [
    "from-yellow-100 to-pink-200",
    "from-green-100 to-teal-200",
    "from-blue-100 to-purple-200",
    "from-orange-100 to-red-200",
    "from-slate-100 to-indigo-200",
  ];

  const darkGradients = [
    "from-slate-800 to-gray-900",
    "from-indigo-800 to-purple-900",
    "from-emerald-800 to-teal-900",
    "from-rose-800 to-pink-900",
    "from-yellow-700 to-orange-900",
  ];

  const gradients = isDark ? darkGradients : lightGradients;
  return gradients[index % gradients.length];
}

function trapFocus(modalElement) {
  const focusableSelectors =
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const focusableElements = modalElement.querySelectorAll(focusableSelectors);
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  modalElement.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Move focus to first element when modal opens
  setTimeout(() => first?.focus(), 50);
}

function openModal(poem, index) {
  currentPoemIndex = index;

  modalContent.className =
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-xl w-full shadow-lg animate-fade-in-up max-h-[90vh] overflow-y-auto";
  updateModalContent(poem);
  modalContent.setAttribute("tabindex", "0");
  modal.classList.remove("hidden");

  // Close button inside modal content
  document.getElementById("closeModalBtn").onclick = closeModal;

  // Close by clicking outside the modalContent
  modal.addEventListener("click", handleClickOutside);

  // Close with Escape key
  document.addEventListener("keydown", handleEscapeKey);
}

function updateModalContent(poem) {
  modalContent.innerHTML = `
      <div class="flex justify-between mb-6">
        <button onclick="showPrevious()" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm" ${currentPoemIndex === 0 ? "disabled" : ""
    }>← Previous</button>
        <button id="closeModalBtn" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"}>Close</button>
        <button onclick="showNext()" class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm" ${currentPoemIndex === poems.length - 1 ? "disabled" : ""
    }>Next →</button>
      </div>
      <h2 class="text-2xl font-bold mb-4 text-center">ಕಗ್ಗ - ${poem._id}</h2>
  
      <pre class="text-lg whitespace-pre-wrap font-semibold text-center mb-4 leading-relaxed">
  ${poem.kagga_kn}
      </pre>
  
      <h4 class="text-l font-bold mb-4 text-center">ಭಾವಾರ್ಥ</h4>
      <hr class="my-4 border-gray-300 dark:border-gray-700" />
      <pre class="text-sm mb-4 whitespace-pre-wrap">${poem.kagga_tatparya_kn
    }</pre>
  
      <h4 class="text-l font-bold mb-4 text-center">Description</h4>
      <hr class="my-4 border-gray-300 dark:border-gray-700" />
      <p class="text-sm whitespace-pre-wrap">${poem.kagga_eng}</p>

      <h4 class="text-l font-bold mb-4 text-center">ವ್ಯಾಖ್ಯಾನ</h4>
      <hr class="my-4 border-gray-300 dark:border-gray-700" />
      <pre class="text-sm whitespace-pre-wrap">${poem.kagga_vyakhyana_kn}</pre>

      <div
        class="flex justify-center items-center pt-4 border-t border-gray-300 dark:border-gray-600"
      >
        <button
          id="modal-share"
          class="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm shadow"
        >
          📤  Share Kagga
        </button>
      </div>

      <div id="share-preview-container" class="hidden pt-4 flex flex-col justify-center items-center">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
        <img
          id="share-preview-img"
          class="rounded-lg border border-gray-300 dark:border-gray-700 shadow max-w-full"
        />
      </div>

      </div>
    `;
  // Close button inside modal content
  document.getElementById("closeModalBtn").onclick = closeModal;
  document.getElementById("modal-share").onclick = () => {
    sharePoemImage(poem.kagga_kn);
  };
}

function showPrevious() {
  if (currentPoemIndex > 0) {
    currentPoemIndex--;
    updateModalContent(poems[currentPoemIndex]);
  }
}

function showNext() {
  if (currentPoemIndex < poems.length - 1) {
    currentPoemIndex++;
    updateModalContent(poems[currentPoemIndex]);
  }
}

function closeModal() {
  modalContent.classList.remove("animate-fade-in-up");
  modalContent.classList.add("animate-fade-out-down");

  // After animation, hide the modal
  setTimeout(() => {
    modal.classList.add("hidden");
    modalContent.classList.remove("animate-fade-out-down");
  }, 200);

  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("click", handleClickOutside);
}
function handleClickOutside(event) {
  if (event.target === modal) {
    closeModal();
  }
}

function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal();
  }
  trapFocus(document.getElementById("modal-content"));
}

function sharePoemImage(poemText) {
  const canvas = document.createElement("canvas");
  const width = 600;
  const height = 260;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#60f7f2");
  gradient.addColorStop(1, "#fefcea");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Poem text
  ctx.font = "28px Noto Sans Kannada, sans-serif";
  ctx.fillStyle = "#222";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const lines = poemText.trim().split("\n");
  const startY = 50;
  const lineHeight = 45;

  lines.forEach((line, i) => {
    ctx.fillText(line.trim(), 60, startY + i * lineHeight);
  });

  // Author name
  ctx.font = "italic 20px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("– DVG", width - 60, height - 40);

  // Convert to blob for preview
  canvas.toBlob((blob) => {
    const imageUrl = URL.createObjectURL(blob);
    const previewContainer = document.getElementById("share-preview-container");
    const previewImg = document.getElementById("share-preview-img");

    previewImg.src = imageUrl;
    previewContainer.classList.remove("hidden");

    // Try Web Share
    if (
      navigator.canShare &&
      navigator.canShare({
        files: [new File([blob], "kakka.png", { type: "image/png" })],
      })
    ) {
      const file = new File([blob], "kagga.png", { type: "image/png" });
      navigator
        .share({
          title: "Kagga by DVG",
          text: "Check out this Kagga",
          files: [file],
        })
        .catch(console.warn);
    } else {
      // Fallback to download
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "kagga.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(imageUrl);
    }
  });
}
