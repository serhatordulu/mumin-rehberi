
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

console.log('Mümin Rehberi başlatılıyor...');

// Service Worker Kaydı
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('SW Başarıyla Kaydedildi: ', registration.scope);
    }).catch(registrationError => {
      console.log('SW Kaydı Başarısız: ', registrationError);
    });
  });
}

try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error("Kök element 'root' bulunamadı.");
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React render işlemi başarılı.');
} catch (error) {
    console.error('Uygulama başlatma hatası:', error);
    // Hata durumunda ekrana mesaj bas (Index.html içindeki onerror da bunu yakalar)
    document.body.innerHTML = `<div style="padding:20px; color:red; font-family:sans-serif;"><h3>Uygulama Başlatılamadı</h3><p>Bir hata oluştu:</p><pre style="background:#eee; padding:10px; overflow:auto;">${error}</pre></div>`;
}
