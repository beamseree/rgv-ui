import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Bounds, GizmoHelper, GizmoViewport, Lightformer, Environment, OrbitControls } from "@react-three/drei"
import { EffectComposer, SSAO, SMAA, Selection, Outline } from "@react-three/postprocessing"
import { Engine } from "./Engine"
import { Rgv } from "./Rgv"
import { useState } from "react"
import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import CameraControls from "camera-controls"
import { useMemo } from "react"

CameraControls.install({ THREE })

function Controls({ zoom, focus, pos = new THREE.Vector3(), look = new THREE.Vector3() }) {
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const controls = useMemo(() => new CameraControls(camera, gl.domElement), [])
  return useFrame((state, delta) => {
    if (focus.x === undefined) return
    // zoom ? pos.set(focus.x, focus.y, focus.z + 0.2) : pos.set(0, 0, 5)
    // zoom ? look.set(focus.x, focus.y, focus.z - 0.2) : look.set(0, 0, 4)
    pos.set(focus.x, focus.y, focus.z + 500)
    look.set(focus.x, focus.y, focus.z - 500)

    state.camera.position.lerp(pos, 1)
    state.camera.updateProjectionMatrix()

    controls.setLookAt(state.camera.position.x, state.camera.position.y, state.camera.position.z, look.x, look.y, look.z, true)
    return controls.update(delta)
  })
}

export default function App() {

  const [zoom, setZoom] = useState(false)
  const [focus, setFocus] = useState({})

  return (
    <Canvas orthographic dpr={[1, 2]} camera={{ position: [200, 200, 200], fov: 35, near: 0, far: 700, zoom: 1.5 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.75} />

        <Selection>
          <EffectComposer multisampling={0} autoClear={false}>
            {/* <SSAO radius={0.05} intensity={150} luminanceInfluence={0.5} color="black" /> */}
            <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={1000} edgeStrength={100} />
            {/* <SMAA /> */}
          </EffectComposer>
          {/* <Bounds > */}
            <Rgv rotation={[0, Math.PI / 2, 0]} setFocus={setFocus}/>
          {/* </Bounds> */}
        </Selection>

        <Environment resolution={256}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
            ))}
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
          </group>
        </Environment>
      </Suspense>

      <GizmoHelper alignment="bottom-right" margin={[80, 80]} renderPriority={2}>
        <GizmoViewport axisColors={["hotpink", "aquamarine", "#3498DB"]} labelColor="black" />
      </GizmoHelper>

      <OrbitControls enablePan={false} makeDefault minZoom={0.5} maxZoom={4}/>
      <Controls zoom={zoom} focus={focus} />
    </Canvas>
  )
}
