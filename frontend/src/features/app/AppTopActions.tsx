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
  return (
    <div className="game-top-actions">
      <button type="button" className="game-log-btn" onClick={onOpenDialogueLog}>
        📜 对话日志
      </button>
      {canUseCityMap && (
        <button type="button" className="game-map-btn" onClick={onOpenCityMap}>
          🗺️ 城市地图
        </button>
      )}
      <button type="button" className="game-title-btn" onClick={onOpenReturnTitle}>
        回到标题界面
      </button>
      <button type="button" className="game-save-btn" onClick={onOpenSaves}>
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
      >
        角色信息
      </button>
    </div>
  );
}
