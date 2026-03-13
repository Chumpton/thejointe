(() => {
  const player = document.querySelector(".player");
  const playerTitle = document.getElementById("playerTitle");
  const closeBtn = document.querySelector(".js-player-close");
  const episodeRow = document.getElementById("episodeRow");
  const episodesDataEl = document.getElementById("episodesData");

  const setPlayerOpen = (open) => {
    if (!player) return;
    player.hidden = !open;
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const renderEpisodes = (episodes) => {
    if (!episodeRow) return;
    const safeEpisodes = Array.isArray(episodes) ? episodes : [];
    episodeRow.innerHTML = safeEpisodes
      .slice(0, 12)
      .map((ep) => {
        const epNum = escapeHtml(ep?.ep ?? "");
        const title = escapeHtml(ep?.title ?? "Episode");
        const desc = escapeHtml(ep?.desc ?? "");
        const videoUrl = escapeHtml(ep?.videoUrl ?? "#");
        const thumb = escapeHtml(ep?.thumb ?? "public/assets/episodes/placeholder.svg");
        const label = epNum ? `Ep. ${epNum}` : "Episode";

        return `
          <article class="episode" role="listitem">
            <a class="thumb-link" href="${videoUrl}" target="_blank" rel="noreferrer" aria-label="${label}: ${title}">
              <div class="thumb-media">
                <img class="thumb-img" src="${thumb}" alt="${label} thumbnail" loading="lazy" />
              </div>
              <div class="thumb-badge">${label}</div>
            </a>
            <div class="episode-meta">
              <h3 class="episode-title">${title}</h3>
              <p class="episode-desc">${desc}</p>
              <div class="episode-actions">
                <button class="btn btn-ink js-play" data-ep="${epNum}" data-title="${title}">
                  <span class="btn-ic" aria-hidden="true">▶</span> Play
                </button>
                <button class="btn btn-ghost js-save" data-ep="${epNum}">Save</button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const loadEpisodes = async () => {
    if (!episodeRow) return;
    if (episodesDataEl?.textContent?.trim()) {
      try {
        const json = JSON.parse(episodesDataEl.textContent);
        if (json?.episodes) {
          renderEpisodes(json.episodes);
          return;
        }
      } catch {
        // Fall through to fetch-based loading
      }
    }
    try {
      const res = await fetch("public/episodes.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`episodes.json HTTP ${res.status}`);
      const json = await res.json();
      renderEpisodes(json?.episodes);
    } catch {
      renderEpisodes([
        {
          ep: "—",
          title: "Add your YouTube thumbnails",
          desc: "Edit public/episodes.json and point thumbs at local files or i.ytimg.com URLs.",
          videoUrl: "https://www.youtube.com/@TheJointe",
          thumb: "public/assets/episodes/placeholder.svg",
        },
      ]);
    }
  };

  loadEpisodes();

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const playBtn = target.closest(".js-play");
    if (playBtn) {
      const title = playBtn.getAttribute("data-title") || "Episode";
      if (playerTitle) playerTitle.textContent = title;
      setPlayerOpen(true);
      return;
    }

    const saveBtn = target.closest(".js-save");
    if (saveBtn) {
      const ep = saveBtn.getAttribute("data-ep") || "";
      const saved = saveBtn.textContent === "Saved";
      saveBtn.textContent = saved ? "Save" : "Saved";
      saveBtn.setAttribute("aria-pressed", saved ? "false" : "true");
      saveBtn.title = ep ? `Episode ${ep}` : "Episode";
    }
  });

  closeBtn?.addEventListener("click", () => setPlayerOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setPlayerOpen(false);
  });
})();
