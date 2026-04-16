const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const devFallbackBases = import.meta.env.DEV
  ? ['http://localhost:5001/api/v1', 'http://localhost:5000/api/v1']
  : [];

const apiBaseCandidates = Array.from(
  new Set([configuredBaseUrl, ...devFallbackBases].filter(Boolean))
);
let activeApiBase = apiBaseCandidates[0] || 'http://localhost:5000/api/v1';

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  const tryRequest = async (baseUrl) => {
    const response = await fetch(`${baseUrl}${path}`, {
      credentials: 'include',
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      const message = payload?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    activeApiBase = baseUrl;
    return payload;
  };

  try {
    return await tryRequest(activeApiBase);
  } catch (error) {
    const isNetworkError = error instanceof TypeError;
    if (!isNetworkError) {
      throw error;
    }

    for (const candidate of apiBaseCandidates) {
      if (candidate === activeApiBase) continue;
      try {
        return await tryRequest(candidate);
      } catch (fallbackError) {
        if (!(fallbackError instanceof TypeError)) {
          throw fallbackError;
        }
      }
    }

    const triedBases = Array.from(new Set([activeApiBase, ...apiBaseCandidates])).join(', ');
    throw new Error(`Cannot reach API server. Tried: ${triedBases}`);
  }
};

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  listTasks: () => request('/tasks'),
  createTask: (body) => request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (taskId, body) =>
    request(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),

  listUsers: () => request('/users'),
  updateUserRole: (userId, role) =>
    request(`/users/${userId}/role`, { method: 'PATCH', body: JSON.stringify({ role }) })
};
