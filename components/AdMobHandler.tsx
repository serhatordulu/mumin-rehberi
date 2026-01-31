
import React, { useEffect } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

export const AdMobHandler: React.FC = () => {
  useEffect(() => {
    const initializeAdMob = async () => {
      // Sadece native platformlarda (Android/iOS) çalıştır
      if (!Capacitor.isNativePlatform()) return;

      // React development ortamı mı kontrol et
      const isDev = process.env.NODE_ENV === 'development';

      // UYARI: Yayınlamadan önce aşağıdaki ID'leri kendi AdMob ID'lerinizle değiştirmelisiniz!
      // Şu anki ID'ler Google'ın Test ID'leridir.
      // Gerçek ID'nizi buraya yazın: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
      const adUnitId = isDev 
          ? 'ca-app-pub-3940256099942544/6300978111' // Google Test Banner ID
          : 'ca-app-pub-3940256099942544/6300978111'; // BURAYA KENDİ GERÇEK BANNER ID'NİZİ YAZIN

      // Uygulama tam yüklendikten sonra çalışması için 2 saniye bekle
      setTimeout(async () => {
          try {
            await AdMob.initialize({
              initializeForTesting: isDev, // Sadece geliştirme ortamında test modu açık
            });

            // iOS App Tracking Transparency (ATT) için izin iste
            try {
                await AdMob.requestTrackingAuthorization();
            } catch (e) {
                // Android'de veya desteklenmeyen durumlarda hata verebilir, yutuyoruz.
                console.debug("Tracking authorization request skipped or failed:", e);
            }

            // GEÇİCİ OLARAK KAPATILDI (Test Reklamı)
            /* 
            await AdMob.showBanner({
              adId: adUnitId,
              adSize: BannerAdSize.BANNER, // Standart Banner (320x50)
              position: BannerAdPosition.BOTTOM_CENTER, 
              margin: 90, // Alt menünün (Navbar) üzerinde kalması için margin
              isTesting: isDev // Production'da FALSE olmalı
            });
            */

          } catch (error) {
            console.error('AdMob Başlatma Hatası:', error);
          }
      }, 2000);
    };

    initializeAdMob();

  }, []);

  return null;
};
