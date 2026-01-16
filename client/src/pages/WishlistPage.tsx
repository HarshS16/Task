import { useWishlist, useRemoveFromWishlist } from '../hooks/useWishlist';
import { AlertToggle } from '../components/AlertToggle';
import { Link } from 'wouter';
import { Heart, Loader2, Trash2, ExternalLink, Clock, AlertCircle, TrendingDown } from 'lucide-react';
import type { WishlistItem } from '../types';

export function WishlistPage() {
  const { data: wishlistItems, isLoading, error } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleRemove = (dealId: string) => {
    if (confirm('Remove this item from your wishlist?')) {
      removeFromWishlist.mutate(dealId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load wishlist</h2>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Start adding deals you love to track price drops and get alerts!
          </p>
          <Link href="/">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all cursor-pointer">
              Browse Deals
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Separate active and inactive items
  const activeItems = wishlistItems.filter(item => !item.deal.isExpired && !item.deal.isDisabled);
  const inactiveItems = wishlistItems.filter(item => item.deal.isExpired || item.deal.isDisabled);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center sm:justify-start gap-3">
          <Heart className="text-red-500 w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" />
          My Wishlist
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Active Items */}
      {activeItems.length > 0 && (
        <div className="space-y-4 mb-8">
          {activeItems.map(item => (
            <WishlistItemCard 
              key={item.id} 
              item={item} 
              onRemove={handleRemove}
              isRemoving={removeFromWishlist.isPending}
            />
          ))}
        </div>
      )}

      {/* Inactive Items */}
      {inactiveItems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <AlertCircle size={18} />
            Expired or Unavailable
          </h2>
          <div className="space-y-4 opacity-75">
            {inactiveItems.map(item => (
              <WishlistItemCard 
                key={item.id} 
                item={item} 
                onRemove={handleRemove}
                isRemoving={removeFromWishlist.isPending}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (dealId: string) => void;
  isRemoving: boolean;
}

function WishlistItemCard({ item, onRemove, isRemoving }: WishlistItemCardProps) {
  const { deal } = item;
  const discount = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100);
  const hasBetterPrice = deal.bestPrice && deal.bestPrice < deal.currentPrice;

  return (
    <div className={`
      bg-white rounded-2xl border border-gray-100 overflow-hidden 
      hover:shadow-lg transition-all duration-300
      ${deal.isExpired || deal.isDisabled ? 'opacity-75' : ''}
    `}>
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Status Badge */}
          {deal.isExpired && (
            <div className="absolute top-2 left-2 bg-gray-800/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Clock size={10} />
              Expired
            </div>
          )}
          {deal.isDisabled && (
            <div className="absolute top-2 left-2 bg-orange-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <AlertCircle size={10} />
              Unavailable
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">
                {deal.retailer}
              </div>
              <Link href={`/deals/${deal.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-2">
                  {deal.title}
                </h3>
              </Link>
              {deal.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{deal.description}</p>
              )}

              {/* Pricing */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${deal.currentPrice.toFixed(2)}
                </span>
                {deal.originalPrice > deal.currentPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      ${deal.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                      -{discount}% off
                    </span>
                  </>
                )}
              </div>

              {/* Best Price */}
              {hasBetterPrice && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  <TrendingDown size={14} />
                  Best available: ${deal.bestPrice?.toFixed(2)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3">
              <AlertToggle 
                dealId={deal.id} 
                alertEnabled={item.alertEnabled} 
              />

              {deal.productUrl && (
                <a
                  href={deal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <ExternalLink size={14} />
                  View Deal
                </a>
              )}

              <button
                onClick={() => onRemove(deal.id)}
                disabled={isRemoving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
