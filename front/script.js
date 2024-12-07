const BASE_URL = 'http://127.0.0.1:3000'
const inputEl = (document.getElementsByClassName('app__controls-input'))[0]
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]
const listEl = (document.getElementsByClassName('app__list'))[0]

let counter = 1
let data = []

// API
async function getItemsApi() {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET'
    })
    if (!res.ok) {
        console.log('something went wrong');
        return
    }
    data = await res.json()
}

async function createTaskApi(data) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
            text: data.text,
            isDone: data.isDone
        })
    })
    if (!res.ok) {
        console.log('something went wrong');
        return
    }
    return await res.json()
}

async function changeStatusApi(id) {

    const res = await fetch(`${BASE_URL}/tasks`, {
        method: 'PATCH',
        body: JSON.stringify({
            id
        })
    })
    if (!res.ok) {
        console.log('something went wrong');
        return
    }
    return await res.json()
}

// APP
async function init() {

    await getItemsApi()

    render()
}

function deleteById(id) {
    const idx = data.findIndex((i) => {
        return i.id === id
    })
    data.splice(idx, 1)
    syncData()
}

function syncData() {
    localStorage.setItem('data', JSON.stringify(data))
    render()
}

async function changeStatusById(id) {
    const item = await changeStatusApi(id)
    const idx = data.findIndex((i) => {
        return i.id === id
    })
}

function createTask(objectData) {
    const root = document.createElement('div')
    root.classList.add('app__list-item')

    if (objectData.isDone === true) {
        root.classList.add('app__list-item_done')
    }

    const input = document.createElement('input')
    input.classList.add('app__list-checkbox')

    if (objectData.isDone === true) {
        input.checked = true
    }

    input.type = 'checkbox'

    const txt = document.createElement('p')
    txt.classList.add('app__list-item-text')
    txt.innerText = objectData.text

    const btn = document.createElement('button')
    btn.classList.add('app__list-button')

    const img = document.createElement('img')
    img.src = './images/trash.svg'
    img.alt = 'trash'
    img.width = 30

    btn.appendChild(img)

    root.appendChild(input)
    root.appendChild(txt)
    root.appendChild(btn)

    btn.addEventListener('click', () => {
        deleteById(objectData.id)
    });

    root.addEventListener('click', async() => {
        await changeStatusById(objectData.id)
    })
    return root
}

btnEl.addEventListener('click', async () => {
    const textValue = inputEl.value
    const item = await createTaskApi({
        text: textValue,
        isDone: false
    })
    data.push(item)
     inputEl.value = ''
    render()
})

function render() {
    listEl.innerHTML = ''
    for (let item of data) {
        const tmpEl = createTask(item)
        listEl.appendChild(tmpEl)
    }
}

init()