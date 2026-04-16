import { useEffect, useMemo, useState } from 'react';
import { api } from './api/client';
import AuthCard from './components/AuthCard';
import TaskPanel from './components/TaskPanel';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [authMode, setAuthMode] = useState('signup');
  const [loginPrefillEmail, setLoginPrefillEmail] = useState('');

  const isAdmin = user?.role === 'admin';

  const setError = (error) => setStatus({ type: 'error', message: error.message || String(error) });
  const setSuccess = (message) => setStatus({ type: 'success', message });

  const loadTasks = async () => {
    const response = await api.listTasks();
    setTasks(response.data.tasks);
  };

  const loadUsers = async () => {
    if (!isAdmin) {
      setUsers([]);
      return;
    }

    const response = await api.listUsers();
    setUsers(response.data.users);
  };

  const refreshData = async () => {
    await loadTasks();
    await loadUsers();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.me();
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setUsers([]);
      return;
    }

    refreshData().catch(setError);
  }, [user]);

  const runAction = async (action) => {
    setLoading(true);
    try {
      await action();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const headline = useMemo(() => {
    if (!user) return 'Task Manager';
    return `Welcome, ${user.name} (${user.role})`;
  }, [user]);

  if (initializing) {
    return <main className="container">Loading...</main>;
  }

  return (
    <main className="container">
      <header className="header">
        <h1>{headline}</h1>
        {user ? (
          <button
            type="button"
            disabled={loading}
            onClick={() =>
              runAction(async () => {
                await api.logout();
                setAuthMode('login');
                setLoginPrefillEmail(user?.email || '');
                setUser(null);
                setSuccess('Logged out');
              })
            }
          >
            Logout
          </button>
        ) : null}
      </header>

      {status.message ? <p className={`notice ${status.type}`}>{status.message}</p> : null}

      {!user ? (
        <AuthCard
          loading={loading}
          mode={authMode}
          onModeChange={setAuthMode}
          loginPrefillEmail={loginPrefillEmail}
          onRegister={(data) =>
            runAction(async () => {
              await api.register(data);
              setAuthMode('login');
              setLoginPrefillEmail(data.email);
              setSuccess('Signup successful. Please login.');
            })
          }
          onLogin={(data) =>
            runAction(async () => {
              const response = await api.login(data);
              setUser(response.data.user);
              setAuthMode('signup');
              setLoginPrefillEmail('');
              setSuccess(response.message || 'Logged in successfully');
            })
          }
        />
      ) : (
        <section className="dashboard-grid">
          <TaskPanel
            tasks={tasks}
            loading={loading}
            onCreate={(payload) =>
              runAction(async () => {
                const response = await api.createTask(payload);
                await refreshData();
                setSuccess(response.message || 'Task created');
              })
            }
            onUpdate={(taskId, payload) =>
              runAction(async () => {
                const response = await api.updateTask(taskId, payload);
                await refreshData();
                setSuccess(response.message || 'Task updated');
              })
            }
            onDelete={(taskId) =>
              runAction(async () => {
                const response = await api.deleteTask(taskId);
                await refreshData();
                setSuccess(response.message || 'Task deleted');
              })
            }
          />

          {isAdmin ? (
            <AdminPanel
              users={users}
              currentUserId={user.id}
              loading={loading}
              onRoleUpdate={(userId, role) =>
                runAction(async () => {
                  const response = await api.updateUserRole(userId, role);
                  await refreshData();
                  setSuccess(response.message || 'Role updated');
                })
              }
            />
          ) : null}
        </section>
      )}
    </main>
  );
}
