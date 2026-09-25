// ══════════════════════════════════════════════
// ── login.js ──
// ══════════════════════════════════════════════

// Se já existe sessão ativa, vai direto para o dashboard.
if (token) {
  window.location.href = '../dashboard/dashboard.html';
}

document.getElementById('btn-login').onclick = async () => {
  const login = document.getElementById('login-user').value.trim();
  const senha = document.getElementById('login-pass').value.trim();
  const errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  if (!login || !senha) { errEl.textContent = 'Preencha login e senha.'; errEl.style.display = 'block'; return; }
  const btn = document.getElementById('btn-login');
  btn.textContent = 'Entrando…'; btn.disabled = true;
  try {
    const { data } = await api.post('/Authentication/login', { login, senha });
    token = data.token;
    userData = data;
    localStorage.setItem('gp_token', token);
    localStorage.setItem('gp_user', JSON.stringify(data));
    window.location.href = '../dashboard/dashboard.html';
  } catch (e) {
    errEl.textContent = 'Login ou senha inválidos.';
    errEl.style.display = 'block';
  } finally {
    btn.textContent = 'Entrar'; btn.disabled = false;
  }
};

document.getElementById('login-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-login').click();
});
