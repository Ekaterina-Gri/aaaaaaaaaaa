// import { getItems } from "./api.js"

const BASE_URL = 'http://127.0.0.1:5500'
const inputEl = (document.getElementsByClassName('app__controls-input'))[0]
const btnEl = (document.getElementsByClassName('app__controls-button'))[0]
const listEl = (document.getElementsByClassName('app__list'))[0]

let counter = 1
let data = []
// let isLoading = true

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
        // const items = await data.json()
        // console.log(items);
}

async function createTaskApi(data) {
    const res = await fetch(`${BASE_URL}/tasks/edit`, {
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
    if (method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        res.end();
      }
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
    // const tmp = localStorage.getItem('data')
    // if (tmp !== null) {
    //     data = JSON.parse(tmp)
    // }
    // data.forEach((item) => {
    //     if (item.id > counter) {
    //         counter = item.id
    //     }
    // })
    // if (counter >1) {
    //     counter++
    // }
    await getItemsApi()
    // console.log(data);
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
    // const item = data.find((i) => {
    //     return i.id === id
    // })
    // item.isDone = !item.isDone
    // data[idx] = item
    // render()
    // syncData()
}

// function loadData() {
//     const savedData = localStorage.getItem('tasks')
//     return savedData ? JSON.parse(savedData) : []
// }

// const data = loadData()

// data.forEach((item) => {
//     if (item.id >= counter) {
//         counter = item.id + 1
//     }
// })

// function saveData() {
//     localStorage.setItem('tasks', JSON.stringify(data))
// }

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

// function deleteTask(id) {
//     const index = data.findIndex(item => item.id === id)
//     if (index !== -1) {
//         data.splice(index, 1)
//         saveData()
//         render()
//     }
// }

// function toggleTaskState(id) {
//     const task = data.find(item => item.id === id)
//     if(task) {
//         task.isDone = !task.isDone
//         saveData()
//         render()
//     }
// }

btnEl.addEventListener('click', async () => {
    const textValue = inputEl.value
    const item = await createTaskApi({
        text: textValue,
        isDone: false
    })
    data.push(item)
    // data.push({
    //     id: counter++,
    //     text: textValue,
    //     isDone: false
    // })
    // syncData

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