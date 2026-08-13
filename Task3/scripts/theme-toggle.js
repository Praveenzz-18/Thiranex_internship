(() => {
  const root = document.documentElement;
  const key = 'preferred-theme';

  function setTheme(theme){
    if(theme === 'dark'){
      root.setAttribute('data-theme','dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem(key, theme);
    updateButtons(theme);
  }

  function updateButtons(theme){
    document.querySelectorAll('#theme-toggle').forEach(btn=>{
      btn.setAttribute('aria-pressed', theme==='dark');
      btn.textContent = theme==='dark' ? 'Light Mode' : 'Dark Mode';
    })
  }

  function init(){
    const saved = localStorage.getItem(key);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    setTheme(theme);

    document.addEventListener('click', e => {
      const t = e.target;
      if(t && t.id === 'theme-toggle'){
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
