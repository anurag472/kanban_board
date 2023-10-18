const modal = document.querySelector('.modal-cont')
const addbtn = document.querySelector('.add-btn')
const removebtn = document.querySelector('.remove-btn')
const mainContainer = document.querySelector('.main-cont')
const allPriorityColors = document.querySelectorAll('.priority-color')
const textAreaContainer = document.querySelector('.textarea-cont')


let currentPriorityColor = 'lightpink'
let isModalTaskOpen = false
let isDeleteModeActive = false
let isEditingCardContent = false
const colorsArray = ['lightpink', 'lightgreen', 'lightblue', 'black']

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


allPriorityColors.forEach((container) => {
    container.addEventListener('click', () => {
        allPriorityColors.forEach((container) => {
            container.classList.remove('active')
        })
        container.classList.add('active')
        currentPriorityColor = container.classList[0]
    })
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

function createTask(taskType, textValue, taskId) {
    const newDiv = document.createElement('div')
    newDiv.classList.add('ticket-cont')

    newDiv.innerHTML = `<div class="ticket-color ${taskType}"></div>
    <div class="ticket-id">Task Id - ${taskId}</div>
    <div class="task-area">${textValue}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>`

    handlePriorityChange(newDiv)
    handleLock(newDiv)
    handleRemoval(newDiv)
    mainContainer.appendChild(newDiv)
}

function handlePriorityChange(div){
    const coloredDiv = div.querySelector('.ticket-color')

    coloredDiv.addEventListener('click', event => {
        const currentColor = coloredDiv.classList[1]
        const index = colorsArray.findIndex(ele => ele === currentColor)
        const newIndex = (index+1)% colorsArray.length
        coloredDiv.classList.remove(currentColor)
        coloredDiv.classList.add(colorsArray[newIndex])
        console.log(index)
    })
}

function handleLock(div) {
    const lock = div.querySelector('.ticket-lock > i')
    const taskAreaElement = div.querySelector('.task-area')
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
        }
        isEditingCardContent = !isEditingCardContent
    })
}

function handleRemoval(divToBeRemoved) {
    divToBeRemoved.addEventListener('click', event => {
        if (isDeleteModeActive) {
            divToBeRemoved.remove()
        }
    })
}

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
