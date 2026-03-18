
const form = document.getElementById("bill-form");
const list = document.getElementById("bill-list");
const calendar = document.getElementById("calendar");


const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const saved = JSON.parse(localStorage.getItem("bills")) || {
  year: currentYear,
  month: currentMonth,
  items: []
};

if (saved.month !== currentMonth || saved.year !== currentYear) {
  saved.items.forEach(bill => bill.paid = false);
  saved.month = currentMonth;
  saved.year = currentYear;
  save();
}

function save() {
  localStorage.setItem("bills", JSON.stringify(saved));
}


function renderList() {
  list.innerHTML = "";

  const sortedBills = [...saved.items].sort((a, b) => a.day - b.day);

  sortedBills.forEach((bill) => {
    const li = document.createElement("li");
    if (bill.paid) li.classList.add("paid");

    li.innerHTML = `
      <span>${bill.name} — due ${bill.day}</span>
      <div>
        <input type="checkbox" ${bill.paid ? "checked" : ""} />
        <button type="button" class="delete">✕</button>
      </div>
    `;

    li.querySelector("input").addEventListener("change", () => {
      bill.paid = !bill.paid;
      save();
      renderList();
      renderCalendar();
    });

    li.querySelector(".delete").addEventListener("click", () => {

      const originalIndex = saved.items.indexOf(bill);
      if (originalIndex > -1) {
        saved.items.splice(originalIndex, 1);
        save();
        renderList();
        renderCalendar();
      }
    });

    list.appendChild(li);
  });
}

function renderCalendar() {
  calendar.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();


  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(d => {
    const header = document.createElement("div");
    header.className = "day-header";
    header.textContent = d;
    calendar.appendChild(header);
  });

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<strong>${day}</strong>`;

    const today = new Date();
    if (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    ) {
      cell.classList.add("today");
    }
    saved.items.forEach(bill => {
      if (Number(bill.day) === day) {
        cell.innerHTML += `<div class="bill">💸 ${bill.name}</div>`;
      }
    });

    calendar.appendChild(cell);
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("bill-name").value.trim();
  const day = Number(document.getElementById("bill-day").value);

  if (!name || day < 1 || day > 31) return;

  saved.items.push({ name, day, paid: false });
  save();
  renderList();
  renderCalendar();
  form.reset();
});

renderList();
renderCalendar();
