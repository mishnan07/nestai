interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700 disabled:bg-gray-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}