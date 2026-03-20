import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12 text-[#B6FF2E]" />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-[#A1A1AA] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/events')}
            className="border-white/10 text-white hover:bg-white/5"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Events
          </Button>
        </div>
      </div>
    </div>
  );
}