import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { user, loading, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if ((location.state as { registered?: boolean })?.registered) {
      addToast('Акаунтът е създаден успешно. Влезте, за да продължите.', 'success');
      window.history.replaceState({}, document.title);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="spinner" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(name, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white">Sweet App</h1>
          <p className="text-sm text-gray-500 mt-1">Влезте в своя профил</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-lg p-6">
          {error && (
            <div className="mb-4 px-3 py-2 text-sm bg-red-900/20 text-red-400 border border-red-800 rounded">{error}</div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Име</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus
              className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Парола</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-3 py-2 bg-black text-white border border-surface-border rounded text-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 outline-none" />
          </div>

          <button type="submit" disabled={submitting}
            className="w-full btn-primary">
            {submitting ? 'Влизане...' : 'Вход'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Нямате акаунт?{' '}
          <Link to="/register" className="text-gray-300 hover:text-white font-medium">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}
