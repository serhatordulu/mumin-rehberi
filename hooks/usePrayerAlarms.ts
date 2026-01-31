
import { useState, useEffect } from 'react';
import { NotificationService } from '../services/notificationService';

interface AlarmState {
    alarms: Record<string, boolean>;
    offsets: Record<string, number>;
}

export const usePrayerAlarms = () => {
    const [alarms, setAlarms] = useState<Record<string, boolean>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('prayer_alarms');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    const [alarmOffsets, setAlarmOffsets] = useState<Record<string, number>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('prayer_alarm_offsets');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    useEffect(() => {
        localStorage.setItem('prayer_alarms', JSON.stringify(alarms));
    }, [alarms]);

    useEffect(() => {
        localStorage.setItem('prayer_alarm_offsets', JSON.stringify(alarmOffsets));
    }, [alarmOffsets]);

    const cleanTimeStr = (timeStr: string) => timeStr.split(' ')[0];

    const getDateFromTimeWithOffset = (timeStr: string, offsetMinutes: number): Date => {
        const cleaned = cleanTimeStr(timeStr);
        const [h, m] = cleaned.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        date.setMinutes(date.getMinutes() + offsetMinutes);
        return date;
    };

    const toggleAlarm = async (prayerName: string, prayerTime: string, offset: number) => {
        const prayerIdMap: Record<string, number> = {
            'İmsak': 1, 'Güneş': 2, 'Öğle': 3, 'İkindi': 4, 'Akşam': 5, 'Yatsı': 6
        };
        const notificationId = prayerIdMap[prayerName] || 99;

        // Alarmı Kapatma Durumu (Eğer zaten kuruluysa ve offset 0 gönderildiyse ya da iptal isteniyorsa)
        // Ancak burada UI'dan gelen isteğe göre hareket ediyoruz.
        // Eğer alarm aktifse ve kullanıcı tekrar tıklarsa genelde modal açılır, bu fonksiyon modal içinden "Kur" dendiğinde çalışır.
        
        const hasPermission = await NotificationService.requestPermissions();
        
        if (!hasPermission) {
            return { success: false, error: "Bildirim izni gerekli." };
        }

        // Önce eskiyi iptal et (Update mantığı)
        await NotificationService.cancel(notificationId);

        let scheduleDate = getDateFromTimeWithOffset(prayerTime, offset);
        const now = new Date();
        // Eğer zaman geçmişse yarına kur
        if (scheduleDate < now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        let bodyText = `${prayerName} vakti girdi.`;
        if (offset < 0) bodyText = `${prayerName} vaktine ${Math.abs(offset)} dakika kaldı.`;
        if (offset > 0) bodyText = `${prayerName} vakti ${offset} dakika önce girdi.`;

        const success = await NotificationService.schedule(
            notificationId,
            "Vakit Hatırlatıcı",
            bodyText,
            scheduleDate
        );

        if (success) {
            setAlarms(prev => ({ ...prev, [prayerName]: true }));
            setAlarmOffsets(prev => ({ ...prev, [prayerName]: offset }));
            return { success: true };
        } else {
            return { success: false, error: "Bildirim zamanlanamadı." };
        }
    };

    const removeAlarm = async (prayerName: string) => {
        const prayerIdMap: Record<string, number> = {
            'İmsak': 1, 'Güneş': 2, 'Öğle': 3, 'İkindi': 4, 'Akşam': 5, 'Yatsı': 6
        };
        const notificationId = prayerIdMap[prayerName] || 99;

        await NotificationService.cancel(notificationId);
        setAlarms(prev => ({ ...prev, [prayerName]: false }));
        // Offseti sıfırlamaya gerek yok, tercih hatırlanabilir.
    };

    return {
        alarms,
        alarmOffsets,
        toggleAlarm,
        removeAlarm
    };
};
