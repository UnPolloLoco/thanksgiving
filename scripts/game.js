scene('game', () => {


// Game scene

const LAYERS = {
    ground: 0,
    player: 100,
}

const WORLD_DATA = {}

class Chunk {
    constructor(pos) {
        let chunkTiles = {}

        for (let x = 0; x < CHUNK_SIZE; x++) {
            chunkTiles[x] = {};
            for (let y = 0; y < CHUNK_SIZE; y++) {
                let chunkPos = pos.scale(CHUNK_PIXEL_SIZE);
                let tilePos = chunkPos.add(x * TILE_SIZE, y * TILE_SIZE);

                chunkTiles[x][y] = new Tile(tilePos);
            }
        }

        this.tiles = chunkTiles;
        this.pos = pos;
        // console.log(`New chunk at ${toStringPos(pos)}`);

        WORLD_DATA[toStringPos(pos)] = this;

    }
}

class Tile {
    constructor(pos) {
        this.pos = pos;
        this.color = rgb(230, randi(150, 210), 0);
    }
}

for (chunkPos of INCLUSIVE_NEIGHBORS) {
    new Chunk(chunkPos)
}

const player = add([
    pos(50,60),
    sprite('bean'),
    anchor('center'),
    z(LAYERS.player),
    {
        speed: 400,
        currentChunk: null,
    }
])

function updatePlayer() {
    setCamPos(player.pos)

    player.currentChunk = vec2(
        Math.floor(player.pos.x / CHUNK_PIXEL_SIZE),
        Math.floor(player.pos.y / CHUNK_PIXEL_SIZE),
    );
}
updatePlayer()

function isPosOnScreen(pos, margin=0) {
    let p = player.pos;
    let w = width()/2 + margin + TILE_SIZE;
    let h = height()/2 + margin + TILE_SIZE;

    let left = p.x - w;
    let right = p.x + w;
    let top = p.y - h;
    let bot = p.y + h;

    if (left < pos.x && pos.x < right) {
        if (top < pos.y && pos.y < bot) {
            return true;
        }
    }

    return false;
}



onUpdate(() => {
    let moveBy = vec2(0);
    if (isButtonDown('up')) moveBy.y -= 1;
    if (isButtonDown('down')) moveBy.y += 1;
    if (isButtonDown('left')) moveBy.x -= 1;
    if (isButtonDown('right')) moveBy.x += 1;

    if (moveBy.x != 0 || moveBy.y != 0) {
        moveBy = moveBy.unit().scale(player.speed * dt())
        player.pos = player.pos.add(moveBy)
        
        updatePlayer()
    }
})


onDraw(() => {
    for (let chunkNum = 0; chunkNum < 9; chunkNum ++) {
        let thisChunkPos = INCLUSIVE_NEIGHBORS[chunkNum].add(player.currentChunk);
        let thisChunk = WORLD_DATA[toStringPos(thisChunkPos)];

        if (!thisChunk) { 
            thisChunk = new Chunk(thisChunkPos) 
        }

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                let tileData = thisChunk.tiles[x][y];

                if (isPosOnScreen(tileData.pos) == false) { continue }

                drawRect({
                    pos: tileData.pos,
                    width: TILE_SIZE, height: TILE_SIZE,
                    color: tileData.color
                })
            }
        }
    }
})


// End of scene
});
go('game')