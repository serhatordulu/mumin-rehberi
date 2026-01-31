
import { useState, useEffect } from 'react';
import { PrayerTimeData, Coordinates } from '../types';

interface PrayerTimesState {
    times: PrayerTimeData | null;
    nextDayImsak: string | null;
    loading: boolean;
    error: string | null;
}

export const usePrayerTimes = (coords: Coordinates | null) => {
    const [state, setState] = useState<PrayerTimesState>({
        times: null,
        nextDayImsak: null,
        loading: true,
        error: null
    });

    const processApiData = (apiData: any, date: Date) => {
        const dayIndex = date.getDate() - 1;
        const todayTimings = apiData.data[dayIndex]?.timings;
        const nextDayTimings = apiData.data[dayIndex + 1]?.timings || apiData.data[0]?.timings;

        if (todayTimings) {
            return {
                times: {
                    Fajr: todayTimings.Fajr,
                    Imsak: todayTimings.Fajr,
                    Sunrise: todayTimings.Sunrise,
                    Dhuhr: todayTimings.Dhuhr,
                    Asr: todayTimings.Asr,
                    Maghrib: todayTimings.Maghrib,
                    Sunset: todayTimings.Sunset,
                    Isha: todayTimings.Isha,
                    Midnight: todayTimings.Midnight
                },
                nextDayImsak: nextDayTimings ? nextDayTimings.Fajr : null
            };
        }
        return null;
    };

    useEffect(() => {
        if (!coords) return;

        let isMounted = true;
        setState(prev => ({ ...prev, loading: true, error: null }));

        const fetchTimes = async () => {
            const now = new Date();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            try {
                const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=13`);
                const data = await response.json();

                if (isMounted) {
                    if (data.code === 200) {
                        const processed = processApiData(data, now);
                        if (processed) {
                            setState({
                                times: processed.times,
                                nextDayImsak: processed.nextDayImsak,
                                loading: false,
                                error: null
                            });
                        } else {
                            setState(prev => ({ ...prev, loading: false, error: "Vakit verileri işlenemedi." }));
                        }
                    } else {
                        setState(prev => ({ ...prev, loading: false, error: "Sunucudan veri alınamadı." }));
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setState(prev => ({ ...prev, loading: false, error: "Bağlantı hatası. İnternetinizi kontrol edin." }));
                }
            }
        };

        fetchTimes();

        return () => { isMounted = false; };
    }, [coords?.latitude, coords?.longitude]); // Sadece koordinatlar değişince çalış

    return state;
};
