async function lockedProfile() {

    let mainElement = document.getElementById('main');

    let url = 'http://localhost:3030/jsonstore/advanced/profiles';

    async function getUsersInfo() {
        let response = await fetch(url);
        let data = await response.json();
        return data  // { {}, {}.. } Object of objects
    }
    
    let data = await getUsersInfo();
    
    mainElement.firstElementChild.remove()
    // Render the cards
    Object.values(data).forEach((value, i) => {
        let profileDiv = createProfileDiv(value, i);
        mainElement.appendChild(profileDiv);
    });


    function createProfileDiv(data, i) {
        i++
        
        let profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');
        profileDiv.innerHTML = `
        <img src="/04.Locked-Profile/iconProfile2.png" class="userIcon" />
        <label>Lock</label>
        <input type="radio" name="user${i}Locked" value="lock" checked="checked">
        <label>Unlock</label>
        <input type="radio" name="user${i}Locked" value="unlock"><br>
        <hr>
        <label>Username</label>
        <input type="text" name="user${i}Username" value="${data.username}" disabled readonly />
        <div class="user${i}HiddenFields" style="display:none;">
            <hr>
            <label>Email:</label>
            <input type="email" name="user${i}Email" value="${data.email}" disabled readonly />
            <label>Age:</label>
            <input type="text" name="user${i}Age" value="${data.age}" disabled readonly />
        </div>

        <button>Show more</button>
    `;

    // add event listners
    profileDiv.querySelector('button').addEventListener('click', showMore);
    let radioBtns = profileDiv.querySelectorAll('input[type="radio"]')
    radioBtns.forEach(btn => {
        btn.addEventListener('change', handleRadioBtns);
    });

    return profileDiv
    }

    function handleRadioBtns(e) {
        let mainDivContainer = e.currentTarget.parentElement;
        let radioBtns = mainDivContainer.querySelectorAll('input[type="radio"]');
        radioBtns.forEach(el => {
            el.hasAttribute('checked') ? 
            el.removeAttribute('checked') : 
            el.setAttribute('checked', 'checked')
        });
    }

    function showMore(e) {
        let btn = e.currentTarget;
        let mainDivContainer = btn.parentElement;
        let hiddenFieldsDiv = mainDivContainer.querySelector('div');
        
        let lockRadioBtn = mainDivContainer.querySelector('input[value="lock"]');
        let unlockRadioBtn = mainDivContainer.querySelector('input[value="unlock"]');

        let locked = lockRadioBtn.hasAttribute('checked') && !unlockRadioBtn.hasAttribute('unlockRadioBtn')
        
        if (locked) {
            console.warn("The profile is locked");
            return
        }

        switch (hiddenFieldsDiv.style.display) {
            case "":        // if visible
            hiddenFieldsDiv.style.display = 'none'
            btn.textContent = 'Show more';
            break;
            case "none":    // if not visible
            hiddenFieldsDiv.style.display = '';
            btn.textContent = 'Show less';
            break;

            default: console.error('edge case hit')
            break;
        }
        
    }
}