import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from '../components/Brand';

const benefits = [
  ['◷', 'Высокая и оперативная скорость обработки заявки'],
  ['⌕', 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос'],
  ['♢', 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству'],
  ['✓', 'Проверка сведений по открытым источникам'],
];

const tariffs = [
  { name: 'Beginner', sub: 'Для небольшого исследования', price: '799 ₽', old: '1 200 ₽', color: 'yellow', current: true, items: ['Безлимитная история запросов', 'Безопасная сделка', 'Поддержка 24/7'] },
  { name: 'Pro', sub: 'Для HR и фрилансеров', price: '1 299 ₽', old: '2 600 ₽', color: 'aqua', items: ['Все пункты тарифа Beginner', 'Экспорт истории', 'Рекомендации по приоритетам'] },
  { name: 'Business', sub: 'Для корпоративных клиентов', price: '2 379 ₽', old: '3 700 ₽', color: 'black', items: ['Все пункты тарифа Pro', 'Безлимитное количество запросов', 'Приоритетная поддержка'] },
];

function Footer() {
  return <footer className="footer"><Brand footer/><div className="footer-contacts">г. Москва, Цветной б-р, 40<br/>+7 495 771 21 11<br/>info@scan.ru<br/><small>Copyright. 2022</small></div></footer>;
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [benefitIndex, setBenefitIndex] = useState(0);
  const visible = [0, 1, 2].map(offset => benefits[(benefitIndex + offset) % benefits.length]);
  return <>
    <main className="home-main">
      <section className="hero">
        <div className="hero-copy">
          <h1>СЕРВИС ПО ПОИСКУ<br/>ПУБЛИКАЦИЙ<br/>О КОМПАНИИ<br/>ПО ЕГО ИНН</h1>
          <p>Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
          {isAuthenticated && <Link className="primary-button" to="/search">Запросить данные</Link>}
        </div>
        <img className="hero-image" src="/hero-main.png" alt="" />
      </section>

      <section className="why" id="faq">
        <h2>ПОЧЕМУ ИМЕННО МЫ</h2>
        <div className="carousel">
          <button aria-label="Предыдущая карточка" className="carousel-arrow" onClick={() => setBenefitIndex((benefitIndex - 1 + benefits.length) % benefits.length)}>‹</button>
          <div className="benefit-cards">{visible.map(([icon,text], i) => <article className={`benefit-card benefit-${i}`} key={`${icon}-${text}`}><div className="benefit-icon">{icon}</div><p>{text}</p></article>)}</div>
          <button aria-label="Следующая карточка" className="carousel-arrow" onClick={() => setBenefitIndex((benefitIndex + 1) % benefits.length)}>›</button>
        </div>
        <img className="why-image" src="/why-main.png" alt="" />
      </section>

      <section className="tariffs" id="tariffs">
        <h2>НАШИ ТАРИФЫ</h2>
        <div className="tariff-grid">{tariffs.map(t => <article className={`tariff tariff-${t.color}`} key={t.name}>
          <div className="tariff-head"><h3>{t.name}</h3><p>{t.sub}</p></div>
          <div className="tariff-body"><div className="price"><strong>{t.price}</strong> <s>{t.old}</s>{t.current && <span>Текущий тариф</span>}</div><p>или 150 ₽/мес. при рассрочке на 24 мес.</p><h4>В тариф входит:</h4><ul>{t.items.map(x => <li key={x}>{x}</li>)}</ul><button className={t.current ? 'cabinet-button' : 'tariff-button'} type="button">{t.current ? 'Перейти в личный кабинет' : 'Подробнее'}</button></div>
        </article>)}</div>
      </section>
    </main>
    <Footer />
  </>;
}
