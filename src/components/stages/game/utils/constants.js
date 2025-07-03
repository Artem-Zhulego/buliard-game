export const TABLE_WIDTH = 8.4;
export const TABLE_HEIGHT = 5;
export const CUSHION_WIDTH = 0.26;
export const POCKET_RADIUS = 0.12;
export const POCKET_DEPTH = 0.6;
export const BALL_RADIUS = 0.11;

export function rotatePng90(texture, count) {
    const newTexture = texture.clone();
    newTexture.rotation = (Math.PI / 2) * count;
    newTexture.center.set(0.5, 0.5);
    return newTexture;
}