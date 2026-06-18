import { AnimatePresence, motion } from 'framer-motion';
import { getItemSummaryByName, resolveItemIconPath } from '../../data/itemIconPaths';

export type RewardNoticeKind = 'item' | 'document' | 'clue';

export interface RewardNotice {
  id: number;
  kind: RewardNoticeKind;
  name: string;
  icon: string;
  image: string;
  quantity?: number;
  summary?: string;
}

function rewardNoticeLabel(kind: RewardNoticeKind) {
  if (kind === 'document') return '获得档案';
  if (kind === 'clue') return '记录线索';
  return '获得物品';
}

export interface StoryRewardNoticesProps {
  notices: RewardNotice[];
  onDismiss: (id: number) => void;
}

export function StoryRewardNotices({ notices, onDismiss }: StoryRewardNoticesProps) {
  const notice = notices[0];
  if (!notice) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notice.id}
        className="reward-acquisition-backdrop"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          className={`reward-acquisition-modal reward-acquisition-${notice.kind}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${rewardNoticeLabel(notice.kind)}：${notice.name}`}
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <span className="reward-acquisition-kicker">{rewardNoticeLabel(notice.kind)}</span>
          <div className="reward-acquisition-image">
            <img
              src={notice.image}
              alt={notice.name}
              onError={(event) => { event.currentTarget.src = resolveItemIconPath('default'); }}
            />
          </div>
          <h2>{notice.name}{notice.quantity && notice.quantity > 1 ? ` x${notice.quantity}` : ''}</h2>
          <p>{notice.summary || getItemSummaryByName(notice.name)}</p>
          {notices.length > 1 && <small>还有 {notices.length - 1} 项待确认</small>}
          <button type="button" onClick={() => onDismiss(notice.id)}>收下</button>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
