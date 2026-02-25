import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const stateConfig = {
  blocked: {
    bg: '#1e1b2e',
    border: '#4c3a6e',
    text: '#a78bfa',
    badge: 'Bloqueada',
    badgeBg: 'rgba(76,58,110,.55)',
  },
  available: {
    bg: '#062e23',
    border: '#0f9977',
    text: '#5ef5c8',
    badge: 'Disponible',
    badgeBg: 'rgba(15,153,119,.22)',
  },
  approved: {
    bg: '#1e3a5f',
    border: '#3b82f6',
    text: '#93c5fd',
    badge: 'Aprobada',
    badgeBg: 'rgba(59,130,246,.25)',
  },
};

function MateriaNode({ data }) {
  const { nombre, codigo, state, onToggle } = data;
  const cfg = stateConfig[state];

  return (
    <div
      onClick={state !== 'blocked' ? onToggle : undefined}
      style={{
        background: cfg.bg,
        border: `2px solid ${cfg.border}`,
        borderRadius: 10,
        padding: '10px 14px',
        width: 200,
        cursor: state === 'blocked' ? 'not-allowed' : 'pointer',
        boxShadow:
          state !== 'blocked' ? `0 0 18px ${cfg.border}44` : 'none',
        transition: 'all .2s ease',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          opacity: 0.5,
          letterSpacing: '.06em',
          color: '#94a3b8',
        }}
      >
        {codigo}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1.3,
          color: cfg.text,
          marginTop: 2,
        }}
      >
        {nombre}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 8,
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: '.07em',
          textTransform: 'uppercase',
          padding: '2px 6px',
          borderRadius: 4,
          background: cfg.badgeBg,
          color: cfg.text,
        }}
      >
        {cfg.badge}
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const handleStyle = {
  width: 6,
  height: 6,
  background: '#475569',
  border: '1px solid #64748b',
};

export default memo(MateriaNode);
