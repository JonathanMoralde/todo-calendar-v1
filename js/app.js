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

// for loadMonth function
let selectMonth = document.querySelectorAll(".months");
selectMonth = Array.apply(null, selectMonth);
let selectedMonth = new Date().getMonth();

// for modal
const newEventModal = document.getElementById("newEventModal");
const modalBackDrop = document.getElementById("modalBackDrop");
const closeBtn = document.querySelector(".close-btn");
const todoInput = document.getElementById("todoInput");
const addBtn = document.querySelector(".submit-btn");
const todoContainer = document.querySelector(".todo-container");
const list = document.querySelector(".todo-list");
const form = document.querySelector(".todo-form");
const alert = document.querySelector(".alert");

// for edit btn
let editElement;
let editFlag = false;
let editID = "";

// for select year
const yearTitle = document.querySelector(".year");
const nextBtn = document.querySelector(".next-button");
const prevBtn = document.querySelector(".prev-button");
let selectYear = new Date().getFullYear();
/* ================================================================= */

/* =======================EVENT LISTENERS============================= */
closeBtn.addEventListener("click", closeModal);

form.addEventListener("submit", addItem);

nextBtn.addEventListener("click", function () {
  selectYear++;
  loadYear();
  load();
});
nextBtn.addEventListener("mousedown", function () {
  nextBtn.style.color = "#b4e7ce";
});
nextBtn.addEventListener("mouseup", function () {
  nextBtn.style.color = "var(--lightColor)";
});

prevBtn.addEventListener("click", function () {
  selectYear--;
  loadYear();
  load();
});
prevBtn.addEventListener("mousedown", function () {
  nextBtn.style.color = "#b4e7ce";
});
prevBtn.addEventListener("mouseup", function () {
  nextBtn.style.color = "var(--lightColor)";
});

window.addEventListener("DOMContentLoaded", function () {
  // set active class to current month
  selectMonth[selectedMonth].classList.add("active");
  // load days for selected month
  loadMonth();
  // load days & load days for current month
  load();

  // set color for events
  eventState();

  loadYear();
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

function loadYear() {
  yearTitle.textContent = selectYear;
}

function load() {
  const dt = new Date();

  // selected Month
  if (selectedMonth !== 0) {
    dt.setMonth(selectedMonth);
  } else {
    dt.setMonth(0);
  }

  // selected Year
  if (selectYear !== dt.getFullYear()) {
    dt.setFullYear(selectYear);
  } else {
    dt.setFullYear(dt.getFullYear());
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  // options for toLocaleDateString & passed as second parameter
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
          eventTitle.id = `ID${d.id}`;

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
  checked();
}

// open modal
function addEvent(date) {
  newEventModal.style.display = "block";
  modalBackDrop.style.display = "block";
  clicked = date;
  // if selected date has events, will load those existing events
  setupEvents(date);
}

function closeModal() {
  // if theres an event stored, this will save its checkbox state
  if (events) {
    saveCheckboxState();
  }

  newEventModal.style.display = "none";
  modalBackDrop.style.display = "none";
  todoInput.value = "";
  clicked = null;
  setBackToDefault();

  // reload page
  window.location.reload();
}

function addItem(e) {
  // prevent submit btn from refreshing page
  e.preventDefault();
  const value = todoInput.value;
  // unique ID
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    // add item
    createListItem(id, value);
    // display alery
    displayAlert("item added to the list", "success");

    setBackToDefault();
    // local STORAGE
    addToLocalStorage(clicked, id, value);
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
                <i class="far fa-trash-alt"></i>
              </button>
            </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  list.appendChild(element);
  checked();
}

function deleteItem(e) {
  let element = e.currentTarget.parentElement.parentElement;
  let id = element.dataset.id;
  list.removeChild(element);

  displayAlert("Item Removed", "danger");

  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = element.querySelector(".titleLabel");
  // editElement = element.querySelector(".title");
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
      // checked();
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
  let items = localStorage.getItem("events")
    ? JSON.parse(localStorage.getItem("events"))
    : [];

  // remove item with the same id from parameter
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("events", JSON.stringify(items));

  let checkboxSaved = localStorage.getItem("checkbox")
    ? JSON.parse(localStorage.getItem("checkbox"))
    : [];

  checkboxSaved = checkboxSaved.filter(function (checkboxItem) {
    if (checkboxItem.id !== id) {
      return checkboxItem;
    }
  });
  localStorage.setItem("checkbox", JSON.stringify(checkboxSaved));
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

    let checkboxArr = checkbox ? { id: id, value: checkbox.checked } : {};

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

    // remove empty objects from array
    let newItems = items.filter((item) => Object.keys(item).length !== 0);

    localStorage.setItem("checkbox", JSON.stringify(newItems));
  });
}

function checked() {
  let items = JSON.parse(localStorage.getItem("checkbox"));

  if (items) {
    items.forEach(function (item) {
      let id = item.id;
      let value = item.value ? item.value[0] : [];
      let checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.checked = value;
      }
    });
  }
}

function eventState() {
  let items = localStorage.getItem("checkbox")
    ? JSON.parse(localStorage.getItem("checkbox"))
    : [];
  const checkValue = true;
  if (items) {
    items.forEach(function (item) {
      const colorState = document.getElementById(`ID${item.id}`);
      if (item.value[0] === checkValue) {
        colorState.classList.add("eventState");
      }
    });
  }
}
/* =========================================================== */
