import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

type Node = {
  position: THREE.Vector3
  velocity: THREE.Vector3
  id: number
  label: string
}

const NODE_LABELS = ['Solana', 'Anchor', 'Rust', 'Go', 'PostgreSQL', 'Redis', 'Mandate', 'Payment', 'API', 'Transfer', 'Settlement', 'Ledger']

function NetworkNodes({ onNodeClick }: { onNodeClick: (id: number) => void }) {
  const groupRef = useRef<THREE.Group>(null)

  const nodes = useMemo<Node[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      label: NODE_LABELS[i] ?? `Node ${i}`,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 2,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.001,
      ),
    }))
  }, [])

  const edges = useMemo(() => {
    const result: Array<[Node, Node]> = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i]!.position.distanceTo(nodes[j]!.position)
        if (dist < 2.8 && Math.random() > 0.4) {
          result.push([nodes[i]!, nodes[j]!])
        }
      }
    }
    return result
  }, [nodes])

  useFrame((_, delta) => {
    nodes.forEach((node) => {
      node.position.add(node.velocity.clone().multiplyScalar(delta * 60))
      if (Math.abs(node.position.x) > 3) node.velocity.x *= -1
      if (Math.abs(node.position.y) > 2) node.velocity.y *= -1
      if (Math.abs(node.position.z) > 1.5) node.velocity.z *= -1
    })
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {edges.map(([a, b], i) => (
        <Line
          key={i}
          points={[a.position, b.position]}
          color="#6366f1"
          lineWidth={0.6}
          opacity={0.25}
          transparent
        />
      ))}
      {nodes.map((node) => (
        <mesh
          key={node.id}
          position={node.position}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation()
            onNodeClick(node.id)
          }}
        >
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={1.5}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3)
    for (let i = 0; i < 600; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02
      ref.current.rotation.x += delta * 0.01
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial color="#6366f1" size={0.015} sizeAttenuation transparent opacity={0.4} />
    </Points>
  )
}

const TX_MOCK_LOGS = [
  { hash: '0x4f3a...2b91', amount: '2,400 USDC', status: 'settled', latency: '230ms' },
  { hash: '0x9c1e...8d44', amount: '18,000 USDC', status: 'pending', latency: '45ms' },
  { hash: '0x7b2f...1a33', amount: '500 USDC', status: 'settled', latency: '180ms' },
  { hash: '0x3e8a...9f12', amount: '75,000 USDC', status: 'processing', latency: '12ms' },
]

export function TransactionNetwork() {
  const [txLog, setTxLog] = useState<boolean>(false)
  const [activeNode, setActiveNode] = useState<number | null>(null)

  const handleNodeClick = useCallback((id: number) => {
    setActiveNode(id)
    setTxLog(true)
    setTimeout(() => setTxLog(false), 4000)
  }, [])

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} color="#6366f1" intensity={2} />
        <pointLight position={[-5, -5, -5]} color="#8b5cf6" intensity={1} />
        <ParticleField />
        <NetworkNodes onNodeClick={handleNodeClick} />
      </Canvas>

      {txLog && (
        <div className="tx-log-overlay" style={{ animation: 'none' }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: 'var(--green-signal)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              NODE_{activeNode} / TRANSACTION LOG
            </span>
            <button
              onClick={() => setTxLog(false)}
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}
            >
              [ESC]
            </button>
          </div>
          {TX_MOCK_LOGS.map((tx, i) => (
            <div key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{tx.hash}</span>
              <span style={{ color: 'var(--text-soft)' }}>{tx.amount}</span>
              <span style={{ color: tx.status === 'settled' ? 'var(--green-signal)' : tx.status === 'pending' ? '#f59e0b' : 'var(--electric-bright)' }}>
                {tx.status}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>{tx.latency}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textAlign: 'center', pointerEvents: 'none' }}>
        CLICK NODES TO VIEW TX LOGS
      </div>
    </div>
  )
}
