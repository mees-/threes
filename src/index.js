const shuffle = require('shuffle-array')
const clone = require('clone')
const rotate = require('matrix-rotate')

const directionMap = {
  UP: 0,
  LEFT: 1,
  DOWN: 2,
  RIGHT: 3,
}

const numScore = tile =>
  tile >= 3 ? Math.pow(3, Math.log(tile / 3) / Math.log(2) + 1) : 0

module.exports = class Threes {
  constructor() {
    this.board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    this._stack = []
    for (let i = 0; i < 9; i++) {
      const pos = this.randomFreePos()
      this.board[pos.y][pos.x] = this.stack.shift()
    }
  }

  get stack() {
    if (this._stack.length === 0) {
      this._stack = shuffle([1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
    }
    return this._stack
  }

  moveBoard(rotateAmount = 0) {
    rotateAmount %= 4
    for (let i = 0; i < rotateAmount; i++) {
      rotate(this.board)
    }
    let moved = false
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (y !== 0 && this.board[y][x] !== 0) {
          if (
            (this.board[y][x] === 1 && this.board[y - 1][x] === 2) ||
            (this.board[y][x] === 2 && this.board[y - 1][x] === 1)
          ) {
            this.board[y][x] = 0
            this.board[y - 1][x] = 3
            moved = true
          } else if (
            this.board[y][x] === this.board[y - 1][x] &&
            this.board[y][x] !== 1 &&
            this.board[y][x] !== 2
          ) {
            this.board[y][x] = 0
            this.board[y - 1][x] *= 2
            moved = true
          } else if (this.board[y - 1][x] === 0) {
            this.board[y - 1][x] = this.board[y][x]
            this.board[y][x] = 0
            moved = true
          }
        }
      }
    }

    for (let i = 0; i < 4 - rotateAmount; i++) {
      rotate(this.board)
    }
    return moved
  }

  move(direction) {
    direction = directionMap[direction]

    const moved = this.moveBoard(direction)
    if (moved) {
      const possibleSpawns = []
      switch (direction) {
        case 0: {
          for (let i = 0; i < 4; i++) {
            if (this.board[3][i] === 0) {
              possibleSpawns.push({
                x: i,
                y: 3,
              })
            }
          }
          break
        }
        case 1: {
          for (let i = 0; i < 4; i++) {
            if (this.board[i][0] === 0) {
              possibleSpawns.push({
                x: 0,
                y: i,
              })
            }
          }
          break
        }
        case 2: {
          for (let i = 0; i < 4; i++) {
            if (this.board[0][i] === 0) {
              possibleSpawns.push({
                x: i,
                y: 0,
              })
            }
          }
          break
        }
        case 3: {
          for (let i = 0; i < 4; i++) {
            if (this.board[i][3] === 0) {
              possibleSpawns.push({
                x: 3,
                y: i,
              })
            }
          }
        }
      }

      const spawn = shuffle.pick(possibleSpawns)
      if (Math.random() > 1 / 21) {
        this.board[spawn.y][spawn.x] = this.stack.shift()
      } else {
        const possibleNums = this.board
          .reduce(
            (uniqueList, row) => [
              ...uniqueList,
              ...row.reduce(
                (rowUnique, num) =>
                  !uniqueList.includes(num) ? [...rowUnique, num] : rowUnique,
                [],
              ),
            ],
            [],
          )
          .filter(num => num >= 48)
          .map(num => num / 8)
        this.board[spawn.y][spawn.x] =
          shuffle.pick(possibleNums) || this.stack.shift()
      }
    }
  }

  score() {
    let total = 0
    for (const row of this.board) {
      for (const num of row) {
        total += numScore(num)
      }
    }

    return total
  }

  randomFreePos() {
    const x = Math.floor(Math.random() * this.board[0].length)
    const y = Math.floor(Math.random() * this.board.length)

    if (this.board[y][x] === 0) {
      return { x, y }
    } else {
      return this.randomFreePos()
    }
  }

  boardString() {
    let str = ''
    for (const row of this.board) {
      for (const num of row) {
        str += ` ${num} `
      }
      str += '\n'
    }
    return str
  }

  static clone(game) {
    const newGame = new Game()
    newGame._stack = clone(game._stack)
    newGame.board = clone(game.board)
    return newGame
  }
}
