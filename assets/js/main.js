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

    grid.innerHTML = projects.map(p => `
      <article class="card">
        <h3>${escapeHtml(p.title)}</h3>
        <p class="muted">${escapeHtml(p.summary)}</p>
        <ul class="chips">
          ${(p.tags || []).map(t => `<li>${escapeHtml(t)}</li>`).join("")}
        </ul>
        <div class="stack" style="margin-top:12px">
          ${p.link ? `<a class="btn btn-ghost" href="${p.link}" target="_blank" rel="noreferrer">보기</a>` : ""}
          ${p.repo ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noreferrer">코드</a>` : ""}
        </div>
      </article>
    `).join("");

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
