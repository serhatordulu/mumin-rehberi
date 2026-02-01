import React, { useEffect, useRef } from 'react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export const AdMobHandler: React.FC = () => {
  const initializedRef = useRef(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Native platform kontrolü
    if (!Capacitor.isNativePlatform()) {
        console.log("AdMob: Web ortamındasınız, reklam gösterilmeyecek.");
        return;
    }

    const initAndShow = async () => {
      if (initializedRef.current) return;

      const BANNER_ID = 'ca-app-pub-3940256099942544/6300978111'; 
      const INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';
      const IS_TESTING = true; 

      try {
        console.log("AdMob: Başlatılıyor...");
        await AdMob.initialize({
          initializeForTesting: IS_TESTING,
        });
        initializedRef.current = true;
        console.log("AdMob: Başlatıldı.");

        // 1. BANNER REKLAM (Retry Mekanizmalı)
        const showBanner = async (retryCount = 0) => {
            if (retryCount > 3) return; 
            try {
                await AdMob.removeBanner().catch(() => {});
                await AdMob.showBanner({
                    adId: BANNER_ID,
                    adSize: BannerAdSize.ADAPTIVE_BANNER, 
                    position: BannerAdPosition.BOTTOM_CENTER,
                    margin: 0, 
                    isTesting: IS_TESTING
                });
                console.log('AdMob: Banner başarıyla istendi.');
            } catch (bannerError) {
                console.error(`AdMob Banner Hatası (Deneme ${retryCount + 1}):`, bannerError);
                setTimeout(() => showBanner(retryCount + 1), 2000);
            }
        };
        showBanner();

        // 2. GEÇİŞ REKLAMI (INTERSTITIAL) - 30 SN AYARLI
        try {
            // Önce reklamı hazırla (İndir)
            await AdMob.prepareInterstitial({
                adId: INTERSTITIAL_ID,
                isTesting: IS_TESTING
            });
            console.log("AdMob: Geçiş reklamı hazırlandı, sayaç başladı.");

            // 30 Saniye bekle ve GÖSTER
            timerRef.current = setTimeout(async () => {
                try {
                    console.log("AdMob: 30 saniye doldu, geçiş reklamı gösteriliyor...");
                    await AdMob.showInterstitial();
                } catch (showError) {
                    console.error("AdMob: Geçiş reklamı gösterme hatası:", showError);
                }
            }, 30000); // 30000 ms = 30 Saniye

        } catch (intError) {
            console.error("AdMob Interstitial Hazırlama Hatası:", intError);
        }

      } catch (error) {
        console.error('AdMob Genel Başlatma Hatası:', error);
      }
    };

    const resumeListener = App.addListener('appStateChange', (state) => {
        if (state.isActive && initializedRef.current) {
            AdMob.resumeBanner().catch(() => {});
        }
    });

    initAndShow();

    return () => {
        resumeListener.then(handle => handle.remove());
        if (timerRef.current) clearTimeout(timerRef.current); // Sayfadan çıkarsa sayacı iptal et
    };
  }, []);

  return null;
};