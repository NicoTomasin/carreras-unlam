const csvModules = import.meta.glob('./materias/**/*.csv', {
  query: '?raw',
  eager: true,
});

function prettify(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getCatalog() {
  const catedras = {};

  for (const [path, mod] of Object.entries(csvModules)) {
    const parts = path.replace('./materias/', '').replace('.csv', '').split('/');
    if (parts.length !== 2) continue;

    const [catedraSlug, carreraSlug] = parts;

    if (!catedras[catedraSlug]) {
      catedras[catedraSlug] = {
        slug: catedraSlug,
        label: prettify(catedraSlug),
        carreras: [],
      };
    }

    catedras[catedraSlug].carreras.push({
      slug: carreraSlug,
      label: prettify(carreraSlug),
      csv: mod.default,
    });
  }

  return Object.values(catedras);
}
