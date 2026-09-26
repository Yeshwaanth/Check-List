import "./App.css";
import { useEffect, useState } from "react";
import ChecklistCard from "./components/ChecklistCard";
import { checklistApi } from "./api/checklistApi";

function App() {
  return <ChecklistApp />;
}

export default App;

function ChecklistApp() {
  const [checklists, setChecklists] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      setChecklists(await checklistApi.list());
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const replace = (list) =>
    setChecklists((all) =>
      all.map((item) => (item._id === list._id ? list : item)),
    );
  const actions = {
    name: async (id, value) => replace(await checklistApi.update(id, value)),
    addItem: async (id, title) =>
      replace(await checklistApi.addItem(id, title)),
    item: async (id, itemId, changes) =>
      replace(await checklistApi.updateItem(id, itemId, changes)),
    removeItem: async (id, itemId) => {
      await checklistApi.removeItem(id, itemId);
      await load();
    },
  };
  const create = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      const list = await checklistApi.create(name.trim());
      setChecklists((all) => [list, ...all]);
      setName("");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">ORGANIZE YOUR DAY</p>
        <h1>Checklists, simply done.</h1>
        <p className="subtitle">
          Small lists. Clear progress. Less to hold in your head.
        </p>
      </header>
      <form className="create-form" onSubmit={create}>
        <input
          aria-label="New checklist name"
          placeholder="Name a new checklist"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>Create checklist</button>
      </form>
      {error && (
        <div className="error" role="alert">
          {error}
          <button onClick={() => setError("")}>×</button>
        </div>
      )}
      {loading ? (
        <p className="empty">Loading your checklists…</p>
      ) : checklists.length ? (
        <section className="checklist-grid">
          {[...checklists]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((list) => (
              <ChecklistCard
                key={list._id}
                checklist={list}
                actions={actions}
                onError={setError}
                onDelete={async (id) => {
                  await checklistApi.remove(id);
                  setChecklists((all) => all.filter((item) => item._id !== id));
                }}
              />
            ))}
        </section>
      ) : (
        <p className="empty">Your first checklist is waiting to be made.</p>
      )}
    </main>
  );
}
