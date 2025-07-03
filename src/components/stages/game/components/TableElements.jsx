import React, { useMemo, useRef } from "react"
import { useBox, useCompoundBody, useCylinder } from "@react-three/cannon"
import { POCKET_RADIUS, POCKET_DEPTH } from "../utils/constants"
import {
    Vector3,
    Float32BufferAttribute,
    BufferGeometry,
    DoubleSide,
} from "three"

export function Cushion({ position, size, map }) {
    const [ref] = useBox(() => ({
        type: "Static",
        position,
        args: size,
        friction: 0,
        restitution: 0,      
        contactEquationStiffness: 2e7,
        contactEquationRelaxation: 2,
        frictionEquationStiffness: 5e6,
        frictionEquationRelaxation: 3,       
        userData: { id: "cushion" },
    }))

    return (
        <mesh ref={ref}>
            <boxGeometry args={size} />
            <meshStandardMaterial map={map} transparent alphaTest={0.5} />
        </mesh>
    )
}

export function Cushion2({ position, size, rotation }) {
    const [ref] = useBox(() => ({
        type: "Static",
        position,
        args: size,
        rotation,
        friction: 0,
        restitution: 0,     
        contactEquationStiffness: 2e7,
        contactEquationRelaxation: 2,
        frictionEquationStiffness: 5e6,
        frictionEquationRelaxation: 3,   
        userData: { id: "cushion2" },
    }))

    return (
        <mesh ref={ref} position={position} rotation={rotation}>
            <boxGeometry args={size} />
            <meshStandardMaterial transparent opacity={0} />
        </mesh>
    )
}

export function TrapezoidCushion({ position, size1, size2 }) {
    const ref = useRef(null)
    const [width1, height1, depth1] = size1
    const [width2, height2, depth2] = size2

    const points = useMemo(
        () => [
            new Vector3(-width1 / 2, -height1 / 2, -depth1 / 2),
            new Vector3(-width1 / 2, -height1 / 2, depth1 / 2),
            new Vector3(width2 / 2, -height2 / 2, depth2 / 2),
            new Vector3(width2 / 2, -height2 / 2, -depth2 / 2),
            new Vector3(-width1 / 2, height1 / 2, -depth1 / 2),
            new Vector3(-width1 / 2, height1 / 2, depth1 / 2),
            new Vector3(width2 / 2, height2 / 2, depth2 / 2),
            new Vector3(width2 / 2, height2 / 2, -depth2 / 2),
        ],
        [width1, height1, depth1, width2, height2, depth2]
    )

    const vertices = points.map((point) => point.toArray())
    const faces = [
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [4, 5, 6, 7],
        [0, 1, 2, 3],
    ]

    const indices = []
    faces.forEach((face) => {
        indices.push(face[0], face[1], face[2])
        indices.push(face[2], face[3], face[0])
    })

    const geometry = useMemo(() => {
        const geom = new BufferGeometry()
        geom.setIndex(indices)
        geom.setAttribute(
            "position",
            new Float32BufferAttribute(vertices.flat(), 3)
        )
        return geom
    }, [vertices, indices])

    const fragmentShader = `
        varying vec3 vPosition;
        void main() {
            float gradient = (vPosition.y + 0.5) / 2.0;
            gl_FragColor = vec4(mix(vec3(0.239, 0.588, 0.78), vec3(0.243, 0.624, 0.812), gradient), 1.0);
        }
    `

    const vertexShader = `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

    const [triVertices, triIndices] = useMemo(() => {
        const flatVertices = vertices.flat()
        return [flatVertices, indices]
    }, [vertices, indices])

    useCompoundBody(
        () => ({
            type: "Static",
            position,
            friction: 0,
            restitution: 0,       
            contactEquationStiffness: 2e7,
            contactEquationRelaxation: 2,
            frictionEquationStiffness: 5e6,
            frictionEquationRelaxation: 3,   
            args: [triVertices, triIndices], 
            userData: { id: "trapezoidCushion" },
        }),
        ref
    )

    return (
        <mesh ref={ref} castShadow geometry={geometry} position={position}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={DoubleSide}
            />
        </mesh>
    )
}

export function TrapezoidCushion2({ position, size1, size2, size3, size4 }) {
    const ref = useRef()
    const [width1, height1, depth1] = size1
    const [width2, height2, depth2] = size2
    const [width3, height3, depth3] = size3
    const [width4, height4, depth4] = size4

    const points = useMemo(
        () => [
            new Vector3(-width3 / 2, -height3 / 2, -depth3 / 2),
            new Vector3(-width3 / 2, -height3 / 2, depth3 / 2),
            new Vector3(width2 / 2, -height2 / 2, depth2 / 2),
            new Vector3(width2 / 2, -height2 / 2, -depth2 / 2),
            new Vector3(-width4 / 2, height4 / 2, -depth4 / 2),
            new Vector3(-width4 / 2, height4 / 2, depth4 / 2),
            new Vector3(width1 / 2, height1 / 2, depth1 / 2),
            new Vector3(width1 / 2, height1 / 2, -depth1 / 2),
        ],
        [
            width1,
            height1,
            depth1,
            width2,
            height2,
            depth2,
            width3,
            height3,
            depth3,
            width4,
            height4,
            depth4,
        ]
    )

    const vertices = points.map((point) => point.toArray())
    const faces = [
        [0, 1, 5, 4],
        [1, 2, 6, 5],
        [2, 3, 7, 6],
        [3, 0, 4, 7],
        [4, 5, 6, 7],
        [0, 1, 2, 3],
    ]

    const indices = []
    faces.forEach((face) => {
        indices.push(face[0], face[1], face[2])
        indices.push(face[2], face[3], face[0])
    })

    const geometry = useMemo(() => {
        const geom = new BufferGeometry()
        geom.setIndex(indices)
        geom.setAttribute(
            "position",
            new Float32BufferAttribute(vertices.flat(), 3)
        )
        return geom
    }, [vertices, indices])

    const fragmentShader = `
        varying vec3 vPosition;
        void main() {
            float gradient = (vPosition.y + 0.5) / 2.0;
            gl_FragColor = vec4(mix(vec3(0.239, 0.588, 0.78), vec3(0.243, 0.624, 0.812), gradient), 1.0);
        }
    `

    const vertexShader = `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

    const [triVertices, triIndices] = useMemo(() => {
        const flatVertices = vertices.flat()
        return [flatVertices, indices]
    }, [vertices, indices])

    useCompoundBody(
        () => ({
            type: "Static",
            position,
            friction: 0,
            restitution: 0,       
            contactEquationStiffness: 2e7,
            contactEquationRelaxation: 2,
            frictionEquationStiffness: 5e6,
            frictionEquationRelaxation: 3,   
            args: [triVertices, triIndices],
            userData: { id: "trapezoidCushion" },
        }),
        ref
    )

    return (
        <mesh ref={ref} castShadow geometry={geometry} position={position}>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                side={DoubleSide}
            />
        </mesh>
    )
}

export function Pocket({ position, map, central = false }) {
    const ref = useRef()

    useCylinder(
        () => ({
            type: "Static",
            position,
            rotation: [Math.PI / 2, 0, 0],
            args: [
                POCKET_RADIUS * 1.3,
                POCKET_RADIUS * 1.3,
                POCKET_DEPTH * 2,
              ],
            userData: { id: "pocket" },
            collisionResponse: 0,
            friction: 0,
            restitution: 0,
            material: {
                friction: 0,
                restitution: 0,
            }
        }),
        ref
    )

    return (
        <mesh ref={ref} position={position} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry
                args={[
                    POCKET_RADIUS + (central ? 0.06 : 0.1),
                    POCKET_RADIUS + (central ? 0.06 : 0.1),
                    POCKET_DEPTH,
                    40,
                ]}
            />
            <meshStandardMaterial map={map} />
        </mesh>
    )
}

export function PocketCushion({ position, size, map }) {
    return (
        <mesh position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial map={map} transparent alphaTest={0} />
        </mesh>
    )
}

export function BlockLine({ position, size }) {
    return (
        <mesh position={position}>
            <boxGeometry args={size} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.2} />
        </mesh>
    )
}
