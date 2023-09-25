//* Массив с данными
let dataInfo = [];
//* Конпки сортировки
let sortByTitleBtn = document.querySelector(".sortByTitle");
let sortByCalorieBtn = document.querySelector(".sortByCalorie");
//* "Таблица" с данными
let columnOneData = document.querySelector(".columnOne__data");
//* Кнопки удаления данных
let deleteButtons;
let deleteAllBtn = document.querySelector(".delete__all");
//* Элементы формы
// Форма контейнер
const formContainer = document.querySelector(".container__form");
// Форма
const formEl = document.querySelector(".form");

// Контейнер с инпутами
let formInfoContainer = document.querySelector(".formInfoContainer");
let form__info = document.querySelector(".form__info");
// Инпуты
const formInput = document.querySelectorAll(".form__input");
// Кнопки формы
const resetBtn = document.querySelector(".btn__reset");

// Редактирование лимита
let limitEditEl = document.querySelector(".limit__edit");
let hideLimitEditEl = document.querySelector(".limit__edit-hide");
let saveLimitBtn = document.querySelector(".save__limit");
let meals;
// данные с формы
let formDataInfo = [];

// amount
let amount = document.querySelector(".amount");
// warning
let warning = document.querySelector(".warning");
// limit
let limitEl = document.querySelector(".limit-span");
let limit;
let editBtn = document.querySelector(".fa-pen-to-square");
let limitEditInput = document.querySelector(".limit__input");

//* Элементы Таблицы
// таблица
let table = document.querySelector(".table");
let tableDeleteBtns;
let tableDeleteBtnsArray;

//* Circular Progress Bar
let progressBar = document.querySelector(".circular-progress"); // красный
let valueContainer = document.querySelector(".value-container"); // надпись
let percent;

class RenderData {
   displayData(data) {
      let limits = new Statistics();
      let displayedOnThePage = "";
      data.forEach((data) => {
         displayedOnThePage += `<div data-id=${data.id} class="data">
            <div class="data__meal">${data.meal}</div>
            <div class="data__calorie">${data.calorie}</div>
            <div data-id=${data.id}><button class="delete">Удалить</button></div>
          </div>`;
      });
      columnOneData.innerHTML = displayedOnThePage;
      limits.amountLimit(data);
   }
}

class FormData {
   postData() {
      const add = new RenderData();
      formEl.addEventListener("submit", (e) => {
         e.preventDefault();
         let array = [];
         const inputs = formEl.querySelectorAll("input");
         const uniqueId = Date.now();
         let formData = { id: uniqueId };
         inputs.forEach(function (input) {
            if (input.name) {
               formData[input.name] = input.value;
            }
         });
         array.push(formData);
         dataInfo = [...dataInfo, formData];
         LocalStorage.saveFormData(dataInfo);
         add.displayData(dataInfo);
         formEl.reset();
      });
   }
   clearForm() {
      resetBtn.addEventListener("click", () => {
         formEl.reset();
      });
   }
}

class DeleteData {
   deleteData() {
      const rendering = new RenderData();
      columnOneData.addEventListener("click", (e) => {
         let id = e.target.parentElement.dataset.id;
         let foundItem = dataInfo.find((meal) => meal.id == id);
         let newArray = dataInfo.filter((meal) => meal.id !== foundItem.id);
         dataInfo = newArray;
         LocalStorage.saveFormData(dataInfo);
         rendering.displayData(dataInfo);
      });
   }
   deleteAllData() {
      const rendering = new RenderData();
      deleteAllBtn.addEventListener("click", () => {
         dataInfo = [];
         LocalStorage.saveFormData(dataInfo);
         rendering.displayData(dataInfo);
      });
   }
}

class LocalStorage {
   static saveFormData(form) {
      localStorage.setItem("productsDataLS", JSON.stringify(form));
   }

   static saveLimitData(dataLimit) {
      localStorage.setItem("limit", JSON.stringify(dataLimit));
   }
}

class SortData {
   titleSort() {
      const showSortedData = new RenderData();
      sortByTitleBtn.addEventListener("click", () => {
         let sortedArray = dataInfo.sort(function (a, b) {
            if (a.meal < b.meal) {
               return -1;
            }
            if (a.meal > b.meal) {
               return 1;
            }
            return 0;
         });
         showSortedData.displayData(sortedArray);
      });
   }
   calorieSort() {
      const showSortedData = new RenderData();
      sortByCalorieBtn.addEventListener("click", () => {
         let sortedArray = dataInfo.sort((a, b) => a.calorie - b.calorie);
         showSortedData.displayData(sortedArray);
      });
   }
}

class Statistics {
   amountLimit(data) {
      meals = data.reduce(function (acc, meal) {
         return acc + parseInt(meal.calorie);
      }, 0);
      amount.innerText = meals;
      this.defineLimit(meals);
   }

   defineLimit(data) {
      const progressBar = new ProgressBar();
      if (!limit) {
         warning.innerText = "Лимит не задан";
         percent = 0;
         progressBar.createPB(percent);
      } else if (data >= limit) {
         warning.innerText = `Лимит превышен на ${data - limit} кал.`;
         percent = 100
         progressBar.createPB(percent);
         warning.style.color = '#e91f63';
      } else {
         warning.innerText = `Лимит не превышен. Осталось ${limit - data} кал.`;
         warning.style.color = '#fcc214';
         percent = Math.floor((data / limit) * 100);
         progressBar.createPB(percent);
      }
   }
   editLimit() {
      editBtn.addEventListener("click", () => {
         limitEditEl.classList.add("active");
         editBtn.style.display = "none";
      });
   }

   changeLimit() {
      limitEditInput.addEventListener("keyup", (e) => {
         limit = e.target.value;
         if (limit) {
            limitEl.innerText = limit;
            LocalStorage.saveLimitData(limit);
         }
         if (!limit) {
            limitEl.innerText = 0;
            LocalStorage.saveLimitData(limit);
         }
      });
   }

   saveLimit() {
      saveLimitBtn.addEventListener("click", () => {
         console.log("click");
         this.changeLimit();
         limitEditEl.classList.remove("active");
         this.defineLimit(meals);
         editBtn.style.display = "block";
      });
   }
}

class ProgressBar {
   createPB(percent) {
      //let progressValue = percent - 1;
      let progressValue = -1;
      let progressEndValue = percent;
      let speed = 30;

      let progress = setInterval(() => {
         progressValue++;
         valueContainer.textContent = `${progressValue}%`;
         progressBar.style.background = `conic-gradient(
            #099250 ${progressValue * 3.6}deg,
      #edfcf2 ${progressValue * 3.6}deg
  )`;
         if (progressValue == progressEndValue) {
            clearInterval(progress);
         }
      }, speed);
   }
}

document.addEventListener("DOMContentLoaded", () => {
   const form = new FormData();
   const rendering = new RenderData();
   const sort = new SortData();
   const statisticsData = new Statistics();
   const remove = new DeleteData();
   form.postData();
   if (localStorage.getItem("productsDataLS")) {
      dataInfo = JSON.parse(localStorage.getItem("productsDataLS"));
      rendering.displayData(dataInfo);
      deleteButtons = [...document.querySelectorAll(".delete")];
   }
   if (localStorage.getItem("limit")) {
      let dataLimit = JSON.parse(localStorage.getItem("limit"));
      limit = Number(dataLimit);
      limitEl.innerText = limit;
   }
   form.clearForm();
   statisticsData.amountLimit(dataInfo);
   statisticsData.editLimit();
   statisticsData.changeLimit();
   statisticsData.saveLimit();
   remove.deleteData();
   remove.deleteAllData();
   sort.titleSort();
   sort.calorieSort();
});
