const dayList = document.getElementById('calendar')
const tasksList = document.querySelector('.tasks-list')

const [prevBtn, nextBtn] = dayList.nextElementSibling.children
let dates
let tasks = [{
  date: "2023-07-03",
  description: "Зробити зачистку", endtime: "15:20", goal: "goal", starttime: "15:00", title: "Зробити зачистку"
}, {
  date: "2023-07-03",
  description: "Знайти кота та почистити йому вуха, щоб кращий був слух", endtime: "14:00", goal: "goal", starttime: "13:00", title: "Де мій кіт ?"
},{
  date: "2023-07-03",
  description: "Купити їжи", endtime: "16:20", goal: "goal", starttime: "16:00", title: "Купити їжи"
}, {
  date: "2023-07-03",
  description: "Помити посуд", endtime: "19:00", goal: "goal", starttime: "18:00", title: "Помити посуд"
}, {
  date: "2023-07-04",
  description: "Поїграти", endtime: "15:19", goal: "goal", starttime: "16:16", title: "Поїграти"
}]

dayList.innerHTML = ''
tasksList.innerHTML = ''
showCalendar()
showDayTasks()

dayList.onclick = e => {
  const li = e.target.closest('li')

  if (!li) return

  dayList.querySelector('.active').classList.remove('active')

  li.classList.add('active')
  clearDayTasks()
  showDayTasks(li.dataset.date)
}

prevBtn.onclick = showPrevWeek
nextBtn.onclick = showNextWeek

async function showPrevWeek() {
  await slideRight(...dayList.children)

  const date = new Date()
  const monday = new Date(dates[0].setDate(dates[0].getDate() - 7))

  dates = getWeekDates(monday)

  const dayItems = dates.map(buildDayItem)
  const current = dayItems.find(
    li => li.dataset.date == date.toISOString().slice(0, 10)
  )

  dayList.replaceChildren(...dayItems)
  if (current) current.classList.add('active', 'today')
  else dayItems.at(-1).classList.add('active')
}

async function showNextWeek() {
  await slideLeft(...dayList.children)

  const date = new Date()
  const monday = new Date(dates[0].setDate(dates[0].getDate() + 7))

  dates = getWeekDates(monday)

  const dayItems = dates.map(buildDayItem)
  const current = dayItems.find(
    li => li.dataset.date == date.toISOString().slice(0, 10)
  )

  dayList.replaceChildren(...dayItems)
  if (current) current.classList.add('active', 'today')
  else dayItems[0].classList.add('active')
}

function slideLeft(...elements) {
  return Promise.all(elements.map(el => new Promise(resolve => {
    el.classList.add('left')
    el.ontransitionend = resolve
  })))
}

function slideRight(...elements) {
  return Promise.all(elements.map(el => new Promise(resolve => {
    el.classList.add('right')
    el.ontransitionend = resolve
  })))
}

function showCalendar() {
  const date = new Date()
  const monday = getMonday(date)

  dates = getWeekDates(monday)

  const dayItems = dates.map(buildDayItem)
  const current = dayItems.find(
    li => li.dataset.date == date.toISOString().slice(0, 10)
  )

  dayList.append(...dayItems)
  current.classList.add('active', 'today')
  showDayTasks(current.dataset.date)
}

function getMonday(date) {
  const dayOfWeek = date.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(date)

  monday.setDate(date.getDate() - daysFromMonday)

  return monday
}

function getWeekDates(monday) {
  const dates = []
  const monDate = monday.getDate()

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)

    date.setDate(monDate + i)
    dates.push(date)
  }

  return dates
}

function buildDayItem(date) {
  const li = document.createElement('li')
  const p = document.createElement('p')
  const b = document.createElement('b')

  li.classList.add('day')
  p.classList.add('weekday')
  b.classList.add('date')

  li.dataset.date = date.toISOString().slice(0, 10)
  p.innerText = date.toLocaleString('en', { weekday: 'short' })
  b.innerText = date.getDate()

  li.append(p, b)

  return li
}



const addTask = document.querySelector('.btn-add')
const cancelBtn = document.querySelector('.form-cancel')

addTask.onclick = openEditor
cancelBtn.onclick = closeEditor
form.onsubmit = saveTask

function openEditor() {
  menu.classList.add('open')
  form.date.value = dayList.querySelector('.day.active').dataset.date
  addTask.hidden = true
}

function closeEditor() {
  menu.classList.remove('open')
  addTask.hidden = false
}

function saveTask() {
  const task = Object.fromEntries(new FormData(form))
  tasks.push(task)
  closeEditor()
  form.reset()
  addTask.hidden = false
}

tasksList.onclick = e => {
  const li = e.target.closest('li')

  if (!li) return

  li.classList.toggle('active')
}

tasksList.ondblclick = e => {
  const li = e.target.closest('li')

  if (!li) return

  li.classList.toggle('done')
}


function showDayTasks(date) {
  const dayTasks = tasks.filter(task => task.date === date)
  dayTasks.sort((a, b) => a.starttime.localeCompare(b.starttime)); 
  for (const dayTask of dayTasks) {
    buildTask(dayTask)

  }
}

function buildTask(task) {
  const li = document.createElement("li");
  li.classList.add('task-item')
  li.innerHTML = `<span class="task-time-left">${task.starttime}</span>
  <div class="task-information">
    <span class="task-title">${task.title}</span>
    <span class="task-description">${task.description}</span>
    <span class="task-time">${task.starttime}-${task.endtime}</span>
  </div>`
  tasksList.append(li)
}

function clearDayTasks(){
  tasksList.innerHTML = ''
}
