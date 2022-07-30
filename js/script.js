const h1 = document.querySelector('h1')
const rouletteCircle = document.querySelector('.roulette-circle')
const face = document.querySelector('.face')

const input = document.querySelector('.form-control input')
const btnAdd = document.querySelector('.btn-add')
const storeList = document.querySelector('.storeList')

const store = document.querySelector('.store-txt')
const storeBg = document.querySelector('.store-bg')

const pointer = document.querySelector('.pointer')
const btnStart = document.querySelector('.btn-start')



let dinnerList = JSON.parse(localStorage.getItem("dinnerList")) || []
let deg = 0

// 輪盤文字
function StoreTxt (storeName, index) {
  this.storeName = storeName
  this.index = index
}
StoreTxt.prototype.createDiv = function () {

  const storeItem = document.createElement('div')
  storeItem.innerText = this.storeName
  storeItem.style = `transform : translateX(-50%) rotate(${(this.index + 1) * deg - deg / 2}deg);width:${deg + 20}px`

  store.appendChild(storeItem)
}


// 輪盤扇形
function StoreBG (storeName, index) {
  this.storeName = storeName
  this.index = index
}
StoreBG.prototype.createDiv = function () {

  const storeBgItem = document.createElement('div')
  storeBgItem.className = `store-bg-item store-bg-item${this.index}`
  storeBgItem.style.clipPath = 'polygon(50% 0, 100% 0, 1000% 100%, 50% 100%)'
  storeBgItem.style.transform = `rotate(${this.index * deg}deg)`

  const div = document.createElement('div')
  div.className = 'circle'
  div.style.clipPath = `polygon(0 0, 50% 0, 50% 100%, 0 100%)`
  div.style.transform = `rotate(${deg}deg)`

  storeBgItem.appendChild(div)
  storeBg.appendChild(storeBgItem)
}


// 表單
function Form (storeName, index) {
  this.content = storeName
  this.index = index
}
Form.prototype.createLi = function () {

  const dinnerLi = document.createElement('li')
  dinnerLi.innerText = this.content
  dinnerLi.dataset.index = this.index

  const dinnerDel = document.createElement('SPAN')
  dinnerDel.className = 'btn-del'
  dinnerDel.innerHTML = `<i class="fas fa-trash-alt" data-index="${this.index}"></i>`
  dinnerDel.dataset.index = this.index
  dinnerDel.addEventListener('click', e => {
    console.log(e.target.dataset.index)
    dinnerList.splice(e.target.dataset.index, 1)
    createList()
    roulette()
  })

  dinnerLi.appendChild(dinnerDel)
  storeList.appendChild(dinnerLi)
}





function roulette () {
  face.className = 'face hide'
  store.innerHTML = ''
  storeBg.innerHTML = ''

  localStorage.setItem('dinnerList', JSON.stringify(dinnerList));

  if (dinnerList.length == 1) {
    // 當只有一個的時候
    store.innerHTML = `<div style="transform: translateX(-50%)">${dinnerList[0]}</div>`

    storeBg.innerHTML = `
    <div class="store-bg-item store-bg-item0">
        <div class="circle">
        </div>
    </div>
    `
    return
  } else if (dinnerList.length == 0) {
    face.className = 'face'
    pointer.style = `transform: translate(-50%,-50%) rotate(0deg);`
  }

  deg = 360 / dinnerList.length
  dinnerList.forEach((item, index) => {

    const txt = new StoreTxt(item, index)
    txt.createDiv()

    const bg = new StoreBG(item, index)
    bg.createDiv()

  })

}



function createList () {
  h1.innerHTML = `今晚要吃什麼<i class="far fa-tired"></i>`
  if (dinnerList.length == 0) {
    storeList.innerHTML = '<li class="nothing">目前沒東西吃QQ</li>'
    return
  }

  storeList.innerHTML = ''
  dinnerList.forEach((item, index) => {
    const form = new Form(item, index)
    form.createLi()
  })

}




createList()
roulette()



// 新增晚餐
btnAdd.addEventListener('click', e => {

  e.preventDefault()
  let dinnerItem = input.value.trim()
  if (!dinnerItem) {
    h1.innerHTML = `不能空白啦<i class="far fa-angry"></i>`
    return 
  }

  dinnerList.push(dinnerItem)
  input.value = ''
  // console.log(dinnerList)

  createList()
  roulette()
})


// 刪除晚餐
// storeList.addEventListener('click', e => {
//   if (e.target.nodeName !== 'I') {
//     return
//   }
//   e.preventDefault()
//   const index = e.target.dataset.index
//   console.log(index)
//   dinnerList.splice(index, 1)
//   createList()
//   roulette()
//   console.log(e.target.nodeName)
// })



// const widthOutput = document.querySelector("#width");
// widthOutput.textContent = window.innerWidth;
// function resizeListener() {
//   widthOutput.textContent = window.innerWidth;
// }

// window.addEventListener("resize", resizeListener);


let startDeg = 0

// 轉輪盤
function pointerDegShow () {

  // console.log(`目前在${startDeg}度`)
  pointer.style = 'animation: pointer ease-out 3s forwards'

  // 隨機給指真角度
  const pointerDeg = Math.floor(Math.random() * 361)
  // console.log(`要轉去${pointerDeg}度`)

  // 計算落點
  const interval = Math.floor(pointerDeg / deg)


  // 在 html 加入@keyframes
  let style = document.createElement('style');
  style.innerHTML = `@keyframes pointer {
    0%{
      transform: translate(-50%,-50%) rotate(${startDeg}deg);
    }
    100%{
      transform: translate(-50%,-50%) rotate(${1440 + pointerDeg}deg);
    }
  }`;
  document.getElementsByTagName('head')[0].appendChild(style);

  // 儲存這次的角度
  startDeg = pointerDeg

  // 讓指針套用動畫
  pointer.style = `animation: pointer ease-out 1.5s forwards`

  setTimeout(() => {

    if(dinnerList[interval] === undefined){
      h1.innerHTML = `不要玩了!! 快點填啦<i class="far fa-angry"></i>`
    } else if(!(pointerDeg % deg)){ // 被整除 PS.要記得括號 不然會出錯
      h1.innerHTML = `尷尬的位子...重轉吧<i class="far fa-grin-beam-sweat"></i>`
    } else {
      h1.innerHTML = `就決定吃${dinnerList[interval]}啦<i class="far fa-grin-squint"></i>`
    }

    // 跑完後要將動畫移除，不然下一次無法重新跑
    pointer.style = `transform: translate(-50%,-50%) rotate(${startDeg}deg);`
  }, 1500)

}

btnStart.addEventListener('click', e => {
  pointerDegShow()
})


