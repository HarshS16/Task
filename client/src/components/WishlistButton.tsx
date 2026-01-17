import { Heart } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useToggleWishlist } from '../hooks/useWishlist';
import { useToast } from './Toast';
import type { Deal } from '../types';

interface WishlistButtonProps {
  deal: Deal;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function WishlistButton({ deal, size = 'md', showText = false, className = '' }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const { toggle, isLoading } = useToggleWishlist({
    onAdd: () => {
      showToast('Item added to wishlist', 'wishlist-add');
    },
    onRemove: () => {
      showToast('Item removed from wishlist', 'wishlist-remove');
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Could show login modal or redirect
      alert('Please login to add items to your wishlist');
      return;
    }

    toggle(deal);
  };

  const isInWishlist = deal.inWishlist;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200
        ${sizeClasses[size]}
        ${isInWishlist 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${showText ? 'px-4 w-auto' : ''}
        ${className}
      `}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSizes[size]}
        className={`transition-transform ${isLoading ? 'animate-pulse' : ''}`}
        fill={isInWishlist ? 'currentColor' : 'none'}
      />
      {showText && (
        <span className="text-sm font-medium">
          {isInWishlist ? 'Remove' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}

