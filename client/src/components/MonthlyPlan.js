import { useState } from "react";

const colors = [
  { background: "#e8e5ff", border: "#6556c5", text: "#332b72" },
  { background: "#dff6ee", border: "#23866a", text: "#145843" },
  { background: "#fff0d9", border: "#bc7119", text: "#7a4208" },
  { background: "#ffe5ed", border: "#bc4670", text: "#7c1f43" },
  { background: "#dff1ff", border: "#287aae", text: "#164c70" },
  { background: "#f0e9dc", border: "#92733e", text: "#604817" },
];
const key = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const taskRange = (task) => ({
  start: task.startDate || task.dueDate,
  end: task.endDate || task.startDate || task.dueDate,
});
const parse = (value) =>
  value ? new Date(`${String(value).slice(0, 10)}T00:00:00`) : null;

export default function MonthlyPlan({ checklists }) {
  const now = new Date();
  const [cursor, setCursor] = useState(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthName = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(cursor);
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const leading = firstDay.getDay();
  const calendarTasks = checklists
    .flatMap((list, index) =>
      list.items.map((item) => ({
        ...item,
        listName: list.name,
        listId: list._id,
        color: colors[index % colors.length],
      })),
    )
    .filter((task) => {
      const range = taskRange(task);
      const start = parse(range.start);
      const end = parse(range.end);
      return (
        start && end && start <= new Date(year, month + 1, 0) && end >= firstDay
      );
    });
  const activeLists = [
    ...new Map(calendarTasks.map((task) => [task.listId, task])).values(),
  ];
  const tasksForDay = (day) => {
    const date = new Date(year, month, day);
    return calendarTasks.filter((task) => {
      const range = taskRange(task);
      return date >= parse(range.start) && date <= parse(range.end);
    });
  };
  const cells = Array.from({ length: leading + lastDate }, (_, index) =>
    index < leading ? null : index - leading + 1,
  );
  const cssColor = (color) => ({
    "--task-bg": color.background,
    "--task-border": color.border,
    "--task-text": color.text,
  });
  return (
    <section className="calendar-page">
      <div className="calendar-header">
        <div>
          <p className="eyebrow">MONTHLY PLAN</p>
          <h2>{monthName}</h2>
          <p>Tasks appear on every day between their start and end dates.</p>
        </div>
        <div className="month-controls">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
          >
            &lt;
          </button>
          <button
            onClick={() =>
              setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
            }
          >
            Today
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>
      </div>
      {activeLists.length > 0 && (
        <div className="calendar-legend" aria-label="Checklist color guide">
          {activeLists.map((list) => (
            <span key={list.listId}>
              <i style={{ background: list.color.border }} />
              {list.listName}
            </span>
          ))}
        </div>
      )}
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((day, index) =>
          day ? (
            <div
              className={`calendar-day ${key(new Date(year, month, day)) === key(now) ? "today" : ""}`}
              key={day}
            >
              <span className="day-number">{day}</span>
              {tasksForDay(day).map((task) => (
                <div
                  className={`calendar-task ${task.completed ? "calendar-complete" : ""}`}
                  style={cssColor(task.color)}
                  title={`${task.title} · ${task.listName}`}
                  key={`${task._id}-${day}`}
                >
                  {task.title}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="calendar-day calendar-blank"
              key={`blank-${index}`}
            />
          ),
        )}
      </div>
      {!calendarTasks.length && (
        <p className="monthly-empty">
          No scheduled tasks this month. Add start and end dates from the
          Checklists page.
        </p>
      )}
    </section>
  );
}
