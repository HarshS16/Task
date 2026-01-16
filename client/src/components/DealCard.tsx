import { Link } from 'wouter';
import { WishlistButton } from './WishlistButton';
import { Clock, AlertCircle, TrendingDown } from 'lucide-react';
import type { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const discount = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100);
  const hasBetterPrice = deal.bestPrice && deal.bestPrice < deal.currentPrice;

  return (
    <Link href={`/deals/${deal.id}`}>
      <div className={`
        relative group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl 
        transition-all duration-300 border border-gray-100
        ${deal.isExpired || deal.isDisabled ? 'opacity-75' : ''}
      `}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {deal.imageUrl ? (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discount}%
            </div>
          )}

          {/* Status Badges */}
          {deal.isExpired && (
            <div className="absolute top-3 right-14 bg-gray-800/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Clock size={12} />
              Expired
            </div>
          )}
          {deal.isDisabled && (
            <div className="absolute top-3 right-14 bg-orange-500/90 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <AlertCircle size={12} />
              Unavailable
            </div>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-3 right-3">
            <WishlistButton deal={deal} size="sm" />
          </div>

          {/* Best Price Badge */}
          {hasBetterPrice && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
              <TrendingDown size={12} />
              Best: ${deal.bestPrice?.toFixed(2)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          <div className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">
            {deal.retailer}
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
            {deal.title}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ${deal.currentPrice.toFixed(2)}
            </span>
            {deal.originalPrice > deal.currentPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ${deal.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
