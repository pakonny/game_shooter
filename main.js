const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const play = document.getElementById("play")
const inst = document.getElementById("inst")
const instruction = document.getElementById("ins")
const close = document.getElementById("close")
const username = document.getElementById("username")
const level = document.getElementById("level")
const tembak = document.querySelectorAll('input[name="tembak"]') // semua input dengan name="tembak"
let pilihanTembak = document.querySelector('input[name="tembak"]:checked').value // value default dari pilihan tembak
const target = document.querySelectorAll('input[name="target"]') // semua input dengan name="target"
let pilihanTarget = document.querySelector('input[name="target"]:checked').value // value default dari pilihan target
const home = document.getElementById("home")
const leaderBoard = document.getElementById("leaderboard")
const detailBar = document.getElementById("detailBar")
const name = document.getElementById("name")
const score = document.getElementById("score")
const namePause = document.getElementById("namePause")
const nameOver = document.getElementById("nameOver")
const scoreAkhir = document.getElementById("scorePemain")
const time = document.getElementById("time")
const continyu = document.getElementById("continue")
const restart = document.getElementById("restart")
const exit = document.getElementById("exit")
const gameOverPopUp = document.getElementById("gameOver")
let levelDefault = level.value
let scorePemain = 0
let intervalPermainan = null
let animasiFrame = null

const w = canvas.width
const h = canvas.height
let mouseX = 0
let mouseY = 0
const wTarget = 150
const hTarget = 150

let countdown = 3
let targetPos = []
let start = false
let gameOver = false 
let pause = false

// LOAD GAMBAR UTAMA
let bg = new Image()
bg.src = "assets/Sprites/bg.jpg"


let gun = new Image()
gun.src = `assets/Sprites/${pilihanTembak}.png`

let targetTembakan = new Image()
targetTembakan.src = `assets/Sprites/${pilihanTarget}.png`

let boom = new Image()
boom.src = "assets/Sprites/boom.png"

let cursor = new Image()
cursor.src = "assets/Sprites/pointer.png"

// EVENT
tembak.forEach(tem => {
    tem.addEventListener("change", function (e) {
        pilihanTembak = e.target.value
        gun.src = `assets/Sprites/${pilihanTembak}.png`
    })
});
target.forEach(tar => {
    tar.addEventListener("change", function (e) {
        pilihanTarget = e.target.value
        targetTembakan.src = `assets/Sprites/${pilihanTarget}.png`
    })
})

username.addEventListener("input", function () {
    play.disabled = username.value.trim() == ""
})

inst.addEventListener("click", function () {
       instruction.style.display = "block"

       close.addEventListener("click", function() {
        instruction.style.display = "none"
       })
})

play.addEventListener("click", function () {
    localStorage.setItem("name", username.value)
    countDown()
    // home.style.display = "none"
    // canvas.style.display = "block"
    // start = true
    // startGame()
})

canvas.addEventListener("mousemove", function (e) {
    let cvs = canvas.getBoundingClientRect()
    mouseX = e.clientX - cvs.left
    mouseY = e.clientY - cvs.top
})

canvas.addEventListener("click", function () {
    tembakan()
})

level.addEventListener("change", function () {
     levelDefault = level.value
    gameOverPopUp.style.display = "none"

})



exit.addEventListener("click", function () {
    canvas.style.display = "none"
    home.style.display = "block"
    leaderBoard.style.display = "none";
    detailBar.style.display = "none";
    gameOverPopUp.style.display = "none"
    location.reload()
})

restart.addEventListener("click", function () {
    reset()
})



function countDown(){
    let interval = setInterval(() => {
        home.style.display = "none"
        canvas.style.display = "block"
        ctx.clearRect(0,0,w,h)
        ctx.font = "230px Arial"
        ctx.fillText(countdown, 400, 350)
        if(countdown == -1) {
           clearInterval(interval)
           start = true
           startGame()
           
        }
        countdown--
    }, 1000);
}

function makeBackground(){
    ctx.drawImage(bg, 0, 0, w, h)
}

function makeGun() {
    ctx.drawImage(gun, mouseX, h - 250,250,250)
}

function makeCursor(){
    ctx.drawImage(cursor, mouseX - 23, mouseY - 23)
}

let ledakan = [] 

function tembakan() {
    ledakan.push({
        x: mouseX - 35,
        y: mouseY - 35,
        time: Date.now() 
    });
    
}

function makeTarget() {
    if(targetPos.length >= 3) {
        targetPos.shift(); 
    }
    targetPos.push({
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 300)
    });
}

function reset() {
    // location.reload()
    gameOverPopUp.style.display = "none"
    localStorage.setItem("score", 0)
    scorePemain = 0;
    levelDefault = level.value;
    countdown = 3;
    start = false;
    gameOver = false;
    pause = false;

    targetPos = [];
    ledakan = [];

    score.innerHTML = 0;
    time.innerHTML = levelDefault;
    name.innerHTML = localStorage.getItem("name") || "";

    clearInterval(intervalPermainan);
    cancelAnimationFrame(animasiFrame);

    startGame();
}

function startGame() {
    leaderBoard.style.display = "block";
    detailBar.style.display = "flex";
    name.innerHTML = localStorage.getItem("name");
    score.innerHTML = 0;
    time.innerHTML = levelDefault
    score.innerHTML = scorePemain
    intervalPermainan = setInterval(() => {
        levelDefault--
   }, 1000);

    for (let i = 0; i < 3; i++) {
        targetPos.push({
            x: Math.floor(Math.random() * 800),
            y: Math.floor(Math.random() * 300)
        });
    }

    render(); 
}

function deteksiTembakan(posisiTarget){
    if(ledakan.length > 0) {
        return (
            ledakan[0].x >= posisiTarget.x &&
            ledakan[0].x <= posisiTarget.x + wTarget && 
            ledakan[0].y >= posisiTarget.y && 
            ledakan[0].y <= posisiTarget.y + hTarget
        )
    }
}

function kurangi () {
    levelDefault -= 5
    console.log("berkurang")
}

function render() {
    ctx.clearRect(0, 0, w, h);
    
    makeBackground();
    time.innerHTML = levelDefault
    for (let i = 0; i < targetPos.length; i++) {    
        if(deteksiTembakan(targetPos[i]) ) {
           targetPos.splice(i,1)
           scorePemain += 1
           score.innerHTML = scorePemain
           localStorage.setItem("score", scorePemain)
        } else if(ledakan.length > 0) {
           
        }
        if(targetPos.length > 0) {
            ctx.drawImage(targetTembakan, targetPos[i]?.x, targetPos[i]?.y, wTarget, hTarget);
        }
    }
    
    if(levelDefault == 0) {
        clearInterval(intervalPermainan)
        gameOver = true
    }
   

    let waktuSekarang = Date.now();
    ledakan = ledakan.filter(e => waktuSekarang - e.time < 300);
    
    for (let i = 0; i < ledakan.length; i++) {
        ctx.drawImage(boom, ledakan[i].x, ledakan[i].y);
    }
    makeGun();
    makeCursor();
    if(!gameOver) {
        animasiFrame = requestAnimationFrame(render);
    } else {
        cancelAnimationFrame(animasiFrame)
        gameOverPopUp.style.display = "block"
        nameOver.innerHTML = localStorage.getItem("name")
        scoreAkhir.innerHTML = localStorage.getItem("score")
    }
}


setTimeout(() => {
    setInterval(makeTarget, 3000);
}, 3000);

