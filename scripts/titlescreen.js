scene('title', () => {
    

// Title screen scene

add([
    text('thanksgiving jam game', {align:'center'}),
    pos(center().add(0, -80)),
    anchor('center'),
    color(BLACK),
])

const playButton = add([
    rect(200,100),
    color(BLUE),
    pos(center().add(0, 100)),
    anchor('center'),
    area(),
])

playButton.onClick(() => {
    go('pregame')
})


// End of scene
})
go('title')