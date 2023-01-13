//宣告
const today = new Date() //今天
let year = today.getFullYear() //年份
let month = today.getMonth() //月份 1月是0

let currentIndex; //現在點擊的li的索引

//DOM
const yearMonthText = document.querySelector('.year-month')
const dateArea = document.querySelector('tbody')

const addModal = document.querySelector('#add-modal')
const editModal = document.querySelector('#edit-modal')

const addDateInput = document.querySelector('#add-date')
const addValueInput = document.querySelector('#add-value')
const editDateInput = document.querySelector('#edit-date')
const editValueInput = document.querySelector('#edit-value')
////////////////////////////////////////////////////////////
let kvImg = document.getElementById('kvImg')
let kvArray = [
    "./catimg/01.jpg" ,
    "./catimg/02.jpg" ,
    "./catimg/03.jpg" ,
    "./catimg/04.jpg" ,
    "./catimg/05.jpg" ,
    "./catimg/06.jpg" ,
    "./catimg/07.png" ,
    "./catimg/08.jpg" ,
    "./catimg/09.jpg" ,
    "./catimg/10.jpg" ,
    "./catimg/11.png" ,
    "./catimg/12.jpg" 
]

//function
function renderDate() {
    dateArea.innerHTML = ""
    yearMonthText.innerText = `${year}年  ${month + 1}月`

    //這個月的第一天是禮拜幾?
    let firstDay = new Date(year, month, 1).getDay()
    //這個月有幾天?
    let dayOfMonth = new Date(year, month + 1, 0).getDate()

    //算出那個月有幾個tr (row= 要渲染的tr) 
    //無條件進位 (4月=> 36/7 = 5.多 => 6列)
    let rows = Math.ceil((dayOfMonth + firstDay) / 7)

    //預設值, 從每個月一號開始渲染
    let day = 1;

    for (let row = 0; row < rows; row++) {
        let tr = document.createElement('tr')

        for (let col = 0; col < 7; col++) {
            let td = document.createElement('td')
            td.classList.add('square')
            
            //由第一列狀況來判斷是上月還是下月
            if (row == 0 && col < firstDay) { 
                //上個月的格子
                td.innerText =''
            } else {
                if (day <= dayOfMonth) {
                    //這個月的格子
                    td.innerText = day
                    let d = day //迴圈跑完day(全域變數)會顯示36,所以這邊再宣告一個d(區域變數)
                    
                    //如果已有輸入行程的話
                    if(localStorage.getItem(`${year}-${month+1}-${day}`) != null){
                        let ul = document.createElement('ul')
                        ul.setAttribute("style", "list-style:none")

                        let todoList = JSON.parse(localStorage.getItem(`${year}-${month+1}-${day}`))
                        
                        todoList.forEach((item, index) => {
                            let li = document.createElement('li')
                            li.setAttribute("style", "list-style:none")
                            li.innerText = item.title

                            //click li 會跳出editModal
                            li.onclick = function(e){
                                editDateInput.value = `${year}-${month+1}-${d}`
                                editValueInput.value = item.title

                                currentIndex = index;

                                bootstrap.Modal.getOrCreateInstance(editModal).show();
                                e.stopPropagation() //阻止li事件冒泡
                            }
                            ul.appendChild(li)
                        })
                        td.appendChild(ul)
                    }
                    td.onclick = function(){
                        addDateInput.value = `${year} - ${month + 1} - ${d}`
                        // addDateInput.value = `${year} - ${month+1} - ${td.childNodes[0].data}`
                        bootstrap.Modal.getOrCreateInstance(addModal).show();
                    }

                } else {
                    //下個月的格子
                    td.innerText = ''
                }
                day++
            }
            tr.appendChild(td)
        }
        dateArea.appendChild(tr)
    }
    kvImg.src = kvArray[month]
}

//換下一個月
function nextMonth() {
    month++
    if (month == 12) {
        year++
        month = 0 //回到1月
    }
    renderDate()
}

//換上一個月
function previousMonth() {
    month--
    if (month == -1) {
        year--
        month = 11 //回到12月
    }
    renderDate()
}

//新增行程
function addTodoItem(){
    let date = addDateInput.value //key是date
    let todoItem = addValueInput.value

    let todoObj = {
        title: todoItem
    }

    let todoList = []

    //如果沒有行程
    if(localStorage.getItem(date) == null){
        todoList.push(todoObj)
    } else { 
        //原本有行程
        todoList = JSON.parse(localStorage.getItem(date)) //轉回物件
        todoList.push(todoObj)
    }

    localStorage.setItem(date, JSON.stringify(todoList)) //轉成字串存取到localStorage
    bootstrap.Modal.getOrCreateInstance(addModal).hide() //新增完成後關掉modal
    renderDate()

    //設計資料結構
    // let todoArr = [
    //     {
    //         title: '倒垃圾',
    //         startTime: '18:00',
    //         endTime:'20:00'
    //     }
}

//修改行程
function editTodoItem(){
    let date = editDateInput.value //key是date
    let todoItem = editValueInput.value

    let todoList = JSON.parse(localStorage.getItem(date))
    // console.log(todoList)
    // console.log(currentIndex)

    todoList[currentIndex] = { //用索引取代掉新的物件
        title: todoItem
    }
    localStorage.setItem(date,JSON.stringify(todoList)) //用新的資料覆蓋重新存一遍

    bootstrap.Modal.getOrCreateInstance(editModal).hide()
    
    renderDate()
}

//移除行程
function deleteTodoItem(){
    let date = editDateInput.value
    
    let todoList = JSON.parse(localStorage.getItem(date))
    todoList.splice(currentIndex, 1) // .splice() 從陣列裡面刪除資料 (1筆)

    localStorage.setItem(date,JSON.stringify(todoList))

    bootstrap.Modal.getOrCreateInstance(editModal).hide()

    renderDate()
}

//window.onload
window.onload = function () { 
    renderDate()
}

// let index = 0

// //前一張圖
// function preImg(){
//     index--;
//     if(index < 0 ) {
//         index = kvArray.length - 1
//     }
//     kvImg.src = kvArray[index]
// }
// //下一張圖
// function nextImg(){
//     index++;
//     if(index > kvArray.length - 1) {
//         index=0;
//     }
//     kvImg.src = kvArray[index]
// }



