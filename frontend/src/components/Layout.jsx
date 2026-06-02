import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Sistema</h2>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/receitas">Clientes/Receitas</NavLink>
        <NavLink to="/despesas">Despesas</NavLink>
        <button onClick={sair}>Sair</button>
      </aside>
      <main className="content"><Outlet /></main>
    </div>
  );
}
