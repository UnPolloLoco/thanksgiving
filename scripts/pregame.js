scene('pregame', () => {

// Pregame scene

const playButton = add([
    rect(200,100),
    color(RED),
    pos(center()),
    anchor('center'),
    area(),
])

playButton.onClick(() => {
    go('game')
})

// End of scene
})