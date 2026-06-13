import { motion } from 'framer-motion';

export interface TutorialStep {
  title: string;
  badge?: string;
  body: string;
  targetSelector?: string;
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#efd58c" />
  </svg>
);

export function TutorialOverlay({ steps, currentStep, onClose, onPrev, onNext }: TutorialOverlayProps) {
  const total = steps.length;
  const step = steps[currentStep];
  if (!step) return null;

  const isFirst = currentStep <= 0;
  const isLast = currentStep >= total - 1;
  const place = step.placement || 'top-right';

  // 计算卡片在视口内的位置
  const getPosition = (): React.CSSProperties => {
    switch (place) {
      case 'top-left':  return { top: 20, left: 60 };
      case 'bottom-left':  return { bottom: 20, left: 60 };
      case 'bottom-right': return { bottom: 20, right: 60 };
      default:             return { top: 20, right: 60 };
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 半透明遮罩 */}
      <div
        className="absolute inset-0 bg-black/65"
        onClick={onClose}
        style={{ backdropFilter: 'blur(2px)' }}
      />

      {/* 浮动提示卡片 */}
      <motion.div
        className="absolute"
        style={getPosition()}
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30, delay: 0.05 }}
      >
        <div
          style={{
            width: 340,
            maxWidth: 'calc(100vw - 80px)',
            background: 'linear-gradient(160deg, #1F2A44 0%, #17203A 50%, #111A30 100%)',
            borderRadius: 16,
            border: '1px solid rgba(239,213,140,0.18)',
            boxShadow: '0 0 40px rgba(239,213,140,0.1), 0 20px 56px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* 顶部进度条 */}
          <div
            style={{
              height: 3,
              background: '#FFF04A',
              width: `${((currentStep + 1) / total) * 100}%`,
              transition: 'width 0.35s ease',
            }}
          />

          <div style={{ padding: '18px 22px 14px' }}>
            {/* 图标 + 标题 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <div style={{ flexShrink: 0, marginTop: 1 }}>{ICON}</div>
              <div style={{ minWidth: 0 }}>
                {step.badge && (
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(95,183,167,0.16)',
                    color: '#5fb7a7',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '1px 7px',
                    borderRadius: 3,
                    marginBottom: 4,
                  }}>
                    {step.badge}
                  </span>
                )}
                <div style={{
                  color: '#efd58c',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  lineHeight: 1.3,
                }}>
                  {step.title}
                </div>
              </div>

              {/* 关闭按钮 */}
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  flexShrink: 0,
                  color: '#666',
                  fontSize: '1.2rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* 正文 */}
            <p style={{
              color: '#c8ced9',
              fontSize: '0.82rem',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              marginBottom: 16,
            }}>
              {step.body}
            </p>

            {/* 底部操作区 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}>
              <button
                type="button"
                disabled={isFirst}
                onClick={onPrev}
                style={{
                  padding: '5px 14px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: isFirst ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                  color: isFirst ? '#3a3a44' : '#999',
                  cursor: isFirst ? 'default' : 'pointer',
                  fontSize: '0.78rem',
                  whiteSpace: 'nowrap',
                }}
              >
                ← 上一步
              </button>

              <span style={{ color: '#444', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                {currentStep + 1} / {total}
              </span>

              {isLast ? (
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '5px 18px',
                    borderRadius: 6,
                    border: '1px solid rgba(239,213,140,0.3)',
                    background: 'rgba(239,213,140,0.12)',
                    color: '#efd58c',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  完成
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onNext}
                  style={{
                    padding: '5px 18px',
                    borderRadius: 6,
                    border: '1px solid rgba(239,213,140,0.3)',
                    background: 'rgba(239,213,140,0.14)',
                    color: '#efd58c',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  下一步 →
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
