import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao entrar');
    }
  }

  return (
    <div className="auth">
      <form onSubmit={enviar} className="card auth-card">
        <h1>Entrar</h1>
        {erro && <p className="error">{erro}</p>}
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Senha" type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} />
        <button>Entrar</button>
        <Link to="/cadastro">Criar conta</Link>
      </form>
    </div>
  );
}
