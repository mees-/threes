const test = require('ava')
const Threes = require('./index')

test('Threes#moveBoard', t => {
  const game = new Threes()
  game.board = [[2, 0, 0, 6], [1, 2, 3, 3], [0, 0, 0, 3], [0, 0, 0, 0]]
  game.moveBoard()
  t.deepEqual(game.board, [
    [3, 2, 3, 6],
    [0, 0, 0, 6],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ])
  game.moveBoard(1)
  t.deepEqual(game.board, [
    [3, 2, 3, 6],
    [0, 0, 6, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ])
})

test('Threes#move', t => {
  const game = new Threes()

  t.notThrows(() => {
    for (const dir of ['UP', 'DOWN', 'LEFT', 'RIGHT']) {
      game.move(dir)
    }
  })
})
