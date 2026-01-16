import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './lib/auth';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { WishlistPage } from './pages/WishlistPage';
import { DealDetailsPage } from './pages/DealDetailsPage';
import { LoginPage } from './pages/LoginPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Switch>
              <Route path="/" component={HomePage} />
              <Route path="/wishlist" component={WishlistPage} />
              <Route path="/deals/:id" component={DealDetailsPage} />
              <Route path="/login" component={LoginPage} />
              <Route>
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Not Found</h1>
                    <p className="text-gray-500">The page you're looking for doesn't exist.</p>
                  </div>
                </div>
              </Route>
            </Switch>
          </main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
