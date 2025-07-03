import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { calculateTrajectory } from "../utils/math";
import { BALL_RADIUS,TABLE_WIDTH, TABLE_HEIGHT, CUSHION_WIDTH } from "../utils/constants";

function trimTrajectory(trajectory, maxLength) {
  const trimmed = [];
  let accumulated = 0;
  trimmed.push(trajectory[0]);
  for (let i = 1; i < trajectory.length; i++) {
    const prev = new THREE.Vector2(...trajectory[i - 1]);
    const curr = new THREE.Vector2(...trajectory[i]);
    const segment = prev.distanceTo(curr);
    if (accumulated + segment > maxLength) {
      const remaining = maxLength - accumulated;
      const dir = curr.clone().sub(prev).normalize();
      const finalPoint = prev.clone().add(dir.multiplyScalar(remaining));
      trimmed.push([finalPoint.x, finalPoint.y]);
      break;
    } else {
      trimmed.push(trajectory[i]);
      accumulated += segment;
    }
  }
  return trimmed;
}

function AimLine({ start, aimEnd }) {
  const { scene } = useThree();

  // Кэширование разрешения и материалов
  const resolution = useMemo(
    () => new THREE.Vector2(window.innerWidth, window.innerHeight),
    []
  );
  const borderMaterial = useMemo(
    () =>
      new LineMaterial({
        color: new THREE.Color(0x000000),
        linewidth: 3,
        resolution: resolution,
        transparent: true,
        opacity: 0.8,
        dashed: true,
        dashSize: 0.8,
        gapSize: 0.1,
        blending: THREE.AdditiveBlending,
      }),
    [resolution]
  );
  const lineMaterial = useMemo(
    () =>
      new LineMaterial({
        color: new THREE.Color(0xffffff),
        linewidth: 1.5,
        resolution: resolution,
        transparent: true,
        opacity: 1.0,
        dashed: false,
        blending: THREE.AdditiveBlending,
      }),
    [resolution]
  );

  if (!start) return null;

  try {
    const tableWidth = TABLE_WIDTH;
    const tableHeight = TABLE_HEIGHT;
    const cushionWidth = CUSHION_WIDTH;
    const maxBounces = 1;
    const scale = 1;

    const direction = [start[0] - aimEnd[0], start[1] - aimEnd[1]];
    const smoothingFactor = 0.01; // Чем меньше значение, тем плавнее изменение
    direction[0] = direction[0] * (1 - smoothingFactor) + direction[0] * smoothingFactor;
    direction[1] = direction[1] * (1 - smoothingFactor) + direction[1] * smoothingFactor;

    const maxAngleChange = Math.PI / 6; 
    const newDirection = new THREE.Vector2(start[0] - aimEnd[0], start[1] - aimEnd[1]).normalize();
    let currentDirection = new THREE.Vector2(direction[0], direction[1]).normalize();
    
    const angleDifference = currentDirection.angle() - newDirection.angle();
    if (Math.abs(angleDifference) > maxAngleChange) {
      const clampedAngle = Math.sign(angleDifference) * maxAngleChange;
      newDirection.rotateAround(new THREE.Vector2(0, 0), clampedAngle);
    }
    
    direction[0] = newDirection.x;
    direction[1] = newDirection.y;
  

    const trajectoryPoints = calculateTrajectory(
      start,
      direction,
      tableWidth,
      tableHeight,
      cushionWidth,
      maxBounces,
      scale
    );

    const threePoints = trajectoryPoints.map(
      (point) => new THREE.Vector3(point[0], point[1], 0.2)
    );
    const threePointsNew = [];
    let collisionDetected = false;
    let collidedBall = null;
    const circleRadius = 0.1;

    const tableGroup = scene.children.find(
      (child) => child.userData.id === "table-group"
    );
    if (!tableGroup) {
      console.warn("Table group not found in scene.");
      return null;
    }
    const elements = tableGroup.children;

    const balls = elements.filter(
      (element) => element.type === "Mesh" && element.userData.id !== "ball-white"
    );
    const ballPositions = balls.map((ball) => {
      const pos = new THREE.Vector3();
      ball.getWorldPosition(pos);
      return pos;
    });
    const ballRadii = balls.map(
      (ball) => ball.geometry.parameters.radius * 1.1
    );

    const table = elements.find((child) => child.type === "Group")?.children || [];
    const cushions = table.filter(
      (element) =>
        element.userData.id === "cushion" ||
        element.userData.id === "trapezoidCushion"
    );
    const cushionData = cushions.map((cushion) => {
      const box = new THREE.Box3().setFromObject(cushion);
      return { box, cushion };
    });

    for (let i = 0; i < threePoints.length - 1 && !collisionDetected; i++) {
      const point1 = threePoints[i];
      const point2 = threePoints[i + 1];
      const distance = point1.distanceTo(point2);
      const count = Math.max(Math.floor(distance / 0.01), 1);

      for (let j = 0; j < count && !collisionDetected; j++) {
        const t = j / count;
        const newPoint = new THREE.Vector3().lerpVectors(point1, point2, t);
        newPoint.z = 0.02;

        for (let k = 0; k < ballPositions.length; k++) {
          const ballPosition = ballPositions[k];
          const ballRadius = ballRadii[k];
          if (newPoint.distanceTo(ballPosition) < ballRadius + circleRadius) {
            collisionDetected = true;
            collidedBall = ballPosition.clone();
            const angle = Math.atan2(
              newPoint.y - ballPosition.y,
              newPoint.x - ballPosition.x
            );
            newPoint.x = ballPosition.x + Math.cos(angle) * (ballRadius + circleRadius);
            newPoint.y = ballPosition.y + Math.sin(angle) * (ballRadius + circleRadius);
            break;
          }
        }

        cushionData.forEach(({ box, cushion }) => {
          const expandedBox = box.clone().expandByScalar(circleRadius);
          if (expandedBox.containsPoint(newPoint)) {
            collisionDetected = true;
            const cushionPosition = new THREE.Vector3();
            const cushionNormal = new THREE.Vector3();
            cushion.getWorldPosition(cushionPosition);
            cushion.getWorldDirection(cushionNormal);
            const closestPoint = new THREE.Vector3();
            box.clampPoint(newPoint, closestPoint);
            cushionNormal.subVectors(newPoint, closestPoint).normalize();
            const cushionEdge = closestPoint.clone().add(cushionNormal.clone().multiplyScalar(circleRadius));
            newPoint.copy(cushionEdge);
            const reflection = new THREE.Vector3(-direction[0], -direction[1], 0).reflect(cushionNormal);
            direction[0] = reflection.x;
            direction[1] = reflection.y;
          }
        });

        threePointsNew.push(newPoint);
        if (collisionDetected) break;
      }
    }

    if (threePointsNew.length === 0 && threePoints.length > 0) {
      threePointsNew.push(threePoints[threePoints.length - 1]);
    }

    const startPoint = new THREE.Vector3(start[0], start[1], 0.2);
    const endPoint = threePointsNew[threePointsNew.length - 1];
    const straightLine = new THREE.Line3(startPoint, endPoint);
    const isLineStraight = threePointsNew.every((point) => {
      const closestPoint = new THREE.Vector3();
      straightLine.closestPointToPoint(point, true, closestPoint);
      return point.distanceTo(closestPoint) < 0.01;
    });

    if (!isLineStraight) {
      threePointsNew.length = 0;
      const lineDirection = new THREE.Vector3().subVectors(endPoint, startPoint);
      const lineLength = lineDirection.length();
      const segments = Math.ceil(lineLength / 0.1);
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const point = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
        threePointsNew.push(point);
      }
    }

    const lineGeometry = new LineGeometry();
    const mainPoints = threePointsNew.flatMap((point) => [point.x, point.y, 0.6]);

    let circlePoints = [];
    if (threePointsNew.length >= 2) {

      const lastPoint = threePointsNew[threePointsNew.length - 1];
      const prevPoint = threePointsNew[threePointsNew.length - 2];
      const directionVector = new THREE.Vector2(
        lastPoint.x - prevPoint.x,
        lastPoint.y - prevPoint.y
      ).normalize();
    
      const startAngle = Math.atan2(directionVector.y, directionVector.x) + Math.PI;
      const circleSegments = 100;
      const zPos = BALL_RADIUS / 2;
    
      for (let i = 0; i <= circleSegments; i++) {
        const angle = startAngle + (i / circleSegments) * Math.PI * 2;
        const x = lastPoint.x + Math.cos(angle) * BALL_RADIUS;
        const y = lastPoint.y + Math.sin(angle) * BALL_RADIUS;
        circlePoints.push(x, y, zPos);
      }
    }    

    let extraLines = null;
    let whitePointsLine = [];
    if (collisionDetected && collidedBall) {
      const incoming = new THREE.Vector3(direction[0], direction[1], 0).normalize();
      const collisionPoint = endPoint.clone();
      const n = collidedBall.clone().sub(collisionPoint).normalize();
      const dot = incoming.dot(n);
      const objectDir = n.clone().multiplyScalar(dot);
      const whiteDir = incoming.clone().sub(objectDir);

      const extraMaxBounces = 1;
      const objectTrajectory = calculateTrajectory(
        [collisionPoint.x, collisionPoint.y],
        [objectDir.x, objectDir.y],
        tableWidth,
        tableHeight,
        cushionWidth,
        extraMaxBounces,
        1
      );
      const whiteTrajectory = calculateTrajectory(
        [collisionPoint.x, collisionPoint.y],
        [whiteDir.x, whiteDir.y],
        tableWidth,
        tableHeight,
        cushionWidth,
        extraMaxBounces,
        1
      );

      const trimmedObjectTrajectory = trimTrajectory(objectTrajectory, 0.7);
      const trimmedWhiteTrajectory = trimTrajectory(whiteTrajectory, 0.5);

      const objectPointsNew = [];
      for (let i = 0; i < trimmedObjectTrajectory.length - 1; i++) {
        const [x1, y1] = trimmedObjectTrajectory[i];
        const [x2, y2] = trimmedObjectTrajectory[i + 1];
        const p1 = new THREE.Vector2(x1, y1);
        const p2 = new THREE.Vector2(x2, y2);
        const dist = p1.distanceTo(p2);
        const count = Math.max(Math.floor(dist / 0.1), 1);
        for (let j = 0; j < count; j++) {
          const t = j / count;
          const x = THREE.MathUtils.lerp(x1, x2, t);
          const y = THREE.MathUtils.lerp(y1, y2, t);
          objectPointsNew.push([x, y]);
        }
      }
      objectPointsNew.splice(0, 2);

      const objectPoints = objectPointsNew.map(
        (pt) => new THREE.Vector3(pt[0], pt[1], 0.6)
      );
      const whitePoints = trimmedWhiteTrajectory.map(
        (pt) => new THREE.Vector3(pt[0], pt[1], 0.6)
      );
      const objectLineGeometry = new LineGeometry();
      const objectLinePoints = objectPoints.flatMap((p) => [p.x, p.y, p.z]);
      const whiteLinePoints = whitePoints.flatMap((p) => [p.x, p.y, p.z]);

      whitePointsLine.push(...whiteLinePoints);
      objectLineGeometry.setPositions(objectLinePoints);

      const extraLineMaterial = new LineMaterial({
        color: "white",
        linewidth: 2,
        resolution: resolution,
      });

      extraLines = (
        <>
          <primitive object={new Line2(objectLineGeometry, borderMaterial)} />
          <primitive object={new Line2(objectLineGeometry, extraLineMaterial)} />
        </>
      );
    }

    const allPoints = [...mainPoints, ...circlePoints, ...whitePointsLine];
    lineGeometry.setPositions(allPoints);

    return (
      <>
        <primitive object={new Line2(lineGeometry, borderMaterial)} />
        <primitive object={new Line2(lineGeometry, lineMaterial)} />
        {extraLines}
      </>
    );
  } catch (error) {
    console.error("Error in AimLine:", error);
    return null;
  }
}

export default AimLine;