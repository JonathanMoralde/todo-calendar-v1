/* ================================SELECT ITEMS===================================== */

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

      const dayString = `${month + 1}/${i - paddingDays}/${year}`;

      // highlight today
      const monthToday = new Date().getMonth();
      if (i - paddingDays === day && selectedMonth === monthToday) {
        daySquare.id = "currentDay";
      }

      // add existing event to daysquare
      let selectedDay = events.filter(function (item) {
        if (item.date === dayString) {
          return item;
        }
      });

      if (selectedDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        selectedDay.forEach(function (d) {
          const eventTitle = document.createElement("h2");
          eventTitle.classList.add("eventTitle");
          eventTitle.textContent = d.value;

          eventDiv.appendChild(eventTitle);
        });

        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", function () {
        addEvent(dayString);
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
  setupEvents(date);
}
function closeModal() {
  if (events) {
    saveCheckboxState();
  }
  newEventModal.style.display = "none";
  modalBackDrop.style.display = "none";
  todoInput.value = "";
  clicked = null;
  setBackToDefault();
  window.location.reload();
}

function addItem(e) {
  e.preventDefault();
  const value = todoInput.value;
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    // add item
    createListItem(id, value);
    // display alery
    displayAlert("item added to the list", "success");

    // local STORAGE
    addToLocalStorage(clicked, id, value);

    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Text Changed", "success");

    // localstorage
    editLocalStorage(editID, value);

    setBackToDefault();
  } else {
    displayAlert("Please enter a text", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// create/add item
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("todoItem");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  // set attribute
  element.setAttributeNode(attr);
  element.innerHTML = `
            <div class="wrapper">
              <input type="checkbox" id="${id}" class="title">
              <label for="${id}" class="titleLabel">${value}</label>
            </div>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-edit"></i>
              </button>
            </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
}

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);

  displayAlert("Item Removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // editElement = element.querySelector(".titleLabel");
  editElement = element.querySelector(".title");
  todoInput.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  addBtn.textContent = "Edit";
}
function setBackToDefault() {
  todoInput.value = "";
  editFlag = false;
  editID = "";
  addBtn.textContent = "Add";
}

function setupEvents(date) {
  list.innerHTML = "";

  let items = events;
  let eventforDay = items.filter(function (item) {
    if (item.date === date) {
      return item;
    }
  });
  eventforDay.forEach(function (item) {
    if (item.date === date) {
      createListItem(item.id, item.value);
      checked();
    }
  });
}

/* ================================================================ */

/* =====================LOCAL STORAGE============================ */
function addToLocalStorage(clicked, id, value) {
  const task = { date: clicked, id: id, value: value };
  let items = events;

  items.push(task);
  localStorage.setItem("events", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = events;

  // remove item with the same id from parameter
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("events", JSON.stringify(items));
}
function editLocalStorage(id, value) {
  let items = events;

  items = items.map(function (item) {
    // edit the value of the specific id
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("events", JSON.stringify(items));
}

function saveCheckboxState() {
  let list = events;
  list.forEach(function (listItem) {
    let id = listItem.id;
    let checkbox = document.getElementById(id);

    let checkboxArr = { id: id, value: checkbox.checked };

    let items = localStorage.getItem("checkbox")
      ? JSON.parse(localStorage.getItem("checkbox"))
      : [];
    items = items.map(function (item) {
      if (item.id === checkboxArr.id) {
        item.value = checkboxArr.value;
      } else {
      }
      return item;
    });

    items.push(checkboxArr);

    let seen = {};
    items = items.filter(function (entry) {
      let previous;

      // Have we seen this label before?
      if (seen.hasOwnProperty(entry.id)) {
        // Yes, grab it and add this data to it
        previous = seen[entry.id];
        previous.value.push(entry.value);

        // Don't keep this entry, we've merged it into the previous one
        return false;
      }

      // entry.data probably isn't an array; make it one for consistency
      if (!Array.isArray(entry.value)) {
        entry.value = [entry.value];
      }

      // Remember that we've seen it
      seen[entry.id] = entry;

      // Keep this one, we'll merge any others that match into it
      return true;
    });

    localStorage.setItem("checkbox", JSON.stringify(items));
  });
}
function checked() {
  let items = JSON.parse(localStorage.getItem("checkbox"));

  if (items) {
    items.forEach(function (item) {
      let id = item.id;
      let value = item.value[0];
      let checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = value;
      }
    });
  }
}
/* =========================================================== */
