export const Button = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`terminal-button ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

