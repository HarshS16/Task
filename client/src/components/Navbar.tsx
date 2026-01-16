import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../lib/auth';
import { Heart, ShoppingBag, LogOut, User, Crown, Menu, X } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Buzdealz
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.name}</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div 
        className={`
          fixed top-0 right-0 h-screen w-72 z-50 transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ 
          backgroundColor: 'white', 
          boxShadow: '-4px 0 20px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ backgroundColor: 'white', height: '100%', padding: '24px' }}>
          {/* Close Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-3">
            <Link href="/" onClick={closeMobileMenu}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                location === '/' 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>
                <ShoppingBag size={20} />
                <span className="font-medium">Deals</span>
              </div>
            </Link>

            {isAuthenticated && (
              <Link href="/wishlist" onClick={closeMobileMenu}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${
                  location === '/wishlist' 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  <Heart size={20} />
                  <span className="font-medium">Wishlist</span>
                </div>
              </Link>
            )}
          </div>

          {/* User Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                    {user?.isSubscriber && (
                      <p className="text-xs text-yellow-600 flex items-center gap-1">
                        <Crown size={12} />
                        Premium Subscriber
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={closeMobileMenu}>
                <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all cursor-pointer">
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
