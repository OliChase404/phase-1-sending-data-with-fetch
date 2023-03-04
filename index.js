


const BASE_URL = "http://localhost:3000"
const div = document.getElementById('div')

function submitData(name, email){
    return fetch(BASE_URL + '/users', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept' : 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
        })
    })
    .then(resp => resp.json())
    .then(obj => {
        const newId = document.createElement('p')
        newId.textContent = (obj.id)
        div.appendChild(newId)
    })
    .catch(error => {
        const errorMessage = error.message
        const newError = document.createElement('p')
        newError.textContent = errorMessage
        div.appendChild(newError)
    })
}


// submitData('Steve', 'steve@steve.com')


