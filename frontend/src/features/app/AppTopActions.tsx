import { useState } from 'react';
import InventoryPanel from '../../components/InventoryPanel';
import type { GameState } from '../../types/game';

export interface AppTopActionsProps {
  canUseCityMap: boolean;
  gameState: GameState;
  characterInfoOpen: boolean;
  onOpenDialogueLog: () => void;
  onOpenCityMap: () => void;
  onOpenReturnTitle: () => void;
  onOpenSaves: () => void;
  onOpenCharacterInfo: () => void;
  onInventoryStatePatch: (patch: Partial<GameState>, message?: string) => void;
}

export function AppTopActions({
  canUseCityMap,
  gameState,
  characterInfoOpen,
  onOpenDialogueLog,
  onOpenCityMap,
  onOpenReturnTitle,
  onOpenSaves,
  onOpenCharacterInfo,
  onInventoryStatePatch,
}: AppTopActionsProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`game-top-actions ${collapsed ? 'is-collapsed' : ''}`} aria-label="冒险快捷侧边栏">
      <button
        type="button"
        className="game-sidebar-toggle"
        aria-label={collapsed ? '展开快捷侧边栏' : '折叠快捷侧边栏'}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((value) => !value)}
      >
        <span>{collapsed ? '›' : '‹'}</span>
      </button>

      <div className="game-sidebar-actions" aria-hidden={collapsed}>
        <button type="button" className="game-log-btn" onClick={onOpenDialogueLog} tabIndex={collapsed ? -1 : 0}>
          📜 对话日志
        </button>
        {canUseCityMap && (
          <button type="button" className="game-map-btn" onClick={onOpenCityMap} tabIndex={collapsed ? -1 : 0}>
            🗺️ 城市地图
          </button>
        )}
        <button type="button" className="game-title-btn" onClick={onOpenReturnTitle} tabIndex={collapsed ? -1 : 0}>
          回到标题界面
        </button>
        <button type="button" className="game-save-btn" onClick={onOpenSaves} tabIndex={collapsed ? -1 : 0}>
          📂 冒险存档
        </button>
        <div className="game-inventory-entry">
          <InventoryPanel state={gameState} onStatePatch={onInventoryStatePatch} />
        </div>
        <button
          type="button"
          className="game-character-btn"
          aria-haspopup="dialog"
          aria-expanded={characterInfoOpen}
          onClick={onOpenCharacterInfo}
          tabIndex={collapsed ? -1 : 0}
        >
          角色信息
        </button>
      </div>
    </aside>
  );
}
