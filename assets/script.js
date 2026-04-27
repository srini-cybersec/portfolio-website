const PROJECTS_URL = './src/data/projects.json';
const INDEX_URL    = './src/data/index.json';

let allProjects = [];
let activeFilter = 'All';

async function loadPortfolio() {
  try {
    const [projRes, idxRes] = await Promise.all([
      fetch(PROJECTS_URL),
      fetch(INDEX_URL),
    ]);

    allProjects = projRes.ok ? await projRes.json() : [];
    const index  = idxRes.ok  ? await idxRes.json()  : {};

    // Stats bar
    document.getElementById('stat-projects').textContent   = allProjects.length;
    document.getElementById('stat-categories').textContent = Object.keys(index.categories || {}).length || countCategories();

    if (index.last_synced) {
      const d = new Date(index.last_synced);
      document.getElementById('last-sync').textContent =
        `Last synced from GitHub: ${d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}`;
    }

    buildFilters();
    renderProjects(allProjects);
  } catch (err) {
    console.error('Portfolio load error:', err);
    showEmpty('Could not load projects. Check back soon.');
  }
}

function countCategories() {
  return [...new Set(allProjects.map(p => p.category || 'Cybersecurity'))].length;
}

function buildFilters() {
  const categories = ['All', ...new Set(allProjects.map(p => p.category || 'Cybersecurity'))];
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      activeFilter = cat;
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(cat === 'All' ? allProjects : allProjects.filter(p => (p.category || 'Cybersecurity') === cat));
    });
    bar.appendChild(btn);
  });
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');

  if (!projects.length) {
    showEmpty(activeFilter === 'All'
      ? 'No projects yet — NEXUS is generating the first one this week!'
      : `No projects in "${activeFilter}" yet.`);
    return;
  }

  grid.innerHTML = projects.map(p => projectCard(p)).join('');
}

function projectCard(p) {
  const tags = (p.tags || [])
    .filter(t => !['cybersecurity','infosec','security-tools','python','ethical-hacking','penetration-testing'].includes(t))
    .slice(0, 5)
    .map(t => `<span class="project-tag">${t}</span>`)
    .join('');

  const lang = (p.tech_stack || ['Python'])[0] || 'Python';
  const date = p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '';
  const stars = p.stars > 0 ? `⭐ ${p.stars}` : '';

  return `
    <div class="project-card">
      <div class="project-header">
        <div class="project-title">${escHtml(p.title || p.slug)}</div>
        <span class="project-lang">${escHtml(lang)}</span>
      </div>
      <p class="project-desc">${escHtml(p.summary || 'Cybersecurity project')}</p>
      ${tags ? `<div class="project-tags">${tags}</div>` : ''}
      <div class="project-footer">
        <span class="project-meta">${[date, stars].filter(Boolean).join(' · ')}</span>
        <a href="${escHtml(p.github_url)}" target="_blank" rel="noopener" class="project-link">
          View on GitHub →
        </a>
      </div>
    </div>`;
}

function showEmpty(msg) {
  document.getElementById('projects-grid').innerHTML =
    `<div class="empty-state"><p>${msg}</p></div>`;
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Animate stat counters
function animateCounter(el, target) {
  if (isNaN(target)) return;
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadPortfolio();
  // Animate number counters after load
  document.querySelectorAll('.stat-num').forEach(el => {
    const val = parseInt(el.textContent);
    if (!isNaN(val) && val > 0) animateCounter(el, val);
  });
});
