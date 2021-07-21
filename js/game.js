'use strict'

const gameboard = document.querySelector('.gameboard');
let gridWidth = 4;
let bombAmount = 2;

const cellOptions = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked'
}

function createBoard(gridWidth, bombAmount) {
    const board = [];
    gameboard.style.setProperty('--size', gridWidth);
    for (let i = 0; i < gridWidth; i++) {
        const row = [];
        for (let j = 0; j < gridWidth; j++) {
            const square = document.createElement('div');
            square.dataset.status = cellOptions.HIDDEN;
            
            const cell = {
                square,
                i,
                j,
                mine: true/false
            }
            row.push(cell);
        }
        board.push(row);
    }
    board.forEach(row => {
        row.forEach(tile => {
            gameboard.append(tile.square);
        })
    });
    return gameboard
}




