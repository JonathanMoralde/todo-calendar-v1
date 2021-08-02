/* ================================SELECT ITEMS===================================== */
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");

let selectMonth = document.querySelectorAll(".months");
selectMonth = Array.apply(null, selectMonth);
let selectedMonth = new Date().getMonth();

const newEventModal = document.getElementById("newEventModal");
const modalBackDrop = document.getElementById("modalBackDrop");
const closeBtn = document.querySelector(".close-btn");
const todoInput = document.getElementById("todoInput");
const addBtn = document.querySelector(".submit-btn");
const todoContainer = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const form = document.querySelector(".todo-form");
const alert = document.querySelector(".alert");

let editElement;
let editFlag = false;
let editID = "";
/* ================================================================= */

/* =======================EVENT LISTENERS============================= */
closeBtn.addEventListener("click", closeModal);

form.addEventListener("submit", addItem);

window.addEventListener("DOMContentLoaded", function () {
  selectMonth[selectedMonth].classList.add("active");
  loadMonth();
  load();
});
/* ================================================================== */

/* ========================FUNCTIONS============================= */
function loadMonth() {
  selectMonth.forEach(function (months) {
    months.addEventListener("click", function (e) {
      const m = e.currentTarget;
      selectedMonth = selectMonth.indexOf(m);

      if (m) {
        selectMonth.forEach(function (i) {
          i.classList.remove("active");
        });
      }
      m.classList.add("active");
      load();
    });
  });
}
function load() {
  const dt = new Date();

  // selected Month
  if (selectedMonth !== 0) {
    dt.setMonth(selectedMonth);
  } else {
    dt.setMonth(0);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", options);

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  // wipe out days
  calendar.innerHTML = "";

  // generate days
  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      daySquare.addEventListener("click", function () {
        addEvent(`${month + 1}/${i - paddingDays}/${year}`);
      });
    } else {
      daySquare.classList.add("padding");
    }
    calendar.appendChild(daySquare);
  }
}

function addEvent(date) {
  newEventModal.style.display = "block";
  modalBackDrop.style.display = "block";
  clicked = date;
}
function closeModal() {
  newEventModal.style.display = "none";
  modalBackDrop.style.display = "none";
  todoInput.value = "";
  clicked = null;
}

function addItem(e) {
  e.preventDefault();
  const value = todoInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    console.log("added an item");
  } else if (value && editFlag) {
    console.log("edited an item");
  } else {
    displayAlert("Please enter a text", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}
/* ================================================================ */

/* =====================LOCAL STORAGE============================ */

/* =========================================================== */
