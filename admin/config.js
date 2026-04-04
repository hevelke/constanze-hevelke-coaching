// ── GitHub-Konfiguration für den Online-Admin ─────────────────
// Diese Datei einmalig anpassen — danach ist der Admin-Bereich
// direkt über die Live-Domain nutzbar.
//
// 1. GITHUB_OWNER  → dein GitHub-Benutzername
// 2. GITHUB_REPO   → Name des Repositories (exakt wie auf GitHub)
// 3. GITHUB_BRANCH → in der Regel "main"
//
// Token beim Login eingeben (wird NUR im Browser-Tab gespeichert):
//   github.com → Settings → Developer settings
//   → Personal access tokens → Fine-grained tokens
//   → New token → Repository access: dieses Repo
//   → Permissions: Contents = Read and write

window.GITHUB_OWNER  = 'hevelke';  // ← hier anpassen
window.GITHUB_REPO   = 'constanze-hevelke-coaching';
window.GITHUB_BRANCH = 'main';
