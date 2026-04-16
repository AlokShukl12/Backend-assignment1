import { useEffect, useState } from 'react';

const defaultRegisterState = { name: '', email: '', password: '' };
const defaultLoginState = { email: '', password: '' };

export default function AuthCard({
  onRegister,
  onLogin,
  loading,
  mode,
  onModeChange,
  loginPrefillEmail
}) {
  const [registerData, setRegisterData] = useState(defaultRegisterState);
  const [loginData, setLoginData] = useState(defaultLoginState);

  useEffect(() => {
    if (loginPrefillEmail) {
      setLoginData((prev) => ({ ...prev, email: loginPrefillEmail }));
    }
  }, [loginPrefillEmail]);

  return (
    <div className="auth-grid">
      <section className="card">
        <h2>{mode === 'signup' ? 'Register' : 'Login'}</h2>
        {mode === 'signup' ? (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await onRegister(registerData);
            }}
            className="form"
          >
            <input
              placeholder="Name"
              value={registerData.name}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={registerData.email}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={registerData.password}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <button disabled={loading} type="submit">
              Create Account
            </button>
            <button type="button" onClick={() => onModeChange('login')}>
              Already have an account? Login
            </button>
          </form>
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await onLogin(loginData);
            }}
            className="form"
          >
            <input
              placeholder="Email"
              type="email"
              value={loginData.email}
              onChange={(event) => setLoginData((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <input
              placeholder="Password"
              type="password"
              value={loginData.password}
              onChange={(event) =>
                setLoginData((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <button disabled={loading} type="submit">
              Login
            </button>
            <button type="button" onClick={() => onModeChange('signup')}>
              New user? Signup
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
