import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface InfoBannerProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
  iconRequired?: boolean;
}

const InfoBanner: React.FC<InfoBannerProps> = ({
  message,
  type = 'info',
  className = '',
  iconRequired = true,
}) => {
  const typeStyles = {
    info: 'bg-[#C5CAE9]  text-primary',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-md border px-4 py-3 ${typeStyles[type]} ${className}`}
      role="alert"
    >
      {iconRequired && <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5" />}

      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default InfoBanner;
