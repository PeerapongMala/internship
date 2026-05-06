/**
 * Grayscale wireframe skeleton loading screens for each page.
 * Shows animated pulse placeholders that match the real page layout.
 */

interface SkeletonBlockProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: number;
  style?: React.CSSProperties;
}

function Block({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonBlockProps) {
  return (
    <div
      className="skeleton-block"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

function SkeletonCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="skeleton-card" style={style}>
      {children}
    </div>
  );
}

// ===== Dashboard Skeleton =====
function DashboardSkeleton() {
  return (
    <div className="skeleton-page">
      {/* Branch filter */}
      <Block width={220} height={44} borderRadius={12} style={{ marginBottom: 24 }} />

      {/* Stat cards row */}
      <div className="skeleton-grid skeleton-grid-4" style={{ marginBottom: 24 }}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i}>
            <Block width={52} height={52} borderRadius={14} style={{ marginBottom: 18 }} />
            <Block width={60} height={36} style={{ marginBottom: 8 }} />
            <Block width={100} height={14} />
          </SkeletonCard>
        ))}
      </div>

      {/* Two cards row */}
      <div className="skeleton-grid skeleton-grid-2">
        <SkeletonCard>
          <Block width={160} height={20} style={{ marginBottom: 20 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <Block width={80} height={14} />
                <Block width={30} height={14} />
              </div>
              <Block height={8} borderRadius={4} />
            </div>
          ))}
        </SkeletonCard>
        <SkeletonCard>
          <Block width={140} height={20} style={{ marginBottom: 20 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <Block width={120} height={14} style={{ marginBottom: 6 }} />
                <Block width={180} height={12} />
              </div>
              <Block width={70} height={24} borderRadius={12} />
            </div>
          ))}
        </SkeletonCard>
      </div>
    </div>
  );
}

// ===== Orders Skeleton =====
function OrdersSkeleton() {
  return (
    <div className="skeleton-page">
      <SkeletonCard>
        {/* Table header */}
        <div className="skeleton-table-row skeleton-table-header">
          <Block width={80} height={12} />
          <Block width={100} height={12} />
          <Block width={70} height={12} />
          <Block width={90} height={12} />
          <Block width={70} height={12} />
          <Block width={60} height={12} />
          <Block width={80} height={12} />
          <Block width={60} height={12} />
        </div>

        {/* Table rows */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div className="skeleton-table-row" key={i}>
            <Block width={100} height={14} />
            <Block width={120} height={14} />
            <Block width={70} height={24} borderRadius={12} />
            <Block width={90} height={14} />
            <Block width={70} height={24} borderRadius={12} />
            <Block width={60} height={14} />
            <Block width={80} height={14} />
            <Block width={70} height={14} />
          </div>
        ))}
      </SkeletonCard>
    </div>
  );
}

// ===== Delivery Skeleton =====
function DeliverySkeleton() {
  return (
    <div className="skeleton-page">
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--border-light)' }}>
        <Block width={140} height={22} />
        <Block width={100} height={14} />
      </div>

      {/* 3-column cards */}
      <div className="skeleton-grid skeleton-grid-3" style={{ marginBottom: 40 }}>
        {[1, 2].map((i) => (
          <SkeletonCard key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Block width={140} height={18} />
              <Block width={70} height={24} borderRadius={12} />
            </div>
            <Block width={160} height={18} style={{ marginBottom: 12 }} />
            <Block width={130} height={14} style={{ marginBottom: 6 }} />
            <Block width={200} height={14} style={{ marginBottom: 16 }} />
            <div style={{ padding: 16, background: 'var(--surface-tertiary)', borderRadius: 12, marginBottom: 16 }}>
              {[1, 2].map((j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Block width={140} height={14} />
                  <Block width={60} height={14} />
                </div>
              ))}
            </div>
            <Block height={56} borderRadius={14} style={{ marginBottom: 8 }} />
            <Block height={56} borderRadius={14} />
          </SkeletonCard>
        ))}
      </div>

      {/* Section 2 header */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--border-light)' }}>
        <Block width={180} height={22} />
        <Block width={80} height={14} />
      </div>

      <div className="skeleton-grid skeleton-grid-3">
        {[1, 2].map((i) => (
          <SkeletonCard key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Block width={140} height={18} />
              <Block width={70} height={24} borderRadius={12} />
            </div>
            <Block width={160} height={18} style={{ marginBottom: 12 }} />
            <Block width={130} height={14} style={{ marginBottom: 6 }} />
            <Block width={200} height={14} style={{ marginBottom: 16 }} />
            <Block width="60%" height={18} borderRadius={8} style={{ margin: '0 auto' }} />
          </SkeletonCard>
        ))}
      </div>
    </div>
  );
}

// ===== Reservation Skeleton =====
function ReservationSkeleton() {
  return (
    <div className="skeleton-page" style={{ display: 'flex', justifyContent: 'center' }}>
      <SkeletonCard style={{ maxWidth: 560, width: '100%' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <Block width={100} height={14} style={{ marginBottom: 8 }} />
            <Block height={44} borderRadius={12} />
          </div>
        ))}
        {/* Textarea */}
        <div style={{ marginBottom: 24 }}>
          <Block width={120} height={14} style={{ marginBottom: 8 }} />
          <Block height={88} borderRadius={12} />
        </div>
        {/* Date picker */}
        <div style={{ marginBottom: 24 }}>
          <Block width={100} height={14} style={{ marginBottom: 8 }} />
          <Block height={44} borderRadius={12} />
        </div>
        {/* Checkbox */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
          <Block width={18} height={18} borderRadius={4} />
          <Block width={280} height={14} />
        </div>
        {/* Submit button */}
        <Block height={48} borderRadius={12} />
      </SkeletonCard>
    </div>
  );
}

// ===== ETax Skeleton =====
function ETaxSkeleton() {
  return (
    <div className="skeleton-page">
      {/* Generate section */}
      <SkeletonCard style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Block width={360} height={44} borderRadius={12} />
          <Block width={160} height={40} borderRadius={12} />
        </div>
      </SkeletonCard>

      {/* Invoice table */}
      <SkeletonCard>
        <Block width={140} height={20} style={{ marginBottom: 20 }} />
        <div className="skeleton-table-row skeleton-table-header">
          <Block width={90} height={12} />
          <Block width={80} height={12} />
          <Block width={80} height={12} />
          <Block width={70} height={12} />
          <Block width={100} height={12} />
        </div>
        {[1, 2, 3].map((i) => (
          <div className="skeleton-table-row" key={i}>
            <Block width={120} height={14} />
            <Block width={100} height={14} />
            <Block width={60} height={24} borderRadius={12} />
            <Block width={80} height={14} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Block width={70} height={28} borderRadius={8} />
              <Block width={80} height={28} borderRadius={8} />
            </div>
          </div>
        ))}
      </SkeletonCard>
    </div>
  );
}

// ===== e-PVP10 Skeleton =====
function EPvp10Skeleton() {
  return (
    <div className="skeleton-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Block width={160} height={28} />
        <Block width={160} height={40} borderRadius={12} />
      </div>

      {/* Table */}
      <SkeletonCard>
        <div className="skeleton-table-row skeleton-table-header">
          <Block width={90} height={12} />
          <Block width={100} height={12} />
          <Block width={80} height={12} />
          <Block width={90} height={12} />
          <Block width={80} height={12} />
          <Block width={70} height={12} />
          <Block width={70} height={12} />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div className="skeleton-table-row" key={i}>
            <Block width={100} height={14} />
            <Block width={120} height={14} />
            <Block width={70} height={14} />
            <Block width={90} height={14} />
            <Block width={80} height={14} />
            <Block width={70} height={24} borderRadius={12} />
            <Block width={70} height={14} />
          </div>
        ))}
      </SkeletonCard>
    </div>
  );
}

// ===== Main export =====
export type SkeletonVariant = 'dashboard' | 'orders' | 'delivery' | 'reservation' | 'etax' | 'epvp10';

const SKELETON_MAP: Record<SkeletonVariant, React.FC> = {
  dashboard: DashboardSkeleton,
  orders: OrdersSkeleton,
  delivery: DeliverySkeleton,
  reservation: ReservationSkeleton,
  etax: ETaxSkeleton,
  epvp10: EPvp10Skeleton,
};

interface PageSkeletonProps {
  variant: SkeletonVariant;
}

export default function PageSkeleton({ variant }: PageSkeletonProps) {
  const Component = SKELETON_MAP[variant];
  return <Component />;
}
