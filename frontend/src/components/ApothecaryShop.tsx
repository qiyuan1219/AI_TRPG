import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// 类型定义
// ============================================================

export interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  type: 'potion' | 'key';
  stat?: string;
  effectLabel?: string;
  repeatable: boolean;         // 是否可重复购买
}

export interface ShopItemState {
  item: ShopItem;
  purchased: boolean;         // 已经购买（对净化之心有效）
  count: number;              // 购买次数
}

export interface ApothecaryShopResult {
  purchases: { id: string; name: string; price: number }[];
  totalSpent: number;
  exited: boolean;            // true = 点了"不购买，返回"
}

interface ApothecaryShopProps {
  gold: number;
  inventoryText: string;          // 逗号分隔的背包字符串
  purchasedKeys: string[];        // 已买过的不可重复商品 id
  onPurchase: (itemId: string, name: string, price: number, stat?: string) => void;
  onExit: () => void;
  onInputAction?: (text: string) => void;  // 处理文本输入（如输入非购买指令）
  fullScreen?: boolean;           // 全屏遮罩模式
}

// ============================================================
// 商品数据
// ============================================================

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'str_potion',
    name: '力量药水',
    desc: '临时提升力量相关检定',
    price: 30,
    type: 'potion',
    stat: 'str',
    effectLabel: '力量+2',
    repeatable: true,
  },
  {
    id: 'dex_potion',
    name: '敏捷药水',
    desc: '临时提升敏捷相关检定',
    price: 30,
    type: 'potion',
    stat: 'dex',
    effectLabel: '敏捷+2',
    repeatable: true,
  },
  {
    id: 'con_potion',
    name: '体质药水',
    desc: '临时提升体质豁免或抗性',
    price: 30,
    type: 'potion',
    stat: 'con',
    effectLabel: '体质+2',
    repeatable: true,
  },
  {
    id: 'int_potion',
    name: '智力药水',
    desc: '临时提升智力相关检定',
    price: 30,
    type: 'potion',
    stat: 'int',
    effectLabel: '智力+2',
    repeatable: true,
  },
  {
    id: 'wis_potion',
    name: '感知药水',
    desc: '临时提升侦察、察觉类检定',
    price: 30,
    type: 'potion',
    stat: 'wis',
    effectLabel: '感知+2',
    repeatable: true,
  },
  {
    id: 'cha_potion',
    name: '魅力药水',
    desc: '临时提升交涉、欺瞒、说服类检定',
    price: 30,
    type: 'potion',
    stat: 'cha',
    effectLabel: '魅力+2',
    repeatable: true,
  },
  {
    id: 'healing_potion',
    name: '治疗药水',
    desc: '恢复生命值',
    price: 25,
    type: 'potion',
    effectLabel: 'HP+5',
    repeatable: true,
  },
  {
    id: 'purification_heart',
    name: '净化之心',
    desc: '被银丝包裹的黑红色结晶，可用于对抗黑石侵蚀',
    price: 120,
    type: 'key',
    effectLabel: '关键道具',
    repeatable: false,
  },
];

function findItemByName(name: string): ShopItem | undefined {
  const cleaned = name.trim();
  return SHOP_ITEMS.find(
    (item) =>
      cleaned.includes(item.name) ||
      cleaned === `购买${item.name}` ||
      cleaned === `买${item.name}`
  );
}

// ============================================================
// 组件
// ============================================================

export function ApothecaryShop({
  gold,
  inventoryText,
  purchasedKeys,
  onPurchase,
  onExit,
  onInputAction,
  fullScreen = false,
}: ApothecaryShopProps) {
  const [inputText, setInputText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'warning' | 'info'>('info');
  const [currentGold, setCurrentGold] = useState(gold);
  const [purchased, setPurchased] = useState<Set<string>>(new Set(purchasedKeys));
  const [purchaseLog, setPurchaseLog] = useState<string[]>([]);

  // 净化之心不可重复购买
  const canBuy = useCallback(
    (item: ShopItem): { ok: boolean; reason: string } => {
      if (!item.repeatable && purchased.has(item.id)) {
        return { ok: false, reason: '已购买' };
      }
      if (currentGold < item.price) {
        return { ok: false, reason: '金币不足' };
      }
      return { ok: true, reason: '' };
    },
    [currentGold, purchased],
  );

  const showMessage = useCallback((text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const handleBuy = useCallback(
    (item: ShopItem) => {
      const check = canBuy(item);
      if (!check.ok) {
        showMessage(
          check.reason === '已购买'
            ? '「净化之心只有一枚，再多我也拿不出了。」——云苓'
            : `「这瓶${item.name}要${item.price}G。等钱够了再谈。」——云苓`,
          'warning',
        );
        return;
      }

      const newGold = currentGold - item.price;
      setCurrentGold(newGold);

      if (!item.repeatable) {
        setPurchased((prev) => new Set([...prev, item.id]));
      }

      const logLine = `你购买了${item.name}，花费 ${item.price}G。`;
      setPurchaseLog((prev) => [...prev, logLine]);
      showMessage(logLine, 'success');

      onPurchase(item.id, item.name, item.price, item.stat);
    },
    [canBuy, currentGold, onPurchase, showMessage],
  );

  // 处理文本输入
  const handleInputSubmit = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');

    // 检查是否是购买指令
    const item = findItemByName(text);
    if (item) {
      handleBuy(item);
      return;
    }

    // 检查退出指令
    if (/不买|返回|离开|登记|退出/.test(text)) {
      onExit();
      return;
    }

    // 未匹配到商品
    showMessage('云苓歪了歪头，没听懂你想买什么。', 'info');
    onInputAction?.(text);
  }, [inputText, handleBuy, onExit, onInputAction, showMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleInputSubmit();
      }
    },
    [handleInputSubmit],
  );

  const inventoryItems = inventoryText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const shopContent = (
    <div className={`apothecary-shop${fullScreen ? ' apothecary-shop-fullscreen' : ''}`}>
      {/* 顶部 */}
      <header className="apothecary-header">
        <div className="apothecary-header-left">
          <p className="apothecary-eyebrow">黑市药铺</p>
          <h2 className="apothecary-title">云苓的小柜台</h2>
        </div>
        <div className="apothecary-header-right">
          <span className="apothecary-gold">
            金币：<strong>{currentGold}G</strong>
          </span>
          <button
            type="button"
            className={`${fullScreen ? 'ghost-button' : 'apothecary-exit-btn'}`}
            onClick={onExit}
            title={fullScreen ? '返回并告别云苓' : '不购买，返回公会登记'}
          >
            {fullScreen ? '返回' : '离开药铺'}
          </button>
        </div>
      </header>

      <p className="apothecary-desc">
        选择药剂购买，或在下方输入行动。
      </p>

      {/* 商品列表 */}
      <ul className="apothecary-items">
        {SHOP_ITEMS.map((item) => {
          const check = canBuy(item);
          const isPurification = item.id === 'purification_heart';
          const isOwned = !item.repeatable && purchased.has(item.id);

          return (
            <li
              key={item.id}
              className={`apothecary-item-card ${isPurification ? 'is-key' : ''} ${isOwned ? 'is-owned' : ''}`}
            >
              <div className="apothecary-item-body">
                <div className="apothecary-item-info">
                  <div className="apothecary-item-name-row">
                    <span className="apothecary-item-name">{item.name}</span>
                    {item.effectLabel && (
                      <span className={`apothecary-item-tag ${isPurification ? 'tag-key' : 'tag-potion'}`}>
                        {item.effectLabel}
                      </span>
                    )}
                  </div>
                  <p className="apothecary-item-desc">{item.desc}</p>
                </div>
                <div className="apothecary-item-action">
                  <span className={`apothecary-item-price ${currentGold < item.price ? 'price-low' : ''}`}>
                    {item.price}G
                  </span>
                  <button
                    type="button"
                    className={`apothecary-buy-btn ${isOwned ? 'btn-owned' : check.ok ? '' : 'btn-disabled'}`}
                    disabled={!check.ok || isOwned}
                    onClick={() => handleBuy(item)}
                  >
                    {isOwned ? '已购买' : !check.ok ? check.reason : '购买'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 购买反馈 */}
      <AnimatePresence>
        {message && (
          <motion.div
            className={`apothecary-message message-${messageType}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            key={message}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 购买记录 */}
      {purchaseLog.length > 0 && (
        <div className="apothecary-log">
          <span className="apothecary-log-title">购买记录</span>
          {purchaseLog.map((line, i) => (
            <p key={i} className="apothecary-log-line">
              {line}
            </p>
          ))}
        </div>
      )}

      {/* 底部输入区 */}
      <div className="apothecary-input-row">
        <input
          type="text"
          className="apothecary-input"
          placeholder="输入你的行动……（如：购买治疗药水）"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="apothecary-submit-btn"
          onClick={handleInputSubmit}
          disabled={!inputText.trim()}
        >
          执行
        </button>
      </div>

      {/* 样式 */}
      <style>{`
        .apothecary-shop {
          width: 100%;
          max-width: 620px;
          margin: 0 auto;
          padding: 16px 20px 12px;
          border: 1px solid rgba(231, 211, 161, 0.28);
          border-radius: 12px;
          background: linear-gradient(175deg, rgba(22, 28, 38, 0.96), rgba(14, 18, 26, 0.98));
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(231, 211, 161, 0.06);
          color: #cdc4a9;
          font-family: "Noto Serif SC", "Georgia", serif;
        }
        .apothecary-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(231, 211, 161, 0.14);
          flex-wrap: wrap;
        }
        .apothecary-header-left { min-width: 0; }
        .apothecary-eyebrow {
          margin: 0;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(231, 211, 161, 0.55);
        }
        .apothecary-title {
          margin: 2px 0 0;
          font-family: "MedievalSharp", "Cinzel", "Noto Serif SC", serif;
          font-size: 1.25rem;
          color: #e7d3a1;
          letter-spacing: 0.04em;
        }
        .apothecary-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .apothecary-gold {
          font-size: 0.88rem;
          color: #cdc4a9;
        }
        .apothecary-gold strong {
          color: #e7d3a1;
          font-family: "Consolas", monospace;
          font-size: 1.05rem;
        }
        .apothecary-exit-btn {
          min-height: 30px;
          padding: 0 12px;
          border: 1px solid rgba(231, 211, 161, 0.22);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          color: #cdc4a9;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s, background 0.2s;
        }
        .apothecary-exit-btn:hover {
          border-color: rgba(211, 99, 99, 0.5);
          background: rgba(211, 99, 99, 0.08);
        }
        .apothecary-desc {
          margin: 0 0 12px;
          font-size: 0.82rem;
          color: rgba(205, 196, 169, 0.6);
          font-style: italic;
        }

        /* 商品列表 */
        .apothecary-items {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 6px;
          max-height: 420px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(231,211,161,0.18) transparent;
        }
        .apothecary-items::-webkit-scrollbar { width: 5px; }
        .apothecary-items::-webkit-scrollbar-thumb {
          background: rgba(231,211,161,0.18);
          border-radius: 3px;
        }

        .apothecary-item-card {
          border: 1px solid rgba(231, 211, 161, 0.12);
          border-radius: 8px;
          background: rgba(22, 28, 38, 0.7);
          padding: 10px 14px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .apothecary-item-card:hover {
          border-color: rgba(231, 211, 161, 0.32);
          background: rgba(28, 34, 46, 0.85);
          box-shadow: 0 0 12px rgba(231, 211, 161, 0.04);
        }
        .apothecary-item-card.is-key {
          border-color: rgba(231, 178, 99, 0.32);
          background: rgba(38, 24, 12, 0.55);
        }
        .apothecary-item-card.is-key:hover {
          border-color: rgba(231, 178, 99, 0.5);
          box-shadow: 0 0 16px rgba(231, 178, 99, 0.08);
        }
        .apothecary-item-card.is-owned {
          opacity: 0.55;
        }
        .apothecary-item-card.is-owned:hover {
          border-color: rgba(231, 211, 161, 0.12);
          background: rgba(22, 28, 38, 0.7);
          box-shadow: none;
        }

        .apothecary-item-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .apothecary-item-info {
          min-width: 0;
          flex: 1;
        }
        .apothecary-item-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .apothecary-item-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #e7d3a1;
        }
        .apothecary-item-tag {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          padding: 1px 7px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .tag-potion {
          color: #5fb7a7;
          background: rgba(95, 183, 167, 0.1);
          border: 1px solid rgba(95, 183, 167, 0.2);
        }
        .tag-key {
          color: #e7b263;
          background: rgba(231, 178, 99, 0.12);
          border: 1px solid rgba(231, 178, 99, 0.25);
        }
        .apothecary-item-desc {
          margin: 3px 0 0;
          font-size: 0.76rem;
          color: rgba(205, 196, 169, 0.52);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .apothecary-item-action {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .apothecary-item-price {
          font-family: "Consolas", monospace;
          font-size: 0.92rem;
          font-weight: 800;
          color: #e7d3a1;
          min-width: 44px;
          text-align: right;
        }
        .apothecary-item-price.price-low {
          color: rgba(211, 99, 99, 0.7);
        }
        .apothecary-buy-btn {
          min-width: 64px;
          min-height: 32px;
          padding: 0 14px;
          border: 1px solid rgba(239, 213, 140, 0.45);
          border-radius: 6px;
          background: linear-gradient(180deg, rgba(201, 154, 55, 0.7), rgba(143, 103, 35, 0.7));
          color: #fff7df;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .apothecary-buy-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: scale(1.02);
        }
        .apothecary-buy-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
        .apothecary-buy-btn.btn-disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .apothecary-buy-btn.btn-owned {
          border-color: rgba(231, 211, 161, 0.2);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(205, 196, 169, 0.5);
          cursor: default;
        }

        /* 消息 */
        .apothecary-message {
          margin-top: 10px;
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 0.84rem;
          line-height: 1.5;
        }
        .message-success {
          background: rgba(95, 183, 167, 0.1);
          border: 1px solid rgba(95, 183, 167, 0.25);
          color: #5fb7a7;
        }
        .message-warning {
          background: rgba(231, 178, 99, 0.08);
          border: 1px solid rgba(231, 178, 99, 0.25);
          color: #e7b263;
        }
        .message-info {
          background: rgba(205, 196, 169, 0.06);
          border: 1px solid rgba(205, 196, 169, 0.16);
          color: #cdc4a9;
        }

        /* 购买记录 */
        .apothecary-log {
          margin-top: 10px;
        }
        .apothecary-log-title {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(95, 183, 167, 0.65);
          margin-bottom: 4px;
        }
        .apothecary-log-line {
          margin: 0;
          padding: 4px 0;
          font-size: 0.78rem;
          color: rgba(205, 196, 169, 0.6);
          border-bottom: 1px solid rgba(231, 211, 161, 0.06);
        }

        /* 底部输入 */
        .apothecary-input-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(231, 211, 161, 0.12);
        }
        .apothecary-input {
          flex: 1;
          min-width: 0;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid rgba(231, 211, 161, 0.22);
          border-radius: 6px;
          background: rgba(16, 19, 26, 0.7);
          color: #cdc4a9;
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .apothecary-input::placeholder {
          color: rgba(205, 196, 169, 0.3);
          font-size: 0.82rem;
          font-style: italic;
        }
        .apothecary-input:focus {
          border-color: rgba(231, 211, 161, 0.5);
        }
        .apothecary-submit-btn {
          min-width: 64px;
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid rgba(95, 183, 167, 0.4);
          border-radius: 6px;
          background: rgba(95, 183, 167, 0.12);
          color: #5fb7a7;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
          white-space: nowrap;
        }
        .apothecary-submit-btn:hover:not(:disabled) {
          background: rgba(95, 183, 167, 0.2);
        }
        .apothecary-submit-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .apothecary-shop {
            padding: 12px 14px 10px;
            border-radius: 8px;
          }
          .apothecary-item-body {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .apothecary-item-action {
            width: 100%;
            justify-content: space-between;
          }
          .apothecary-header-right {
            flex-direction: column;
            align-items: flex-end;
            gap: 6px;
          }
        }
        .apothecary-shop-fullscreen {
          max-width: 680px;
          margin: 0 auto;
        }

        .apothecary-shop-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 40px;
          overflow-y: auto;
          background: linear-gradient(180deg, rgba(10, 17, 23, 0.94), rgba(10, 11, 15, 0.97)),
                      repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 96px),
                      radial-gradient(ellipse 55% 40% at 50% 30%, rgba(30, 50, 70, 0.35), transparent);
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return <div className="apothecary-shop-overlay">{shopContent}</div>;
  }

  return shopContent;
}

export default ApothecaryShop;
