import { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { parseCSV, buildInitialPositions } from './csvParser';
import MateriaNode from './MateriaNode';
import useCorrelativas, { getState } from './useCorrelativas';

const nodeTypes = { materia: MateriaNode };

function positionsKey(carreraKey) {
  return `correlativas-positions-${carreraKey}`;
}

function loadPositions(carreraKey) {
  try {
    return JSON.parse(localStorage.getItem(positionsKey(carreraKey)));
  } catch {
    return null;
  }
}

function savePositions(carreraKey, nodes) {
  const map = {};
  nodes.forEach((n) => (map[n.id] = n.position));
  localStorage.setItem(positionsKey(carreraKey), JSON.stringify(map));
}

function buildEdges(approved, materias) {
  const edges = [];
  for (const m of materias) {
    for (const dep of m.deps) {
      const met = approved.has(dep);
      edges.push({
        id: `${dep}->${m.codigo}`,
        source: dep,
        target: m.codigo,
        animated: met,
        type: 'smoothstep',
        style: {
          stroke: met ? '#0f9977' : '#64548a',
          strokeWidth: met ? 2.5 : 1.5,
          opacity: met ? 1 : 0.55,
        },
      });
    }
  }
  return edges;
}

export default function CarreraGraph({ carreraKey, csv, carreraLabel, onBack }) {
  const materias = useMemo(() => parseCSV(csv), [csv]);
  const { approved, toggle, reset } = useCorrelativas(carreraKey, materias);
  const savedPositions = useRef(loadPositions(carreraKey));

  const initialNodes = useMemo(() => {
    const computed = buildInitialPositions(materias);
    const saved = savedPositions.current;
    return materias.map((m) => ({
      id: m.codigo,
      type: 'materia',
      position: saved?.[m.codigo] || computed[m.codigo] || { x: 0, y: 0 },
      data: {
        nombre: m.nombre,
        codigo: m.codigo,
        state: getState(m.codigo, approved, materias),
        onToggle: () => toggle(m.codigo),
      },
    }));
  }, [materias]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(approved, materias));

  const prevApprovedRef = useRef(approved);
  if (prevApprovedRef.current !== approved) {
    prevApprovedRef.current = approved;
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          state: getState(n.id, approved, materias),
          onToggle: () => toggle(n.id),
        },
      }))
    );
    setEdges(buildEdges(approved, materias));
  }

  const onNodeDragStop = useCallback(
    (_event, _node, allNodes) => {
      savePositions(carreraKey, allNodes);
    },
    [carreraKey]
  );

  const handleReset = useCallback(() => {
    if (window.confirm('¿Reiniciar todas las materias aprobadas?')) reset();
  }, [reset]);

  const handleResetLayout = useCallback(() => {
    if (window.confirm('¿Reiniciar posiciones de los nodos?')) {
      const computed = buildInitialPositions(materias);
      setNodes((nds) =>
        nds.map((n) => ({ ...n, position: computed[n.id] || n.position }))
      );
      localStorage.removeItem(positionsKey(carreraKey));
    }
  }, [setNodes, materias, carreraKey]);

  const countApproved = approved.size;
  const countAvailable = materias.filter(
    (m) => getState(m.codigo, approved, materias) === 'available'
  ).length;
  const countBlocked = materias.filter(
    (m) => getState(m.codigo, approved, materias) === 'blocked'
  ).length;
  const pct = Math.round((countApproved / materias.length) * 100);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0f172a' }}>
      <div className="topbar">
        <button className="back-btn" onClick={onBack}>
          ← Volver
        </button>
        <h1>
          <span className="accent">▶</span> {carreraLabel}
        </h1>
        <div className="stats">
          <span><strong>{countApproved}</strong> aprobadas</span>
          <span><strong>{countAvailable}</strong> disponibles</span>
          <span><strong>{countBlocked}</strong> bloqueadas</span>
          <span className="pct">{pct}%</span>
        </div>
        <div className="actions">
          <button onClick={handleResetLayout}>Reiniciar layout</button>
          <button className="danger" onClick={handleReset}>Reiniciar materias</button>
        </div>
        <div className="legend">
          <span><i className="dot blocked" /> Bloqueada</span>
          <span><i className="dot available" /> Disponible</span>
          <span><i className="dot approved" /> Aprobada</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={24} size={1} />
        <Controls
          position="bottom-left"
          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
        />
        <MiniMap
          nodeColor={(n) => {
            const st = n.data?.state;
            if (st === 'approved') return '#3b82f6';
            if (st === 'available') return '#0f9977';
            return '#4c3a6e';
          }}
          style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }}
          maskColor="rgba(15,23,42,.7)"
        />
      </ReactFlow>
    </div>
  );
}
