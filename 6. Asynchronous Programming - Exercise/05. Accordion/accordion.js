async function solution() {
    let endpoints = {
        getAllArticles: 'http://localhost:3030/jsonstore/advanced/articles/list',
        getCurrentArticle: 'http://localhost:3030/jsonstore/advanced/articles/details/'
    }

    let mainElement = document.getElementById('main');

    let allArticles = await getAllArticles()
    

    async function getAllArticles() {
        let responce = await fetch(endpoints.getAllArticles);
        let data = await responce.json();
        return data
    }

    allArticles.forEach(article => {
        let {_id, title} = article

        let div = createDiv(_id, title);
        mainElement.appendChild(div);
        
    });
    
    function createDiv(_id, title) {
        
        let div = document.createElement('div');
        div.classList.add('accordion');
        div.innerHTML = `
            <div class="head">
                <span>${title}</span>
                <button class="button" id="${_id}">More</button>
            </div>
            <div class="extra">
                <p>Scalable Vector Graphics .....</p>
            </div>
        `;

        div.querySelector('button')
        .addEventListener('click', function (e) {getMoreInfo(_id, e)});
        return div
    }

    async function getMoreInfo(_id, e) {
        let currentDiv = document.getElementById(_id).parentElement.parentElement;
        let button = currentDiv.querySelector('button')
        let extraDiv = currentDiv.querySelector('.extra');

        let url = endpoints.getCurrentArticle + _id;

        let responce = await fetch(url);
        let data = await responce.json()
        
        extraDiv.firstElementChild.textContent = data.content;
        switch (button.textContent) {
            case 'More':
                extraDiv.style.display = 'inline';
                button.textContent = 'Less'
            break;

            case 'Less':
                extraDiv.style.display = 'none';
                button.textContent = 'More'
            break;
        }
    }
}

solution()