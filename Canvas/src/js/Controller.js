import io from 'socket.io-client';
import Player from './Components/Player';
import { Driver } from './Components/Driver';
import Global from './Global';

const socket = io(Global.getHost());
const register = document.querySelector("section.register");
const setup = document.querySelector("section.setup");
const waiting = document.querySelector("section.waiting");
const loading = document.querySelector(".loading");
const controller = document.querySelector(".controller");
const pname = document.querySelectorAll(".playerName");
let mapInfo = {}
var firstPlayer = false;
window.onload = function () {
    hide(controller);
}
/* Support functions */
function fadeOut(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

function hide(element) {
    element.style.display = 'none';
}


function show(element) {
    if(element == isFirst) {
        firstPlayer = true;
    }
    element.style.display = 'block';
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}
/* Register */
let playerName = document.querySelector("input[name='playerName']");
let joinBtn = document.querySelector("button[name='join']");
let isFirst = document.querySelector(".isFirst");
let playable = document.querySelector(".playable");
let limit = document.querySelector(".limit");

let inputCheck = (e) => {
    if(e.target.value.length > 0) {
        joinBtn.disabled = false;
    } else {
        joinBtn.disabled = true;
    }
}
playerName.addEventListener("keyup", e => inputCheck(e), false);
playerName.addEventListener("keydown", e => inputCheck(e), false)


socket.on("loadMap", data => {
    if(!isEmpty(data)) {
        /* If there is someone opens the map */
        Object.assign(mapInfo, data);
    } 
})
joinBtn.addEventListener("click", function (){
    fadeIn(loading);
    console.log(playerName.value);
    [...pname].map(each => each.innerHTML = playerName.value);
    if(!isEmpty(mapInfo)) {
        hide(register)
        show(setup);
        socket.emit("isPlayer", playerName.value);
        socket.on("matchInfo", data => {
            console.log(data);
            if(data.playerIndex == 1) {
                /* If it's first player */
                show(isFirst);
                show(playable);
            } else if (data.playerIndex <= data.maxPlayer && data.playerIndex > 1){
                hide(isFirst);
                show(playable);
            } else {
                hide(playable);
                show(limit);
            }
        })
        socket.on("getPosition", data => {
            console.log(data);
            for(var i in data) {
                if(data[i] == true) {
                    console.log(pos.options.namedItem(i));  
                    pos.options.namedItem(i).disabled = true;
                } else {
                    pos.options.namedItem(i).selected = "selected";
                }
            }
        })
    } else {
        alert("There is no match existed");
    }
    fadeOut(loading);
}, false);

/* Setup */
let maxP = document.querySelector("select[name='maxPlayer']");
let pos = document.querySelector("select[name='position']");
let continueBtn = document.querySelector("button[name='continue']");
continueBtn.addEventListener("click", function () {
    console.log(maxP.options[maxP.selectedIndex].value);
    if(firstPlayer == true) {
        socket.emit("setMaxPlayer", maxP.options[maxP.selectedIndex].value);
    }
    socket.emit("setPosition", pos.options[pos.selectedIndex].value);
    hide(setup);
    show(waiting);
    socket.on("initPlayer", (player) => {
        var thisPlayer = new Player(player.id,player.x,player.y,playerName.value,mapInfo);
        let controller = new Driver(thisPlayer, socket, btnController);
        controller.init();
        myColor.style.background = player.color;
        [...btnController].map(each => each.style.background = player.color);
    })
})
/* Waiting */
let myColor = document.querySelector('.myColor');
let leftArrow = document.querySelector(".leftArrow");
let rightArrow = document.querySelector(".rightArrow");
let upArrow = document.querySelector(".upArrow");
let downArrow = document.querySelector(".downArrow");
let btnController = [leftArrow, rightArrow, upArrow, downArrow];
let btnStart = document.querySelector("button[name='start']");
socket.on("startAble", () => {
    btnStart.classList.remove("is-loading");
    if(firstPlayer == true) {
        btnStart.disabled = false;
        btnStart.innerHTML = "Start Game";
    } else {
        btnStart.innerHTML = "Waiting for first player to start game";
    }
})

btnStart.addEventListener("click", function() {
    socket.emit("start");
})

socket.on("showController", () => {
    hide(waiting);
    controller.style.display = 'grid';
})
controller.addEventListener("click", function() {
    var
          el = document.documentElement
        , rfs =
               el.requestFullScreen
            || el.webkitRequestFullScreen
            || el.mozRequestFullScreen
    ;
    rfs.call(el);
});