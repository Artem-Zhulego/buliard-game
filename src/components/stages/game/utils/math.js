import * as THREE from 'three';

export function calculateTrajectory(start, direction, tableWidth, tableHeight, cushionWidth, maxBounces = 3, scale = 1) {
    const points = [start];
    let currentPos = new THREE.Vector2(start[0], start[1]);
    let currentDir = new THREE.Vector2(direction[0], direction[1]).normalize().multiplyScalar(scale);

    const boundaries = {
        left: -tableWidth / 2 + cushionWidth,
        right: tableWidth / 2 - cushionWidth,
        top: tableHeight / 2 - cushionWidth,
        bottom: -tableHeight / 2 + cushionWidth,
    };

    const EPSILON = 1e-6;

    for (let i = 0; i < maxBounces; i++) {
        let tMin = Infinity;
        let collision = null;

        if (Math.abs(currentDir.x) > EPSILON) {
            const tLeft = (boundaries.left - currentPos.x) / currentDir.x;
            const tRight = (boundaries.right - currentPos.x) / currentDir.x;

            if (tLeft > EPSILON && tLeft < tMin) {
                tMin = tLeft;
                collision = 'left';
            }
            if (tRight > EPSILON && tRight < tMin) {
                tMin = tRight;
                collision = 'right';
            }
        }

        if (Math.abs(currentDir.y) > EPSILON) {
            const tTop = (boundaries.top - currentPos.y) / currentDir.y;
            const tBottom = (boundaries.bottom - currentPos.y) / currentDir.y;

            if (tTop > EPSILON && tTop < tMin) {
                tMin = tTop;
                collision = 'top';
            }
            if (tBottom > EPSILON && tBottom < tMin) {
                tMin = tBottom;
                collision = 'bottom';
            }
        }

        if (tMin === Infinity) break;

        const collisionPoint = currentPos.clone().add(currentDir.clone().multiplyScalar(tMin));
        points.push([collisionPoint.x, collisionPoint.y]);

        switch (collision) {
            case 'left':
            case 'right':
                currentDir.x *= -1;
                break;
            case 'top':
            case 'bottom':
                currentDir.y *= -1;
                break;
        }

        currentPos = collisionPoint.clone();
    }

    return points;
}
