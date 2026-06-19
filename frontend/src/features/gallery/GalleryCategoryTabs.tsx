import type { GalleryCategory } from './galleryTypes';
import { GALLERY_CATEGORY_ORDER, getGalleryCategoryLabel } from './galleryUtils';

interface GalleryCategoryTabsProps {
  active: GalleryCategory;
  counts: Record<GalleryCategory, number>;
  onSelect: (category: GalleryCategory) => void;
}

export function GalleryCategoryTabs({ active, counts, onSelect }: GalleryCategoryTabsProps) {
  return (
    <nav className="gallery-category-tabs" aria-label="素材分类">
      {GALLERY_CATEGORY_ORDER.filter((category) => counts[category] > 0 || category === 'all').map((category) => (
        <button
          key={category}
          type="button"
          className={active === category ? 'is-active' : ''}
          onClick={() => onSelect(category)}
        >
          <span>{getGalleryCategoryLabel(category)}</span>
          <b>{counts[category] || 0}</b>
        </button>
      ))}
    </nav>
  );
}

