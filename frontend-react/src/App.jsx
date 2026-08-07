import { useState } from 'react';
import Lesson1Props from './lessons/Lesson1Props';
import Lesson2State from './lessons/Lesson2State';
import Lesson3Conditional from './lessons/Lesson3Conditional';
import Lesson4Lists from './lessons/Lesson4Lists';
import Lesson5Effect from './lessons/Lesson5Effect';
import Lesson6Forms from './lessons/Lesson6Forms';
import Lesson7CustomHooks from './lessons/Lesson7CustomHooks';

// As we go, each new lesson gets its own file in src/lessons/,
// and gets added to this list — App just switches between them.
const lessons = [
  { id: 'props', title: '1. Props', Component: Lesson1Props },
  { id: 'state', title: '2. State', Component: Lesson2State },
  { id: 'conditional', title: '3. Conditional', Component: Lesson3Conditional },
  { id: 'lists', title: '4. Lists & keys', Component: Lesson4Lists },
  { id: 'effect', title: '5. useEffect', Component: Lesson5Effect },
  { id: 'forms', title: '6. Forms', Component: Lesson6Forms },
  { id: 'hooks', title: '7. Custom hooks', Component: Lesson7CustomHooks },
];

export default function App() {
  const [activeId, setActiveId] = useState(lessons[0].id);
  const active = lessons.find((l) => l.id === activeId);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ width: 180, padding: '1rem', borderRight: '1px solid #ddd' }}>
        <h3>Lessons</h3>
        {lessons.map((l) => (
          <button
            key={l.id}
            onClick={() => setActiveId(l.id)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '0.5rem',
              marginBottom: '0.25rem',
              background: l.id === activeId ? '#333' : '#f0f0f0',
              color: l.id === activeId ? '#fff' : '#000',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            {l.title}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: '1.5rem' }}>
        <active.Component />
      </main>
    </div>
  );
}
