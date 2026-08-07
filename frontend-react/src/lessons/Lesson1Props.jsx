// LESSON 1: Components & Props
//
// A "component" is just a function that returns JSX (HTML-like syntax).
// "Props" (short for properties) are how a parent component passes data
// DOWN into a child component — like function arguments, but for components.
// Props are read-only: a child must never modify the props it receives.

// Greeting is a CHILD component. It receives a `name` and a `mood` prop.
// Notice props arrive as a single object, which we destructure: { name, mood }
function Greeting({ name, mood }) {
  return (
    <p>
      Hey {name}, you seem <strong>{mood}</strong> today.
    </p>
  );
}

// UserCard is another child component. It takes a whole `user` object as a prop.
function UserCard({ user }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '0.75rem', borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>{user.name}</h3>
      <p style={{ margin: '0.25rem 0' }}>Role: {user.role}</p>
    </div>
  );
}

// Lesson1Props is the PARENT. It owns the data and passes slices of it
// down to each child via props — data flows one-way, top to bottom.
export default function Lesson1Props() {
  const users = [
    { name: 'Vipin', role: 'Developer' },
    { name: 'Asha', role: 'Designer' },
  ];

  return (
    <div>
      <h2>Lesson 1: Components & Props</h2>

      {/* Passing plain string props */}
      <Greeting name="Vipin" mood="curious" />
      <Greeting name="Asha" mood="focused" />

      {/* Passing an object as a single prop */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        {users.map((u) => (
          <UserCard key={u.name} user={u} />
        ))}
      </div>

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: add a third field to a user object above (e.g. <code>age</code>),
        then read it inside <code>UserCard</code> with <code>user.age</code>.
      </p>
    </div>
  );
}
