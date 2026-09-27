import { useState, useEffect } from 'react';

export function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!targetDate) return;
    const compute = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('00d : 00h : 00m : 00s');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${String(d).padStart(2, '0')}d : ${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m : ${String(s).padStart(2, '0')}s`
      );
    };

    compute();
    const id = setInterval(compute, 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, [targetDate]);

  return timeLeft;
}
