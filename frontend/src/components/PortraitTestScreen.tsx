import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ===== 角色立绘映射（与 VisualNovelStage.tsx 保持一致） ===== */
const PORTRAIT_MAP: Record<string, string> = {
  冒险者: '/assets/characters/adventurer/adventurer_idle.png',
  瑟琳: '/assets/characters/selin/selin_idle.png',
  森洛: '/assets/characters/senluo/senluo_idle.png',
  莉亚瑟: '/assets/characters/liyase/liyase_idle.png',
  艾琳: '/assets/characters/ailin/ailin_idle.png',
  克莱娅: '/assets/characters/kelaiya/kelaiya_idle.png',
  雷铎: '/assets/characters/leiduo/leiduo_idle.png',
};

/* ===== 角色模拟对话 ===== */
interface PortraitCharacter {
  name: string;
  subtitle: string;
  portrait: string;
  dialogue: string;
  role: "player" | "system";
}

const CHARACTERS: PortraitCharacter[] = [
  {
    name: "冒险者",
    subtitle: "战士 Lv.3 · 主角",
    portrait: PORTRAIT_MAP["冒险者"],
    dialogue: "我是来自地表的冒险者，接受了公会的委托前来逆穹城。前方的黑暗洞穴中似乎有什么在等待着我们……",
    role: "player",
  },
  {
    name: "瑟琳·逆钟",
    subtitle: "魔族 · 时间魔法师",
    portrait: PORTRAIT_MAP["瑟琳"],
    dialogue: "小心，冒险者。我能感觉到时间线在这里变得异常紊乱。裂隙中的那些生物不是为了战斗而生，而是被扭曲的时间所召唤。",
    role: "system",
  },
  {
    name: "森洛·铁锅",
    subtitle: "矮人 · 生存专家·厨师·战士",
    portrait: PORTRAIT_MAP["森洛"],
    dialogue: "哈！这孢海的气味还是这么熟悉。前方的菌林里有不少可食用品种——当然，还有不少会吃你的品种。跟紧我，别乱碰东西。",
    role: "system",
  },
  {
    name: "莉亚瑟·青弦",
    subtitle: "精灵 · 游侠·弓箭手",
    portrait: PORTRAIT_MAP["莉亚瑟"],
    dialogue: "前方三格远处有动静……不是裂隙爬兽，体型更大。我建议从右侧绕过去，那边的菌柱可以遮蔽我们的行动。",
    role: "system",
  },
  {
    name: "艾琳·白枝",
    subtitle: "精灵 · 修女·生命牧师",
    portrait: PORTRAIT_MAP["艾琳"],
    dialogue: "愿白枝之光护佑你们。如果有人在战斗中受伤，请立刻告诉我——在到达黑石根区之前，每一滴生命都弥足珍贵。",
    role: "system",
  },
  {
    name: "克莱娅·软爪",
    subtitle: "兽族(猫人) · 盗贼·怪物猎人",
    portrait: PORTRAIT_MAP["克莱娅"],
    dialogue: "嘘——前面有个机关踏板，看到了吗？地底堡垒的陷阱设计还是老一套。给我三秒钟，我就能把它拆成零件。",
    role: "system",
  },
  {
    name: "雷铎·炉心",
    subtitle: "机械人形 · 守卫者·前排大盾",
    portrait: PORTRAIT_MAP["雷铎"],
    dialogue: "分析完成：前方地形狭窄，适合单线防守。建议由我站在最前方承伤，瑟琳在后排提供法术支援。",
    role: "system",
  },
];

interface PortraitTestScreenProps {
  onBack: () => void;
}

export function PortraitTestScreen({ onBack }: PortraitTestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [loadedStatus, setLoadedStatus] = useState<Record<string, boolean | null>>({});
  const [visibleText, setVisibleText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);

  const currentChar = CHARACTERS[currentIndex];
  const total = CHARACTERS.length;

  // 预加载所有立绘并跟踪加载状态
  useEffect(() => {
    const status: Record<string, boolean | null> = {};
    CHARACTERS.forEach((char) => {
      status[char.name] = null;
      const img = new Image();
      img.onload = () => setLoadedStatus((prev) => ({ ...prev, [char.name]: true }));
      img.onerror = () => setLoadedStatus((prev) => ({ ...prev, [char.name]: false }));
      img.src = char.portrait;
    });
    setLoadedStatus(status);
  }, []);

  // 打字机效果
  useEffect(() => {
    const text = currentChar.dialogue;
    setVisibleText("");
    setTypingDone(false);

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));
      if (index >= text.length) {
        setTypingDone(true);
        window.clearInterval(timer);
      }
    }, 25);

    return () => window.clearInterval(timer);
  }, [currentIndex]);

  // 跳过后完成打字
  function skipTyping() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setVisibleText(currentChar.dialogue);
    setTypingDone(true);
  }

  // 自动播放
  useEffect(() => {
    if (!autoPlay || !typingDone) return;
    autoTimerRef.current = window.setTimeout(() => {
      goNext();
    }, 1500);
    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    };
  }, [autoPlay, typingDone, currentIndex]);

  function goNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (autoPlay) {
      setAutoPlay(false);
    }
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  }, []);

  const loadedCount = Object.values(loadedStatus).filter((v) => v === true).length;
  const failedCount = Object.values(loadedStatus).filter((v) => v === false).length;

  const statusIcon = (name: string) => {
    const s = loadedStatus[name];
    if (s === true) return "✅";
    if (s === false) return "❌";
    return "⏳";
  };

  return (
    <main className="vn-canvas portrait-test" onClick={skipTyping}>
      <div className="scene-layer" />
      <div className="scene-vignette" />

      {/* 顶部信息栏 */}
      <header className="portrait-test-header">
        <div className="portrait-test-info">
          <span className="portrait-test-eyebrow">PORTRAIT TEST</span>
          <span className="portrait-test-title">
            {currentChar.name}
            <small>{currentChar.subtitle}</small>
          </span>
        </div>
        <div className="portrait-test-actions">
          <span className="portrait-test-status">
            已加载 {loadedCount}/{total} · 失败 {failedCount}
          </span>
          <button
            type="button"
            className={`portrait-test-auto-btn ${autoPlay ? "is-active" : ""}`}
            onClick={(e) => { e.stopPropagation(); setAutoPlay((v) => !v); }}
          >
            {autoPlay ? "⏸ 停止" : "▶ 自动"}
          </button>
          <button type="button" className="ghost-button" onClick={(e) => { e.stopPropagation(); onBack(); }}>
            返回
          </button>
        </div>
      </header>

      {/* 底部缩略图指示器 */}
      <nav className="portrait-test-thumbnails" onClick={(e) => e.stopPropagation()}>
        {CHARACTERS.map((char, i) => (
          <button
            key={char.name}
            type="button"
            className={`portrait-thumb ${i === currentIndex ? "is-current" : ""} ${loadedStatus[char.name] === false ? "is-error" : ""}`}
            onClick={() => goTo(i)}
            title={`${statusIcon(char.name)} ${char.name}`}
          >
            <span className="portrait-thumb-dot">
              {i === currentIndex ? "▣" : "▢"}
            </span>
            <span className="portrait-thumb-label">{char.name.split("·")[0]}</span>
            <span className="portrait-thumb-icon">{statusIcon(char.name)}</span>
          </button>
        ))}
      </nav>

      {/* 角色立绘 */}
      <AnimatePresence>
        <div className="character-portrait" key={currentChar.name}>
          <motion.img
            src={currentChar.portrait}
            alt={currentChar.name}
            initial={{ opacity: 0, filter: "blur(8px) brightness(1.4)" }}
            animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
            exit={{ opacity: 0, filter: "blur(4px) brightness(0.8)", transition: { duration: 0.5, ease: "easeInOut" } }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            onError={() => setLoadedStatus((prev) => ({ ...prev, [currentChar.name]: false }))}
            onLoad={() => setLoadedStatus((prev) => ({ ...prev, [currentChar.name]: true }))}
          />
        </div>
      </AnimatePresence>

      {/* 立绘加载失败占位 */}
      {loadedStatus[currentChar.name] === false && (
        <div className="portrait-test-fallback" onClick={(e) => e.stopPropagation()}>
          <span>⚠️</span>
          <p>立绘加载失败</p>
          <small>{currentChar.portrait}</small>
        </div>
      )}

      {/* 视觉小说对话框 — 与主游戏完全相同的 CSS 类名 */}
      <motion.section
        key={currentChar.name}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`dialogue-box dialogue-${currentChar.role}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="speaker-row">
          <span>{currentChar.name}</span>
          {!typingDone && <i>输入中</i>}
          {autoPlay && typingDone && <i>自动播放中</i>}
        </div>
        <p>{visibleText || "……"}</p>

        <div className="portrait-test-nav" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={goPrev} disabled={currentIndex === 0}>
            ← 上一个
          </button>
          <span>{currentIndex + 1} / {total}</span>
          <button type="button" onClick={goNext} disabled={currentIndex >= total - 1}>
            下一个 →
          </button>
        </div>
      </motion.section>
    </main>
  );
}
