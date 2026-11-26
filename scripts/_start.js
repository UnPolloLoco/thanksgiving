kaboom({
    letterbox: true,
    width: 1280,
    height: 720,
    font: 'ubuntu',
    buttons: {
		up:      { keyboard: ["up", "w"] },
		down:    { keyboard: ["down", "s"] },
		left:    { keyboard: ["left", "a"] },
		right:    { keyboard: ["right", "d",] },
    }
});

loadBean();

loadRoot('https://unpolloloco.github.io/thanksgiving/fonts/');
loadFont("ubuntu", "Ubuntu-Light.ttf");

// loadRoot('https://unpolloloco.github.io/thanksgiving/sprites/');

const CHUNK_SIZE = 10;
const TILE_SIZE = 200;
const CHUNK_PIXEL_SIZE = CHUNK_SIZE * TILE_SIZE;

const NEIGHBORS = [vec2(0,1), vec2(1,1), vec2(1,0), vec2(1,-1), vec2(0,-1), vec2(-1,-1), vec2(-1,0), vec2(-1, 1)];
const INCLUSIVE_NEIGHBORS = [vec2(0), ...NEIGHBORS];

function toStringPos(v) { return `${v.x},${v.y}`; }

function fromStringPos(s) {
    let split = s.split(',');
    return vec2(Number(split[0]), Number(split[1]));
}

function hsl(h,s,l) { return hsl2rgb(h/360, s, l); }