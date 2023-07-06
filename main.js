const dayList = document.getElementById('calendar')
const tasksList = document.querySelector('.tasks-list')
const pages = document.querySelectorAll('.pages')

const [prevBtn, nextBtn] = dayList.nextElementSibling.children
let dates, second, timerId
let nextId = 0
let tasks = [{
  id: ++nextId,
  date: "2023-07-05",
  description: "Зробити зачистку", endtime: "15:20", goal: "common", starttime: "15:00", title: "Зробити зачистку", done: false
}, {
  id: ++nextId,
  date: "2023-07-05",
  description: "Знайти кота та почистити йому вуха, щоб кращий був слух", endtime: "14:00", goal: "body", starttime: "13:00", title: "Де мій кіт ?", done: true
}, {
  id: ++nextId,
  date: "2023-07-05",
  description: "Купити їжи", endtime: "16:20", goal: "work", starttime: "16:00", title: "Купити їжи", done: true
}, {
  id: ++nextId,
  date: "2023-07-05",
  description: "Помити посуд", endtime: "19:00", goal: "goal", starttime: "18:00", title: "Помити посуд", done: true
}, {
  id: ++nextId,
  date: "2023-07-06",
  description: "Поїграти", endtime: "15:19", goal: "common", starttime: "16:16", title: "Поїграти", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Зробити зачистку", endtime: "15:20", goal: "body", starttime: "15:00", title: "Зробити зачистку", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Знайти кота та почистити йому вуха, щоб кращий був слух", endtime: "14:00", goal: "body", starttime: "13:00", title: "Де мій кіт ?", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Купити їжи", endtime: "16:20", goal: "work", starttime: "16:00", title: "Купити їжи", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Помити посуд", endtime: "19:00", goal: "goal", starttime: "18:00", title: "Помити посуд", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Зробити зачистку", endtime: "15:20", goal: "common", starttime: "15:00", title: "Зробити зачистку", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Знайти кота та почистити йому вуха, щоб кращий був слух", endtime: "14:00", goal: "body", starttime: "13:00", title: "Де мій кіт ?", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Купити їжи", endtime: "16:20", goal: "work", starttime: "16:00", title: "Купити їжи", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Помити посуд", endtime: "19:00", goal: "goal", starttime: "18:00", title: "Помити посуд", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Зробити зачистку", endtime: "15:20", goal: "social", starttime: "15:00", title: "Зробити зачистку", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Знайти кота та почистити йому вуха, щоб кращий був слух", endtime: "14:00", goal: "social", starttime: "13:00", title: "Де мій кіт ?", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Купити їжи", endtime: "16:20", goal: "work", starttime: "16:00", title: "Купити їжи", done: false
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Помити посуд", endtime: "19:00", goal: "goal", starttime: "18:00", title: "Помити посуд", done: true
}, {
  id: ++nextId,
  date: "2023-07-09",
  description: "Поїграти", endtime: "15:19", goal: "goal", starttime: "16:16", title: "Поїграти", done: false
}]

extendDate()
dayList.innerHTML = ''
clearDayTasks()
showCalendar()
showDayTasks()

dayList.onclick = e => {
  const li = e.target.closest('li')

  if (!li) return

  dayList.querySelector('.active').classList.remove('active')

  li.classList.add('active')
  clearDayTasks()
  showDayTasks(li.dataset.date)
  console.log(li.dataset.date)
}

prevBtn.onclick = showPrevWeek
nextBtn.onclick = showNextWeek

function extendDate(){
  Date.prototype.asISODate = function() {
    const yyyy = this.getFullYear()
    const mm = (this.getMonth() + 1).toString().padStart(2,0)
    const dd = this.getDate().toString().padStart(2,0)
  
    return `${yyyy}-${mm}-${dd}`
  }
}

async function showPrevWeek() {
  await slideRight(...dayList.children)

  const date = new Date()
  const monday = new Date(dates[0].setDate(dates[0].getDate() - 7))

  dates = getWeekDates(monday)

  const dayItems = dates.map(buildDayItem)
  const current = dayItems.find(
    li => li.dataset.date == date.asISODate()
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
    li => li.dataset.date == date.asISODate()
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
    li => li.dataset.date == date.asISODate()
  )

  dayList.append(...dayItems)
  current.classList.add('active', 'today')
  showDayTasks(current.dataset.date)

  console.log(current.dataset.date)
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

  li.dataset.date = date.asISODate()
  p.innerText = date.toLocaleString('en', { weekday: 'short' })
  b.innerText = date.getDate()

  li.append(p, b)

  // console.log(date)
  // console.log(date.asISODate())
  // console.log(date.toLocaleString())

  return li
}






const addTask = document.querySelector('.btn-add')
const cancelBtn = document.querySelector('.form-cancel')

addTask.onclick = openEditor
cancelBtn.onclick = closeEditor
form.onsubmit = createTask

function openEditor() {
  pages.forEach((page)=> page.classList.remove('open'))
  editpage.classList.add('open')
  form.date.value = dayList.querySelector('.day.active').dataset.date
  // отключение кнопки доьавления задания
  addTask.hidden = true
}

function closeEditor() {
  editpage.classList.remove('open')
  // овключение кнопки доьавления задания
  addTask.hidden = false
  form.reset()
}

function createTask() {
  const task = Object.fromEntries(new FormData(form))
  tasks.push(task)
  task.id = ++nextId
  task.done = false
  closeEditor()
  form.reset()
  clearDayTasks()

  dayList.querySelector('.active').classList.remove('active')
  dayList.querySelector(`li[data-date="${task.date}"]`).classList.add('active')
  showDayTasks(task.date)


}

tasksList.onclick = e => {
  const li = e.target.closest('li')


  if (!li) return
  if (e.target.matches('.task-item-edit')) {
    const id = li.dataset.id
    editTask(+id)

  } else {
    if (second) {
      li.classList.toggle('done')
      clearTimeout(timerId)
      second = false
      // почему нужно дублировать єту запись ниже? -----------------------------
      const id = li.dataset.id
      changeTaskStatus(+id)
    } else {
      timerId = setTimeout(() => {
        li.classList.toggle('active')
        second = false
      }, 200)

      second = true
    }
  }

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
  li.classList.add('task-item', `${task.goal}`)
  li.dataset.id = task.id
  if (task.done == true) li.classList.add('done')
  li.innerHTML = `<span class="task-time-left">${task.starttime}</span>
  <div class="task-information">
    <span class="task-title">${task.title}</span>
    <span class="task-description">${task.description}</span>
    <span class="task-time">${task.starttime}-${task.endtime}</span>
  </div>
  <button class="task-item-edit">✏</button>`
  tasksList.append(li)
}

function clearDayTasks() {
  tasksList.innerHTML = ''
}

function editTask(id) {
  const task = tasks.find(task => task.id === id)

  openEditor()
  form.querySelector('.form-create').hidden = true
  form.querySelector('.form-save').hidden = false

  form.title.value = task.title
  form.description.value = task.description
  form.goal.value = task.goal
  form.starttime.value = task.starttime
  form.endtime.value = task.endtime
  form.description.value = task.description


  form.querySelector('.form-save').onclick = () => saveTask(task)
}

function saveTask(task) {
  task.title = form.title.value
  task.date = form.date.value
  task.description = form.description.value
  task.goal = form.goal.value
  task.starttime = form.starttime.value
  task.endtime = form.endtime.value
  task.description = form.description.value


  form.querySelector('.form-create').hidden = false
  form.querySelector('.form-save').hidden = true
  closeEditor()
  form.reset()
  clearDayTasks()
  dayList.querySelector('.active').classList.remove('active')
  dayList.querySelector(`li[data-date="${task.date}"]`).classList.add('active')
  showDayTasks(task.date)
}

function changeTaskStatus(id) {
  const task = tasks.find(task => task.id === id)
  if (!task.done == true) {
    task.done = true
  } else {
    task.done = false
  }

  console.log(task)
}

const goalStatistic = mainpage.querySelector('.b-parts-1 .statistic-goal')
const bodyStatistic = mainpage.querySelector('.b-parts-2 .statistic-goal')
const socialStatistic = mainpage.querySelector('.b-parts-3 .statistic-goal')
const workStatistic = mainpage.querySelector('.b-parts-4 .statistic-goal')

const goalStatisticPlanned = mainpage.querySelector('.b-parts-1 .statistic-planned')
const bodyStatisticPlanned = mainpage.querySelector('.b-parts-2 .statistic-planned')
const socialStatisticPlanned = mainpage.querySelector('.b-parts-3 .statistic-planned')
const workStatisticPlanned = mainpage.querySelector('.b-parts-4 .statistic-planned')

const goalStatisticDone = mainpage.querySelector('.b-parts-1 .statistic-done')
const bodyStatisticDone = mainpage.querySelector('.b-parts-2 .statistic-done')
const socialStatisticDone = mainpage.querySelector('.b-parts-3 .statistic-done')
const workStatisticDone = mainpage.querySelector('.b-parts-4 .statistic-done')

mainBtn.onclick = () => {
  pages.forEach((page)=> page.classList.remove('open'))
  mainpage.classList.toggle('open')
  addTask.hidden = false
  
  countBalance()
}


countBalance()
function countBalance(){
  filteredTasks = tasks.filter(task => task.goal !== 'common')

  goalTasks = tasks.filter(task => task.goal == 'goal')
  goalPercent = Math.round(goalTasks.length / filteredTasks.length * 100)
  goalStatistic.innerText = goalPercent + '%'
  goalDoneTasks = goalTasks.filter(task => task.done == true)
  goalStatisticPlanned.innerText = goalTasks.length + ' tasks'
  goalStatisticDone.innerText = goalDoneTasks.length + ' tasks'


  bodyTasks = tasks.filter(task => task.goal == 'body')
  bodyPercent = Math.round(bodyTasks.length / filteredTasks.length * 100)
  bodyStatistic.innerText = bodyPercent + '%'
  bodyDoneTasks = bodyTasks.filter(task => task.done == true)
  bodyStatisticPlanned.innerText = bodyTasks.length + ' tasks'
  bodyStatisticDone.innerText = bodyDoneTasks.length + ' tasks'


  socialTasks = tasks.filter(task => task.goal == 'social')
  socialPercent = Math.round(socialTasks.length / filteredTasks.length * 100)
  socialStatistic.innerText = socialPercent + '%'
  socialDoneTasks = socialTasks.filter(task => task.done == true)
  socialStatisticPlanned.innerText = socialTasks.length + ' tasks'
  socialStatisticDone.innerText = socialDoneTasks.length + ' tasks'


  workTasks = tasks.filter(task => task.goal == 'work')
  workPercent = Math.round(workTasks.length / filteredTasks.length * 100)
  workStatistic.innerText = workPercent + '%'   
  workDoneTasks = workTasks.filter(task => task.done == true)
  workStatisticPlanned.innerText = workTasks.length + ' tasks'
  workStatisticDone.innerText = workDoneTasks.length + ' tasks'
}

calendarBtn.onclick = () =>{
  pages.forEach((page)=> page.classList.remove('open'))
  addTask.hidden = false
}