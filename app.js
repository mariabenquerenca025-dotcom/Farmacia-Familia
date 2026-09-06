// ---------- Supabase client ----------
const { url, anonKey } = window.SUPABASE_CONFIG || {};
let sb = null;
let configOk = url && anonKey && !url.includes("COLA_AQUI") && !anonKey.includes("COLA_AQUI");
if (configOk) {
  sb = supabase.createClient(url, anonKey);
}

// ---------- Constants ----------
const TABLE = "medicamentos";

const CATEGORIES = [
  "Dor e febre", "Dores musculares", "Alergias", "Antibióticos",
  "Cardiovascular", "Suplementos", "Digestivo", "Respiratório",
  "Pele", "Feridas e pensos", "Outro",
];

const FORMAS = [
  "Comprimidos", "Cápsulas", "Xarope", "Gotas", "Pomada / Creme",
  "Injetável", "Spray", "Supositório", "Outro",
];

const SYMPTOM_MAP = {
  "febre": ["Dor e febre"], "febril": ["Dor e febre"],
  "dor": ["Dor e febre", "Dores musculares"],
  "dor de cabeca": ["Dor e febre"], "dor de dentes": ["Dor e febre"],
  "dor muscular": ["Dores musculares"], "dor nas costas": ["Dores musculares"],
  "contratura": ["Dores musculares"],
  "gripe": ["Dor e febre", "Respiratório"], "constipacao": ["Respiratório"],
  "tosse": ["Respiratório"], "garganta": ["Respiratório"],
  "alergia": ["Alergias"], "alergica": ["Alergias"],
  "comichao": ["Alergias", "Pele"], "urticaria": ["Alergias", "Pele"],
  "picada": ["Pele", "Alergias"], "queimadura": ["Pele"],
  "irritacao": ["Pele"], "eczema": ["Pele"],
  "ferida": ["Feridas e pensos"], "corte": ["Feridas e pensos"],
  "diarreia": ["Digestivo"], "obstipacao": ["Digestivo"],
  "prisao de ventre": ["Digestivo"], "estomago": ["Digestivo"], "azia": ["Digestivo"],
  "infecao": ["Antibióticos"],
  "coracao": ["Cardiovascular"], "arritmia": ["Cardiovascular"],
  "anemia": ["Suplementos"], "ferro": ["Suplementos"], "cansaco": ["Suplementos"],
};

const ICONS = {
  plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  pencil: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>`,
  alert: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  calendar: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  check: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  package: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 6.96 12 12.01l8.7-5.05"/><path d="M12 22.08V12"/></svg>`,
  packageBig: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 6.96 12 12.01l8.7-5.05"/><path d="M12 22.08V12"/></svg>`,
  alertBig: `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

const STATUS_STYLE = {
  expired: { fg: "var(--red)", bg: "var(--red-soft)", label: "Expirado", icon: ICONS.alert },
  soon: { fg: "var(--amber)", bg: "var(--amber-soft)", label: "A expirar", icon: ICONS.calendar },
  ok: { fg: "var(--green)", bg: "var(--green-soft)", label: "Válido", icon: ICONS.check },
};

// ---------- Helpers ----------
function esc(s) {
  return (s ?? "").toString().replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function normalize(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function monthsUntil(validade) {
  if (!validade) return null;
  const [y, m] = validade.split("-").map(Number);
  const expiryEnd = new Date(y, m, 0);
  return Math.floor((expiryEnd - new Date()) / 86400000);
}

function statusFor(validade) {
  const days = monthsUntil(validade);
  if (days === null) return { key: "ok", days };
  if (days < 0) return { key: "expired", days };
  if (days <= 90) return { key: "soon", days };
  return { key: "ok", days };
}

function formatValidade(v) {
  if (!v) return "—";
  const [y, m] = v.split("-");
  const meses = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  return `${meses[parseInt(m, 10) - 1]} ${y}`;
}

function symptomCategories(query) {
  const q = normalize(query);
  if (!q) return new Set();
  const cats = new Set();
  Object.entries(SYMPTOM_MAP).forEach(([key, list]) => {
    if (q.includes(key) || key.includes(q)) list.forEach((c) => cats.add(c));
  });
  return cats;
}

function emptyForm() {
  return { id: null, nome: "", principio_ativo: "", dosagem: "", forma: FORMAS[0], quantidade: "", categoria: CATEGORIES[0], lote: "", validade: "", notas: "" };
}

// ---------- State ----------
let state = {
  meds: [],
  loading: true,
  saveError: configOk ? null : "Falta configurar o Supabase em config.js (URL e anon key).",
  query: "",
  filter: "todos",
  symptom: "",
  panelOpen: false,
  form: emptyForm(),
  confirmDeleteId: null,
};

// Evita que o mesmo toque que ABRE um painel também o feche de imediato
// (comum em telemóveis, quando o DOM muda a meio do gesto de toque).
let lastPanelOpenAt = 0;
let lastConfirmOpenAt = 0;
const CLOSE_GUARD_MS = 350;

function setState(patch) {
  state = { ...state, ...patch };
  render();
}

// ---------- Data layer ----------
async function loadMeds() {
  if (!configOk) { setState({ loading: false }); return; }
  try {
    const { data, error } = await sb.from(TABLE).select("*").order("validade", { ascending: true, nullsFirst: false });
    if (error) throw error;
    setState({ meds: data || [], loading: false, saveError: null });
  } catch (e) {
    setState({ loading: false, saveError: "Não consegui carregar os dados: " + e.message });
  }
}

async function saveMed(record) {
  try {
    const { error } = await sb.from(TABLE).upsert(record);
    if (error) throw error;
    setState({ saveError: null });
    return true;
  } catch (e) {
    setState({ saveError: "Não foi possível guardar: " + e.message });
    return false;
  }
}

async function deleteMed(id) {
  try {
    const { error } = await sb.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    setState({ saveError: null });
  } catch (e) {
    setState({ saveError: "Não foi possível eliminar: " + e.message });
  }
}

function subscribeRealtime() {
  if (!configOk) return;
  sb.channel("medicamentos-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: TABLE }, () => loadMeds())
    .subscribe();
}

// ---------- Derived lists ----------
function getVisible() {
  let list = state.meds;
  const q = state.query.trim().toLowerCase();
  if (q) {
    list = list.filter((m) =>
      (m.nome || "").toLowerCase().includes(q) ||
      (m.principio_ativo || "").toLowerCase().includes(q) ||
      (m.categoria || "").toLowerCase().includes(q)
    );
  }
  if (state.filter !== "todos") {
    list = list.filter((m) => statusFor(m.validade).key === state.filter);
  }
  return [...list].sort((a, b) => (!a.validade ? 1 : !b.validade ? -1 : a.validade.localeCompare(b.validade)));
}

function getSymptomMatches() {
  const trimmed = state.symptom.trim();
  if (!trimmed) return null;
  const nq = normalize(trimmed);
  const cats = symptomCategories(trimmed);
  const list = state.meds.filter((m) => {
    const inCategory = cats.has(m.categoria);
    const inText = normalize(m.nome).includes(nq) || normalize(m.principio_ativo).includes(nq) || normalize(m.notas).includes(nq);
    return inCategory || inText;
  });
  return [...list].sort((a, b) => (!a.validade ? 1 : !b.validade ? -1 : a.validade.localeCompare(b.validade)));
}

function getStats() {
  let expired = 0, soon = 0;
  state.meds.forEach((m) => {
    const k = statusFor(m.validade).key;
    if (k === "expired") expired++; else if (k === "soon") soon++;
  });
  return { total: state.meds.length, expired, soon };
}

// ---------- Rendering ----------
function medCardHtml(m) {
  const s = statusFor(m.validade);
  const style = STATUS_STYLE[s.key];
  return `
    <div class="med-card" style="border-left:4px solid ${style.fg}">
      <div class="med-top">
        <div style="min-width:0;flex:1">
          <div class="med-name">${esc(m.nome)}</div>
          <div class="med-sub">${esc([m.principio_ativo, m.dosagem].filter(Boolean).join(" · "))}</div>
        </div>
        <div class="med-actions">
          <button class="icon-btn" data-action="edit" data-id="${esc(m.id)}" aria-label="Editar">${ICONS.pencil}</button>
          <button class="icon-btn" data-action="ask-delete" data-id="${esc(m.id)}" aria-label="Eliminar">${ICONS.trash}</button>
        </div>
      </div>
      <div class="tag-row">
        <span class="tag" style="background:${style.bg};color:${style.fg}">${style.icon} ${style.label} · ${formatValidade(m.validade)}</span>
        ${m.categoria ? `<span class="tag" style="background:var(--cream);color:var(--ink-soft)">${esc(m.categoria)}</span>` : ""}
        ${m.quantidade !== null && m.quantidade !== undefined && m.quantidade !== "" ? `<span class="tag" style="background:var(--cream);color:var(--ink-soft)">${ICONS.package} ${esc(m.quantidade)} ${esc((m.forma || "unid.").toLowerCase())}</span>` : ""}
        ${m.lote ? `<span class="tag" style="background:var(--cream);color:var(--ink-soft)">Lote ${esc(m.lote)}</span>` : ""}
      </div>
      ${m.notas ? `<div class="med-notes">${esc(m.notas)}</div>` : ""}
    </div>`;
}

function render() {
  // Preserve focus + cursor position across re-renders (typing in a text
  // field triggers a full re-render for live filtering, which would
  // otherwise recreate the input and drop focus after every keystroke).
  const active = document.activeElement;
  const activeId = active && active.id;
  const selStart = active && "selectionStart" in active ? active.selectionStart : null;
  const selEnd = active && "selectionEnd" in active ? active.selectionEnd : null;

  const stats = getStats();
  const visible = getVisible();
  const symptomTrimmed = state.symptom.trim();
  const symptomMatches = symptomTrimmed ? getSymptomMatches() : null;

  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="header">
      <div class="header-top">
        <div class="brand">
          <div class="brand-icon">${ICONS.plus.replace("20", "18")}</div>
          <div>
            <h1>Farmácia da Família</h1>
            <p class="subtitle">Base de dados partilhada — Supabase</p>
          </div>
        </div>
        <button class="btn-add" data-action="new" aria-label="Adicionar medicamento">${ICONS.plus}</button>
      </div>

      <div class="stats">
        <div class="stat-pill" style="background:var(--cream)">
          <div class="stat-value">${stats.total}</div><div class="stat-label">Total</div>
        </div>
        <div class="stat-pill" style="background:var(--amber-soft)">
          <div class="stat-value" style="color:var(--amber)">${stats.soon}</div><div class="stat-label" style="color:var(--amber)">A expirar</div>
        </div>
        <div class="stat-pill" style="background:var(--red-soft)">
          <div class="stat-value" style="color:var(--red)">${stats.expired}</div><div class="stat-label" style="color:var(--red)">Expirados</div>
        </div>
      </div>

      <div class="symptom-box">
        <label class="symptom-label">O que precisas? Diz o sintoma</label>
        <div class="symptom-input-wrap">
          <input id="symptom-input" placeholder="Ex: febre, dor de cabeça, picada de inseto..." value="${esc(state.symptom)}" />
          ${state.symptom ? `<button class="symptom-clear" data-action="clear-symptom">${ICONS.x}</button>` : ""}
        </div>
        <div class="chip-row">
          ${["Febre","Dor de cabeça","Alergia","Tosse","Picada de inseto","Estômago"].map(s => `<button class="chip" data-action="set-symptom" data-value="${esc(s.toLowerCase())}">${esc(s)}</button>`).join("")}
        </div>
      </div>

      <div class="search-wrap">
        <span class="search-icon">${ICONS.search}</span>
        <input id="query-input" placeholder="Procurar por nome ou categoria..." value="${esc(state.query)}" />
      </div>

      <div class="filters">
        ${[["todos","Todos"],["soon","A expirar"],["expired","Expirados"]].map(([k,l]) =>
          `<button class="filter-btn ${state.filter===k?"active":""}" data-action="set-filter" data-value="${k}">${l}</button>`
        ).join("")}
      </div>
    </div>

    <div class="body">
      ${state.saveError ? `<div class="error-banner">${esc(state.saveError)}</div>` : ""}
      ${state.loading ? `<div class="loading">A carregar a farmácia...</div>` :
        symptomTrimmed ? `
          <div>
            ${symptomMatches.length > 0 ? `<div class="hint-line">${symptomMatches.length} ${symptomMatches.length===1?"sugestão":"sugestões"} com base no que já tens registado — não substitui o conselho do médico ou farmacêutico.</div>` : ""}
            ${symptomMatches.length === 0 ? `
              <div class="empty">
                <div style="color:var(--ink-soft)">${ICONS.alertBig}</div>
                <p style="margin:10px 0 4px">Não tens nada registado para isto.</p>
                <p style="margin:0;font-size:13px">Fala com o farmacêutico ou adiciona um medicamento novo.</p>
              </div>` :
              `<div class="med-list">${symptomMatches.map(medCardHtml).join("")}</div>`
            }
          </div>` :
        visible.length === 0 ? `
          <div class="empty">
            <div style="color:var(--ink-soft)">${ICONS.packageBig}</div>
            <p>${(state.query || state.filter !== "todos") ? "Nenhum medicamento corresponde a esta procura." : "A farmácia da família ainda está vazia."}</p>
            ${!(state.query || state.filter !== "todos") ? `<button class="empty-btn" data-action="new">Adicionar o primeiro medicamento</button>` : ""}
          </div>` :
          `<div class="med-list">${visible.map(medCardHtml).join("")}</div>`
      }
    </div>

    ${state.panelOpen ? panelHtml() : ""}
    ${state.confirmDeleteId ? confirmHtml() : ""}
  `;

  attachListeners();

  if (activeId) {
    const toFocus = document.getElementById(activeId);
    if (toFocus) {
      toFocus.focus();
      if (selStart !== null && typeof toFocus.setSelectionRange === "function") {
        try { toFocus.setSelectionRange(selStart, selEnd); } catch (e) {}
      }
    }
  }
}

function panelHtml() {
  const f = state.form;
  const disabled = !f.nome.trim() || !f.validade;
  return `
    <div class="overlay" data-overlay-kind="close-panel">
      <div class="sheet" data-stop="1">
        <div class="sheet-header">
          <h2>${f.id ? "Editar medicamento" : "Novo medicamento"}</h2>
          <button class="close-btn" data-action="close-panel" aria-label="Fechar">${ICONS.x}</button>
        </div>
        <div class="form-col">
          <div class="field"><label>Nome *</label><input id="f-nome" value="${esc(f.nome)}" placeholder="Ex: Flexiban" /></div>
          <div class="field"><label>Princípio ativo</label><input id="f-principio" value="${esc(f.principio_ativo)}" placeholder="Ex: Cloridrato de ciclobenzaprina" /></div>
          <div class="form-row">
            <div class="field"><label>Dosagem</label><input id="f-dosagem" value="${esc(f.dosagem)}" placeholder="Ex: 10 mg" /></div>
            <div class="field"><label>Forma</label>
              <select id="f-forma">${FORMAS.map(x => `<option ${x===f.forma?"selected":""}>${esc(x)}</option>`).join("")}</select>
            </div>
          </div>
          <div class="form-row">
            <div class="field"><label>Quantidade</label><input id="f-quantidade" type="number" min="0" value="${esc(f.quantidade)}" placeholder="Ex: 20" /></div>
            <div class="field"><label>Validade *</label><input id="f-validade" type="month" value="${esc(f.validade)}" /></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Categoria</label>
              <select id="f-categoria">${CATEGORIES.map(x => `<option ${x===f.categoria?"selected":""}>${esc(x)}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Lote</label><input id="f-lote" value="${esc(f.lote)}" placeholder="Ex: A172A" /></div>
          </div>
          <div class="field"><label>Notas</label><textarea id="f-notas" rows="2" placeholder="Ex: guardar na prateleira de cima">${esc(f.notas)}</textarea></div>
          <button class="submit-btn" data-action="submit-form" ${disabled ? "disabled" : ""}>${f.id ? "Guardar alterações" : "Adicionar medicamento"}</button>
        </div>
      </div>
    </div>`;
}

function confirmHtml() {
  return `
    <div class="overlay center" data-overlay-kind="cancel-delete">
      <div class="confirm-card" data-stop="1">
        <p>Eliminar este medicamento da lista?</p>
        <div class="confirm-actions">
          <button class="btn-cancel" data-action="cancel-delete">Cancelar</button>
          <button class="btn-danger" data-action="confirm-delete">Eliminar</button>
        </div>
      </div>
    </div>`;
}

// ---------- Event wiring ----------
function attachListeners() {
  const app = document.getElementById("app");

  const symptomInput = document.getElementById("symptom-input");
  if (symptomInput) symptomInput.oninput = (e) => setState({ symptom: e.target.value });

  const queryInput = document.getElementById("query-input");
  if (queryInput) queryInput.oninput = (e) => setState({ query: e.target.value });

  // form fields (only present when panel open) — mutate state directly
  // instead of going through setState/render, so typing never rebuilds
  // the DOM (keeps focus without needing the restore-focus logic above).
  const bind = (id, key, transform) => {
    const el = document.getElementById(id);
    if (el) el.oninput = (e) => {
      state.form[key] = transform ? transform(e.target.value) : e.target.value;
      const btn = document.querySelector('[data-action="submit-form"]');
      if (btn) btn.disabled = !state.form.nome.trim() || !state.form.validade;
    };
  };
  bind("f-nome", "nome");
  bind("f-principio", "principio_ativo");
  bind("f-dosagem", "dosagem");
  bind("f-forma", "forma");
  bind("f-quantidade", "quantidade");
  bind("f-validade", "validade");
  bind("f-categoria", "categoria");
  bind("f-lote", "lote");
  bind("f-notas", "notas");

  app.onclick = async (e) => {
    const stopEl = e.target.closest("[data-stop]");
    const overlay = e.target.closest(".overlay");
    if (overlay && !stopEl?.contains(e.target) && e.target === overlay) {
      // clicked outside the sheet/card
      const action = overlay.dataset.overlayKind;
      const now = Date.now();
      if (action === "close-panel" && now - lastPanelOpenAt > CLOSE_GUARD_MS) {
        setState({ panelOpen: false });
      }
      if (action === "cancel-delete" && now - lastConfirmOpenAt > CLOSE_GUARD_MS) {
        setState({ confirmDeleteId: null });
      }
      return;
    }

    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "new") { lastPanelOpenAt = Date.now(); setState({ form: emptyForm(), panelOpen: true }); return; }
    if (action === "edit") {
      const m = state.meds.find((x) => String(x.id) === target.dataset.id);
      if (m) { lastPanelOpenAt = Date.now(); setState({ form: { ...emptyForm(), ...m, quantidade: m.quantidade ?? "" }, panelOpen: true }); }
      return;
    }
    if (action === "close-panel") { setState({ panelOpen: false }); return; }
    if (action === "clear-symptom") { setState({ symptom: "" }); return; }
    if (action === "set-symptom") { setState({ symptom: target.dataset.value }); return; }
    if (action === "set-filter") { setState({ filter: target.dataset.value }); return; }
    if (action === "ask-delete") { lastConfirmOpenAt = Date.now(); setState({ confirmDeleteId: target.dataset.id }); return; }
    if (action === "cancel-delete") { setState({ confirmDeleteId: null }); return; }
    if (action === "confirm-delete") {
      const id = state.confirmDeleteId;
      setState({ confirmDeleteId: null });
      await deleteMed(id);
      await loadMeds();
      return;
    }
    if (action === "submit-form") {
      const f = state.form;
      if (!f.nome.trim() || !f.validade) return;
      const record = {
        id: f.id || `med-${Date.now()}`,
        nome: f.nome.trim(),
        principio_ativo: f.principio_ativo || "",
        dosagem: f.dosagem || "",
        forma: f.forma || "",
        quantidade: f.quantidade === "" ? null : Number(f.quantidade),
        categoria: f.categoria || "",
        lote: f.lote || "",
        validade: f.validade || "",
        notas: f.notas || "",
        updated_at: new Date().toISOString(),
      };
      const ok = await saveMed(record);
      if (ok) { setState({ panelOpen: false }); await loadMeds(); }
      return;
    }
  };
}

// ---------- Boot ----------
render();
loadMeds();
subscribeRealtime();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
