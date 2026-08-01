const m=document.querySelector(".menu"),n=document.querySelector(".topbar nav");if(m&&n)m.onclick=()=>n.classList.toggle("open");

(() => {
  const config = window.DAO_SUPREME_CONFIG || {};

  document.querySelectorAll(".server-invite-link").forEach(link => {
    if (config.serverInviteUrl) link.href = config.serverInviteUrl;
  });

  document.querySelectorAll(".bot-invite-link").forEach(link => {
    if (config.botInviteUrl) {
      link.href = config.botInviteUrl;
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-disabled");
    } else {
      link.href = "#";
      link.setAttribute("aria-disabled", "true");
      link.classList.add("is-disabled");
      link.title = "Ajoute le lien OAuth2 du bot dans js/config.js";
      link.addEventListener("click", event => event.preventDefault());
    }
  });
})();
