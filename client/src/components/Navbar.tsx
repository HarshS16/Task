import { Link, useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { Heart, ShoppingBag, LogOut, User, Crown } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Buzdealz
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/">
              <span className={`text-sm font-medium transition-colors cursor-pointer ${
                location === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}>
                Deals
              </span>
            </Link>

            {isAuthenticated && (
              <Link href="/wishlist">
                <span className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  location === '/wishlist' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}>
                  <Heart size={16} />
                  Wishlist
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                  <User size={14} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  {user?.isSubscriber && (
                    <Crown size={14} className="text-yellow-500" />
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
