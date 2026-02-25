import { useState } from 'react';
import Home from './Home';
import CarreraGraph from './CarreraGraph';

export default function App() {
  const [view, setView] = useState({ screen: 'home' });

  if (view.screen === 'graph') {
    return (
      <CarreraGraph
        key={view.carreraKey}
        carreraKey={view.carreraKey}
        csv={view.csv}
        carreraLabel={view.carreraLabel}
        onBack={() => setView({ screen: 'home' })}
      />
    );
  }

  return (
    <Home
      onSelect={(catedraSlug, carreraSlug, csv, carreraLabel) =>
        setView({
          screen: 'graph',
          carreraKey: `${catedraSlug}/${carreraSlug}`,
          csv,
          carreraLabel,
        })
      }
    />
  );
}
