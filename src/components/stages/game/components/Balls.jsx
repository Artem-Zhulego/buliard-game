import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { useSphere } from '@react-three/cannon';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BALL_RADIUS, TABLE_HEIGHT, TABLE_WIDTH } from '../utils/constants';
import { useGameStore, useUserStore } from '../../../../store/store';
import socket from '../../../utils/game';

const ballVelocities = new Map();
const ballAngularVelocities = new Map();
const ballApis = new Map();

export const Ball = forwardRef(({ position, map, id }, ref) => {
  const { user } = useUserStore();
  const { updateGames, addBall, getCurrentPlayer } = useGameStore();

  const [meshRef, api] = useSphere(() => ({
    mass: 0.17,
    position,
    args: [BALL_RADIUS],
    linearFactor: [1, 1, 0],
    angularFactor: [1, 1, 1],
    linearDamping: 0.25,
    angularDamping: 0.3,
    friction: 0.02,
    restitution: 0.4,
    material: {
      friction: 0.02,
      restitution: 0.4,
    },
    ccdSpeedThreshold: 0.01,
    ccdMotionThreshold: BALL_RADIUS * 4,
    userData: { id: `ball-${id}` },
    onCollide: handleCollision,
  }));

  const velocityRef = useRef(new THREE.Vector3());
  const angularVelocityRef = useRef(new THREE.Vector3());
  const [initialSpeedReached, setInitialSpeedReached] = useState(false);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => {
      const maxSpeed = 10;
      const speed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

      if (speed > maxSpeed) {
        api.velocity.set(
          (v[0] / speed) * maxSpeed,
          (v[1] / speed) * maxSpeed,
          0
        );
      }

      velocityRef.current.set(v[0], v[1], v[2]);
      ballVelocities.set(id, velocityRef.current.clone());
    });

    return () => {
      unsubscribe();
      ballVelocities.delete(id);
    };
  }, [api.velocity, id]);

  useEffect(() => {
    const unsubscribeAng = api.angularVelocity.subscribe((v) => {
      const maxSpin = 4;
      const spin = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

      if (spin > maxSpin) {
        api.angularVelocity.set(
          (v[0] / spin) * maxSpin,
          (v[1] / spin) * maxSpin,
          (v[2] / spin) * maxSpin
        );
      }

      angularVelocityRef.current.set(v[0], v[1], v[2]);
      ballAngularVelocities.set(id, angularVelocityRef.current.clone());
    });

    return () => {
      unsubscribeAng();
      ballAngularVelocities.delete(id);
    };
  }, [api.angularVelocity, id]);

  useEffect(() => {
    ballApis.set(id, api);
    return () => {
      ballApis.delete(id);
    };
  }, [api, id]);

  useFrame((_state, delta) => {
    const lv = velocityRef.current;
    const speed = lv.length();

    if (!initialSpeedReached && speed >= 0.1) {
      setInitialSpeedReached(true);
    }

    if (speed > 0.01) {
      const desiredOmegaX = -lv.y / BALL_RADIUS;
      const desiredOmegaY = lv.x / BALL_RADIUS;
      const currentOmega = angularVelocityRef.current;
      const rate = 5;
      const newOmegaX =
        currentOmega.x + (desiredOmegaX - currentOmega.x) * rate * delta;
      const newOmegaY =
        currentOmega.y + (desiredOmegaY - currentOmega.y) * rate * delta;

      api.angularVelocity.set(newOmegaX, newOmegaY, currentOmega.z);
    }

    if (initialSpeedReached && speed < 0.05) {
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    }

    api.sleepSpeedLimit.set(speed < 0.2 ? 0.1 : 0.5);
  });

  function handleCollision(e) {

    if (e.body.userData?.id === 'pocket') {
      if (meshRef.current) {

        socket.send('scored', {
          game_id: user.game.data.id,
          user_id: '1038855897',
          ball_id: id,
        });

        if (meshRef.current.parent) {
          meshRef.current.parent.remove(meshRef.current);
        }
        if (meshRef.current.geometry) {
          meshRef.current.geometry.dispose();
        }
        if (meshRef.current.material) {
          meshRef.current.material.dispose();
        }

        ballApis.delete(id);

        api.position.set(100, 100, -10);
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        api.sleep();

        const ballsLeft = getRemainingBalls();
        if (ballsLeft > 0) {

          const current = getCurrentPlayer() === 'player' ? 'bot' : 'player';
          updateGames('isScored', true);
          addBall(current, id);
        } else {

          updateGames('gameOver', true);
        }
      }
    }

    if (e.body.userData?.id === 'cushion') {

      const normal = new THREE.Vector3(
        -Math.sign(velocityRef.current.x),
        -Math.sign(velocityRef.current.y),
        0
      );
      const reflectedVelocity = velocityRef.current
        .clone()
        .reflect(normal)
        .multiplyScalar(0.88);

      api.velocity.set(
        reflectedVelocity.x,
        reflectedVelocity.y,
        reflectedVelocity.z
      );
    }

    if (e.body.userData?.id && e.body.userData.id.startsWith('ball-')) {
      const otherBallId = Number(e.body.userData.id.replace('ball-', ''));
      const otherApi = ballApis.get(otherBallId);
      if (!otherApi) return;

      const myAngular = angularVelocityRef.current.clone();
      const otherAngular =
        ballAngularVelocities.get(otherBallId) || new THREE.Vector3();

      const spinLossFactor = 0.88;
      const relativeSpin = myAngular
        .clone()
        .sub(otherAngular)
        .multiplyScalar(0.5 * spinLossFactor);

      api.angularVelocity.set(
        myAngular.x - relativeSpin.x,
        myAngular.y - relativeSpin.y,
        myAngular.z - relativeSpin.z
      );

      otherApi.angularVelocity.set(
        otherAngular.x + relativeSpin.x,
        otherAngular.y + relativeSpin.y,
        otherAngular.z + relativeSpin.z
      );
    }
  }

  function getRemainingBalls() {
    return Array.from(ballApis.keys()).length;
  }

  React.useImperativeHandle(ref, () => ({
    velocityRef,
    angularVelocityRef,
    api,
    id,
  }));

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[BALL_RADIUS, 64, 64]} />
      <meshPhysicalMaterial
        map={map}
        roughness={0.1}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1}
        color={new THREE.Color(0xdddddd)}
      />
    </mesh>
  );
});

export const WhiteBall = forwardRef(
  ({ map, aimStart, aimEnd, hit, powerCoefficient, id }, ref) => {
    const { updateGames } = useGameStore();

    const [meshRef, api] = useSphere(() => ({
      mass: 0.17,
      position: [-TABLE_WIDTH / 4, 0, 0.1],
      args: [BALL_RADIUS],
      linearFactor: [1, 1, 0],
      angularFactor: [1, 1, 1],
      linearDamping: 0.25,
      angularDamping: 0.3,
      friction: 0.02,
      restitution: 0.4,
      material: {
        friction: 0.02,
        restitution: 0.4,
      },
      ccdSpeedThreshold: 0.01,
      ccdMotionThreshold: BALL_RADIUS * 4,
      userData: { id },
      onCollide: handleCollision,
    }));

    const velocityRef = useRef(new THREE.Vector3());
    const angularVelocityRef = useRef(new THREE.Vector3());
    const [initialSpeedReached, setInitialSpeedReached] = useState(false);

    useEffect(() => {
      const unsubscribe = api.velocity.subscribe((v) => {
        const maxSpeed = 10;
        const speed = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

        if (speed > maxSpeed) {
          api.velocity.set(
            (v[0] / speed) * maxSpeed,
            (v[1] / speed) * maxSpeed,
            0
          );
        }

        velocityRef.current.set(v[0], v[1], v[2]);
        ballVelocities.set(id, velocityRef.current.clone());
      });

      return () => {
        unsubscribe();
        ballVelocities.delete(id);
      };
    }, [api.velocity, id]);

    useEffect(() => {
      const unsubscribeAng = api.angularVelocity.subscribe((v) => {
        const maxSpin = 4;
        const spin = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

        if (spin > maxSpin) {
          api.angularVelocity.set(
            (v[0] / spin) * maxSpin,
            (v[1] / spin) * maxSpin,
            (v[2] / spin) * maxSpin
          );
        }

        angularVelocityRef.current.set(v[0], v[1], v[2]);
        ballAngularVelocities.set(id, angularVelocityRef.current.clone());
      });

      return () => {
        unsubscribeAng();
        ballAngularVelocities.delete(id);
      };
    }, [api.angularVelocity, id]);

    useEffect(() => {
      ballApis.set(id, api);
      return () => {
        ballApis.delete(id);
      };
    }, [api, id]);

    useEffect(() => {
      if (hit && aimStart && aimEnd) {

        const direction = new THREE.Vector3(
          aimStart[0] - aimEnd[0],
          aimStart[1] - aimEnd[1],
          0
        ).normalize();

        if (direction.length() > 0) {
          setInitialSpeedReached(false);
          const maxPower = 10;
          const computedPower = THREE.MathUtils.clamp(
            powerCoefficient,
            1,
            maxPower
          );

          api.velocity.set(
            direction.x * computedPower,
            direction.y * computedPower,
            0
          );
          api.angularVelocity.set(0, 0, 0);
        }
      }
    }, [hit, aimStart, aimEnd, powerCoefficient, api]);

    useFrame((_state, delta) => {
      const lv = velocityRef.current;
      const speed = lv.length();

      if (!initialSpeedReached && speed >= 0.1) {
        setInitialSpeedReached(true);
      }

      if (speed > 0.01) {
        const desiredOmegaX = -lv.y / BALL_RADIUS;
        const desiredOmegaY = lv.x / BALL_RADIUS;
        const currentOmega = angularVelocityRef.current;
        const rate = 5;

        const newOmegaX =
          currentOmega.x + (desiredOmegaX - currentOmega.x) * rate * delta;
        const newOmegaY =
          currentOmega.y + (desiredOmegaY - currentOmega.y) * rate * delta;

        api.angularVelocity.set(newOmegaX, newOmegaY, currentOmega.z);
      }

      if (initialSpeedReached && speed < 0.05) {
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
      }

      api.sleepSpeedLimit.set(speed < 0.2 ? 0.1 : 0.5);
    });

    function handleCollision(e) {

      if (e.body.userData?.id === 'pocket') {
        api.velocity.set(0, 0, 0);
        api.angularVelocity.set(0, 0, 0);
        api.position.set(-TABLE_WIDTH / 4, 0, 0.1);
      }

      if (e.body.userData?.id === 'cushion') {
        const normal = new THREE.Vector3(
          -Math.sign(velocityRef.current.x),
          -Math.sign(velocityRef.current.y),
          0
        );
        const reflectedVelocity = velocityRef.current
          .clone()
          .reflect(normal)
          .multiplyScalar(0.88);

        api.velocity.set(
          reflectedVelocity.x,
          reflectedVelocity.y,
          reflectedVelocity.z
        );
      }

      if (e.body.userData?.id && e.body.userData.id.startsWith('ball-')) {
        const otherBallId = Number(e.body.userData.id.replace('ball-', ''));
        const otherApi = ballApis.get(otherBallId);
        if (!otherApi) return;

        const myAngular = angularVelocityRef.current.clone();
        const otherAngular =
          ballAngularVelocities.get(otherBallId) || new THREE.Vector3();

        const spinLossFactor = 0.88;
        const relativeSpin = myAngular
          .clone()
          .sub(otherAngular)
          .multiplyScalar(0.5 * spinLossFactor);

        api.angularVelocity.set(
          myAngular.x - relativeSpin.x,
          myAngular.y - relativeSpin.y,
          myAngular.z - relativeSpin.z
        );

        otherApi.angularVelocity.set(
          otherAngular.x + relativeSpin.x,
          otherAngular.y + relativeSpin.y,
          otherAngular.z + relativeSpin.z
        );
      }
    }

    React.useImperativeHandle(ref, () => ({
      velocityRef,
      angularVelocityRef,
      api,
      id,
    }));

    return (
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[BALL_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={map}
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1}
          color={new THREE.Color(0xffffff)}
        />
      </mesh>
    );
  }
);

function ColoredBalls({ maps, ballRefs }) {
  const startX = TABLE_HEIGHT / 2.35;
  const startY = 0;
  const startZ = 0.1;
  let ballCount = 1;
  const balls = [];

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= row; col++) {
      const x = startX + row * BALL_RADIUS * 2;
      const y = startY + (col - row / 2) * BALL_RADIUS * 2;
      const currentBallCount = ballCount;
      ballCount++;

      balls.push(
        <Ball
          key={currentBallCount}
          position={[x, y, startZ]}
          map={maps[currentBallCount - 1]}
          id={currentBallCount}
          ref={(ball) => {
            if (ball) {
              ballRefs.current[currentBallCount] = ball;
            }
          }}
        />
      );
    }
  }

  return <>{balls}</>;
}

export function BallManager({ whiteBallProps, coloredBallsProps, ballRefs }) {
  return (
    <>
      <WhiteBall
        {...whiteBallProps}
        ref={(ball) => {
          if (ball) {
            ballRefs.current[0] = ball;
          }
        }}
      />
      <ColoredBalls {...coloredBallsProps} ballRefs={ballRefs} />
    </>
  );
}