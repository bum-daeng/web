const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#navMenu");

if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // 메뉴 클릭 시 모바일 메뉴 닫기
    navMenu.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
            navMenu.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
        });
    });
}

// Footer year
document.querySelector("#year").textContent = String(new Date().getFullYear());

// Portfolio load
async function loadProjects() {
    const grid = document.querySelector("#projectGrid");
    if (!grid) return;

    try {
        const res = await fetch("data/projects.json", { cache: "no-store" });
        if (!res.ok) throw new Error("projects.json fetch failed");
        const projects = await res.json();

        grid.innerHTML = projects.map(p => {
            if (p.type === "av") return renderAvCard(p);
            return renderDevCard(p);
        }).join("");

        function renderAvCard(p) {
            return `
    <article class="card">
      <div class="card-top">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="muted mono">${escapeHtml(p.period || "")} · ${escapeHtml(p.scale || "")}</p>
      </div>

      <p class="muted">${escapeHtml(p.summary)}</p>

      <dl class="spec">
        <div><dt>Role</dt><dd>${escapeHtml(p.role || "-")}</dd></div>
        <div><dt>Stack</dt><dd>${(p.stack || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</dd></div>
      </dl>

      <ul class="list">
        ${(p.highlights || []).slice(0, 3).map(h => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>

      <div class="stack" style="margin-top:12px">
        ${p.evidence?.photos ? `<a class="btn btn-ghost" href="${p.evidence.photos}" target="_blank" rel="noreferrer">Photos</a>` : ""}
        ${p.evidence?.doc ? `<a class="btn btn-ghost" href="${p.evidence.doc}" target="_blank" rel="noreferrer">Docs</a>` : ""}
        ${p.evidence?.video ? `<a class="btn btn-ghost" href="${p.evidence.video}" target="_blank" rel="noreferrer">Video</a>` : ""}
      </div>
    </article>
  `;
        }

        function renderDevCard(p) {
            const demo = p.links?.demo || "";
            const repo = p.links?.repo || "";
            return `
    <article class="card">
      <div class="card-top">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="muted mono">${escapeHtml(p.period || "")} · ${escapeHtml(p.role || "")}</p>
      </div>

      <p class="muted">${escapeHtml(p.summary)}</p>

      <div class="tags">
        ${(p.stack || []).map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("")}
      </div>

      <ul class="list">
        ${(p.highlights || []).slice(0, 3).map(h => `<li>${escapeHtml(h)}</li>`).join("")}
      </ul>

      <div class="stack" style="margin-top:12px">
        ${demo ? `<a class="btn btn-ghost" href="${demo}" target="_blank" rel="noreferrer">Demo</a>` : ""}
        ${repo ? `<a class="btn btn-ghost" href="${repo}" target="_blank" rel="noreferrer">Repo</a>` : ""}
      </div>
    </article>
  `;
        }


    } catch (e) {
        grid.innerHTML = `
      <div class="card">
        <h3>포트폴리오 데이터를 불러오지 못했습니다</h3>
        <p class="muted">data/projects.json 파일을 확인해주세요.</p>
      </div>
    `;
    }
}

function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

loadProjects();
