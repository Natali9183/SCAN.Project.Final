import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Brand from "../components/Brand";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const valid = Boolean(loginValue.trim() && password.trim());
  if (isAuthenticated)
    return (
      <main className="simple-state">
        <h1>Пользователь авторизован</h1>
        <p>Перейдите к поиску публикаций.</p>
        <button className="primary-button" onClick={() => navigate("/search")}>
          Перейти к поиску
        </button>
      </main>
    );
  async function submit(e) {
    e.preventDefault();
    if (!valid || loading) return;
    setError("");
    setLoading(true);
    try {
      await login(loginValue.trim(), password);
      navigate("/search");
    } catch {
      setError("Неправильный пароль");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-page">
      <main className="auth-main">
        <section className="auth-intro">
          <h1>
            ДЛЯ ОФОРМЛЕНИЯ ПОДПИСКИ
            <br />
            НА ТАРИФ, НЕОБХОДИМО
            <br />
            АВТОРИЗОВАТЬСЯ.
          </h1>
        </section>
        <section className="auth-card-wrap">
          <img className="auth-lock" src="/auth-lock.png" alt="" />
          <div className="auth-card">
            <div className="auth-tabs">
              <button className="active" type="button">
                Войти
              </button>
              <button type="button" disabled>
                Зарегистрироваться
              </button>
            </div>
            <form onSubmit={submit}>
              <label>
                Логин или номер телефона:
                <input
                  autoComplete="username"
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                />
                {loginValue && !/^[^\s]+$/.test(loginValue) && (
                  <span className="field-error">Введите корректные данные</span>
                )}
              </label>
              <label>
                Пароль:
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <span className="field-error">{error}</span>}
              </label>
              <button className="submit-button" disabled={!valid || loading}>
                {loading ? "Вход..." : "Войти"}
              </button>
              <button type="button" className="forgot">
                Восстановить пароль
              </button>
            </form>
            <div className="social-title">Войти через:</div>
            <div className="social">
              <button type="button">
                <img className="social-btn" src="/google-btn.png" alt=""></img>
              </button>
              <button type="button">
                <img
                  className="social-btn"
                  src="/facebook-btn.png"
                  alt=""
                ></img>
              </button>
              <button type="button">
                <img className="social-btn" src="/yandex-btn.png"></img>
              </button>
            </div>
          </div>
          <img
            className="auth-illustration"
            src="/auth-illustration.png"
            alt=""
          />
        </section>
      </main>
      <footer className="footer">
        <Brand footer />
        <div className="footer-contacts">
          г. Москва, Цветной б-р, 40
          <br />
          +7 495 771 21 11
          <br />
          info@scan.ru
          <br />
          <small>Copyright. 2022</small>
        </div>
      </footer>
    </div>
  );
}
