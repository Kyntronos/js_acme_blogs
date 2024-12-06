function createElemWithText(elementType = 'p', textContent = '', className = '') {
  const element = document.createElement(elementType);
  
  element.textContent = textContent;
  
  if(className){
    element.className = className;
  }
  
  return element;
}

function createSelectOptions(users) {
  if(!users){
    return undefined;
  }
  
  const arrayOptions = [];
  
  for(const user of users){
    const option = document.createElement('option');
    
    option.value = user.id;
    
    option.textContent = user.name;
    
    arrayOptions.push(option);
  }
  
  return arrayOptions;
}

function toggleCommentSection(postId) {
  if(!postId){
    return undefined;
  }
  
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  
  if(section){
    section.classList.toggle('hide');
  }
  
  return section;
}

function toggleCommentButton(postId) {
  if(!postId){
    return undefined;
  }
  
  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  
  if(!button){
    return null;
  }
  
  button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
  
  return button;
}

function deleteChildElements(parentElement) {
  if(!(parentElement instanceof HTMLElement)){
    return undefined;
  }
  
  let child = parentElement.lastElementChild;
  
  while(child){
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  
  return parentElement;
}

function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  
  if(buttons) {
    for(const button of buttons) {
      const postId = button.dataset.postId;
      
      if(postId){
        button.addEventListener('click', function(event){
          toggleComments(event, postId);
        });
      }
    }
  }
  
  return buttons;
}

function removeButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  
  for(const button of buttons) {
    const postId = button.dataset.id;
    
    if(postId){
      button.removeEventListener('click', addButtonListeners);
    }
  }
  
  return buttons;
}

function createComments(comments) {
  if(!comments){
    return undefined;
  }
  
  const fragment = document.createDocumentFragment();
  
  for(const comment of comments) {
    const article = document.createElement('article');
    
    const h3 = createElemWithText('h3', comment.name);
    
    const pBody = createElemWithText('p', comment.body);
    
    const pEmail = createElemWithText('p', `From: ${comment.email}`);
    
    article.appendChild(h3);
    article.appendChild(pBody);
    article.appendChild(pEmail);
    
    fragment.appendChild(article);
  }
  
  return fragment;
}

function populateSelectMenu(users) {
  if(!users){
    return undefined;
  }
  
  const selectMenu = document.getElementById('selectMenu');
  
  const options = createSelectOptions(users);
  
  if(options){
    for(const option of options) {
      selectMenu.appendChild(option);
    }
  }
  
  return selectMenu;
}

async function getUsers() {
  try{
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if(!response.ok){
      throw new Error(`Error fetching data: ${response.status}`);
    }
    
    const users = await response.json();
    
    return users;
    
  } catch(error) {
    console.error('Error in getUsers:', error);
    throw error;
  }
}

async function getUserPosts(userId) {
  if(!userId){
    return undefined;
  }
  
 try {
   const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
   
   if(!response.ok){
     throw new Error(`Error fetching posts: ${response.status}`);
   }
   
   const posts = await response.json();
   
   return posts;
 } catch(error) {
   console.error('Error in getUserPosts:', error);
   throw error;
 }
}

async function getUser(userId) {
  if(!userId){
    return undefined;
  }
  
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
    if(!response.ok){
      throw new Error(`Error fetching user: ${response.status}`);
    }
    
    const user = await response.json();
    
    return user;
  } catch (error) {
    console.error('Error in getUser:', error);
    throw error;
  }
}

async function getPostComments(postId) {
  if(!postId){
    return undefined;
  }
  
  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    
    if(!response.ok){
      throw new Error(`Error fetching comments: ${response.status}`);
    }
    
    const comments = await response.json();
    
    return comments;
  } catch (error) {
    console.error('Error in getPostComments:', error);
    throw error;
  }
}

async function displayComments(postId) {
  if(!postId){
    return undefined;
  }
  
  const section = document.createElement('section');
  
  section.dataset.postId = postId;
  
  section.classList.add('comments', 'hide');
  
  const comments = await getPostComments(postId);
  
  const fragment = createComments(comments);
  
  section.appendChild(fragment);
  
  return section;
}

async function createPosts(posts) {
  if(!posts){
    return undefined;
  }

  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const article = document.createElement('article');

    const h2 = createElemWithText('h2', post.title);

    const pBody = createElemWithText('p', post.body);

    const pId = createElemWithText('p', `Post ID: ${post.id}`);

    const author = await getUser(post.userId);

    const pAuthor = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);

    const pCatchphrase = createElemWithText('p', author.company.catchPhrase); 

    const button = document.createElement('button');
    button.textContent = 'Show Comments';

    button.dataset.postId = post.id;

    article.appendChild(h2);
    article.appendChild(pBody);
    article.appendChild(pId);
    article.appendChild(pAuthor);
    article.appendChild(pCatchphrase);
    article.appendChild(button);

    const section = await displayComments(post.id);

    article.appendChild(section);

    fragment.appendChild(article);
  }

  return fragment;
}


async function displayPosts(posts) {
  
  const mainElement = document.querySelector('main');
  
  const element = posts && posts.length > 0 ? await createPosts(posts) : createElemWithText('p','Select an Employee to display their posts.', 'default-text');
  
  
  mainElement.appendChild(element);
  
  return element;
}

function toggleComments(event, postId) {
  if(!postId){
    return undefined;
  }
  
  event.target.listener = true;
  
  const section = toggleCommentSection(postId);
  
  const button = toggleCommentButton(postId);
  
  return [section, button];
}

async function refreshPosts(posts) {
  if(!posts){
    return undefined;
  }

  const removeButtons = removeButtonListeners();
  
  const mainElement = document.querySelector('main')
  const main = deleteChildElements(mainElement);

  const fragment = await displayPosts(posts);

  const addButtons = addButtonListeners();

  return [removeButtons, main, fragment, addButtons];
}

async function selectMenuChangeEventHandler(event) {
  if(!event){
    return undefined;
  }

  const selectMenu = event.target;

  const userId = selectMenu?.value === 'Employees' || !selectMenu?.value ? 1 : selectMenu?.value;

  if(selectMenu !== undefined){
    selectMenu.disabled = true;
  }

  const posts = await getUserPosts(userId);

  const refreshPostsArray = await refreshPosts(posts);

  if(selectMenu){
    selectMenu.disabled = false;
  }

  return [userId, posts, refreshPostsArray];
}

async function initPage() {
  const users = await getUsers();
  
  const selectElement = populateSelectMenu(users);
  
  return [users, selectElement];
}

async function initApp() {
  const [users, selectElement] = await initPage();
  
  const selectMenu = document.getElementById('selectMenu');
  
  selectMenu.addEventListener('change', async(event) => {
    await selectMenuChangeEventHandler(event);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
