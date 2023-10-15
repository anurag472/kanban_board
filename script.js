const modal = document.querySelector('.modal-cont')
const addbtn = document.querySelector('.add-btn')
const removebtn = document.querySelector('.remove-btn')
const mainContainer = document.querySelector('.main-cont')

let isModalTaskOpen = false
addbtn.addEventListener('click', () => {
    if(isModalTaskOpen){
        modal.style.display = 'none'
        isModalTaskOpen = false
        mainContainer.style.opacity = '1'
    } else {
        modal.style.display = 'flex' 
        isModalTaskOpen = true
        mainContainer.style.opacity = '0.4'
    }
})

removebtn.addEventListener('click', () => {
    modal.style.display = 'none'
})