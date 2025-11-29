export const InfoBox = ({ title, children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'border-terminal-green',
    highlight: 'border-terminal-green box-glow',
    dark: 'border-terminal-green-dark bg-terminal-bg-light'
  };

  return (
    <div className={`border-2 p-6 ${variants[variant]} ${className}`}>
      {title && <h3 className="text-xl font-bold mb-4 text-terminal-green">{title}</h3>}
      <div className="text-terminal-green-light">
        {children}
      </div>
    </div>
  );
};

