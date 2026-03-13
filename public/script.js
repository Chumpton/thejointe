(() => {
  const menuToggle = document.querySelector(".js-menu-toggle");
  const menuPanel = document.querySelector(".js-menu-panel");
  const spotifyEmbed = document.querySelector(".spotify-embed");
  const spotifyPlaceholder = document.querySelector(".spotify-placeholder");

  const normalizeSpotifyEmbedUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (raw.includes("open.spotify.com/embed/")) return raw;
    if (raw.includes("open.spotify.com/")) {
      return raw.replace("open.spotify.com/", "open.spotify.com/embed/");
    }
    return raw;
  };

  const setMenuOpen = (open) => {
    if (!(menuToggle instanceof HTMLButtonElement)) return;
    if (!menuPanel) return;
    menuPanel.hidden = !open;
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  if (menuToggle && menuPanel) {
    menuToggle.addEventListener("click", () => {
      setMenuOpen(menuPanel.hidden);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (menuPanel.hidden) return;
      if (target.closest(".js-menu-toggle")) return;
      if (target.closest(".js-menu-panel")) return;
      setMenuOpen(false);
    });

    menuPanel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a")) setMenuOpen(false);
    });
  }

  if (spotifyEmbed instanceof HTMLIFrameElement) {
    const embedUrl = normalizeSpotifyEmbedUrl(spotifyEmbed.dataset.spotifyEmbed);
    if (embedUrl) {
      spotifyEmbed.src = embedUrl;
      spotifyEmbed.hidden = false;
      if (spotifyPlaceholder) spotifyPlaceholder.hidden = true;
    } else {
      spotifyEmbed.hidden = true;
      if (spotifyPlaceholder) spotifyPlaceholder.hidden = false;
    }
  }
  const episodeRow = document.getElementById("episodeRow");
  const episodesDataEl = document.getElementById("episodesData");

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
      .slice(0, 6)
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
              <div class="thumb-badge">
                <span class="thumb-badge-text">${label}</span>
                <span class="thumb-playing" aria-hidden="true">
                  <span></span><span></span><span></span>
                </span>
              </div>
            </a>
            <div class="episode-meta">
              <h3 class="episode-title">${title}</h3>
              <p class="episode-desc">${desc}</p>
              <div class="episode-actions">
                <a class="btn btn-ink js-play" href="${videoUrl}" target="_blank" rel="noreferrer">
                  <span class="btn-ic" aria-hidden="true">▶</span> Watch
                </a>
                <button
                  class="icon-btn js-save"
                  type="button"
                  data-ep="${epNum}"
                  aria-pressed="false"
                  aria-label="Save ${label}: ${title}"
                  title="Save"
                >
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path
                      d="M7 4h10a1 1 0 0 1 1 1v16l-6-3-6 3V5a1 1 0 0 1 1-1z"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
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
      return;
    }

    const saveBtn = target.closest(".js-save");
    if (saveBtn) {
      const ep = saveBtn.getAttribute("data-ep") || "";
      const saved = saveBtn.getAttribute("aria-pressed") === "true";
      saveBtn.setAttribute("aria-pressed", saved ? "false" : "true");
      saveBtn.title = saved ? "Save" : "Saved";
      saveBtn.setAttribute("aria-label", `${saved ? "Save" : "Saved"} ${ep ? `Ep. ${ep}` : "Episode"}`);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
})();
