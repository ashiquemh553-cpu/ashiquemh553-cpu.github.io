try {
  const saved = localStorage.getItem('ashique-portfolio-theme');
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
} catch {}

