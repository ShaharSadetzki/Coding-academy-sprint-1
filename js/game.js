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
    for (let i = 0; i < gridWidth; i++) {
        const row = [];
        for (let j = 0; j < gridWidth; j++) {
            const square = document.createElement('div');
            square.dataset.status = cellOptions.HIDDEN;
            
            const cell = {
                square,
                i,
                j,
        }
        row.push(cell);
        }
        board.push(row);
    }
    return board;
}




