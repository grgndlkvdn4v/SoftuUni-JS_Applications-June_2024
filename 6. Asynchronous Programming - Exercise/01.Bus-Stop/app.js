// Note: The service will respond with valid data to IDs 1287, 1308, 1327 and 2334.

function getInfo() {
    let stopIDinputElem = document.getElementById('stopId');
    let stopNameElem = document.getElementById('stopName');
    let busStopsULelem = document.getElementById('buses');

    onSubmit();
    
    async function onSubmit(e) {
        
        let stopID = stopIDinputElem.value;
        let baseURL = 'http://localhost:3030/jsonstore/bus/businfo/';

        try {
            let fullURL = baseURL + stopID;
            let response = await fetch(fullURL);
            let data = await response.json();
            
            renderInfo(data);
        } catch (error) {
            console.error('Error')
        }
    }
    
    function renderInfo(data) {
        clearFields()

        stopNameElem.textContent = data.name

        Object.entries(data.buses).forEach(arr => {
            [busId, time] = arr;

            let liElem = document.createElement('li');
            liElem.textContent = `Bus ${busId} arrives in ${time} minutes`;

            busStopsULelem.appendChild(liElem)
        });
    }

    function clearFields() {
        stopIDinputElem.value = '';
        stopNameElem.textContent = '';
        busStopsULelem.innerHTML = '';
    }
}
