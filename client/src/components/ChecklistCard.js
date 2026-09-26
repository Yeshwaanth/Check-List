import { useState } from "react";

export default function ChecklistCard({
  checklist,
  actions,
  onDelete,
  onError,
}) {
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(checklist.name);
  const run = async (work) => {
    try {
      await work();
    } catch (error) {
      onError(error.message);
    }
  };
  const completeCount = checklist.items.filter((item) => item.completed).length;
  return (
    <article className="checklist-card">
      <div className="card-heading">
        {editingName ? (
          <form
            className="inline-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (name.trim())
                run(async () => {
                  await actions.name(checklist._id, name.trim());
                  setEditingName(false);
                });
            }}
          >
            <input
              aria-label="Checklist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <button className="text-button">Save</button>
          </form>
        ) : (
          <>
            <h2>{checklist.name}</h2>
            <div>
              <button
                className="mini-button"
                onClick={() => setEditingName(true)}
              >
                Edit
              </button>
              <button
                className="mini-button danger"
                onClick={() => run(() => onDelete(checklist._id))}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
      <p className="progress">
        {completeCount} of {checklist.items.length} completed
      </p>
      <ul className="item-list">
        {checklist.items.map((item) => (
          <li key={item._id} className={item.completed ? "done" : ""}>
            <input
              type="checkbox"
              aria-label={`Complete ${item.title}`}
              checked={item.completed}
              onChange={() =>
                run(() =>
                  actions.item(checklist._id, item._id, {
                    completed: !item.completed,
                  }),
                )
              }
            />
            {editingId === item._id ? (
              <form
                className="inline-form item-edit"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (editValue.trim())
                    run(async () => {
                      await actions.item(checklist._id, item._id, {
                        title: editValue.trim(),
                      });
                      setEditingId(null);
                    });
                }}
              >
                <input
                  aria-label="Item title"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button className="text-button">Save</button>
              </form>
            ) : (
              <>
                <span>{item.title}</span>
                <button
                  className="mini-button"
                  onClick={() => {
                    setEditingId(item._id);
                    setEditValue(item.title);
                  }}
                >
                  Edit
                </button>
              </>
            )}
            <button
              className="mini-button danger"
              aria-label={`Delete ${item.title}`}
              onClick={() =>
                run(() => actions.removeItem(checklist._id, item._id))
              }
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      <form
        className="add-item"
        onSubmit={(event) => {
          event.preventDefault();
          if (newItem.trim())
            run(async () => {
              await actions.addItem(checklist._id, newItem.trim());
              setNewItem("");
            });
        }}
      >
        <input
          aria-label="New checklist item"
          placeholder="Add an item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button>Add</button>
      </form>
    </article>
  );
}
