import { Bell, BellOff } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useUpdateWishlistAlert } from '../hooks/useWishlist';

interface AlertToggleProps {
  dealId: string;
  alertEnabled: boolean;
  className?: string;
}

export function AlertToggle({ dealId, alertEnabled, className = '' }: AlertToggleProps) {
  const { user } = useAuth();
  const updateAlert = useUpdateWishlistAlert();

  const isSubscriber = user?.isSubscriber ?? false;

  const handleToggle = () => {
    if (!isSubscriber) {
      alert('Upgrade to premium to enable deal alerts!');
      return;
    }
    updateAlert.mutate({ dealId, alertEnabled: !alertEnabled });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={updateAlert.isPending}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${alertEnabled && isSubscriber
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${!isSubscriber ? 'opacity-60 cursor-not-allowed' : ''}
        ${updateAlert.isPending ? 'opacity-50' : ''}
        ${className}
      `}
      title={!isSubscriber ? 'Premium feature - upgrade to enable' : (alertEnabled ? 'Disable alerts' : 'Enable alerts')}
    >
      {alertEnabled && isSubscriber ? (
        <>
          <Bell size={16} className="animate-pulse" />
          <span>Alerts On</span>
        </>
      ) : (
        <>
          <BellOff size={16} />
          <span>{isSubscriber ? 'Enable Alerts' : 'Premium Only'}</span>
        </>
      )}
    </button>
  );
}
