export const SchematicBox = ({ 
  label, 
  value, 
  isActive = false, 
  isHighlighted = false,
  size = 'medium',
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && <div className="text-xs mb-2 text-terminal-green-light">{label}</div>}
      <div
        className={`
          ${sizeClasses[size]}
          border-2 flex items-center justify-center font-bold
          transition-all duration-300
          ${isActive 
            ? 'border-terminal-green bg-terminal-green text-black box-glow-strong' 
            : isHighlighted
            ? 'border-terminal-green box-glow'
            : 'border-terminal-green-dark'
          }
        `}
      >
        {value}
      </div>
    </div>
  );
};

