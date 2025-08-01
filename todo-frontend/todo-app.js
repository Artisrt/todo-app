(() => {
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


		// расставим атрибу 
		form.classList.add('input-group', 'mb-3');
		// form.classList.add('input-group', 'mb-3'); для того чтобы правильно нарисовать кнопку mb-3- клас отступ после формы чтобф она не слипдядась с элементом
		input.classList.add('form-control');
		input.placeholder = 'Введите название нового дела';
		buttonWrapper.classList.add('input-group-append');
		// buttonWrapper.classList.add('input-group-append'); для позиционирование элемента справа от кнопки 
		button.classList.add('btn', 'btn-primary');
		// button.classList.add('btn', 'btn-primary'); для кнопки стилизация
		button.textContent = 'Добавить дело';

		// объеденяем все элементы
		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

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


	// функция которая создаст элемент для списка дел и вернет все необходимое для взаимодействия с этим элементом
	function createTodoItemElement(todoItem, { onDone, oneDelete }) {
		const doneClass = 'list-group-item-succes';
		let item = document.createElement('li');
		// кнопки помещаем в элемент, который красиво покажет тх в одной группе
		let buttonGroup = document.createElement('div');
		let doneButton = document.createElement('button');
		let deleteButton = document.createElement('button');

		// устанавливаем стили для элемента списка, а также для размещения кнопок
		// в его правой части с помощью флекс
		item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		if (todoItem.done) {
			item.classList.add(doneClass);
		}
		item.textContent = todoItem.name;

		buttonGroup.classList.add('btn-group', 'btn-group-sm');
		doneButton.classList.add('btn', 'btn-success');
		doneButton.textContent = 'Готово';
		deleteButton.classList.add('btn', 'btn-danger');
		deleteButton.textContent = 'Удалить';

		// добавляем обработчик на кнопки 
		doneButton.addEventListener('click', () => {
			onDone({ todoItem, element: item });
			item.classList.toggle(doneClass, todoItem.done);
		});
		deleteButton.addEventListener('click', function () {
			oneDelete({ todoItem, element: item });
			// if (confirm('Вы уверены?')) {
			// 	item.remove();
			// }
		});

		// вкладываем кнопки в отделтный элемент, стобы они объединались в одине блок
		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		return item;

	}
	async function createTodoApp(container, title, owner) {
		// Вызываем поочередно три функции которые создали до этого 
		let todoAppTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let todoList = createTodoList();
		const handlers = {
			onDone({ todoItem }) {
				todoItem.done = !todoItem.done;
				fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
					method: 'PATCH',
					body: JSON.stringify({ done: todoItem.done }),
					headers: {
						'Content-Type': 'application/json',
					}
				});
			},
			oneDelete({ todoItem, element }) {
				if (!confirm('Вы уверены?')) {
					return
				}
				element.remove();
				fetch(`http://localhost:3000/api/todos/${todoItem.id}`, {
					method: 'DELETE',
				});
			},
		};

		// их результат размещаем внутри контейнера
		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);


		// Отправляем запрос на список всех дел
		const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`);
		const todoItemList = await response.json();

		// преобразуем тот список в ДОМ-дерево, для єтого проходися по каждому єлементу
		todoItemList.forEach(todoItem => {
			const todoItemElement = createTodoItemElement(todoItem, handlers);
			todoList.append(todoItemElement);
		});



		// браузер создает событие submit на форме по нажатии на Enter или на кнопку создания дела
		todoItemForm.form.addEventListener('submit', async e => {
			// эта строчка необходима, чтобы предотвратить стандартное дейтсвия браузерв
			// в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
			e.preventDefault();


			// игнорируем созданние элемeнта, если пользователь ничего не ввел в поле
			if (!todoItemForm.input.value) {
				return;
			}
			// код который осуществялет запрос на сервер
			const response = await fetch('http://localhost:3000/api/todos', {
				method: 'POST',
				body: JSON.stringify({
					name: todoItemForm.input.value.trim(),
					owner,
				}),
				headers: {
					'Content-Type': 'application/json',
				}
			});
			// получаем тело ответа для этого создаем константу и помещаем конструкцию
			//  в todoItem хранится информация о созданом деле так как нам ее возвращает 
			const todoItem = await response.json();


			// помещаем в переменную todoItem результат выполнения функции createTodoItem
			const todoItemElement = createTodoItemElement(todoItem, handlers);


			// создаем и добавляем в список новое дело с названием из поля для ввода
			todoList.append(todoItemElement);


			// (создаем и добавляем в список новое дело с названием из поля для ввода
			//  с помощью функции createTodoItem в нее мы передаем содержимое input тоесть value и берем из этого объекта item потому что в item хранится сам элемент 
			// todoList.append(createTodoItem(todoItemForm.input.value).item); этот код заменим чтобы было можно удалить или выполнить эемент списка(дела))

			// обнуляем значение в поле, чтобы не пришлось стрирать его вручную
			todoItemForm.input.value = '';
		});
	}
	window.createTodoApp = createTodoApp;
	// });
})();

// названение дела задается пользователю в форме поэтому его мы укажем как аргумент функции чтобы его можно было связать отправку формы с отправкой и названием элемента списка
