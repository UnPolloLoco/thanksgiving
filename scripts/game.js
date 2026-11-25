scene('game', () => {

    
// Game scene

const bean = add([
    pos(0),
    sprite('bean')
])

onUpdate(() => {
    bean.pos = mousePos()
})


// End of scene
});
// go('game')