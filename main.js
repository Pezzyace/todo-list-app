const listsContainer = document.querySelector('[data-lists]');
const newListInput = document.querySelector('#list-name-input');
const addNewListBtn = document.querySelector('#add-new-list-btn');
const deleteSelectedListBtn = document.querySelector('#delete-selected-list');
const listDisplayContainer = document.querySelector('#list-display-container');
const listTitle = document.querySelector('#list-title');
const tasksContainer = document.querySelector('#tasks');
const listCount = document.querySelector('#list-count');
const newTaskInput = document.getElementById('new-task-input');
const addNewTaskBtn = document.getElementById('add-task-btn');
const taskTemplate = document.getElementById('task-template')
const clearCompleteTaskBtn = document.getElementById('clear-complete-task-btn');


const LOCAL_STORAGE_LIST_KEY = 'tasks.list';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'tasks.selectedListId';


let lists= JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [ ];

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
})

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input'){
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(task => task.id ===e.target.id);
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount();
  }
})

clearCompleteTaskBtn.addEventListener('click', e => {
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
})

deleteSelectedListBtn.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
})

addNewListBtn.addEventListener("click", () => {
  const listName = newListInput.value;
  if(listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
})

addNewTaskBtn.addEventListener("click", () => {
  const taskName = newTaskInput.value;
  if(taskName == null || taskName === '') return;
  const task = createList(taskName);
  newListInput.value = null;
  
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
})

// THIS FUNCTION CREATES A NEW LIST NAME
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}

// THIS FUNCTION CREATES A NEW TASK 
function createTask(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

// THIS FUNCTION SAVES YOUR DATA TO LOCAL STORAGE SO IT DOESN'T CLEAR ON PAGE LOAD
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
};


//THIS FUNCTION CREATES AN ELEMENT 
function render() {
  clearElement(listsContainer);
  renderList(); 
  const selectedList = lists.find(list => list.id === selectedListId);
  if(selectedListId == null){
    listDisplayContainer.style.display = "none";
   } else {
    listDisplayContainer.style.display = '';
    listTitle.innerText = selectedList.name ;
    renderTaskCount(selectedList); 
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList){
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;

    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  })
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  listCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}


function renderList() {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.innerText = "+ " + list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    listsContainer.appendChild(listElement);
  })
}

//THIS FUNCTION REMOVES ANY OLDER CHILD ELEMENT IN THE ELEMENT
function clearElement(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
render();

function saveAndRender() {
  save();
  render();
}