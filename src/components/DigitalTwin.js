import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function VehicleHologram({ telemetry, darkMode }) {
  const meshRef = useRef();

  const vehicleGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // GENİŞLİK VE YÜKSEKLİK (Kalıplı ve dolgun bir gövde için)
    const width = 1.4;    
    const height = 0.8;   
    const bevelRadius = 0.2; 

    // Taban yapısı
    shape.moveTo(-width / 2 + bevelRadius, 0);
    shape.lineTo(width / 2 - bevelRadius, 0);
    shape.absarc(width / 2 - bevelRadius, bevelRadius, bevelRadius, -Math.PI / 2, 0, false);
    
    // Sağ yan ve üst kemer
    shape.lineTo(width / 2, height / 2);
    shape.absarc(0, height / 2, width / 2, 0, Math.PI, false);
    
    // Sol yan ve alt köşe
    shape.lineTo(-width / 2, height / 2);
    shape.absarc(-width / 2 + bevelRadius, bevelRadius, bevelRadius, Math.PI, -Math.PI / 2, false);
    shape.closePath(); 

    const settings = {
      depth: 4.2, // UZATILDI: Eski 2.8 -> Yeni 4.2 (Gerçekçi pod uzunluğu)
      bevelEnabled: true,
      bevelThickness: 0.15, 
      bevelSize: 0.1,
      bevelSegments: 8,
      curveSegments: 24,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, settings);

    // KRİTİK: Geometriyi tam merkez noktasına taşır. 
    // Böylece araç kendi ortası etrafında döner, savrulma yapmaz.
    geometry.center(); 

    // BURUN DARALMASI (4.2 uzunluğuna göre uyarlandı)
    // Center yapıldığı için Z ekseni artık -2.1 ile +2.1 arası.
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      
      // Ön kısımdan (z > 0.5) itibaren aerodinamik daralma başlar
      if (z > 0.5) {
        const t = (z - 0.5) / 1.6; // Daralma eğrisi mesafesi
        const scale = 1 - Math.pow(t, 2) * 0.55; // Uç noktada %55 daralma
        pos.setX(i, pos.getX(i) * scale);
        pos.setY(i, pos.getY(i) * scale);
      }
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Herhangi bir batarya sıcaklığı veya fren basıncı kritikse hologramı kırmızı göster.
  const temperatures = Object.values(telemetry?.temperature ?? {}).map(Number).filter(Number.isFinite);
  const pressures = Object.values(telemetry?.pressure ?? {}).map(Number).filter(Number.isFinite);
  const isCritical = temperatures.some((value) => value > 60) || pressures.some((value) => value > 100);

  const hologramColor = isCritical
    ? darkMode ? "#ff4d4d" : "#e11d48"
    : darkMode ? "#00e5ff" : "#0284c7";

  useFrame(() => {
    // Backend eşlemesi: RX=roll, PX=pitch, YX=yaw (derece).
    const pitch = THREE.MathUtils.degToRad(Number(telemetry?.motion?.px) || 0);
    const roll = THREE.MathUtils.degToRad(Number(telemetry?.motion?.rx) || 0);
    const yaw = THREE.MathUtils.degToRad(Number(telemetry?.motion?.yx) || 0);

    if (meshRef.current) {
      // Hareketleri yumuşak bir sönümleme (Lerp) ile uygula
      meshRef.current.rotation.x += (pitch - meshRef.current.rotation.x) * 0.1;
      meshRef.current.rotation.y += (yaw - meshRef.current.rotation.y) * 0.1;
      meshRef.current.rotation.z += (roll - meshRef.current.rotation.z) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <mesh geometry={vehicleGeometry}>
        <meshStandardMaterial
          color={hologramColor}
          wireframe={true}
          transparent={true}
          opacity={0.5} 
          emissive={hologramColor}
          emissiveIntensity={isCritical ? 1.0 : 0.5}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function DigitalTwin({ telemetry, darkMode = true }) {
  const hasOrientation = ["rx", "px", "yx"].some(
    (key) => Number.isFinite(Number(telemetry?.motion?.[key]))
  );

  return (
    <Canvas 
      // KAMERA AYARI: Uzayan gövdeyi tam sığdırmak için pozisyon optimize edildi
      camera={{ position: [3.8, 2.4, 4.8], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "low-power" }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={darkMode ? 0.3 : 0.6} />
      <pointLight
        position={[10, 10, 10]}
        intensity={2}
        color={darkMode ? "#00e5ff" : "#0284c7"}
      />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      
      <VehicleHologram telemetry={telemetry} darkMode={darkMode} />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!hasOrientation}
        autoRotateSpeed={0.7}
      />
    </Canvas>
  );
}
