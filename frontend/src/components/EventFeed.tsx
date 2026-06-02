import { AnimatePresence, motion } from 'framer-motion';

export interface EventFeedItem {
  id: number;
  text: string;
  tone: 'dice' | 'state' | 'error';
}

interface EventFeedProps {
  items: EventFeedItem[];
}

export function EventFeed({ items }: EventFeedProps) {
  return (
    <div className="event-feed" aria-live="polite">
      <AnimatePresence>
        {items.slice(-4).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            className={`event-chip event-${item.tone}`}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
