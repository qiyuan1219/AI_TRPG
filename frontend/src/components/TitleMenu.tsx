import { motion } from 'framer-motion';

interface TitleMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onTest: () => void;
}

const MENU_ITEMS = [
  { label: '新游戏', action: 'new' },
  { label: '载入游戏', action: 'load' },
  { label: '设置', action: 'settings', disabled: true },
  { label: '画廊', action: 'gallery', disabled: true },
  { label: '测试', action: 'test' },
] as const;

export function TitleMenu({ onNewGame, onLoadGame, onTest }: TitleMenuProps) {
  return (
    <main className="title-menu-screen">
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
          <div className="title-rule" />
        </div>

        <nav className="title-menu-actions" aria-label="主菜单">
          {MENU_ITEMS.map((item, index) => {
            const onClick =
              item.action === 'new' ? onNewGame : item.action === 'load' ? onLoadGame : item.action === 'test' ? onTest : undefined;
            const disabled = 'disabled' in item && item.disabled;

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
