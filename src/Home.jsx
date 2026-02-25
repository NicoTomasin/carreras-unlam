import { getCatalog } from './catalog';

const catalog = getCatalog();

const icons = {
  ingenieria: '🏗️',
  ciencias: '🔬',
  economia: '💼',
  medicina: '🏥',
  derecho: '⚖️',
  arquitectura: '🏛️',
  sistemas: '💻',
  humanidades: '📖',
  default: '📚',
};

function getIcon(slug) {
  for (const [key, icon] of Object.entries(icons)) {
    if (slug.includes(key)) return icon;
  }
  return icons.default;
}

export default function Home({ onSelect }) {
  return (
    <div className="home">
      <div className="home-header">
        <div className="unlam-brand">UNLaM</div>
        <h1>Carreras</h1>
        <p>Seleccioná una cátedra para ver las carreras disponibles</p>
      </div>

      <div className="catedras-grid">
        {catalog.map((cat) => (
          <div key={cat.slug} className="catedra-card">
            <div className="catedra-icon">{getIcon(cat.slug)}</div>
            <h2>{cat.label}</h2>
            <div className="carreras-list">
              {cat.carreras.map((car) => (
                <button
                  key={car.slug}
                  className="carrera-btn"
                  onClick={() => onSelect(cat.slug, car.slug, car.csv, car.label)}
                >
                  <span className="carrera-arrow">→</span>
                  {car.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
