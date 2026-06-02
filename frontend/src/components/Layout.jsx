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
        <div className="sidebar-title">Sistema</div>

        <nav className="menu">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/receitas">Receitas</NavLink>
          <NavLink to="/despesas">Despesas</NavLink>
        </nav>

        <button onClick={sair}>Sair</button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}