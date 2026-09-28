import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistograms, objectSearch, getDocuments } from "../api/scan";

const initial = {
  inn: "",
  maxFullness: false,
  inBusinessNews: false,
  onlyMainRole: false,
  tonality: "any",
  onlyWithRiskFactors: false,
  excludeTechNews: false,
  excludeAnnouncements: false,
  excludeDigests: false,
  limit: 100,
  startDate: "",
  endDate: "",
};

function isValidInn(inn) {
  if (!/^\d+$/.test(inn)) return false;
  if (inn.length === 10) {
    const c = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    const sum = c.reduce((s, k, i) => s + Number(inn[i]) * k, 0);
    return (sum % 11) % 10 === Number(inn[9]);
  }
  if (inn.length === 12) {
    const c1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8],
      c2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const d1 = (c1.reduce((s, k, i) => s + Number(inn[i]) * k, 0) % 11) % 10;
    const d2 = (c2.reduce((s, k, i) => s + Number(inn[i]) * k, 0) % 11) % 10;
    return d1 === Number(inn[10]) && d2 === Number(inn[11]);
  }
  return false;
}

export default function SearchPage() {
  const [form, setForm] = useState(initial),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const today = new Date().toISOString().slice(0, 10);
  const innOk = isValidInn(form.inn);
  const datesOk =
    form.startDate &&
    form.endDate &&
    form.startDate <= form.endDate &&
    form.startDate <= today &&
    form.endDate <= today;
  const limitOk = Number(form.limit) >= 1 && Number(form.limit) <= 1000;
  const valid = Boolean(form.inn && innOk && datesOk && limitOk);
  async function submit(e) {
    e.preventDefault();
    if (!valid) return;
    setError("");
    setLoading(true);
    const body = {
      intervalType: "month",
      histogramTypes: ["totalDocuments", "riskFactors"],
      issueDateInterval: { startDate: form.startDate, endDate: form.endDate },
      searchContext: {
        targetSearchEntitiesContext: {
          targetSearchEntities: [
            {
              type: "company",
              sparkId: null,
              entityId: null,
              inn: form.inn,
              maxFullness: form.maxFullness,
              inBusinessNews: form.inBusinessNews ? true : null,
            },
          ],
          onlyMainRole: form.onlyMainRole,
          tonality: form.tonality,
          onlyWithRiskFactors: form.onlyWithRiskFactors,
        },
      },
      similarMode: "none",
      limit: Number(form.limit),
      sortType: "issueDate",
      sortDirectionType: "desc",
      attributeFilters: {
        excludeTechNews: form.excludeTechNews,
        excludeAnnouncements: form.excludeAnnouncements,
        excludeDigests: form.excludeDigests,
      },
    };
    try {
      const [hist, search] = await Promise.all([
        getHistograms(body),
        objectSearch(body),
      ]);
      const items = search?.items || [];
      const ids = items.map((x) => x.encodedId).slice(0, 10);
      const docs = ids.length ? await getDocuments(ids) : [];
      navigate("/results", { state: { hist, items, docs, body } });
    } catch (e) {
      setError(e.message || "Не удалось выполнить поиск");
    } finally {
      setLoading(false);
    }
  }
  const options = [
    ["maxFullness", "Признак максимальной полноты"],
    ["inBusinessNews", "Упоминания в бизнес-контексте"],
    ["onlyMainRole", "Главная роль в публикации"],
    ["onlyWithRiskFactors", "Публикации только с риск-факторами"],
    ["excludeTechNews", "Исключать технические новости рынков"],
    ["excludeAnnouncements", "Исключать анонсы и календари"],
    ["excludeDigests", "Исключать сводки новостей"],
  ];
  return (
    <main className="search-page">
      <form className="search-card" onSubmit={submit}>
        <div className="search-left">
          <label>
            ИНН компании <em>*</em>
            <input
              inputMode="numeric"
              maxLength="12"
              value={form.inn}
              onChange={(e) => set("inn", e.target.value.replace(/\D/g, ""))}
            />
            {form.inn && !innOk && (
              <span className="field-error">Введите корректные данные</span>
            )}
          </label>
          <label>
            Тональность
            <select
              value={form.tonality}
              onChange={(e) => set("tonality", e.target.value)}
            >
              <option value="any">Любая</option>
              <option value="positive">Позитивная</option>
              <option value="negative">Негативная</option>
            </select>
          </label>
          <label>
            Количество документов в выдаче <em>*</em>
            <input
              className={!limitOk ? "invalid" : ""}
              type="number"
              min="1"
              max="1000"
              value={form.limit}
              onChange={(e) => set("limit", e.target.value)}
            />
            {!limitOk && (
              <span className="field-error">
                От 1 до 1000
                <br />
                Обязательное поле
              </span>
            )}
          </label>
          <div className="date-block">
            <span>
              Диапазон поиска <em>*</em>
            </span>
            <div className="date-grid">
              <label>
                <input
                  type="date"
                  max={today}
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                />
              </label>
              <label>
                <input
                  type="date"
                  max={today}
                  value={form.endDate}
                  onChange={(e) => set("endDate", e.target.value)}
                />
              </label>
            </div>
            {form.startDate &&
              form.endDate &&
              form.startDate > form.endDate && (
                <span className="field-error">Введите корректные данные</span>
              )}
          </div>
        </div>
        <div className="search-right">
          <div className="checks">
            {options.map(([k, text]) => (
              <label key={k}>
                <input
                  type="checkbox"
                  checked={form[k]}
                  onChange={(e) => set(k, e.target.checked)}
                />
                <span>{text}</span>
              </label>
            ))}
          </div>
          <button
            className="primary-button search-submit"
            disabled={!valid || loading}
          >
            {loading ? (
              <>
                <span className="spinner light" /> Загрузка...
              </>
            ) : (
              "Поиск"
            )}
          </button>
          <div className="required-note">* Обязательные к заполнению поля</div>
          {error && <div className="field-error request-error">{error}</div>}
        </div>
      </form>
      <img className="search-page-img" src="/search-page-img.png" alt="" />
    </main>
  );
}
