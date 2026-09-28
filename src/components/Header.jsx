import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from './Brand';
import { useState } from 'react';

export default function Header({ account, accountLoading }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <Brand />
      <nav className="nav" aria-label="Основная навигация">
        <a href="/#">Главная</a><a href="/#tariffs">Тарифы</a><a href="/#faq">FAQ</a>
      </nav>
      <div className="header-actions">
        {isAuthenticated ? <>
          <div className="account-limit">
            {accountLoading ? <><span className="spinner"/> <span>Загрузка...</span></> : <>
              <span><small>Использовано компаний</small><strong>{account?.usedCompanyCount ?? '—'}</strong></span>
              <span><small>Лимит по компаниям</small><b>{account?.companyLimit ?? '—'}</b></span>
            </>}
          </div>
          <div className="profile">
  <span className="avatar">А</span>

  <span className="profile-name">
    Алексей А.
    <button
      type="button"
      onClick={() => {
        logout();
        navigate('/');
      }}
    >
      Выйти
    </button>
  </span>
</div>
        </> : <>
          <button className="register-link" type="button">Зарегистрироваться</button>
          <button className="login-button" type="button" onClick={() => navigate('/login')}>Войти</button>
        </>}
      </div>
      <button
  className="mobile-menu"
  type="button"
  onClick={() => setMenuOpen(prev => !prev)}
  aria-label="Меню"
>
  <span />
  <span />
  <span />
</button>
{menuOpen && (
  <div className="mobile-nav">
    <a href="/#" onClick={() => setMenuOpen(false)}>Главная</a>
    <a href="/#tariffs" onClick={() => setMenuOpen(false)}>Тарифы</a>
    <a href="/#faq" onClick={() => setMenuOpen(false)}>FAQ</a>

    {!isAuthenticated && (
  <>
    <button
      type="button"
      onClick={() => setMenuOpen(false)}
    >
      Зарегистрироваться
    </button>

    <button
      type="button"
      onClick={() => {
        setMenuOpen(false);
        navigate('/login');
      }}
    >
      Войти
    </button>
  </>
)}
    {isAuthenticated && (
      <button
        type="button"
        onClick={() => {
          setMenuOpen(false);
          logout();
          navigate('/');
        }}
      >
        Выйти
      </button>
    )}
  </div>
)}
    </header>
  );
}
