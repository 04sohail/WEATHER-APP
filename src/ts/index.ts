const getStartedBtn = document.getElementById('getStartedBtn');

if (getStartedBtn) {
    getStartedBtn.addEventListener('click', (): void => {
      window.location.href = "login.html"
    });
}

// Add animation classes for the blobs
document.styleSheets[0].insertRule(`
  @keyframes blob {
    0% { transform: scale(1); }
    33% { transform: scale(1.1); }
    66% { transform: scale(0.9); }
    100% { transform: scale(1); }
  }
`, 0);

document.styleSheets[0].insertRule(`
  .animate-blob {
    animation: blob 7s infinite;
  }
`, 0);

document.styleSheets[0].insertRule(`
  .animation-delay-2000 {
    animation-delay: 2s;
  }
`, 0);

document.styleSheets[0].insertRule(`
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`, 0);