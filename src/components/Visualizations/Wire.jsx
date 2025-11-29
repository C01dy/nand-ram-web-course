export const Wire = ({ 
  direction = 'horizontal', 
  length = 'medium',
  isActive = false 
}) => {
  const lengthClasses = {
    short: direction === 'horizontal' ? 'w-8' : 'h-8',
    medium: direction === 'horizontal' ? 'w-16' : 'h-16',
    long: direction === 'horizontal' ? 'w-32' : 'h-32'
  };

  const thicknessClass = direction === 'horizontal' ? 'h-0.5' : 'w-0.5';

  return (
    <div
      className={`
        ${lengthClasses[length]}
        ${thicknessClass}
        transition-all duration-300
        ${isActive ? 'bg-terminal-green shadow-[0_0_10px_#00ff00]' : 'bg-terminal-green-dark'}
      `}
    />
  );
};

