import { useRef, useMemo, useCallback } from "react"
import * as THREE from "three"
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

import cueTextureUrl from "../../../../assets/game/ceus/cue.png"

function Cue({ start, end, power }) {
    const cueRef = useRef()
    const cueTexture = useLoader(TextureLoader, cueTextureUrl)

    cueTexture.wrapS = THREE.RepeatWrapping
    cueTexture.wrapT = THREE.RepeatWrapping
    cueTexture.repeat.set(1, 1)

    const calculateCuePosition = useCallback(() => {
        if (!start || !end) return null

        const directionX = end[0] - start[0]
        const directionY = end[1] - start[1]

        const length = Math.sqrt(directionX * directionX + directionY * directionY)

        const normalizedDirX = directionX / length
        const normalizedDirY = directionY / length

        const powerFactor = (power - 1) / 10

        const additionalDistance = powerFactor * 0.8
        const totalDistance = 0.2 + additionalDistance

        const cueEndX = start[0] + normalizedDirX * totalDistance
        const cueEndY = start[1] + normalizedDirY * totalDistance

        const cueX = cueEndX + normalizedDirX * 1.75
        const cueY = cueEndY + normalizedDirY * 1.75

        const angle = Math.atan2(directionY, directionX)

        return { position: [cueX, cueY, 0.6], rotation: angle }
    }, [start, end, power])

    const cuePosition = useMemo(() => calculateCuePosition(), [calculateCuePosition])

    useFrame(() => {
        if (!cueRef.current || !cuePosition) return

        cueRef.current.position.set(...cuePosition.position)
        cueRef.current.rotation.z = cuePosition.rotation
    })

    if (!cuePosition) return null

    return (
        <group ref={cueRef}>
            <mesh>
                <boxGeometry args={[3.5, 0.5, 0.08]} />
                <meshStandardMaterial map={cueTexture} transparent={true} side={THREE.DoubleSide} />
            </mesh>
        </group>
    )
}

export default Cue