function attachEvents() {
    baseURL = 'http://localhost:3030/';
    let relativePaths = {
        posts: 'jsonstore/blog/posts/',
        comments: 'jsonstore/blog/comments/'
    }
    let endpoints = {
        posts: baseURL + relativePaths.posts,
        comments: baseURL + relativePaths.comments
    }

    let loadPostsBtn = document.getElementById('btnLoadPosts');
    let selectPostsDropdown = document.getElementById('posts');
    let viewPostsBtn = document.getElementById('btnViewPost');
    
    loadPostsBtn.addEventListener('click', loadPosts)
    viewPostsBtn.addEventListener('click', viewPosts)
    

    async function loadPosts() {
        let responce = await fetch(endpoints.posts);
        let data = await responce.json();
        try {
            renderPosts(data)
            loadPostsBtn.setAttribute('disabled', 'disabled')
        } catch (error) {
            // alert(error);
            throw new Error(error);
        }
    }

    async function getAllComments() {
        let response = await fetch(endpoints.comments)
        let data = response.json(response)
        return data
    }
    
    async function viewPosts() {
        let postID = selectPostsDropdown.value;
        
        let allComments;

        try {
            allComments = await getAllComments()
        } catch (error) {
            throw new Error(error);
        }

        let commentsArr = [];

        Object.values(allComments).forEach(obj => {
            if (obj.postId === postID) {
                commentsArr.push(obj)
            }
        });
        
        renderPostDetails();
        renderComments(commentsArr);
    }
    
    async function renderPosts(data) {
        Object.values(data).forEach(obj => {
            let option = document.createElement('option');

            option.setAttribute('value', obj.id);
            option.textContent = obj.title;

            selectPostsDropdown.appendChild(option)
        });
    }

    async function renderPostDetails() {
        let titleElem = document.querySelector('h1#post-title')
        let textElem = document.querySelector('p#post-body')

        let id = selectPostsDropdown.value
        let url = endpoints.posts + id
        
        let response = await fetch(url)
        let data = await response.json(response)
        
        titleElem.textContent = data.title
        textElem.textContent = data.body
    }

    function renderComments(commentsArr) {
        let commentsUL = document.querySelector('ul#post-comments')
        commentsUL.innerHTML = ''

        commentsArr.forEach(obj => {
            let li = document.createElement('li');
            li.setAttribute('id', obj.id);
            li.textContent = obj.text;

            commentsUL.appendChild(li)
        });
    }
    
}

attachEvents();