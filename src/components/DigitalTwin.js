import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Cylinder } from "@react-three/drei";

function VehicleHologram({ telemetry }) {
  const meshRef = useRef();

  const isCritical = (telemetry?.temperature?.bt1 > 60) || (telemetry?.pressure?.p1 > 100);
  const hologramColor = isCritical ? "#ff4d4d" : "#00e5ff"; 

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
          emissiveIntensity={isCritical ? 1 : 0.4} 
        />
      </Box>
      <Cylinder args={[0, 0.75, 1, 4]} position={[0, 0, 2]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
        <meshStandardMaterial color={hologramColor} wireframe={true} />
      </Cylinder>
    </group>
  );
}

export default function DigitalTwin({ telemetry }) {
  return (
    <Canvas camera={{ position: [3, 2, 4], fov: 50 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#0ff" />
      
      <VehicleHologram telemetry={telemetry} />
      
      {/* SİHİRLİ KİLİT BURADA: enablePan={false} eklendi */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={!telemetry?.motion?.ax} 
        autoRotateSpeed={1} 
      />
    </Canvas>
  );
}