type BadgeVariant = 'default' | 'success' | 'warning' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  info: 'bg-blue-100 text-blue-700',
};

export function CWBadge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex min-w-10 items-center justify-center px-1 py-0.5 text-xs font-normal rounded-md whitespace-nowrap ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default CWBadge;
