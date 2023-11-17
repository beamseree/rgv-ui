import { Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Bounds, GizmoHelper, GizmoViewport, Lightformer, Environment, OrbitControls } from "@react-three/drei"
import { EffectComposer, SSAO, SMAA, Selection, Outline } from "@react-three/postprocessing"
import { Rgv } from "./Rgv"
import { useState } from "react"
import "./App.css"
import logo from "./img/amwlogoui.svg"
import hoverables from "./Hoverables.json";

export default function App() {
  const [focus, setFocus] = useState(null)
  const [itemName, setItemName] = useState("")
  const [itemDesc, setItemDesc] = useState("")

  useEffect(() => {
    if (focus) {
      let foundSensor = hoverables.sensors.find(sensor => sensor.id === focus.slice(6, focus.length));
      setItemName(foundSensor.name);
      setItemDesc(foundSensor.description);
    }
  }, [focus])

  return (
    <div className="App">
      <div className="navbar">
        <img src={logo} alt="logo" className="logo" />
        <div className="nav-link-container">
          <a href="" className="nav-link">Overview</a>
          <a href="" className="nav-link">Console</a>
          <a href="" className="nav-link">Settings</a>
        </div>
      </div>
      <div className="main">

        <div className="sidebar">
            <p className="item-name">{itemName}</p>
            <p className="item-description">{itemDesc}</p>
        </div>
        <Canvas className="canvas" orthographic flat dpr={[1, 2]} camera={{ position: [200, 200, 200], fov: 35, near: 0, far: 700, zoom: 1.25 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.75} />

            <Selection>
              <EffectComposer multisampling={0} autoClear={false}>
                <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={1000} edgeStrength={100} />
              </EffectComposer>
              <Rgv rotation={[0, Math.PI / 2, 0]} setFocus={setFocus} hoverables={hoverables}/>
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
        </Canvas>
      </div>
    </div>
  )
}
