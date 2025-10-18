interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function ProgressBar({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  color = 'primary',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-gradient-to-r from-sage-500 to-sage-400',
    success: 'bg-gradient-to-r from-moss-500 to-moss-400',
    warning: 'bg-gradient-to-r from-cream-600 to-cream-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-400',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-earth-700">Progress</span>
          <span className="text-sm font-medium text-earth-700">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-sage-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
