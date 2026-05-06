import React from 'react';
import { CWBadge } from '../cw-badge';

/**
 * Configuration for a badge to be displayed in the list item
 */
export interface BadgeConfig {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
}

/**
 * Props for the CWListItem component
 */
export interface CWListItemProps {
  /** The main title text to display */
  title: string;
  /** Optional array of badges to display vertically on the right side of the title */
  badges?: BadgeConfig[];
  /** Optional action buttons/elements to display on the far right */
  actions?: React.ReactNode;
  /** Optional CSS class name */
  className?: string;
  /** Whether to show a bottom border divider (default: true) */
  showDivider?: boolean;
}

/**
 * CWListItem - A reusable list item component for displaying content with badges and action buttons
 *
 * Use cases:
 * - Sublesson tab lists (with badges showing lesson counts)
 * - Model tab lists (simple title with delete button)
 * - Any list view requiring title + metadata + actions
 *
 * @example
 * // With badges and multiple actions
 * <CWListItem
 *   title="กลุ่มวิชาคณิตศาสตร์ ป.1 วิชาคณิตศาสตร์"
 *   badges={[
 *     { label: '8/8 บทเรียน', variant: 'default' },
 *     { label: '8/8 บทเรียนย่อย', variant: 'default' }
 *   ]}
 *   actions={
 *     <>
 *       <IconButton variant="danger" onClick={handleDelete} />
 *       <IconButton variant="primary" onClick={handleNavigate} />
 *     </>
 *   }
 * />
 *
 * @example
 * // Simple list item with single action
 * <CWListItem
 *   title="โมเดล 1"
 *   actions={<IconButton variant="danger" onClick={handleDelete} />}
 * />
 */
const CWListItem: React.FC<CWListItemProps> = ({
  title,
  badges = [],
  actions,
  className = '',
  showDivider = true,
}) => {
  return (
    <div
      className={`
        bg-white
        flex items-center gap-4
        px-5 py-3
        min-h-[32px]
        hover:bg-neutral-100
        ${showDivider ? 'border-b-2 border-[#e9e9e9]' : ''}
        ${className}
      `.trim()}
    >
      {/* Title Section - grows to fill available space */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-bold tracking-tight text-gray-20 truncate ">
          {title}
        </h3>
      </div>

      {/* Badges Section - vertical stack on the right of title */}
      {badges.length > 0 && (
        <div className="flex flex-col gap-1 items-end shrink-0">
          {badges.map((badge, index) => (
            <CWBadge key={index} variant={badge.variant || 'default'}>
              {badge.label}
            </CWBadge>
          ))}
        </div>
      )}

      {/* Actions Section - buttons/elements on far right */}
      {actions && (
        <div className="flex gap-4 items-center shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CWListItem;
