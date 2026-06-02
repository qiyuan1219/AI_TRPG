import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  error: string;
  onRetry: () => void;
}

export function LoadingScreen({ error, onRetry }: LoadingScreenProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setDots((value) => (value + 1) % 4), 400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-panel">
        <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="loading-sigil">
          SC
        </motion.div>
        <h1>碎冠之影</h1>
        <div className="loading-rule" />
        {error ? (
          <>
            <p className="loading-error">召唤失败</p>
            <p className="loading-detail">{error}</p>
            <button onClick={onRetry} className="primary-button">
              返回
            </button>
          </>
        ) : (
          <p>地下城主正在搭建冒险舞台{'.'.repeat(dots)}</p>
        )}
      </div>
    </div>
  );
}
