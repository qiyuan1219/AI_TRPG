import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/** 逆穹城地图上的关键地点定义 */
interface MapLocation {
  id: string;
  name: string;
  subtitle: string;
  /** 点击后触发的行动文本（提交给 KP） */
  actionText: string;
  /** 热点在地图上的位置（百分比） */
  x: number;
  y: number;
  /** 图标文件路径 */
  icon?: string;
  /** 主题色 */
  accentColor: string;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'guild',
    name: '冒险者公会',
    subtitle: '委托·远征档案·失踪者名单',
    actionText: '前往冒险者公会',
    x: 18,
    y: 22,
    icon: '/assets/maps/icon-guild.png',
    accentColor: '#d4a843',
  },
  {
    id: 'cathedral',
    name: '静默神殿',
    subtitle: '治疗·安魂·远征者遗录',
    actionText: '前往静默神殿',
    x: 62,
    y: 18,
    icon: '/assets/maps/icon-cathedral.png',
    accentColor: '#c8d6e5',
  },
  {
    id: 'blackmarket',
    name: '黑市',
    subtitle: '违禁品·情报·暗价交易',
    actionText: '前往黑市',
    x: 78,
    y: 68,
    icon: '/assets/maps/icon-blackmarket.png',
    accentColor: '#9b59b6',
  },
  {
    id: 'tavern',
    name: '回声酒馆',
    subtitle: '传闻·骰子·一杯暖酒',
    actionText: '前往回声酒馆',
    x: 80,
    y: 15,
    icon: '/assets/maps/icon-tavern.png',
    accentColor: '#e67e22',
  },
  {
    id: 'elevator',
    name: '降渊缆梯',
    subtitle: '九条秘银主缆垂向深渊',
    actionText: '前往降渊缆梯中枢',
    x: 35,
    y: 82,
    icon: '/assets/maps/icon-elevator.png',
    accentColor: '#5fb7a7',
  },
];

interface CityMapProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (actionText: string) => void;
}

/** 单地点标记组件 */
function LocationMarker({
  loc,
  index,
  onNavigate,
}: {
  loc: MapLocation;
  index: number;
  onNavigate: (actionText: string) => void;
}) {
  return (
    <motion.button
      type="button"
      className="city-map-marker"
      style={{
        left: `${loc.x}%`,
        top: `${loc.y}%`,
        '--marker-accent': loc.accentColor,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.5, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: -8 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => onNavigate(loc.actionText)}
    >
      {/* 脉冲光环 */}
      <span className="marker-pulse" />
      {/* 图标/建筑图 */}
      {loc.icon ? (
        <img
          src={loc.icon}
          alt={loc.name}
          className="marker-icon"
          onError={(e) => {
            // 图片加载失败时隐藏图片，显示文字 fallback
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="marker-fallback-icon">◆</span>
      )}
      {/* 地名标签 */}
      <span className="marker-label">
        <strong>{loc.name}</strong>
        <small>{loc.subtitle}</small>
      </span>
    </motion.button>
  );
}

export function CityMap({ visible, onClose, onNavigate }: CityMapProps) {
  // 键盘 ESC 关闭
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  const locations = useMemo(() => MAP_LOCATIONS, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="city-map-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          onClick={onClose}
        >
          {/* 地图容器 */}
          <motion.div
            className="city-map-container"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 地图背景层 */}
            <div className="city-map-bg">
              {/* 回退渐变纹理（图片加载失败时可见） */}
              <div className="city-map-fallback" />
              {/* 地图图片 */}
              <div className="city-map-image" />
              <div className="city-map-vignette" />
            </div>

            {/* 地图标题 */}
            <div className="city-map-header">
              <h2>逆穹悬城</h2>
              <p>倒挂在穹顶下的奇迹城邦</p>
            </div>

            {/* 关闭按钮 —— 独立于标题，固定在右上角 */}
            <button
              type="button"
              className="city-map-close"
              onClick={onClose}
              aria-label="关闭地图"
            >
              ✕
            </button>

            {/* 图例提示 */}
            <div className="city-map-legend">
              点击地点前往探索
            </div>

            {/* 地点标记 */}
            <AnimatePresence>
              {locations.map((loc, idx) => (
                <LocationMarker
                  key={loc.id}
                  loc={loc}
                  index={idx}
                  onNavigate={onNavigate}
                />
              ))}
            </AnimatePresence>

            {/* 底部深渊荧光渐变 */}
            <div className="city-map-abyss-glow" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
