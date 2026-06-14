import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shopItems } from '../data/shopItems';
import type { ShopItem } from '../data/shopItems';
import '../styles/ApothecaryShop.css';

export interface ApothecaryShopResult {
  purchases: { id: string; name: string; price: number }[];
  totalSpent: number;
  exited: boolean;
}

interface ApothecaryShopProps {
  gold: number;
  inventoryText: string;
  purchasedKeys: string[];
  onPurchase: (itemId: string, name: string, price: number, stat?: string) => void;
  onExit: () => void;
  fullScreen?: boolean;
}

function countInventory(inventoryText: string, itemName: string) {
  return inventoryText
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry === itemName).length;
}

function ShopItemCard({
  item,
  gold,
  owned,
  count,
  onBuy,
}: {
  item: ShopItem;
  gold: number;
  owned: boolean;
  count: number;
  onBuy: (item: ShopItem) => void;
}) {
  const cannotAfford = gold < item.price;
  const disabled = owned || cannotAfford;

  return (
    <article className={`shop-item-card ${item.type === 'rare' ? 'shop-item-card-rare' : ''}`}>
      <div className="shop-item-icon-frame">
        <img src={item.icon} alt={item.name} className="shop-item-icon" />
      </div>
      <div className="shop-item-copy">
        <div className="shop-item-title-row">
          <h3>{item.name}</h3>
          <span className={`shop-item-kind shop-item-kind-${item.type}`}>
            {item.type === 'rare' ? '稀有' : '药剂'}
          </span>
          {count > 0 && item.repeatable && <span className="shop-item-count">x{count}</span>}
        </div>
        <p>{item.desc}</p>
      </div>
      <div className="shop-item-buy">
        <strong className={cannotAfford ? 'shop-price-low' : ''}>{item.price}G</strong>
        <button type="button" disabled={disabled} onClick={() => onBuy(item)}>
          {owned ? '已购买' : cannotAfford ? '金币不足' : '购买'}
        </button>
      </div>
    </article>
  );
}

export function ApothecaryShop({
  gold,
  inventoryText,
  purchasedKeys,
  onPurchase,
  onExit,
  fullScreen = false,
}: ApothecaryShopProps) {
  const [message, setMessage] = useState('云苓把几只细颈药瓶推到灯下，示意你自己挑。');
  const [messageTone, setMessageTone] = useState<'success' | 'warning' | 'info'>('info');
  const [currentGold, setCurrentGold] = useState(gold);
  const [ownedUnique, setOwnedUnique] = useState<Set<string>>(new Set(purchasedKeys));
  const [localInventory, setLocalInventory] = useState(inventoryText);

  useEffect(() => setCurrentGold(gold), [gold]);
  useEffect(() => setOwnedUnique(new Set(purchasedKeys)), [purchasedKeys]);
  useEffect(() => setLocalInventory(inventoryText), [inventoryText]);

  const inventoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    shopItems.forEach((item) => counts.set(item.id, countInventory(localInventory, item.name)));
    return counts;
  }, [localInventory]);

  const showMessage = useCallback((text: string, tone: 'success' | 'warning' | 'info') => {
    setMessage(text);
    setMessageTone(tone);
  }, []);

  const handleBuy = useCallback(
    (item: ShopItem) => {
      if (!item.repeatable && ownedUnique.has(item.id)) {
        showMessage(`${item.name}已经买过了。云苓轻轻合上木匣，没有再打开。`, 'warning');
        return;
      }
      if (currentGold < item.price) {
        showMessage('金币不足。云苓看了看你的钱袋，没有说话。', 'warning');
        return;
      }

      setCurrentGold((value) => Math.max(0, value - item.price));
      setLocalInventory((value) => (value ? `${value},${item.name}` : item.name));
      if (!item.repeatable) {
        setOwnedUnique((prev) => new Set([...prev, item.id]));
      }

      const successText =
        item.id === 'purification_heart'
          ? '你购买了净化之心。云苓提醒你：这东西不是给小伤小痛用的。'
          : item.stat
            ? `你购买了${item.name}，花费 ${item.price}G。药效立刻生效，${item.name.replace('药水', '')}相关能力提升。`
          : `你购买了${item.name}，花费 ${item.price}G。`;
      showMessage(successText, 'success');
      onPurchase(item.id, item.name, item.price, item.stat);
    },
    [currentGold, onPurchase, ownedUnique, showMessage],
  );

  return (
    <div className={fullScreen ? 'apothecary-shop-overlay' : 'apothecary-shop-inline'}>
      <section className="apothecary-shop">
        <header className="apothecary-shop-header">
          <div>
            <span className="shop-kicker">SHOP</span>
            <h1>黑市药铺</h1>
            <p>云苓的小柜台</p>
          </div>
          <div className="shop-header-actions">
            <div className="shop-gold-pill" aria-label={`金币 ${currentGold}G`}>
              <span>◈</span>
              <strong>{currentGold}G</strong>
            </div>
            <button type="button" className="shop-close-button" onClick={onExit}>
              返回
            </button>
          </div>
        </header>

        <div className="shop-shelf">
          {shopItems.map((item) => (
            <ShopItemCard
              key={item.id}
              item={item}
              gold={currentGold}
              owned={!item.repeatable && ownedUnique.has(item.id)}
              count={inventoryCounts.get(item.id) ?? 0}
              onBuy={handleBuy}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            className={`shop-feedback shop-feedback-${messageTone}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            {message}
          </motion.div>
        </AnimatePresence>

        <footer className="shop-footer-note">选择商品卡片完成购买。需要离开时点击右上角返回。</footer>
      </section>
    </div>
  );
}

export default ApothecaryShop;
