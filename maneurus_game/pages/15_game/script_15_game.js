/*Classes*/
class Casella {
    number;
    position;

    constructor(num, pos){
        this.number = num;
        this.position = pos;
    }
    getPos(){
        return this.position;
    }
    getNum(){
        return this.number;
    }
    setPos(pos){
        this.position = pos;
    }
}
/*Elements*/
const btnShuffle = document.getElementById('btnShuffle');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const txtTime = document.getElementById('time');
const txtMoves = document.getElementById('moves');
const buttons = document.getElementsByClassName('diff');

/*Defines*/
const URLBack = '../../images/back.png';
const width = 500;
const height = 500;
const key = 'grid';
const keyD = 'difficulty';
const keyT = 'time';
const keyM = 'moves';
const separator = " ";
const storSeparator = "_";
const fontSize = 28;

/*Structure*/
let img = new Image();
const grid = [];
let hasWon = false;
let gridSize;
let lengthCasella;
let indexOfBlanck;
let difficulty;
let firstMoveDone = false;
let cs = 0;
let sec = 0; 
let min = 0; 
let nMoves = 0;
let isPaused = false;

/*Methods*/
const shuffle = () => {
    /*This is the first prototype of the shuffle method, 
    it has been rejected, 'cause it is not possible to 
    affirm that the combination of tiles is solvable*/
    // for(let i = 0; i < indexOfBlanck; i++) {
        //     let j = Math.floor(Math.random() * 15);
        //     let tmp = grid[i].getPos();
        //     grid[i].setPos(grid[j].getPos());
        //     grid[j].setPos(tmp);
    // };
    // let tmp2 = 0;
    // let i = 0;
    // while(grid[i].getPos() != indexOfBlanck){
        //     i++;
        // }// tmp2 = grid[i].getPos();
        // grid[i].setPos(grid[indexOfBlanck].getPos());
        // grid[indexOfBlanck].setPos(tmp2);
    
    let i = 0;
    while(i < difficulty * 200){
        let direction = Math.floor(Math.random() * 4);
        let changed = false;
        switch(direction){
            case 0: //The direction will be UP
                if(!(grid[indexOfBlanck].getPos() + gridSize > indexOfBlanck)){
                    move(grid[indexOfBlanck].getPos() + gridSize);
                    changed = true;
                }
                break;
            case 1: //The direction will be RIGHT
                if(!(grid[indexOfBlanck].getPos() % gridSize - 1 < 0)){
                    move(grid[indexOfBlanck].getPos() - 1);
                    changed = true;
                }
                break;
            case 2: //The direction will be DOWN
                if(!(grid[indexOfBlanck].getPos() - gridSize < 0)){
                    move(grid[indexOfBlanck].getPos() - gridSize);
                    changed = true;
                }
                break;
            case 3: //The direction will be LEFT
                if(!(grid[indexOfBlanck].getPos() % gridSize + 1 > gridSize - 1)){
                    move(grid[indexOfBlanck].getPos() + 1);
                    changed = true;
                }
                break;
        }
        if(changed) {
            i++;
        };
    }

    while(!(grid[indexOfBlanck].getPos() % gridSize + 1 > gridSize - 1)){
        move(grid[indexOfBlanck].getPos() + 1);
    }
    while(!(grid[indexOfBlanck].getPos() + gridSize > indexOfBlanck)){
        move(grid[indexOfBlanck].getPos() + gridSize);
    }

    resetMoves();
    firstMoveDone = false;
    save();
    isPaused = false;
}

const save = () => {
    sessionStorage.clear();
    for(let i = 0; i < grid.length; i++){
        sessionStorage.setItem(key + storSeparator + i, grid[i].getNum() + separator + grid[i].getPos());
    }

    sessionStorage.setItem(keyD, difficulty);
    sessionStorage.setItem(keyT, min + separator + sec + separator + cs);
    sessionStorage.setItem(keyM, nMoves);
}

const draw = () => {
    context.clearRect(0, 0, width, height);

    context.drawImage(img, 0, 0, width, height);
    context.fillStyle = '#00000050';
    context.fillRect(0, 0, width, height);
    showGrid()

    if(hasWon){
        context.fillStyle = '#000000d0';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'white';
        context.font = fontSize * 1.5  + "px Verdana";
        context.fillText("Victory!", width / 2, height / 2);
    } else if(isPaused){
        context.fillStyle = '#000000d0';
        context.fillRect(0, 0, width, height);
        context.fillStyle = 'white';
        context.font = fontSize * 1.2  + "px Verdana";
        context.fillText("The game is paused!", width / 2, height / 2);
    }
    requestAnimationFrame(draw);
}

const showGrid = () => {
    context.font = fontSize + "px Verdana";
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
        for(let i = 0; i < grid.length - 1; i++){
        context.fillText(grid[i].getNum(), 
            (grid[i].getPos() % gridSize) * lengthCasella + lengthCasella / 2, 
            Math.floor(grid[i].getPos() / gridSize) * lengthCasella + lengthCasella / 2);
    }
}

const move = (tmpPos) => {
    let i = 0;
    while(grid[i].getPos() !== tmpPos){
        i++; 
    }
    let tmp = grid[i].getPos();
    grid[i].setPos(grid[indexOfBlanck].getPos());
    grid[indexOfBlanck].setPos(tmp);

    nMoves++;
    showMoves();

    hasWon = hasWonMethod();
}

const getGrid = () => {
    grid.splice(0, grid.length);
    for(let i = 0; i <= indexOfBlanck; i++){
        let tmp = parseInt(sessionStorage.getItem(key + storSeparator + i).split(separator)[0]);
        let tmp2 = parseInt(sessionStorage.getItem(key + storSeparator + i).split(separator)[1]);
        grid.push(new Casella(tmp, tmp2));
    }

    getTime();
    getMoves();
}

const hasWonMethod = () => {
    let counter = 0;
    for(let i = 0; i < grid.length; i++){
        if(grid[i].getPos() === i){
            counter++;
        }
    }
    if(counter === grid.length){
        r = true;
    } else {
        r = false;
    }
    return r;
}

const generateGrid = () => {
    for(let i = 0; i <= indexOfBlanck; i++){
        grid.push(new Casella(i+1, i));
    }
    shuffle();
}

const btnSetDiff = (d) => {
    enableB();
    difficulty = d;
    gridSize = difficulty;
    lengthCasella = width / gridSize;
    indexOfBlanck = Math.pow(gridSize, 2) - 1;

    sessionStorage.clear();
    grid.splice(0,grid.length);

    generateGrid();
    reset();

    disableB();
}

const enableB = () => {
    let a = difficulty;
    a = a - 3;
    if(a == 7)
        a = a - 2;
    
    buttons[a].disabled = false;
}

const disableB = () => {
    let a = difficulty;
    a = a - 3;
    if(a == 7)
        a = a - 2;

    buttons[a].disabled = true;
}

const tick = () => {
    cs++;
    if(cs == 100){
        cs = 0;
        sec++
        if(sec == 60){
            sec = 0;
            min++;
            if(min > 99){
                return "99 : 00 : 00";
            }
        }
    }
    showTime();
}

const reset = () => {
    cs = 0;
    sec = 0;
    min = 0;

    showTime();
}

const getTime = () => {
    min = parseInt(sessionStorage.getItem(keyT).split(separator)[0]);
    sec = parseInt(sessionStorage.getItem(keyT).split(separator)[1]);
    cs = parseInt(sessionStorage.getItem(keyT).split(separator)[2]);

    showTime();
}

const showTime = () => {
    txtTime.textContent = 
        (min < 10 ? "0" + min : min) + ":" 
        + (sec < 10 ? "0" + sec : sec) + ":"
        + (cs < 10 ? "0" + cs : cs);
}

const showMoves = () => {
    txtMoves.textContent = nMoves;
}

const resetMoves = () => {
    nMoves = 0;
    showMoves();
}

const getMoves = () => {
    nMoves = parseInt(sessionStorage.getItem(keyM));
    showMoves();
}

const pause = () => {
    isPaused = !isPaused;
}

setInterval(() => {
    if(!hasWon && firstMoveDone && !isPaused)
    tick()
}, 10);
/*End Declaration*/

/*Start Code*/
canvas.width = width;
canvas.height = height;
img.src = URLBack;

if(sessionStorage.getItem(keyD) == null){
    difficulty = 4;
    btnSetDiff(difficulty);
} else {
    if(sessionStorage.getItem(keyT) === "0 0 0"){
        difficulty = 4;
        btnSetDiff(difficulty);
    } else {
        difficulty = parseInt(sessionStorage.getItem(keyD));
        disableB();
        gridSize = difficulty;
        lengthCasella = width / gridSize;
        indexOfBlanck = Math.pow(gridSize, 2) - 1;
        getGrid();
        hasWon = hasWonMethod();
        pause();
    }
}

draw();
/*End code*/

/*Events*/
btnShuffle.onclick = () => {
    btnSetDiff(difficulty);
    shuffle();
    reset();
}

document.onkeydown = (e) => {
    if(e.code === "Space" || e.code === "Escape" || e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight")
    e.preventDefault();
}

document.onkeyup = (e) => {
    if(!hasWon){
        if(e.code === "Space" || e.code === "Escape"){
            pause();
        }

        if(!isPaused){
            if(e.code === "ArrowUp" || e.key === "w" || e.key === "W"){
                if(!(grid[indexOfBlanck].getPos() + gridSize > indexOfBlanck)){
                    move(grid[indexOfBlanck].getPos() + gridSize);
                    save();
                    firstMoveDone = true;
                }
            } 
            else if(e.code === "ArrowDown" || e.key === "s" || e.key === "S") {
                if(!(grid[indexOfBlanck].getPos() - gridSize < 0)){
                    move(grid[indexOfBlanck].getPos() - gridSize);
                    save();
                    firstMoveDone = true;
                }
            } 
            else if(e.code === "ArrowLeft" || e.key === "a" || e.key === "A"){   
                if(!(grid[indexOfBlanck].getPos() % gridSize + 1 > gridSize - 1)){
                    move(grid[indexOfBlanck].getPos() + 1);
                    save();
                    firstMoveDone = true;
                }
            }
            else if(e.code === "ArrowRight" || e.key === "d" || e.key === "D"){
                if(!(grid[indexOfBlanck].getPos() % gridSize - 1 < 0)){
                    move(grid[indexOfBlanck].getPos() - 1);
                    save();
                    firstMoveDone = true;
                }
            }
        }
    }
}