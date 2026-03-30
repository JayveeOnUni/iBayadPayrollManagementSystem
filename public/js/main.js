// ─── Sidebar nav toggle ────────────────────────────────────────────────────────
function toggleNav(btn) {
  const item = btn.closest('.nav-item');
  const isOpen = item.classList.contains('open');
  // Close all open items
  document.querySelectorAll('.nav-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ─── Modal helpers ─────────────────────────────────────────────────────────────
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ─── Toast auto-dismiss ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('.toast');
  if (toast) {
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});

// ─── Confirm delete ────────────────────────────────────────────────────────────
function confirmDelete(formId) {
  if (confirm('Are you sure you want to delete this record? This cannot be undone.')) {
    document.getElementById(formId).submit();
  }
}

// ─── Table search filter ────────────────────────────────────────────────────────
function filterTable(inputId, tableId) {
  const q = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ─── Punch time ────────────────────────────────────────────────────────────────
function recordPunch(type) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const el = document.getElementById('punch-' + type);
  if (el) {
    el.textContent = time;
    el.style.color = 'var(--n100)';
    el.style.fontWeight = '600';
  }
}
