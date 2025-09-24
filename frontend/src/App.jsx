import { useEffect, useState } from "react";
import { api } from "./api";

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [peptide, setPeptide] = useState("");
  const [dosage, setDosage] = useState(0.5);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await api.get("/api/entries");
    setEntries(data);
    setLoading(false);
  }
  async function add(e) {
    e.preventDefault();
    if (!peptide) return;
    await api.post("/api/entries", {
      peptide,
      dosageMg: Number(dosage),
      takenAt: "",
    });
    setPeptide("");
    setDosage(0.5);
    load();
  }
  async function del(id) {
    await api.delete(`/api/entries/${id}`);
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <h1>Peptide Journal</h1>
          <p className="muted">Log peptide, dosage, and time. (In-memory demo)</p>
        </header>

        <form className="form" onSubmit={add}>
          <Field label="Peptide">
            <input
              value={peptide}
              onChange={(e) => setPeptide(e.target.value)}
              placeholder="e.g. BPC-157"
              required
            />
          </Field>

          <Field label="Dosage (mg)">
            <input
              type="number"
              step="0.1"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              min="0"
              required
            />
          </Field>

          <button className="btn" type="submit">Add Entry</button>
        </form>

        <div className="list">
          {loading ? (
            <div className="empty">Loading…</div>
          ) : entries.length === 0 ? (
            <div className="empty">No entries yet. Add your first one ↑</div>
          ) : (
            entries.map((e) => (
              <div className="row" key={e.id}>
                <div className="row-main">
                  <div className="row-title">{e.peptide}</div>
                  <div className="row-sub">
                    {new Date(e.takenAt).toLocaleString()} · {e.dosageMg} mg
                  </div>
                </div>
                <button className="btn ghost" onClick={() => del(e.id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
      <footer className="foot">© {new Date().getFullYear()} Peptide Journal</footer>
    </div>
  );
}

