import { useDeals } from '../hooks/useDeals';
import { DealCard } from '../components/DealCard';
import { Loader2, ShoppingBag } from 'lucide-react';

export function HomePage() {
  const { data: deals, isLoading, error } = useDeals();

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
          <ShoppingBag className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load deals</h2>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }

  const activeDeals = deals?.filter(d => !d.isExpired && !d.isDisabled) || [];
  const inactiveDeals = deals?.filter(d => d.isExpired || d.isDisabled) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Today's Best Deals</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Discover amazing discounts on top products. Add to wishlist to track price drops!
        </p>
      </div>

      {/* Active Deals Grid */}
      {activeDeals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {activeDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-2xl mb-12">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No active deals available</p>
        </div>
      )}

      {/* Inactive Deals */}
      {inactiveDeals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Deals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inactiveDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
