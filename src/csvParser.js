export function parseCSV(text) {
  const lines = text.trim().split('\n').slice(1);
  const materias = [];

  for (const line of lines) {
    const match = line.match(/^(\d+),"([^"]+)"(?:,"([^"]*)")?/);
    if (!match) continue;
    const codigo = match[1];
    const nombre = match[2];
    const rawDeps = match[3] || '';
    const deps = rawDeps
      ? rawDeps.split(' - ').map((d) => d.trim()).filter(Boolean)
      : [];
    materias.push({ codigo, nombre, deps });
  }

  return materias;
}

export function computeLevel(codigo, materias, memo = {}) {
  if (memo[codigo] !== undefined) return memo[codigo];
  const mat = materias.find((m) => m.codigo === codigo);
  if (!mat || mat.deps.length === 0) {
    memo[codigo] = 0;
    return 0;
  }
  const maxDep = Math.max(...mat.deps.map((d) => computeLevel(d, materias, memo)));
  memo[codigo] = maxDep + 1;
  return memo[codigo];
}

export function buildInitialPositions(materias) {
  const memo = {};
  materias.forEach((m) => computeLevel(m.codigo, materias, memo));

  const levels = {};
  materias.forEach((m) => {
    const lvl = memo[m.codigo];
    if (!levels[lvl]) levels[lvl] = [];
    levels[lvl].push(m.codigo);
  });

  const NODE_W = 220;
  const NODE_H = 120;
  const PAD_X = 60;
  const PAD_Y = 40;

  const positions = {};
  Object.keys(levels)
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((lvl) => {
      const items = levels[lvl];
      const totalWidth = items.length * NODE_W + (items.length - 1) * PAD_X;
      const startX = -totalWidth / 2;
      items.forEach((cod, i) => {
        positions[cod] = {
          x: startX + i * (NODE_W + PAD_X),
          y: lvl * (NODE_H + PAD_Y),
        };
      });
    });

  return positions;
}
