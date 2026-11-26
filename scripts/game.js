scene('game', () => {


// Game scene

const LAYERS = {
    ground: 0,
    player: 100,
}

const WORLD_DATA = {}

class Chunk {
    constructor(pos) {
        this.tiles = this.generateTiles(pos);
        this.pos = pos;
        
        WORLD_DATA[toStringPos(pos)] = this;
        // console.log(`New chunk at ${toStringPos(pos)}`);
    }

    generateTiles(pos) {
        let chunkTiles = {}

        for (let x = 0; x < CHUNK_SIZE; x++) {
            chunkTiles[x] = {};
            for (let y = 0; y < CHUNK_SIZE; y++) {
                let chunkPos = pos.scale(CHUNK_PIXEL_SIZE);
                let tilePos = chunkPos.add(x * TILE_SIZE, y * TILE_SIZE);

                chunkTiles[x][y] = new Tile(tilePos);
            }
        }

        return chunkTiles;
    }
}

class Tile {
    constructor(pos) {
        this.pos = pos;
        this.color = rgb(230, randi(150, 210), 0);
        this.content = [];

        if (chance(0.1)) {
            this.content.push(new Tree(pos));
        }
    }
}

class Player {
    constructor() {
        this.pos = vec2(0);
        this.speed = 400;
        this.currentChunk = null;
    }

    draw() {
        drawSprite({
            pos: this.pos,
            sprite: 'bean',
            anchor: 'bot'
        })
    }
}

class Tree {
    constructor(pos) {
        this.offset = vec2(
            rand(0, TILE_SIZE),
            rand(0, TILE_SIZE),
        );
        this.pos = pos.add(this.offset);
        this.color = rgb(randi(150,255), randi(0,80), 0)
        this.rect1 = Rect.fromPoints(this.pos.add(-200, -550), this.pos.add(200, -150));
        this.rect2 = Rect.fromPoints(this.pos.add(-40, -150), this.pos.add(40, 0));
        this.opacity = 1;
    }

    draw() {
        if (this.rect1.contains(player.pos) || this.rect2.contains(player.pos)) { 
            this.opacity = 0.3;
        } else {
            this.opacity = 1;
        }
        drawRect({
            pos: this.pos,
            width: 80, height: 150,
            color: this.color,
            anchor: 'bot',
            opacity: this.opacity,
        })
        drawRect({
            pos: this.pos.sub(0,150),
            width: 400, height: 400,
            color: this.color,
            anchor: 'bot',
            opacity: this.opacity,
        })
    }
}

for (chunkPos of INCLUSIVE_NEIGHBORS) {
    new Chunk(chunkPos)
}

const player = new Player()

function updatePlayer() {
    setCamPos(player.pos)

    player.currentChunk = vec2(
        Math.floor(player.pos.x / CHUNK_PIXEL_SIZE),
        Math.floor(player.pos.y / CHUNK_PIXEL_SIZE),
    );
}
updatePlayer()

function isPosOnScreen(pos, margin=1) {
    let p = player.pos;
    let w = width()/2 + margin*TILE_SIZE;
    let h = height()/2 + margin*TILE_SIZE;

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
    let itemDrawOrder = [player];

    for (let chunkNum = 0; chunkNum < 9; chunkNum ++) {
        let thisChunkPos = INCLUSIVE_NEIGHBORS[chunkNum].add(player.currentChunk);
        let thisChunk = WORLD_DATA[toStringPos(thisChunkPos)];

        if (!thisChunk) { 
            thisChunk = new Chunk(thisChunkPos) 
        }

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                let tileData = thisChunk.tiles[x][y];

                for (item of tileData.content) {
                    if (isPosOnScreen(item.pos, 3)) itemDrawOrder.push(item)
                }

                if (isPosOnScreen(tileData.pos)) {
                    drawRect({
                        pos: tileData.pos,
                        width: TILE_SIZE, height: TILE_SIZE,
                        color: tileData.color
                    })
                }
            }
        }
    }

    itemDrawOrder.sort((a,b) => {
        if (a.pos.y < b.pos.y) {
            return -1;
        } else if (a.pos.y > b.pos.y) {
            return 1;
        }

        return 0;
    })

    for (item of itemDrawOrder) {
        item.draw()
    }
})


// End of scene
});
go('game')