import { useState } from 'react';

const defaultTask = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: ''
};

export default function TaskPanel({ tasks, onCreate, onUpdate, onDelete, loading }) {
  const [form, setForm] = useState(defaultTask);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState(defaultTask);

  const resetCreateForm = () => setForm(defaultTask);

  return (
    <section className="card">
      <h2>Tasks</h2>

      <form
        className="form inline"
        onSubmit={(event) => {
          event.preventDefault();
          const payload = {
            ...form,
            dueDate: form.dueDate || null
          };
          onCreate(payload);
          resetCreateForm();
        }}
      >
        <input
          placeholder="Title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
        <select
          value={form.status}
          onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          value={form.dueDate}
          onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
        />
        <button disabled={loading} type="submit">
          Add Task
        </button>
      </form>

      <div className="task-list">
        {tasks.map((task) => {
          const isEditing = editingTaskId === task._id;

          if (isEditing) {
            return (
              <article className="task-item" key={task._id}>
                <form
                  className="form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    onUpdate(task._id, {
                      ...editForm,
                      dueDate: editForm.dueDate || null
                    });
                    setEditingTaskId(null);
                  }}
                >
                  <input
                    value={editForm.title}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    required
                  />
                  <input
                    value={editForm.description}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                  />
                  <select
                    value={editForm.status}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, status: event.target.value }))
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(event) =>
                      setEditForm((prev) => ({ ...prev, dueDate: event.target.value }))
                    }
                  />
                  <div className="row">
                    <button disabled={loading} type="submit">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingTaskId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </article>
            );
          }

          return (
            <article className="task-item" key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description || 'No description'}</p>
              <p>Status: {task.status}</p>
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
              {task.owner?.name ? <p>Owner: {task.owner.name}</p> : null}
              <div className="row">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTaskId(task._id);
                    setEditForm({
                      title: task.title,
                      description: task.description || '',
                      status: task.status,
                      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
                    });
                  }}
                >
                  Edit
                </button>
                <button disabled={loading} type="button" onClick={() => onDelete(task._id)}>
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
