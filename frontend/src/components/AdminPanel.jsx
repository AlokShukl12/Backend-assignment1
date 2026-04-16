export default function AdminPanel({ users, currentUserId, onRoleUpdate, loading }) {
  return (
    <section className="card">
      <h2>Admin - Users</h2>
      <div className="task-list">
        {users.map((user) => (
          <article className="task-item" key={user.id}>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
            {user.id !== currentUserId ? (
              <div className="row">
                <button disabled={loading} type="button" onClick={() => onRoleUpdate(user.id, 'user')}>
                  Set User
                </button>
                <button
                  disabled={loading}
                  type="button"
                  onClick={() => onRoleUpdate(user.id, 'admin')}
                >
                  Set Admin
                </button>
              </div>
            ) : (
              <p>Current account</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
