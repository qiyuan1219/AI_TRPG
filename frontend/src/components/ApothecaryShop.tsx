import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { shopItems } from '../data/shopItems';
import type { ShopItem } from '../data/shopItems';
import { fetchShopConsult } from '../services/api';
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
  purchaseCounts?: Record<string, number>;
  onPurchase: (itemId: string, name: string, price: number, stat?: string) => void;
  onExit: () => void;
  fullScreen?: boolean;
}

function countInventory(inventoryText: string, itemName: string) {
  return inventoryText
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((total, raw) => {
      const match = raw.match(/^(.+?)(?:x|×)(\d+)$/i);
      const name = (match ? match[1] : raw).trim();
      const quantity = match ? Math.max(1, Number(match[2]) || 1) : 1;
      return name === itemName ? total + quantity : total;
    }, 0);
}

function fallbackYunlingConsult(item: ShopItem) {
  if (item.id === 'purification_heart') return '「这不是普通药。黑石侵蚀没压到骨头里时，它才有救人的余地。」';
  if (item.id === 'healing_potion') return '「治疗药水只管把命线拉回来，不负责让你继续莽。」';
  if (item.stat === 'str') return '「力量药水适合破门、攀爬、硬扛，别拿来解决需要脑子的机关。」';
  if (item.stat === 'dex') return '「敏捷药水给手和脚用，拆陷阱、潜行、躲开第一下都合适。」';
  if (item.stat === 'con') return '「体质药水抗毒抗雾，适合进孢海前喝，不是倒下后才想起来。」';
  if (item.stat === 'int') return '「智力药水适合符文、机关和旧文本。喝完以后，先看，再碰。」';
  if (item.stat === 'wis') return '「感知药水让你先发现危险。它不能替你逃跑，只能让你早点决定。」';
  if (item.stat === 'cha') return '「魅力药水是谈判用的，不是让别人突然变蠢。」';
  return `「${item.name}能派上用场，但别把药效当奇迹。」`;
}

function ShopItemCard({
  item,
  gold,
  owned,
  count,
  consulting,
  purchasedCount,
  onBuy,
  onConsult,
}: {
  item: ShopItem;
  gold: number;
  owned: boolean;
  count: number;
  consulting: boolean;
  purchasedCount: number;
  onBuy: (item: ShopItem) => void;
  onConsult: (item: ShopItem) => void;
}) {
  const cannotAfford = gold < item.price;
  const remainingStock = item.stock === undefined ? null : Math.max(0, item.stock - purchasedCount);
  const soldOut = remainingStock === 0;
  const disabled = owned || soldOut || cannotAfford;

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
          {remainingStock !== null && <span className="shop-item-count">库存 {remainingStock}/{item.stock}</span>}
        </div>
        <p>{item.desc}</p>
      </div>
      <div className="shop-item-buy">
        <strong className={cannotAfford ? 'shop-price-low' : ''}>{item.price}G</strong>
        <button type="button" className="shop-consult-button" disabled={consulting} onClick={() => onConsult(item)}>
          {consulting ? '咨询中' : '咨询'}
        </button>
        <button type="button" disabled={disabled} onClick={() => onBuy(item)}>
          {owned ? '已购买' : soldOut ? '已售罄' : cannotAfford ? '金币不足' : '购买'}
        </button>
      </div>
    </article>
  );
}

export function ApothecaryShop({
  gold,
  inventoryText,
  purchasedKeys,
  purchaseCounts = {},
  onPurchase,
  onExit,
  fullScreen = false,
}: ApothecaryShopProps) {
  const [message, setMessage] = useState('云苓把几只细颈药瓶推到灯下，示意你自己挑。');
  const [messageTone, setMessageTone] = useState<'success' | 'warning' | 'info'>('info');
  const [currentGold, setCurrentGold] = useState(gold);
  const [ownedUnique, setOwnedUnique] = useState<Set<string>>(new Set(purchasedKeys));
  const [localInventory, setLocalInventory] = useState(inventoryText);
  const [consultingId, setConsultingId] = useState<string | null>(null);
  const [localPurchaseCounts, setLocalPurchaseCounts] = useState<Record<string, number>>(purchaseCounts);

  useEffect(() => setCurrentGold(gold), [gold]);
  useEffect(() => setOwnedUnique(new Set(purchasedKeys)), [purchasedKeys]);
  useEffect(() => setLocalInventory(inventoryText), [inventoryText]);
  useEffect(() => setLocalPurchaseCounts(purchaseCounts), [purchaseCounts]);

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
      if (item.stock !== undefined && (localPurchaseCounts[item.id] || 0) >= item.stock) {
        showMessage(`${item.name}已经售罄。`, 'warning');
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
      setLocalPurchaseCounts((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

      const successText =
        item.id === 'purification_heart'
          ? '你购买了净化之心。云苓提醒你：这东西不是给小伤小痛用的。'
          : item.stat
            ? `你购买了${item.name}，花费 ${item.price}G。药水已放入背包，使用后${item.name.replace('药水', '')}相关能力提升。`
          : `你购买了${item.name}，花费 ${item.price}G。`;
      showMessage(successText, 'success');
      onPurchase(item.id, item.name, item.price, item.stat);
    },
    [currentGold, localPurchaseCounts, onPurchase, ownedUnique, showMessage],
  );

  const handleConsult = useCallback(
    (item: ShopItem) => {
      const fallback = fallbackYunlingConsult(item);
      showMessage(fallback, 'info');
      setConsultingId(item.id);
      fetchShopConsult({
        item_id: item.id,
        name: item.name,
        desc: item.desc,
        price: item.price,
        type: item.type,
        stat: item.stat ?? null,
      }).then((line) => {
        showMessage(line || fallback, 'info');
      }).finally(() => {
        setConsultingId((current) => (current === item.id ? null : current));
      });
    },
    [showMessage],
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
              consulting={consultingId === item.id}
              purchasedCount={localPurchaseCounts[item.id] || 0}
              onBuy={handleBuy}
              onConsult={handleConsult}
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
