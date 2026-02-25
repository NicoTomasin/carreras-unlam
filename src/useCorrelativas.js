import { useState, useCallback } from 'react';

function storageKey(carreraKey) {
  return `correlativas-approved-${carreraKey}`;
}

function loadApproved(carreraKey) {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey(carreraKey)) || '[]'));
  } catch {
    return new Set();
  }
}

function saveApproved(carreraKey, set) {
  localStorage.setItem(storageKey(carreraKey), JSON.stringify([...set]));
}

export function getState(codigo, approved, materias) {
  if (approved.has(codigo)) return 'approved';
  const mat = materias.find((m) => m.codigo === codigo);
  if (!mat) return 'blocked';
  if (mat.deps.length === 0) return 'available';
  if (mat.deps.every((d) => approved.has(d))) return 'available';
  return 'blocked';
}

function getDependentsChain(codigo, approved, materias) {
  const result = [];
  function collect(cod) {
    for (const m of materias) {
      if (approved.has(m.codigo) && m.deps.includes(cod) && !result.includes(m.codigo)) {
        result.push(m.codigo);
        collect(m.codigo);
      }
    }
  }
  collect(codigo);
  return result;
}

export default function useCorrelativas(carreraKey, materias) {
  const [approved, setApproved] = useState(() => loadApproved(carreraKey));

  const toggle = useCallback(
    (codigo) => {
      setApproved((prev) => {
        const next = new Set(prev);
        const state = getState(codigo, prev, materias);

        if (state === 'available') {
          next.add(codigo);
        } else if (state === 'approved') {
          const chain = getDependentsChain(codigo, prev, materias);
          if (chain.length > 0) {
            const names = chain
              .map((c) => materias.find((m) => m.codigo === c)?.nombre)
              .join(', ');
            if (
              !window.confirm(
                `Al desaprobar esta materia también se desaprobarán:\n${names}\n\n¿Continuar?`
              )
            ) {
              return prev;
            }
            chain.forEach((c) => next.delete(c));
          }
          next.delete(codigo);
        } else {
          return prev;
        }

        saveApproved(carreraKey, next);
        return next;
      });
    },
    [carreraKey, materias]
  );

  const reset = useCallback(() => {
    const empty = new Set();
    setApproved(empty);
    saveApproved(carreraKey, empty);
  }, [carreraKey]);

  return { approved, toggle, reset };
}
