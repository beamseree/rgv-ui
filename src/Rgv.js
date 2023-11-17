import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Select } from "@react-three/postprocessing";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import hoverables from "./Hoverables.json";

// import { useControls, folder } from "leva"

export function Rgv({ setFocus, ...props }) {
    const group = useRef();
    const { nodes } = useGLTF("/rgvtest.glb");
    const [hovered, hover] = useState();
    const sensorIds = hoverables.sensors.map(sensor => sensor.id);

    // const config = useControls({
    //     all: { value: false },
    //     parts: folder(
    //         {
    //             gear: { value: false },
    //             shaft: { value: false },
    //             cylinder: { value: false },
    //             piston1: { value: false },
    //             piston2: { value: false },
    //             piston3: { value: false },
    //         },
    //         { collapsed: true },
    //     ),
    // })
    const [isDragging, setIsDragging] = useState(false);

    const { camera, scene } = useThree();

    // function raycastCheckMouseHover(event) {
    //     const raycaster = new THREE.Raycaster();
    //     const mouse = new THREE.Vector2();
    //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //     raycaster.setFromCamera(mouse, camera);
    //     const intersects = raycaster.intersectObjects(scene.children, true);
    //     // for (let i = intersects.length - 1; i >= 0; i--) {
    //     //     const intersect = intersects[i];
    //     //     if (intersect.object.parent.name === "Object649") {
    //     //         intersects.splice(i, 1);
    //     //     }
    //     // }
    //     if (intersects.length > 0) {
    //         hover(intersects[0].object.parent.name);
    //     }
    // }

    const handlePointerDown = (e) => {
        setIsDragging(false); // Reset dragging state on mouse down
    };

    const handlePointerMove = (e) => {
        if (e.pressure > 0) {
            // Check if the pointer is down
            setIsDragging(true); // Set dragging state
        }
    };

    const handlePointerUp = (e) => {
        if (!isDragging) {
            setFocus(e.object.position);
            console.log(hovered); // Handle click event
        }
        setIsDragging(false); // Reset dragging state
    };

    const renderHoverables = () => {
        const sensors = hoverables.sensors;
        const meshes = [];
        for (let i = 0; i < sensors.length; i++) {
            try {
                meshes.push(
                    <Select
                        name={`Object${sensors[i].id}`}
                        enabled={hovered === `Object${sensors[i].id}`}>
                        <mesh
                            key={i}
                            geometry={nodes[`Object${sensors[i].id}`].geometry}
                            material={nodes[`Object${sensors[i].id}`].material}
                        />
                    </Select>
                );
            } catch (e) { }
        }
        return meshes;
    };

    const renderUnhoverables = () => {
        const meshes = [];
        for (let i = 0; i < 1035; i++) {
            let num = convertToThreeDigits(i);
            if (!sensorIds.includes(num)) {
                try {
                    meshes.push(
                        <Select
                            name={`Object${num}`}
                            enabled={hovered === `Object${num}`}>
                            <mesh
                                key={i}
                                geometry={nodes[`Object${num}`].geometry}
                                material={nodes[`Object${num}`].material}
                            />
                        </Select>
                    );
                } catch (e) { }
            }
        }
        return meshes;
    };

    function convertToThreeDigits(num) {
        return num.toString().padStart(3, "0");
    }

    // console.log(Sensors.sensors);

    return (
        <>
            <group scale={0.4}>
                {renderUnhoverables()}
                {/* <Select enabled={config.all}> */}
                <group
                    position={[0, 0, 0]}
                    onClick={handlePointerUp}
                    onPointerOver={(e) => hover(e.object.parent.name)}
                    onPointerOut={(e) => hover(null)}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    ref={group}>
                    <Select>{renderHoverables()}</Select>
                </group>
            </group>
        </>
    );
}
