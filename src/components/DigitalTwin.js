import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder } from "@react-three/drei";

// darkMode prop'unu ekledik
function VehicleHologram({ telemetry, darkMode }) {
  const meshRef = useRef();

  const isCritical = (telemetry?.temperature?.bt1 > 60) || (telemetry?.pressure?.p1 > 100);
  
  // Arıza Tespiti: Karanlık ve Aydınlık mod için ayrı renkler
  const hologramColor = isCritical 
    ? (darkMode ? "#ff4d4d" : "#e11d48") 
    : (darkMode ? "#00e5ff" : "#0284c7"); 

  useFrame(() => {
    const pitch = telemetry?.motion?.ax ? telemetry.motion.ax * 0.1 : 0; 
    const roll = telemetry?.motion?.ay ? telemetry.motion.ay * 0.1 : 0;  

    if (meshRef.current) {
      meshRef.current.rotation.x += (pitch - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.z += (roll - meshRef.current.rotation.z) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Box args={[1.5, 0.6, 3]}>
        <meshStandardMaterial 
          color={hologramColor} 
          wireframe={true} 
          emissive={hologramColor} 
          emissiveIntensity={isCritical ? (darkMode ? 1 : 0.6) : (darkMode ? 0.4 : 0.2)} 
        />
      </Box>
      <Cylinder args={[0, 0.75, 1, 4]} position={[0, 0, 2]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <meshStandardMaterial color={hologramColor} wireframe={true} />
      </Cylinder>
    </group>
  );
}

// darkMode prop'unu ekledik
export default function DigitalTwin({ telemetry, darkMode = true }) {
  return (
    <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
      <ambientLight intensity={darkMode ? 0.2 : 0.5} />
      <pointLight position={[10, 10, 10]} intensity={darkMode ? 1.5 : 0.8} color={darkMode ? "#0ff" : "#0284c7"} />
      
      <VehicleHologram telemetry={telemetry} darkMode={darkMode} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={!telemetry?.motion?.ax} 
        autoRotateSpeed={1} 
      />
    </Canvas>
  );
}