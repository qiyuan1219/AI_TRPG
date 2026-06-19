import { motion } from 'framer-motion';

interface TitleMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onGallery: () => void;
  onSettings: () => void;
  onTest: () => void;
  onPrimeAudio?: () => void;
}

const MENU_ITEMS = [
  { label: '新游戏', action: 'new' },
  { label: '载入游戏', action: 'load' },
  { label: '画廊', action: 'gallery' },
  { label: '设置', action: 'settings' },
  { label: '测试', action: 'test' },
] as const;

const TITLE_VIDEO = '/assets/scenes/title-bg.mp4';

export function TitleMenu({ onNewGame, onLoadGame, onGallery, onSettings, onTest, onPrimeAudio }: TitleMenuProps) {
  return (
    <main className="title-menu-screen" onPointerDownCapture={onPrimeAudio} onKeyDownCapture={onPrimeAudio}>
      <video
        className="title-video-bg"
        src={TITLE_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
      />
      <div className="title-menu-shade" />
      <motion.section
        className="title-menu-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="title-brand">
          <p className="eyebrow">D&D AI-TRPG</p>
          <h1>地心之门</h1>
          <p className="title-intro">
            新时代 TRPG · AI 跑团游戏。你将和 AI 主持人一起深入逆穹悬城，调查通向九层地狱的地心狱门。
          </p>
          <div className="title-rule" />
        </div>

        <nav className="title-menu-actions" aria-label="主菜单">
          {MENU_ITEMS.map((item, index) => {
            const onClick =
              item.action === 'new' ? onNewGame : item.action === 'load' ? onLoadGame : item.action === 'gallery' ? onGallery : item.action === 'settings' ? onSettings : item.action === 'test' ? onTest : undefined;
            const disabled = Boolean('disabled' in item && item.disabled);

            return (
              <motion.button
                key={item.action}
                type="button"
                className="title-menu-button"
                disabled={disabled}
                onClick={onClick}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.05 }}
              >
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>
      </motion.section>
    </main>
  );
}
