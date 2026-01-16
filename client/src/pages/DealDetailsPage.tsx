import { useParams } from 'wouter';
import { useDeal } from '../hooks/useDeals';
import { WishlistButton } from '../components/WishlistButton';
import { AlertToggle } from '../components/AlertToggle';
import { Link } from 'wouter';
import { 
  Loader2, ArrowLeft, ExternalLink, Clock, AlertCircle, 
  TrendingDown, Tag, Store 
} from 'lucide-react';

export function DealDetailsPage() {
  const params = useParams<{ id: string }>();
  const { data: deal, isLoading, error } = useDeal(params.id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deal not found</h2>
          <p className="text-gray-500 mb-6">This deal may have been removed or doesn't exist.</p>
          <Link href="/">
            <span className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
              <ArrowLeft size={18} />
              Back to Deals
            </span>
          </Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((deal.originalPrice - deal.currentPrice) / deal.originalPrice) * 100);
  const hasBetterPrice = deal.bestPrice && deal.bestPrice < deal.currentPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link href="/">
        <span className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 cursor-pointer">
          <ArrowLeft size={18} />
          Back to Deals
        </span>
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100">
            {deal.imageUrl ? (
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                No Image Available
              </div>
            )}

            {/* Status Overlay */}
            {(deal.isExpired || deal.isDisabled) && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white px-6 py-3 rounded-xl flex items-center gap-2 text-lg font-semibold">
                  {deal.isExpired ? (
                    <>
                      <Clock className="text-gray-600" />
                      <span>Deal Expired</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-orange-500" />
                      <span>Currently Unavailable</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && !deal.isExpired && !deal.isDisabled && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-lg">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8">
            {/* Retailer */}
            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-2">
              <Store size={16} />
              {deal.retailer}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{deal.title}</h1>

            {/* Description */}
            {deal.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{deal.description}</p>
            )}

            {/* Pricing */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${deal.currentPrice.toFixed(2)}
                </span>
                {deal.originalPrice > deal.currentPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <Tag size={16} />
                  <span className="font-medium">You save ${(deal.originalPrice - deal.currentPrice).toFixed(2)}</span>
                </div>
              )}

              {/* Best Price */}
              {hasBetterPrice && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  <TrendingDown size={18} />
                  <span className="font-medium">
                    Best available price: <strong>${deal.bestPrice?.toFixed(2)}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <WishlistButton 
                  deal={deal} 
                  size="lg" 
                  showText 
                  className="flex-1 sm:flex-none !rounded-xl !h-12"
                />

                {deal.inWishlist && (
                  <AlertToggle 
                    dealId={deal.id} 
                    alertEnabled={deal.alertEnabled || false}
                    className="flex-1 sm:flex-none !rounded-xl !h-12"
                  />
                )}
              </div>

              {deal.productUrl && !deal.isExpired && !deal.isDisabled && (
                <a
                  href={deal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  <ExternalLink size={18} />
                  View Deal at {deal.retailer}
                </a>
              )}
            </div>

            {/* Added Date */}
            <p className="text-sm text-gray-400 mt-6">
              Added {new Date(deal.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
