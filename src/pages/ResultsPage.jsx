import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDocuments } from "../api/scan";

export default function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [docs, setDocs] = useState(state?.docs || []);
  const [loading, setLoading] = useState(false);
  const [histIndex, setHistIndex] = useState(0);
  if (!state)
    return (
      <main className="results-page">
        <h1>Результаты</h1>
        <p>Результаты поиска не найдены.</p>
        <button className="primary-button" onClick={() => navigate("/search")}>
          Новый поиск
        </button>
      </main>
    );
  const items = state.items || [];
  async function more() {
    const next = items
      .slice(docs.length, docs.length + 10)
      .map((x) => x.encodedId);
    if (!next.length) return;
    setLoading(true);
    try {
      const data = await getDocuments(next);
      setDocs((d) => [...d, ...data]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  const histData = state.hist?.data || [];

  const totalDocuments =
    histData.find((x) => x.histogramType === "totalDocuments")?.data || [];

  const riskFactors =
    histData.find((x) => x.histogramType === "riskFactors")?.data || [];

  const histogramPeriods = totalDocuments.map((item) => {
    const risk = riskFactors.find((riskItem) => riskItem.date === item.date);

    return {
      date: item.date,
      total: item.value,
      risk: risk?.value || 0,
    };
  });

  const desktopPeriods = histogramPeriods.slice(histIndex, histIndex + 8);
  const mobilePeriod = histogramPeriods[histIndex];

  const totalFound = histogramPeriods.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

  function formatHistogramDate(date) {
    const value = new Date(date);

    return value.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function prepareMarkup(markup) {
    if (!markup) {
      return "<p>Содержимое публикации отсутствует.</p>";
    }

    let html = markup
      // XML-заголовок
      .replace(/<!--\?xml[\s\S]*?\?-->/gi, "")
      .replace(/<\?xml[\s\S]*?\?>/gi, "");

    // Если HTML пришёл закодированным: &lt;p&gt; → <p>
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    html = textarea.value;

    // Сохраняем переносы перед удалением тегов
    html = html
      .replace(/<\/p>\s*<p>/gi, "\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/div>\s*<div>/gi, "\n\n")
      .replace(/<\/li>\s*<li>/gi, "\n");

    // Удаляем ВСЕ HTML/XML-теги
    const container = document.createElement("div");
    container.innerHTML = html;

    let text = container.textContent || "";

    // Нормализуем пробелы и переносы
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!text) {
      return "<p>Содержимое публикации отсутствует.</p>";
    }

    // Превращаем переносы в нормальные абзацы
    return text
      .split(/\n\s*\n/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
      .join("");
  }
  return (
    <main className="results-page">
      <div className="results-head-row">
        <div className="results-head">
          <h1>Результаты поиска</h1>
          <p>Результаты анализа публикаций</p>
        </div>

        <img className="search-result-img" src="/search-result.png" alt="" />

        <button
          className="secondary-button"
          onClick={() => navigate("/search")}
        >
          Новый поиск
        </button>
      </div>
      <section className="histogram-card">
        <h2>Общая сводка</h2>

        <p className="histogram-count">
          Найдено {totalFound.toLocaleString("ru-RU")} вариантов
        </p>

        {histogramPeriods.length > 0 ? (
          <>
            {/* ДЕСКТОП */}
            <div className="histogram-carousel histogram-carousel-desktop">
              <button
                className="histogram-arrow"
                aria-label="Предыдущий период"
                disabled={histIndex === 0}
                onClick={() => setHistIndex((index) => Math.max(0, index - 1))}
              >
                ‹
              </button>

              <div className="histogram-table">
                <div className="histogram-labels">
                  <div>Период</div>
                  <div>Всего</div>
                  <div>Риски</div>
                </div>

                <div
                  className="histogram-data"
                  style={{
                    gridTemplateColumns: `repeat(${desktopPeriods.length}, 1fr)`,
                  }}
                >
                  {desktopPeriods.map((period) => (
                    <div className="histogram-column" key={period.date}>
                      <div>{formatHistogramDate(period.date)}</div>
                      <div>{period.total}</div>
                      <div>{period.risk}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="histogram-arrow"
                aria-label="Следующий период"
                disabled={histIndex + 8 >= histogramPeriods.length}
                onClick={() =>
                  setHistIndex((index) =>
                    Math.min(
                      Math.max(0, histogramPeriods.length - 8),
                      index + 1,
                    ),
                  )
                }
              >
                ›
              </button>
            </div>

            {/* МОБИЛЬНАЯ ВЕРСИЯ */}
            <div className="histogram-carousel histogram-carousel-mobile">
              <button
                className="histogram-arrow"
                aria-label="Предыдущий период"
                disabled={histIndex === 0}
                onClick={() => setHistIndex((index) => Math.max(0, index - 1))}
              >
                ‹
              </button>

              <div className="histogram-mobile-table">
                <div className="histogram-mobile-head">
                  <div>Период</div>
                  <div>Всего</div>
                  <div>Риски</div>
                </div>

                {mobilePeriod && (
                  <div className="histogram-mobile-row">
                    <div>{formatHistogramDate(mobilePeriod.date)}</div>
                    <div>{mobilePeriod.total}</div>
                    <div>{mobilePeriod.risk}</div>
                  </div>
                )}
              </div>

              <button
                className="histogram-arrow"
                aria-label="Следующий период"
                disabled={histIndex + 1 >= histogramPeriods.length}
                onClick={() =>
                  setHistIndex((index) =>
                    Math.min(histogramPeriods.length - 1, index + 1),
                  )
                }
              >
                ›
              </button>
            </div>
          </>
        ) : (
          <p className="histogram-empty">
            Данные по динамике публикаций отсутствуют.
          </p>
        )}
      </section>
      <div className="documents">
        {docs.map((d, i) => {
          const doc = d?.ok || d;
          return (
            <article className="document" key={doc.id || i}>
              <div className="document-meta">
                <span>{doc.issueDate}</span>
                <span>{doc.source?.name}</span>
              </div>
              <h2>{doc.title?.text}</h2>
              <div className="tags">
                {doc.attributes?.isTechNews && <span>Технические новости</span>}
                {doc.attributes?.isAnnouncement && (
                  <span>Анонсы и события</span>
                )}
                {doc.attributes?.isDigest && <span>Сводка новостей</span>}
              </div>
              <div
                className="markup"
                dangerouslySetInnerHTML={{
                  __html: prepareMarkup(doc.content?.markup),
                }}
              />
              <div className="document-foot">
                <span>{doc.attributes?.wordCount || 0} слов</span>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  Читать в источнике →
                </a>
              </div>
            </article>
          );
        })}
      </div>
      {docs.length < items.length && (
        <button
          className="primary-button more-button"
          onClick={more}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner light" /> Загрузка...
            </>
          ) : (
            "Показать больше"
          )}
        </button>
      )}
    </main>
  );
}
