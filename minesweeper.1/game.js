'use strict'

// Show a timer that starts on first click (right / left) and stops when game is over.
// Left click reveals the cell’s content
// Right click flags/unflags a suspected cell (you cannot reveal a flagged cell) 
// Game ends when:
// o LOSE: when clicking a mine, all mines should be revealed
// o WIN: all the mines are flagged, and all the other cells are shown
// Support 3 levels of the game:
// o Beginner (4*4 with 2 MINES)
// o Medium (8*8 with 12 MINES)
// o Expert (12*12 with 30 MINES) 
// Expanding: When left clicking on cells there are 3 possible cases we want to address:
// o MINE – reveal the mine clicked
// o Cell with neighbors – reveal the cell alone
// o Cell without neighbors – expand it and its 1st degree neighbors

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

// setInterval ( setTime, 1000 );

var board;
var gBoard;
var boardWidth = 4;
var mineAmount = 2;
const mine = '💣';
const flag = '🚩';

function init() {
    gBoard = createBoard();
    renderboard(gBoard);
}
function levels(w,m) {
    boardWidth = w;
    mineAmount = m;
    init();
}
function createBoard() {
    board = [];
    for (var i = 0; i < boardWidth; i++) {
        var row = [];
        for (var j = 0; j < boardWidth; j++) {
            row.push('');
        }
        board.push(row);
    }
    return board;
}
function renderboard(board) {
    var count = 0;
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[i].length; j++) {
            var cellClass = getClassName({ i: i, j: j })
            var mine = document.createAttribute("data-mine");
            mine.value = false;
            var neighborMines = document.createAttribute("data-neighbors");
            neighborMines.value = "100";
            var visible = document.createAttribute("data-visible");
            visible.value = "false";
            strHTML += `<td class="${cellClass}" id="${count}" data-mine="${mine.value}"  
            data-neighbors = "${neighborMines.value}" data-visible = "${visible.value}"
            oncontextmenu = "cellRightClicked(event, this, ${i}, ${j})"
            onclick = "cellLeftClicked (event, this, ${i}, ${j})"> 
			${board[i][j]}</td>`;
            count++;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.gameboard');
    elBoard.innerHTML = strHTML;
    addMines();
    addNeighbors();
}
function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
function addMines() {
    var countMines = 0;
    while (countMines < mineAmount) {
        var id = getRandInt(0, boardWidth * boardWidth - 1);
        var cell = document.getElementById(id);
        if (cell.getAttribute("data-mine") === "false") {
            cell.setAttribute("data-mine", "true");
            countMines++;
        }
    }
}
function addNeighbors() {
    var countN = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var id = i * boardWidth + j;
            var cellData = document.getElementById(id);
            // var cellData = document.getElementsByClassName('cell-' + i + '-' + j);
            if (!isMine(i, j)) {
                // top row
                if (isMine(i - 1, j - 1)) countN++;
                if (isMine(i - 1, j)) countN++;
                if (isMine(i - 1, j + 1)) countN++;
                // same row
                if (isMine(i, j - 1)) countN++;
                if (isMine(i, j + 1)) countN++;
                // buttom row
                if (isMine(i + 1, j - 1)) countN++;
                if (isMine(i + 1, j)) countN++;
                if (isMine(i + 1, j + 1)) countN++;
                cellData.setAttribute("data-neighbors", countN);
                countN = 0;
            }
        }
    }
}
function isMine(i, j) {
    //  checks i and j of certain point and returns true if the cell cintains a mine
    if (i < 0 || i > boardWidth - 1 || j < 0 || j > boardWidth - 1) return false;
    var id = i * boardWidth + j;
    var cell = document.getElementById(id);
    if (cell.getAttribute("data-mine") === "true") return true;
    else return false;
}
function showCell(i, j) {
    // reveals cell content
    var id = i * boardWidth + j;
    var cell = document.getElementById(id);
    cell.setAttribute("data-visible", "true");
    if (isMine(i, j)) {
        cell.innerText = mine;
    } else {
        cell.innerText = cell.getAttribute("data-neighbors");
        // cell.style.text-decoration = "bold";
        if (cell.innerText === "0") cell.style.color = "aqua";
        if (cell.innerText === "1") cell.style.color = "yellow";
        if (cell.innerText === "2") cell.style.color = "pink";
        if (cell.innerText === "3") cell.style.color = "red";
        if (cell.innerText === "4") cell.style.color = "purple";
        if (cell.innerText === "5") cell.style.color = "orange";
    }
}
function revealBlanks(i, j) {
    // checks all the blank near the cell chosen and reveals them
}
function gameOver(value) {
    // sting values ("fail"/"win")
    if (value === "fail") {
        alert('GameOver!');
        getElementById("starter-image").src="imgs\gameover.png";
    }
    if (value === "win") {
        alert('Good Job! You Won!');
        getElementById("starter-image").src="imgs\win.png";
    }
}
function isGameOver() {
    // checks if all cells besides mines are shown
    for (var id = 0; id < boardWidth*boardWidth; id++) {
        var cell = document.getElementById(id);
        if (cell.getAttribute("data-neighbors") !== "100") {
            if (cell.getAttribute("data-visible") === "false")
            return false;
        }
    }
    return true;
}
function cellLeftClicked(e, elCell, cellI, cellJ) {
    // if the cell containts a flag - nothing happens  
    if (elCell.innerHTML != flag) {
        // if the content is 'number' - reveal it
        showCell(cellI, cellJ);
        // if the content is 'bomb' - end game
        if (isMine(cellI, cellJ)) gameOver("fail");
        // if the content is 'blank' - reveal cell and all blank cells near it
        revealBlanks(cellI, cellJ);
        // if all cells besides mines are shown - win
        if (isGameOver()) { gameOver("win") }
    }
}
function cellRightClicked(e, elCell) {
    // adding and removing flag with each right click
    if (elCell.innerHTML != flag) elCell.innerHTML = flag;
    else elCell.innerHTML = "";
    
    //preventing the default context menue to appear
    e.preventDefault();
    return false;
}
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function idToLocation(id) {
    var i = Math.floor(id / boardWidth);
    var j = id % boardWidth;
}  
function printValues() {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board.length; j++) {
                showCell(i, j);
            }
        }
}