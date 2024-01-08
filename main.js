const listsContainer = document.querySelector('[data-lists]');
const newListInput = document.querySelector('#list-name-input');
const addNewListBtn = document.querySelector('#add-new-list-btn');
const deleteSelectedList = document.querySelector('#delete-selected-list');

const LOCAL_STORAGE_LIST_KEY = 'tasks.list';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'tasks.selectedListId';

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li'){
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
})

let lists= JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [ ];

let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

deleteSelectedList.addEventListener('click', e => {
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


// THIS FUNCTION CREATES A NEW LIST NAME
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] }
}


// THIS FUNCTION SAVES YOUR DATA TO LOCAL STORAGE SO IT DOESN'T CLEAR ON PAGE LOAD
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
};


//THIS FUNCTION CREATES AN ELEMENT 
function render() {
  clearElement(listsContainer);
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