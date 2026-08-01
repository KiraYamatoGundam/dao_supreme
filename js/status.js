
(() => {
  const STATES = {
    connected: {
      label: "・Connecté",
      icon: "assets/status/connected.webp",
      detail: "Le bot fonctionne normalement."
    },
    disconnected: {
      label: "・Déconnecté",
      icon: "assets/status/disconnected.webp",
      detail: "Le bot est actuellement indisponible."
    },
    maintenance: {
      label: "・Maintenance",
      icon: "assets/status/maintenance.webp",
      detail: "Une opération de maintenance est en cours."
    },
    updating: {
      label: "・Mise à jour",
      icon: "assets/status/updating.webp",
      detail: "Une nouvelle version est en cours de déploiement."
    }
  };

  const $ = id => document.getElementById(id);
  const config = window.DAO_SUPREME_CONFIG || {};
  let timer;

  function formatUptime(value) {
    if (typeof value === "string") return value;
    if (!Number.isFinite(value)) return "—";
    const total = Math.max(0, Math.floor(value));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    return [d ? `${d} j` : "", h ? `${h} h` : "", `${m} min`].filter(Boolean).join(" ");
  }

  function render(payload = {}) {
    const key = STATES[payload.status] ? payload.status : "disconnected";
    const state = STATES[key];

    $("bot-status-icon").src = state.icon;
    $("bot-status-label").textContent = state.label;
    $("bot-status-detail").textContent = payload.message || state.detail;
    $("bot-latency").textContent = Number.isFinite(payload.latency)
      ? `${Math.round(payload.latency)} ms`
      : "— ms";
    $("bot-uptime").textContent = formatUptime(payload.uptime);
    $("bot-version").textContent = payload.version || "—";
    $("bot-guilds").textContent = Number.isFinite(payload.guilds) ? payload.guilds : "—";
    $("bot-users").textContent = Number.isFinite(payload.users) ? payload.users : "—";
    $("bot-commands").textContent = Number.isFinite(payload.commands) ? payload.commands : "—";
    $("bot-cogs").textContent = Number.isFinite(payload.cogs) ? payload.cogs : "—";
    $("bot-last-check").textContent = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    document.querySelector(".status-card")?.setAttribute("data-status", key);
  }

  async function refresh() {
    if (!config.statusEndpoint) {
      render({ status: config.fallbackStatus || "disconnected" });
      return;
    }

    try {
      const response = await fetch(config.statusEndpoint, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      render(await response.json());
    } catch {
      render({
        status: "disconnected",
        message: "Impossible de joindre le service de statut."
      });
    }
  }

  refresh();
  timer = setInterval(refresh, Math.max(10000, config.refreshEveryMs || 60000));
})();
