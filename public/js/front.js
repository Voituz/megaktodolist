const todoInput = document.querySelector('.new-todo');
const todoList = document.querySelector('ul.todo-list');
const counter = document.querySelector('span.todo-count strong');
const allTodosBtn = document.querySelector('ul.filters li a#all');
const activeTodosBtn = document.querySelector('ul.filters li a#active');
const completedTodosBtn = document.querySelector('ul.filters li a#completed');
const filterBtns = document.querySelectorAll('ul.filters li a');

let todosArray = [];

const newLiContent = (text) => `
    <div class="view">
        <input class="toggle" type="checkbox">
        <label>${text}</label>
        <button class="destroy"></button>
    </div>
    <input class="edit" value="">
  `;

const sendData = async (data) => {
  await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

const createNewLi = (liContent) => {
  const newLi = document.createElement('li');
  const todoData = {
    todo: liContent,
    isDone: false,
  };

  newLi.innerHTML = newLiContent(liContent);
  todoList.appendChild(newLi);
  todoInput.value = '';
  todoData.todo = liContent;
  return todoData;
};

const checkTodo = (e) => {
  if (e.target.classList.value === 'toggle') {
    const id = e.target.closest('li').childNodes[1].childNodes[3].textContent;
    const li = e.target.closest('li');
    li.classList.toggle('completed');
    todosArray.forEach((el) => {
      if (el.todo === id) {
        if (el.isDone === true) {
          el.isDone = false;
          sendData(todosArray);
        } else {
          el.isDone = true;
          sendData(todosArray);
        }
      }
    });
  }
};

const checkTodoOnRender = () => {
  const checkboxes = document.querySelectorAll('ul.todo-list li div input.toggle');
  checkboxes.forEach((checkbox) => {
    const boxLi = checkbox.closest('li');
    const id = boxLi.childNodes[1].childNodes[3].textContent;
    todosArray.forEach((el) => {
      if (el.todo === id) {
        if (el.isDone) {
          boxLi.classList.add('completed');
          checkbox.checked = true;
        } else {
          boxLi.classList.remove('completed');
        }
      }
    });
  });
};

const deleteTodo = (e) => {
  if (e.target.classList.value === 'destroy') {
    const li = e.target.closest('li');
    const label = e.target.previousSibling.previousSibling.textContent;
    todoList.removeChild(li);

    todosArray = todosArray.filter((el) => el.todo !== label);
    sendData(todosArray);
    counter.textContent = `${todosArray.length}`;
  }
};

const editTodo = (e) => {
  const li = e.target.parentNode.parentNode;
  if (li.childNodes[1].classList.value === 'view') {
    const input = li.childNodes[3];
    const label = li.childNodes[1].childNodes[3];
    input.value = label.textContent;
    input.style.display = 'block';
    input.focus();
    todosArray.forEach((el) => {
      if (el.todo === label.textContent) {
        input.addEventListener('keypress', (ev) => {
          if (ev.key === 'Enter') {
            label.textContent = input.value;
            input.style.display = 'none';
            el.todo = label.textContent;
            sendData(todosArray);
          }
        });
      }
    });
  }
};

const createTodo = (e) => {
  if (e.key === 'Enter') {
    if (todoInput.value === '') {
      console.log('enter any text');
      return;
    }
    const existingTodos = todosArray.map((el) => el.todo);
    if (existingTodos.includes(todoInput.value)) {
      console.log('this task already exist');
      todoInput.value = '';
      return;
    }

    const newLi = createNewLi(todoInput.value);
    todosArray.push(newLi);

    sendData(todosArray);
    counter.textContent = `${todosArray.length}`;
  }
};

const renderTodos = async (path) => {
  const res = await fetch(path);
  const data = JSON.parse(await res.json());
  data.forEach((todo) => {
    todosArray.push(todo);
  });
  counter.textContent = `${todosArray.length}`;
  todosArray.forEach((todo) => {
    createNewLi(todo.todo);
  });
  checkTodoOnRender();

  todoList.addEventListener('click', checkTodo);

  todoList.addEventListener('click', deleteTodo);

  todoList.addEventListener('dblclick', editTodo);

  todoInput.addEventListener('keypress', createTodo);
};

renderTodos('/all');

function changeFilter(btn, path) {
  filterBtns.forEach((el) => {
    el.classList.remove('selected');
  });
  btn.classList.add('selected');
  todosArray = [];
  todoList.textContent = '';
  renderTodos(path);
}

allTodosBtn.addEventListener('click', () => {
  changeFilter(allTodosBtn, '/all');
});

activeTodosBtn.addEventListener('click', () => {
  changeFilter(activeTodosBtn, '/active');
});

completedTodosBtn.addEventListener('click', () => {
  changeFilter(completedTodosBtn, '/completed');
});
