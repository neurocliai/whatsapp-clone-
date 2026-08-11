"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function OrbitalLattice() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 48; i++) {
      const phi = Math.acos(-1 + (2 * i) / 48);
      const theta = Math.sqrt(48 * Math.PI) * phi;
      pts.push(
        new THREE.Vector3(
          2.4 * Math.cos(theta) * Math.sin(phi),
          2.4 * Math.sin(theta) * Math.sin(phi),
          2.4 * Math.cos(phi)
        )
      );
    }
    return pts;
  }, []);

  const linePositions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.55) {
          arr.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return new Float32Array(arr);
  }, [nodes]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.18;
    group.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.18;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#1EC8A5" transparent opacity={0.45} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#F0A202" : "#E8EEF7"} emissive="#1EC8A5" emissiveIntensity={0.25} />
        </mesh>
      ))}
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshStandardMaterial
            color="#0F8F78"
            metalness={0.55}
            roughness={0.25}
            emissive="#1EC8A5"
            emissiveIntensity={0.35}
            wireframe
          />
        </mesh>
      </Float>
      <mesh>
        <torusGeometry args={[1.55, 0.025, 16, 120]} />
        <meshBasicMaterial color="#F0A202" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="canvas-wrap">
      <Canvas camera={{ position: [0, 0.4, 6.2], fov: 42 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#070b14"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 5, 2]} intensity={1.3} color="#d7fff4" />
        <pointLight position={[-3, -2, 2]} intensity={1.1} color="#F0A202" />
        <Stars radius={40} depth={30} count={1800} factor={3} saturation={0} fade speed={0.6} />
        <OrbitalLattice />
      </Canvas>
    </div>
  );
}
