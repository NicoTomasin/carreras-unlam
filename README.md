<div align="center">

# 🎓 Carreras UNLaM

**Mapa interactivo de correlativas de las carreras de la Universidad Nacional de La Matanza.**

Marcá las materias que aprobaste y mirá al instante cuáles podés cursar después.

[![Demo](https://img.shields.io/badge/demo-carreras--unlam.vercel.app-000000?style=flat-square&logo=vercel&logoColor=white)](https://carreras-unlam.vercel.app)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=flat-square&logo=reactflow&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**[👉 Probalo online](https://carreras-unlam.vercel.app)**

</div>

---

## ✨ Funcionalidades

- **Grafo de correlativas**: cada materia es un nodo y cada correlativa una flecha, ordenados por nivel automáticamente.
- **Seguimiento de tu avance**: hacé click en una materia para marcarla como aprobada. Los nodos cambian de estado:
  - ✅ **Aprobada**
  - 🟢 **Disponible**: tenés aprobadas todas sus correlativas.
  - 🔒 **Bloqueada**: todavía te falta alguna correlativa.
- **Desaprobar en cascada**: si desmarcás una materia, también se desmarcan las que dependían de ella.
- **Layout editable**: arrastrá los nodos donde quieras; la posición se guarda.
- **Todo local**: tu progreso y el layout se guardan en `localStorage`, sin cuentas ni servidores.
- Minimapa, zoom y controles de navegación.

## 📚 Carreras incluidas

| Departamento | Carrera | Materias |
| --- | --- | --- |
| Ingeniería | Ingeniería en Informática | 62 |
| Ingeniería | Ingeniería Industrial | 60 |

¿Falta tu carrera? [Agregala](#-agregar-una-carrera) 🙌

## 🚀 Correrlo localmente

Requisitos: Node.js 20+.

```bash
git clone https://github.com/NicoTomasin/carreras-unlam.git
cd carreras-unlam
npm install
npm run dev
```

Abrí <http://localhost:5173>.

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve el build localmente |

## ➕ Agregar una carrera

Las carreras se cargan solas a partir de archivos CSV: no hace falta tocar código.

1. Creá el archivo en `src/materias/<departamento>/<carrera>.csv`, por ejemplo `src/materias/economia/contador-publico.csv`.
2. Usá este formato (las correlativas van separadas por ` - `):

   ```csv
   codigo,materia,correlativas
   03621,"MATEMATICA DISCRETA",
   03622,"ANALISIS MATEMATICO I",
   03635,"TOPICOS DE PROGRAMACION","03621 - 03629"
   ```

3. El nombre de la carpeta y del archivo se usan como título (`contador-publico` → *Contador Publico*).

## 🗂️ Estructura

```
src/
├── App.jsx              # Navegación entre Home y el grafo
├── Home.jsx             # Listado de departamentos y carreras
├── CarreraGraph.jsx     # Grafo con React Flow
├── MateriaNode.jsx      # Nodo de cada materia
├── useCorrelativas.js   # Estado de materias aprobadas (localStorage)
├── csvParser.js         # Parseo del CSV y cálculo de niveles
├── catalog.js           # Descubre los CSV con import.meta.glob
└── materias/            # Planes de estudio en CSV
```

## 🤝 Contribuir

¡Sumar carreras o mejoras es muy bienvenido! Leé la [guía de contribución](CONTRIBUTING.md).

## 📄 Licencia

Distribuido bajo la [Licencia MIT](LICENSE). Proyecto independiente, no oficial de la UNLaM. Verificá siempre las correlativas con el plan de estudios vigente.

---

<div align="center">Hecho por <a href="https://nicotomasin.com.ar">Nico Tomasin</a></div>
