import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Home, Compass, Users, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Don't show bottom nav on certain pages
  if (!isAuthenticated || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/events' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#07070A]/95 backdrop-blur-md border-t border-white/5 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-[#B6FF2E]' : 'text-[#A1A1AA]'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}