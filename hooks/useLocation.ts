
import { useState, useEffect, useCallback } from 'react';
import { Coordinates } from '../types';
import { TURKEY_CITIES, getDistrictsForCity } from '../data/turkey_data';

interface LocationState {
    name: string;
    coords: Coordinates | null;
    loading: boolean;
    error: string | null;
}

export const useLocation = () => {
    const [location, setLocation] = useState<LocationState>({
        name: "Konum Belirleniyor...",
        coords: null,
        loading: true,
        error: null
    });

    // Koordinattan Şehir İsmi Bulma (Reverse Geocoding)
    const getCityNameFromCoords = async (lat: number, lon: number): Promise<string> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=tr`);
            const data = await response.json();
            
            if (data && data.address) {
                const district = data.address.town || data.address.city_district || data.address.district || "";
                const city = data.address.province || data.address.city || "";
                return district && city ? `${district}, ${city}` : city || "Mevcut Konum";
            }
            return "Mevcut Konum";
        } catch (error) {
            return "Mevcut Konum";
        }
    };

    // GPS Konumu Al
    const getUserLocation = useCallback(async (isInitialLoad = false) => {
        setLocation(prev => ({ ...prev, loading: true, error: null, name: isInitialLoad ? prev.name : "Konum Güncelleniyor..." }));

        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, loading: false, error: "Cihazınız konum özelliğini desteklemiyor." }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                const detectedName = await getCityNameFromCoords(coords.latitude, coords.longitude);
                
                const newLocation = { name: detectedName, coords, loading: false, error: null };
                setLocation(newLocation);
                localStorage.setItem('user_location', JSON.stringify({ name: detectedName, coords }));
            },
            (err) => {
                // Hata durumunda varsayılan (İstanbul) veya önceki konumu koru
                if (isInitialLoad) {
                    const defaultCoords = { latitude: 41.0082, longitude: 28.9784 };
                    setLocation({ name: "İstanbul (Varsayılan)", coords: defaultCoords, loading: false, error: null });
                } else {
                    setLocation(prev => ({ 
                        ...prev, 
                        loading: false, 
                        error: "GPS verisi alınamadı. Konum servislerini kontrol edin." 
                    }));
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    // Manuel İlçe Seçimi
    const setManualLocation = async (city: typeof TURKEY_CITIES[0], district: string) => {
        setLocation(prev => ({ ...prev, loading: true, error: null }));

        if (district === "Merkez") {
            const coords = { latitude: city.latitude, longitude: city.longitude };
            const fullName = `${city.name} (Merkez)`;
            const newLoc = { name: fullName, coords, loading: false, error: null };
            
            setLocation(newLoc);
            localStorage.setItem('user_location', JSON.stringify({ name: fullName, coords }));
            return true;
        }

        // İlçe Koordinatını Bul
        const query = `${district}, ${city.name}, Turkey`;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();
            
            let coords: Coordinates;
            if (data && data.length > 0) {
                coords = { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
            } else {
                coords = { latitude: city.latitude, longitude: city.longitude };
            }

            const fullName = `${district}, ${city.name}`;
            const newLoc = { name: fullName, coords, loading: false, error: null };
            
            setLocation(newLoc);
            localStorage.setItem('user_location', JSON.stringify({ name: fullName, coords }));
            return true;
        } catch (error) {
            setLocation(prev => ({ ...prev, loading: false, error: "İlçe konumu bulunamadı." }));
            return false;
        }
    };

    // İlk Yükleme
    useEffect(() => {
        const savedLocation = localStorage.getItem('user_location');
        if (savedLocation) {
            try {
                const loc = JSON.parse(savedLocation);
                setLocation({ name: loc.name, coords: loc.coords, loading: false, error: null });
            } catch (e) { getUserLocation(true); }
        } else { getUserLocation(true); }
    }, [getUserLocation]);

    return {
        location,
        refreshLocation: () => getUserLocation(false),
        setManualLocation
    };
};
