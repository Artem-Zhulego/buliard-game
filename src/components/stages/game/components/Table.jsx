import { useRef, useState, useCallback, useEffect, useImperativeHandle, forwardRef, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { usePlane } from "@react-three/cannon"
import { Plane } from "@react-three/drei"
import * as THREE from "three"

import { TABLE_WIDTH, TABLE_HEIGHT, CUSHION_WIDTH, POCKET_RADIUS, rotatePng90 } from "../utils/constants"
import { useTableTextures, useBallTextures } from "../utils/textures"

import { Cushion, Cushion2, Pocket, PocketCushion, BlockLine, TrapezoidCushion, TrapezoidCushion2 } from "../components/TableElements"
import { BallManager } from "../components/Balls"
import AimLine from "../components/AimLine"
import Cue from "../components/Cue"
import { getBallPosition, getPocketPosition } from "../game"

import { useGameStore, useUserStore } from "../../../../store/store"
import socket from "../../../utils/game"

const Table = forwardRef((data, ref) => {
    const [cloth, bordureLeftPng, bordureRightPng, bordureUpDownPng, hole, centerHole, otherHole, bordureLeftDotPng, bordureRightDotPng, bordureUpDownDotPng] = useTableTextures()
    const ballTextures = useBallTextures()
    const { user } = useUserStore()

    const { games, updateGames } = useGameStore()

    const pocketOffset = (POCKET_RADIUS + 0.15) * 1.5
    const leftPocketEnd = -TABLE_WIDTH / 2 + pocketOffset + POCKET_RADIUS
    const rightPocketStart = TABLE_WIDTH / 2 - pocketOffset - POCKET_RADIUS

    const { gl, camera } = useThree()

    const [line, setLine] = useState(true)
    const [aimEnd, setAimEnd] = useState([-TABLE_WIDTH / 2, 0])
    const [lineStart, setLineStart] = useState(null)
    const [power, setPower] = useState(1)

    const isAnyBallMovingRef = useRef(false)
    const isPointerDownRef = useRef(false)
    const initialMouseRef = useRef(null)
    const ballRefs = useRef([])
    const tableGroupRef = useRef()
    const isCheckingRef = useRef(false)
    const prevPositionsRef = useRef([])
    const unsubscribesRef = useRef([])

    useEffect(() => {
        const balls = ballRefs.current
        prevPositionsRef.current = balls.map(() => [0, 0, 0])

        let timeoutId = null

        const checkMovement = () => {
            if (isCheckingRef.current) return
            isCheckingRef.current = true

            let anyBallMoving = false
            let checkedBalls = 0

            unsubscribesRef.current.forEach((unsubscribe) => unsubscribe())
            unsubscribesRef.current = []

            balls.forEach((ball, index) => {
                if (ball?.api?.position) {
                    const unsubscribe = ball.api.position.subscribe((position) => {
                        const prevPosition = prevPositionsRef.current[index]

                        const isMoving =
                            Math.abs(position[0] - prevPosition[0]) > 0.001 || Math.abs(position[1] - prevPosition[1]) > 0.001

                        if (isMoving) {
                            anyBallMoving = true
                        }

                        prevPositionsRef.current[index] = position
                        checkedBalls++

                        if (checkedBalls === balls.length) {
                            finishCheck(anyBallMoving)
                        }

                        unsubscribe()
                    })

                    unsubscribesRef.current.push(unsubscribe)
                } else {
                    checkedBalls++
                }
            })

            if (checkedBalls === balls.length) {
                finishCheck(anyBallMoving)
            }
        }

        const finishCheck = (anyBallMoving) => {
            if (anyBallMoving) {
                updateGames("isMoving", true)
                setLine(false)
            } else {
                const whiteBallPosition = prevPositionsRef.current[0]
                updateGames("isMoving", false)
                setLineStart([whiteBallPosition[0], whiteBallPosition[1]])
                setLine(true)
                setPower(1)
                updateGames("hit", false)
                updateGames("pocket", false)
                updateGames("AImove", null)
            }

            isCheckingRef.current = false
            timeoutId = setTimeout(checkMovement, 100)
        }

        checkMovement()

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            unsubscribesRef.current.forEach((unsubscribe) => unsubscribe())
        }
    }, [updateGames])

    const handlePointerDown = useCallback((event) => {
        if (isAnyBallMovingRef.current || isPointerDownRef.current || games.hit || games.block) return
        isPointerDownRef.current = true

        const rect = gl.domElement.getBoundingClientRect()
        const screenX = rect.width
        const screenY = rect.height - Math.abs(rect.top) * 2

        const mouseX = event.clientX
        const mouseY = event.clientY

        const ballX = lineStart[0]
        const ballY = lineStart[1]

        const ballWorldPosition = new THREE.Vector3(ballX, ballY, 0)
        const ballScreenPosition = ballWorldPosition.clone().project(camera)

        const ballXScreen = ((ballScreenPosition.x + 1) / 2) * screenX
        const ballYScreen = ((-ballScreenPosition.y + 1) / 2) * screenY

        const pointerX = mouseX - ballXScreen
        const pointerY = mouseY - ballYScreen

        initialMouseRef.current = { x: mouseX, y: mouseY, pointerX, pointerY }
    }, [games.hit, gl, lineStart])

    const handlePointerMove = useCallback((event) => {
        if (isAnyBallMovingRef.current || !isPointerDownRef.current || games.hit || games.block) return

        const rect = gl.domElement.getBoundingClientRect()
        const screenX = rect.width
        const screenY = rect.height - Math.abs(rect.top) * 2

        const mouseX = event.clientX
        const mouseY = event.clientY

        const ballX = lineStart[0]
        const ballY = lineStart[1]

        const ballWorldPosition = new THREE.Vector3(ballX, ballY, 0)
        const ballScreenPosition = ballWorldPosition.clone().project(camera)

        const ballXScreen = ((ballScreenPosition.x + 1) / 2) * screenX
        const ballYScreen = ((-ballScreenPosition.y + 1) / 2) * screenY

        const pointerX = mouseX - ballXScreen
        const pointerY = mouseY - ballYScreen

        if (!initialMouseRef.current) {
            initialMouseRef.current = { x: mouseX, y: mouseY, pointerX, pointerY }
            return
        }

        const prevPointerX = initialMouseRef.current.pointerX
        const prevPointerY = initialMouseRef.current.pointerY

        const crossProduct = prevPointerX * pointerY - prevPointerY * pointerX

        const initialMouseX = initialMouseRef.current.x
        const initialMouseY = initialMouseRef.current.y
        const deltaX = mouseX - initialMouseX
        const deltaY = mouseY - initialMouseY
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
        const rotationSpeed = Math.min(distance * 0.06, 2)

        const angle = (crossProduct > 0 ? -1 : 1) * rotationSpeed

        const cosAngle = Math.cos(angle)
        const sinAngle = Math.sin(angle)

        const newAimEndX = cosAngle * (aimEnd[0] - ballX) - sinAngle * (aimEnd[1] - ballY) + ballX
        const newAimEndY = sinAngle * (aimEnd[0] - ballX) + cosAngle * (aimEnd[1] - ballY) + ballY

        const smoothFactor = 0.07
        const smoothedAimEndX = aimEnd[0] + (newAimEndX - aimEnd[0]) * smoothFactor
        const smoothedAimEndY = aimEnd[1] + (newAimEndY - aimEnd[1]) * smoothFactor

        setAimEnd([smoothedAimEndX, smoothedAimEndY])

        initialMouseRef.current = { x: mouseX, y: mouseY, pointerX, pointerY }
    }, [aimEnd, games.hit, gl, lineStart])

    const handlePointerUp = useCallback(() => {
        if (isAnyBallMovingRef.current || !isPointerDownRef.current || games.hit || games.block) return
        isPointerDownRef.current = false
        initialMouseRef.current = null
    }, [games.hit])

    useEffect(() => {
        const canvas = gl.domElement

        canvas.style.touchAction = "none"

        canvas.addEventListener("pointerdown", handlePointerDown)
        canvas.addEventListener("pointermove", handlePointerMove)
        canvas.addEventListener("pointerup", handlePointerUp)

        return () => {
            canvas.removeEventListener("pointerdown", handlePointerDown)
            canvas.removeEventListener("pointermove", handlePointerMove)
            canvas.removeEventListener("pointerup", handlePointerUp)
        }
    }, [gl, handlePointerDown, handlePointerMove, handlePointerUp])

    useImperativeHandle(ref, () => ({
        getBallRefs: () => ballRefs.current,
        getTableGroup: () => tableGroupRef.current,
    }), [])

    const [tableRef] = usePlane(() => ({
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        userData: { id: "table" },
    }))

    const AImove = () => {
        if (games.AImove && !games.hit) {
            const { x, y, power } = games.AImove

            const targetX = x
            const targetY = y

            const ballX = lineStart[0]
            const ballY = lineStart[1]

            const relativeTargetX = -(targetX - ballX)
            const relativeTargetY = -(targetY - ballY)

            const newAimEndX = ballX + relativeTargetX
            const newAimEndY = ballY + relativeTargetY

            const startTime = Date.now()
            const duration = 2000

            const animateLine = () => {
                const elapsedTime = Date.now() - startTime
                const progress = Math.min(elapsedTime / duration, 1)

                const newX = aimEnd[0] + (newAimEndX - aimEnd[0]) * progress
                const newY = aimEnd[1] + (newAimEndY - aimEnd[1]) * progress

                setAimEnd([newX, newY])

                if (progress < 1) {
                    requestAnimationFrame(animateLine)
                } else {
                    const powerStartTime = Date.now()
                    const powerDuration = 1000
                    const animatePower = () => {
                        const powerElapsedTime = Date.now() - powerStartTime
                        const powerProgress = Math.min(powerElapsedTime / powerDuration, 1)
                        setPower(power * powerProgress)
                        if (powerProgress < 1) {
                            requestAnimationFrame(animatePower)
                        }
                    }
                    animatePower()
                    setTimeout(() => {
                        updateGames("hit", true)
                        updateGames("block", false)
                        updateGames("current", "player")
                        updateGames("count", games.count + 1)
                    }, 1000)
                }
            }

            animateLine()
        }
    }

    useEffect(() => {
        if (games.AImove && games.current === "bot") {
            AImove()
        }
    }, [games.AImove, games.current])

    useEffect(() => {
        const fetchData = async () => {
            if (!games.isMoving) {
                if (games.count === 0) return;
                const { ballPositions, whiteBall } = await getBallPosition(ballRefs.current);
                const pocketsData = await getPocketPosition(tableGroupRef.current);
    
                await socket.send('hit', {
                    game_id: user.game.data.id,
                    user_id: games.current === "player" ? "1" : "1038855897",
                    balls: ballPositions,
                    holes: pocketsData,
                    scored: games.isScored,
                    white_ball: {
                        x: whiteBall.x,
                        y: whiteBall.y,
                        z: whiteBall.z,
                    }
                });

                updateGames("isScored", false);
            }
        };
    
        fetchData();
    }, [games.isMoving]);
    

    const memoizedTableStructure = useMemo(() => (
        <group ref={tableGroupRef} userData={{ id: "tableRef" }}>
            <Plane ref={tableRef} receiveShadow>
                <boxGeometry args={[TABLE_WIDTH - 1, TABLE_HEIGHT - 1, 0.1]} />
                <meshPhysicalMaterial
                    map={cloth}
                    clearcoat={0.5} // Максимальная чистота поверхности
                    clearcoatRoughness={0.1} // Чуть шероховатая поверхность сукна
                    reflectivity={0.01} // Лёгкое отражение
                    roughness={0.1} // Немного шероховатости
                    metalness={0.01} // Чуть металлический эффект
                />
            </Plane>

            <BlockLine position={[-TABLE_HEIGHT / 2.35, 0, 0.1]} size={[0.05, TABLE_HEIGHT - 1, 0.1]} />

            <Cushion position={[TABLE_WIDTH / 2.11 - CUSHION_WIDTH / 2, 0, 0.2]} size={[CUSHION_WIDTH, TABLE_HEIGHT / 1.3, 0.3]} map={bordureRightPng} material={{ friction: 0.05, restitution: 0.5 }} />
            <Cushion position={[TABLE_WIDTH / 2.11 - CUSHION_WIDTH / 2, 0, 0.2]} size={[CUSHION_WIDTH, TABLE_HEIGHT / 1.3, 0.3]} map={bordureRightDotPng} material={{ friction: 0.05, restitution: 0.5 }} />
            <Cushion position={[-TABLE_WIDTH / 2.11 + CUSHION_WIDTH / 2, 0, 0.2]} size={[CUSHION_WIDTH, TABLE_HEIGHT / 1.3, 0.3]} map={bordureLeftPng} material={{ friction: 0.05, restitution: 0.5 }} />
            <Cushion position={[-TABLE_WIDTH / 2.11 + CUSHION_WIDTH / 2, 0, 0.2]} size={[CUSHION_WIDTH, TABLE_HEIGHT / 1.3, 0.3]} map={bordureLeftDotPng} material={{ friction: 0.05, restitution: 0.5 }} />

            <TrapezoidCushion position={[TABLE_WIDTH / 2.2 - CUSHION_WIDTH / 2, 0, 0.2]} size1={[0.15, TABLE_HEIGHT * pocketOffset * 1.6, 0.3]} size2={[0.15, TABLE_HEIGHT * pocketOffset * 1.8, 0.3]} />
            <TrapezoidCushion position={[-(TABLE_WIDTH / 2.2 - CUSHION_WIDTH / 2), 0, 0.2]} size1={[0.15, TABLE_HEIGHT * pocketOffset * 1.8, 0.3]} size2={[0.15, TABLE_HEIGHT * pocketOffset * 1.6, 0.3]} />

            <Cushion2 position={[TABLE_WIDTH / 2.2 - CUSHION_WIDTH / 2, 0, 0.2]} size={[0.15, TABLE_HEIGHT * pocketOffset * 1.75, 0.3]} />
            <Cushion2 position={[TABLE_WIDTH / 2.164 - CUSHION_WIDTH / 2, 1.64, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 4.8]} />
            <Cushion2 position={[TABLE_WIDTH / 2.164 - CUSHION_WIDTH / 2, -1.64, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 4.8]} />

            <Cushion2 position={[-(TABLE_WIDTH / 2.2 - CUSHION_WIDTH / 2), 0, 0.2]} size={[0.15, TABLE_HEIGHT * pocketOffset * 1.75, 0.3]} />
            <Cushion2 position={[-(TABLE_WIDTH / 2.164 - CUSHION_WIDTH / 2), 1.64, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 4.8]} />
            <Cushion2 position={[-(TABLE_WIDTH / 2.164 - CUSHION_WIDTH / 2), -1.64, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 4.8]} />

            <Cushion position={[0, TABLE_HEIGHT / 2.21 - CUSHION_WIDTH / 2, 0.2]} size={[TABLE_WIDTH / 1.1, CUSHION_WIDTH, 0.3]} map={bordureUpDownPng} />
            <Cushion position={[0, TABLE_HEIGHT / 2.21 - CUSHION_WIDTH / 2, 0.2]} size={[TABLE_WIDTH / 1.05, CUSHION_WIDTH, 0.3]} map={bordureUpDownDotPng} />

            <Cushion2 position={[(leftPocketEnd + -POCKET_RADIUS) / 2.15, TABLE_HEIGHT / 2.42 - CUSHION_WIDTH / 2, 0.2]} size={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.16, 0.15, 0.3]} />
            <Cushion2 position={[(leftPocketEnd + -POCKET_RADIUS) / 1.12, TABLE_HEIGHT / 2.33 - CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 3.8]} />
            <Cushion2 position={[-0.24, TABLE_HEIGHT / 2.32 - CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 6]} />

            <Cushion2 position={[(rightPocketStart + -POCKET_RADIUS) / 2.08, TABLE_HEIGHT / 2.42 - CUSHION_WIDTH / 2, 0.2]} size={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.17, 0.15, 0.3]} />
            <Cushion2 position={[(rightPocketStart + -POCKET_RADIUS) / 1.083, TABLE_HEIGHT / 2.33 - CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 3.8]} />
            <Cushion2 position={[0.24, TABLE_HEIGHT / 2.32 - CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 6]} />

            <TrapezoidCushion2
                position={[(leftPocketEnd + -POCKET_RADIUS) / 2, TABLE_HEIGHT / 2.42 - CUSHION_WIDTH / 2, 0.2]}
                size1={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.03, 0.15, 0.3]}
                size2={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.07, 0.15, 0.3]}
                size3={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.23, 0.15, 0.3]}
                size4={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.13, 0.15, 0.3]}
            />
            <TrapezoidCushion2
                position={[(rightPocketStart + -POCKET_RADIUS) / 2, TABLE_HEIGHT / 2.42 - CUSHION_WIDTH / 2, 0.2]}
                size1={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.05, 0.15, 0.3]}
                size2={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.15, 0.15, 0.3]}
                size3={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.15, 0.15, 0.3]}
                size4={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.11, 0.15, 0.3]}
            />

            <Cushion position={[0, -TABLE_HEIGHT / 2.21 + CUSHION_WIDTH / 2, 0.2]} size={[TABLE_WIDTH / 1.1, CUSHION_WIDTH, 0.3]} map={bordureUpDownPng} />
            <Cushion position={[0, -TABLE_HEIGHT / 2.21 + CUSHION_WIDTH / 2, 0.2]} size={[TABLE_WIDTH / 1.05, CUSHION_WIDTH, 0.3]} map={bordureUpDownDotPng} />

            <Cushion2 position={[(leftPocketEnd + -POCKET_RADIUS) / 2.15, -TABLE_HEIGHT / 2.42 + CUSHION_WIDTH / 2, 0.2]} size={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.16, 0.15, 0.3]} />
            <Cushion2 position={[(leftPocketEnd + -POCKET_RADIUS) / 1.12, -TABLE_HEIGHT / 2.33 + CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 3.8]} />
            <Cushion2 position={[-0.24, -TABLE_HEIGHT / 2.32 + CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 6]} />

            <Cushion2 position={[(rightPocketStart + -POCKET_RADIUS) / 2.08, -TABLE_HEIGHT / 2.42 + CUSHION_WIDTH / 2, 0.2]} size={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.17, 0.15, 0.3]} />
            <Cushion2 position={[(rightPocketStart + -POCKET_RADIUS) / 1.083, -TABLE_HEIGHT / 2.33 + CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, Math.PI / 3.8]} />
            <Cushion2 position={[0.24, -TABLE_HEIGHT / 2.32 + CUSHION_WIDTH / 2, 0.2]} size={[0.15, 0.3, 0.3]} rotation={[0, 0, -Math.PI / 6]} />

            <TrapezoidCushion2
                position={[(leftPocketEnd + -POCKET_RADIUS) / 2, -TABLE_HEIGHT / 2.42 + CUSHION_WIDTH / 2, 0.2]}
                size1={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.07, 0.15, 0.3]}
                size2={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.03, 0.15, 0.3]}
                size3={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.13, 0.15, 0.3]}
                size4={[Math.abs(leftPocketEnd + POCKET_RADIUS) / 1.23, 0.15, 0.3]}
            />
            <TrapezoidCushion2
                position={[(rightPocketStart + -POCKET_RADIUS) / 2, -TABLE_HEIGHT / 2.42 + CUSHION_WIDTH / 2, 0.2]}
                size1={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.15, 0.15, 0.3]}
                size2={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.05, 0.15, 0.3]}
                size3={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.11, 0.15, 0.3]}
                size4={[Math.abs(rightPocketStart - POCKET_RADIUS) / 1.15, 0.15, 0.3]}
            />

            <Pocket position={[-TABLE_WIDTH / 2.05 + pocketOffset, TABLE_HEIGHT / 2.1 - pocketOffset, 0.3]} map={rotatePng90(hole, 1)} />
            <PocketCushion position={[-TABLE_WIDTH / 2.035 + pocketOffset, TABLE_HEIGHT / 2.07 - pocketOffset, 0.2]} size={[CUSHION_WIDTH * 1.95, pocketOffset * 1.25, 0.4]} map={otherHole} />

            <Pocket position={[TABLE_WIDTH / 2.05 - pocketOffset, TABLE_HEIGHT / 2.1 - pocketOffset, 0.3]} map={rotatePng90(hole, 4)} />
            <PocketCushion position={[TABLE_WIDTH / 2.035 - pocketOffset, TABLE_HEIGHT / 2.07 - pocketOffset, 0.2]} size={[CUSHION_WIDTH * 1.95, pocketOffset * 1.25, 0.4]} map={rotatePng90(otherHole, 3)} />

            <Pocket position={[-TABLE_WIDTH / 2.05 + pocketOffset, -TABLE_HEIGHT / 2.1 + pocketOffset, 0.3]} map={rotatePng90(hole, 2)} />
            <PocketCushion position={[-TABLE_WIDTH / 2.035 + pocketOffset, -TABLE_HEIGHT / 2.07 + pocketOffset, 0.2]} size={[CUSHION_WIDTH * 1.95, pocketOffset * 1.25, 0.4]} map={rotatePng90(otherHole, 1)} />

            <Pocket position={[TABLE_WIDTH / 2.05 - pocketOffset, -TABLE_HEIGHT / 2.1 + pocketOffset, 0.3]} map={rotatePng90(hole, 3)} />
            <PocketCushion position={[TABLE_WIDTH / 2.035 - pocketOffset, -TABLE_HEIGHT / 2.07 + pocketOffset, 0.2]} size={[CUSHION_WIDTH * 1.95, pocketOffset * 1.25, 0.4]} map={rotatePng90(otherHole, 2)} />

            <Pocket position={[0, TABLE_HEIGHT / 2.03 - pocketOffset, 0.2]} map={rotatePng90(centerHole, 1)} central={true} />
            <Pocket position={[0, -TABLE_HEIGHT / 2.03 + pocketOffset, 0.2]} map={rotatePng90(centerHole, 3)} central={true} />
        </group>
    ), [cloth, bordureLeftPng, bordureRightPng, bordureUpDownPng, hole, centerHole, otherHole, bordureLeftDotPng, bordureRightDotPng, bordureUpDownDotPng])

    return (
        <group userData={{ id: "table-group" }}>

            {/* Освещение */}
            <ambientLight intensity={0.25} /> {/* Общий свет */}
            <directionalLight
                position={[0, 5, 5]} // Свет сверху
                intensity={0.7} // Средняя яркость
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <spotLight
                position={[0, 5, 5]} // Имитация лампы над столом
                intensity={0.7}
                angle={0.3}
                penumbra={0.25} // Мягкие края
                castShadow
            />
            
            {memoizedTableStructure}

            <BallManager
                whiteBallProps={{
                    map: ballTextures[0],
                    aimStart: lineStart,
                    aimEnd: aimEnd,
                    hit: games.hit,
                    powerCoefficient: power !== 1 ? power : data.power || 1,
                    id: "ball-white",
                }}
                coloredBallsProps={{
                    maps: ballTextures.slice(1),
                }}
                ballRefs={ballRefs}
            />

            {line && <AimLine start={lineStart} aimEnd={aimEnd} />}
            {line && <Cue start={lineStart} end={aimEnd} power={power !== 1 ? power : data.power || 1} />}
        </group>
    )
})

export default Table