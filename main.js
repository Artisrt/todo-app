(function () {


	// Этап 1.3 созжаем пустой массив, чтобі там хранился список дел
	let todoItemArray = [];
	let listName = '';
	// выносим чтобы listName было глобальная
	// создаем и возвращаем заголовок приложения, чтобы тело фенкции было легко изменить будем передавать его в аргументе функции Title(Title)
	function createAppTitle(title) {
		let appTitle = document.createElement('h2');
		appTitle.innerHTML = title;
		// appTitle.innerHTML = title; мы присваеваем let appTitle внутреннему содержимому этого тега title, который мы передаем в качестве аргумента
		return appTitle;
		// вернуть нужно обязательно 
	}

	// создаем и возвращаем форму для создания дела
	function createTodoItemForm() {
		let form = document.createElement('form');
		// let form = document.createElement('form'); создаем сам элемонт формы
		let input = document.createElement('input');
		// let input = document.createElement('input'); создаем поле для ввода
		let buttonWrapper = document.createElement('div');
		// let buttonWrapper = document.createElement('div'); передаем вспомогательный элемент, для того чтобы правильно стилизовать кнопку
		let button = document.createElement('button');
		// let button = document.createElement('button');  создаем саму кнопку


		// расставим атрибу нашим элементам 
		form.classList.add('input-group', 'mb-3');
		// form.classList.add('input-group', 'mb-3'); для того чтобы правильно нарисовать кнопку mb-3- клас отступ после формы чтобф она не слипдядась с элементом
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		buttonWrapper.classList.add('input-group-append');
		// buttonWrapper.classList.add('input-group-append'); для позиционирование элемента справа от кнопки 
		button.classList.add('btn', 'btn-primary');
		// button.classList.add('btn', 'btn-primary'); для кнопки стилизация, основное действие
		button.textContent = 'Добавить дело';

		// объеденяем все элементы
		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		// Этап 2 установили атрибут disabled
		button.disabled = true;
		// начальное состояние кнопки отключённое
		input.addEventListener("change", stateHandle);
		// Добавили обработчик событий в поле ввода, который отслеживает изменения его значения
		function stateHandle() {
			if (input.value === '') {
				button.disabled = true;
			} else {
				button.disabled = false;
			}
		};
		//stateHandle проверяет значение поля ввода и соответствующим образом включает или отключает кнопку:


		// возвращаем результат 
		return {
			form,
			input,
			button,
		};
	}

	// создаем и возвращаем список элементов
	function createTodoList() {
		let list = document.createElement('ul');
		list.classList.add('list-group');
		return list;
	}


	// функция createTodoItem созжание элесентов списка, которая создаст дом элемент с делом для списка дел и 
	// вернет все необходимое для взаимодействия с этим элементом
	function createTodoItem(todoObject) {
		// элемент li в который будем пом. список
		let item = document.createElement('li');
		// кнопки помещаем в элемент, который красиво покажет их в одной группе
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		// что бы отметить дело как сделанное
		let deleteButton = document.createElement('button');
		// кнопка чтобы удалить дело из списка


		// устанавливаем стили для элемента списка, а также для размещения кнопок
		// в его правой части с помощью флекс
		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		// // <li class="list-group-item d-flex justify-content-between align-items-center">
		item.textContent = todoObject.name;
		// <li>Название дела</li>
		// все что было переданно вскачестве аргумента в name, используем textContent так как внутри name могут быть
		// использованы символи чтобы не создавали теги

		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		// классы дя кнопки
		doneButton.classList.add('btn', 'btn-success');
		// делает кнопку зеленой btn-success
		doneButton.textContent = 'Готово';
		doneButton.setAttribute('data-action', 'done');
		deleteButton.classList.add('btn', 'btn-danger');
		// кнопку красной делают btn-danger
		deleteButton.textContent = 'Удалить';

		// если done активно добавляем класс
		if (todoObject.done == true) item.classList.add('list-group-item-success')
		// слушаем кнопку "готово" вызываем ф-цию, доб. класс
		doneButton.addEventListener('click', function () {
			item.classList.toggle('list-group-item-success')

			for (let listItem of todoItemArray) {
				// создаем цикл, пройдемся по всем элементам нашего объекта todoItemArray
				if (listItem.id == todoObject.id) listItem.done = !listItem.done
				// и сравним если listItem.id равно todoObject.id, то можем изменить его статус на противоположный
			}
			// сохраняем 
			saveList(todoItemArray, listName);
		});
		// ф-кция при удалении дела
		deleteButton.addEventListener('click', function () {
			if (confirm('Вы уверены?')) {
				item.remove();
				// создаем цикл
				for (let i = 0; i < todoItemArray.length; i++) {
					if (todoItemArray[i].id == todoObject.id) todoItemArray.splice(i, 1)
				}
			}
			// сохраняем 
			saveList(todoItemArray, listName);
		});

		// вкладываем кнопки в отделтный элемент, стобы они объединались в один блок
		buttonGroup.append(doneButton);
		// <div><button>Готово</button>
		buttonGroup.append(deleteButton);
		// <button>Удалить</button></div>

		item.append(buttonGroup);
		// кнопки вкладываем в группу кнопок, группу передаем в item

		// Приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия 
		return {
			// с помощью return возвращаем объект 
			item,
			buttonGroup,
			doneButton,
			deleteButton,
		};

	}
	// ..// .............max ID.......

	function getID(arr) {
		let maxId = 0;
		for (let item of arr) {
			if (item.id > maxId) maxId = item.id
		}
		return maxId + 1;
	}
	// функция для хранения в нее пердаем два параметра 
	function saveList(arr, keyName) {
		localStorage.setItem(keyName, JSON.stringify(arr));
		// установить значения имя ключа, наш массив
		// keyName -название переменной JSON.stringify(arr)) - данные

	}
	// функция чтобы расположить на одной странице все дела, вынесем в аргументы функ. 
	// то что может изменяться контейнер+заголовок
	// ф-кции добавим новый объект 
	function createTodoApp(container, title = 'Список дел', keyName) {
		let todoAppTitle = createAppTitle(title);
		// todoItemForm это объект, имеено поэтому добавляем container.append(todoItemForm.form)
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();
		// let todoItems = [createTodoItem('Сходить за хлебом'), createTodoItem('Купить молоко')]; код для демоснстрации


		// при запуске ф-кции createTodoApp мы помещаем в наш ListName название списка keyName, чтобы имя списка было глобальное
		listName = keyName;


		// их результат размещаем внутри контейнера
		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);
		// (так как возвращается обьект нужно добавить елемент .item
		// todoList.append(todoItems[0].item);код для демоснстрации
		// todoList.append(todoItems[1].item);код для демоснстрации)

		// при запуске приложения массив нужно расшифровать
		let localData = localStorage.getItem(listName)
		//  условие, если localData не равно 0 и не равно пустой строчке, то мы не делаем расшифровку, будет ошибка
		// делаем проверку на пустоту и превр. из строки преврощает в массив
		if (localData !== null && localData !== '') todoItemArray = JSON.parse(localData)
		//  проходим по массиву
		for (const itemList of todoItemArray) {
			let todoItem = createTodoItem(itemList);
			todoList.append(todoItem.item);
		}


		// браузер создает событие submit на форме по нажатии на Enter или на кнопку создания дела
		todoItemForm.form.addEventListener('submit', function (e) {
			// эта строчка необходима, чтобы предотвратить стандартное дейтсвия браузерв e this event
			// в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
			e.preventDefault();

			// игнорируем созданние элемента, если пользователь ничего не ввел в поле
			if (!todoItemForm.input.value) {
				return;
			}



			// .......................Этап 1
			let newTodoItemArray = {
				id: getID(todoItemArray),
				name: todoItemForm.input.value,
				done: false,
			}

			// помещаем в переменную todoItem результат выполнения функции createTodoItem
			let todoItem = createTodoItem(newTodoItemArray);

			todoItemArray.push(newTodoItemArray);

			// при изменении дела список сохраняем
			saveList(todoItemArray, listName);
			// добавляем обработчик на кнопки 




			// ...................
			// добавляем прослушку и вешаем doneTask
			// определим чтобы смотреть был ли клик в нужном месте
			// todoItem.doneButton.addEventListener('click', doneTask)
			// function doneTask(event) {
			// 	// проверяем что клик был по кнопке "готово"
			// 	if (event.target.dataset.action === 'done') {
			// 		// let parentNode = event.target.closest(todoItem);
			// 		// console.log(parentNode);
			// 	}

			// }
			// .................................................................
			// создаем и добавляем в список новое дело с названием из поля для ввода
			todoList.append(todoItem.item);
			// (создаем и добавляем в список новое дело с названием из поля для ввода
			//  с помощью функции createTodoItem в нее мы передаем содержимое input тоесть value и берем из этого объекта item потому что в item хранится сам элемент 
			// todoList.append(createTodoItem(todoItemForm.input.value).item); этот код заменим чтобы было можно удалить или выполнить эемент списка(дела))

			// обнуляем значение в поле, чтобы не пришлось стрирать его вручную
			todoItemForm.button.disabled = true;
			todoItemForm.input.value = '';

			// ..............................
			// let todoItems = JSON.parse(localStorage.getItem(todoItems));
			// if (todoItems !== null) {
			// 	todoObject = JSON.parse(localStorage.getItem(todoItems));
			// }

			// todoItems.push(todoItem);
			// localStorage.setItem('todoItems', JSON.stringify(todoItems));

			// .........................................


		});
	}

	// создать обработчик событий DOMContentLoaded', для того чтобы мы получили доступ к ДОм дереву загрузившемуся на странице
	// (document.addEventListener('DOMContentLoaded', function () {
	// 	// вызовем функцию createTodoApp три раза 
	// 	createTodoApp(document.getElementById('my-todos'), 'Мои дела');
	// 	createTodoApp(document.getElementById('mom-todos'), 'Дела для мамы');
	// 	createTodoApp(document.getElementById('dad-todos'), 'Дела для папы');

	// })) убираем

	// зарегистрируем функцию 
	window.createTodoApp = createTodoApp;
})();

