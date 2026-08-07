// LESSON 6: Forms & controlled inputs
//
// In plain HTML, an <input> keeps its own value internally and you read it
// from the DOM when you need it. In React we usually make it a "controlled
// input" instead: the input's value comes FROM state, and every keystroke
// updates that state via onChange. State becomes the single source of
// truth — the DOM just reflects it.
//
//   <input value={text} onChange={(e) => setText(e.target.value)} />
//
// This is why Lesson 2's NameInput worked the way it did — that WAS a
// controlled input, we just hadn't named the pattern yet.

import { useState } from 'react';

// One state variable per field is fine for a couple of fields...
function SimpleForm() {
  const [submitted, setSubmitted] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default full-page reload on submit
    setSubmitted({ email, password });
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h3>Simple login form</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />{' '}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />{' '}
        <button type="submit">Log in</button>
      </form>
      {submitted && (
        <p style={{ color: '#666' }}>
          Submitted: {submitted.email} / {'*'.repeat(submitted.password.length)}
        </p>
      )}
    </div>
  );
}

// ...but for many fields, ONE state object + a shared onChange handler
// scales better than a useState per field.
function ProfileForm() {
  const [form, setForm] = useState({
    name: '',
    plan: 'free',
    newsletter: false,
    bio: '',
  });

  // a single handler for every field, keyed by the input's `name` attribute
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  const isValid = form.name.trim().length > 0;

  return (
    <div>
      <h3>Profile form (shared handler + validation)</h3>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <select name="plan" value={form.plan} onChange={handleChange}>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />{' '}
            Subscribe to newsletter
          </label>
        </div>
        <div style={{ margin: '0.5rem 0' }}>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short bio"
            rows={2}
          />
        </div>
        {!isValid && <p style={{ color: 'crimson' }}>Name is required.</p>}
        <button type="submit" disabled={!isValid}>
          Save profile
        </button>
      </form>
      <pre style={{ background: '#f5f5f5', padding: '0.5rem', marginTop: '0.5rem' }}>
        {JSON.stringify(form, null, 2)}
      </pre>
    </div>
  );
}

export default function Lesson6Forms() {
  return (
    <div>
      <h2>Lesson 6: Forms & controlled inputs</h2>
      <SimpleForm />
      <ProfileForm />

      <p style={{ marginTop: '1rem', color: '#666' }}>
        Try it: add an <code>age</code> number field to <code>ProfileForm</code>{' '}
        (an <code>&lt;input type="number" name="age" /&gt;</code>), wire it
        into the same <code>form</code> state and <code>handleChange</code> —
        no new state variable needed, since <code>handleChange</code> already
        reads <code>name</code> off any input.
      </p>
    </div>
  );
}
