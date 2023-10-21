const modal = document.querySelector('.modal-cont')
const addbtn = document.querySelector('.add-btn')
const removebtn = document.querySelector('.remove-btn')
const mainContainer = document.querySelector('.main-cont')
const allPriorityColors = document.querySelectorAll('.priority-color')
const textAreaContainer = document.querySelector('.textarea-cont')
const allFiltercontainers = document.querySelectorAll('.color')


let currentPriorityColor = 'lightpink'
let isModalTaskOpen = false
let isDeleteModeActive = false
let isEditingCardContent = false
const colorsArray = ['lightpink', 'lightgreen', 'lightblue', 'black']
const ticketsArray = []
const LOCALSTORAGE_KEY = 'tickets'
const ticketsInStorage = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY))

if (ticketsInStorage) {
    ticketsInStorage.forEach(ticket => {
        createTask(ticket.type, ticket.value, ticket.id)
    })
}

addbtn.addEventListener('click', () => {
    if (isModalTaskOpen) {
        modal.style.display = 'none'
        isModalTaskOpen = false
        mainContainer.style.opacity = '1'
    } else {
        modal.style.display = 'flex'
        isModalTaskOpen = true
        mainContainer.style.opacity = '0.4'
    }
})

modal.addEventListener('keydown', (event) => {
    if (event.key == 'Shift') {
        let textAreaValue = textAreaContainer.value
        if (!textAreaValue.trim() || !currentPriorityColor) {
            alert("Please make sure you have added a task value and have selected a priority color")
            return
        }
        const id = shortid.generate()
        createTask(currentPriorityColor, textAreaValue, id)
        textAreaContainer.value = ""
        modal.style.display = 'none'
        mainContainer.style.opacity = 1
        isModalTaskOpen = false
        currentPriorityColor = null

    }
})

removebtn.addEventListener('click', () => {
    isDeleteModeActive = !isDeleteModeActive
    if (isDeleteModeActive) {
        alert('Delete mode is activated')
        removebtn.style.color = 'red'
    } else {
        alert('Delete mode has been de-activated')
        removebtn.style.color = 'white'
    }
})

allPriorityColors.forEach((container) => {
    container.addEventListener('click', () => {
        allPriorityColors.forEach((container) => {
            container.classList.remove('active')
        })
        container.classList.add('active')
        currentPriorityColor = container.classList[0]
    })
})

allFiltercontainers.forEach(container => {
    container.addEventListener('click', event => {
        const filterColor = container.classList[0]

        const filteredTasks = ticketsArray.filter(ele => {
            return filterColor == ele.type
        })
        const allTicketsDiv = document.querySelectorAll('.ticket-cont')
        allTicketsDiv.forEach(ticket => {
            ticket.remove()
        })
        filteredTasks.forEach(filteredTask => {
            createTask(filteredTask.type, filteredTask.value, filteredTask.id)
        })


    })
    container.addEventListener('dblclick', event => {
        const allTicketsDiv = document.querySelectorAll('.ticket-cont')
        allTicketsDiv.forEach(ticket => {
            ticket.remove()
        })
        ticketsArray.forEach(filteredTask => {
            createTask(filteredTask.type, filteredTask.value, filteredTask.id)
        })
    })
})

function createTask(taskType, textValue, taskId) {
    const newDiv = document.createElement('div')
    newDiv.classList.add('ticket-cont')

    newDiv.innerHTML = `<div class="ticket-color ${taskType}"></div>
    <div class="ticket-id">Task Id - ${taskId}</div>
    <div class="task-area">${textValue}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`

    const foundTicketIndex = ticketsArray.findIndex(ele => {
        return ele.id == taskId
    })
    if (foundTicketIndex == -1) {
        const ticketObject = {
            id: taskId,
            type: taskType,
            value: textValue
        }
        ticketsArray.push(ticketObject)
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ticketsArray))
    }

    handlePriorityChange(newDiv, taskId)
    handleLock(newDiv, taskId)
    handleRemoval(newDiv, taskId)
    mainContainer.appendChild(newDiv)
}

function handlePriorityChange(div, ticketId) {
    const coloredDiv = div.querySelector('.ticket-color')

    const idx = findTicketIdx(ticketId)

    coloredDiv.addEventListener('click', event => {
        const currentColor = coloredDiv.classList[1]
        const index = colorsArray.findIndex(ele => ele === currentColor)
        const newIndex = (index + 1) % colorsArray.length
        coloredDiv.classList.remove(currentColor)
        coloredDiv.classList.add(colorsArray[newIndex])
        ticketsArray[idx].type = colorsArray[newIndex]
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ticketsArray))
    })
}

function findTicketIdx(id) {
    return ticketsArray.findIndex(ele => {
        return ele.id == id
    })
}

function handleLock(div, ticketId) {
    const lock = div.querySelector('.ticket-lock > i')
    const taskAreaElement = div.querySelector('.task-area')
    const idx = findTicketIdx(ticketId)
    lock.addEventListener('click', event => {
        if (!isEditingCardContent) {
            lock.classList.remove('fa-lock')
            lock.classList.add('fa-lock-open')
            taskAreaElement.setAttribute('contenteditable', 'true')
            taskAreaElement.focus()
        } else {
            lock.classList.add('fa-lock')
            lock.classList.remove('fa-lock-open')
            taskAreaElement.setAttribute('contenteditable', 'false')
            ticketsArray[idx].value = taskAreaElement.innerText
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ticketsArray))
        }
        isEditingCardContent = !isEditingCardContent
    })
}

function handleRemoval(divToBeRemoved, ticketId) {
    const idx = findTicketIdx(ticketId)
    divToBeRemoved.addEventListener('click', event => {
        if (isDeleteModeActive) {
            divToBeRemoved.remove()
            ticketsArray.splice(idx, 1)
            localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(ticketsArray))
        }
    })
}