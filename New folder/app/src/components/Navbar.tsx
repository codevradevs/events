import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Search, Menu, X, User, Ticket, LogOut, PlusCircle, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Rookie': return 'text-gray-400';
      case 'Explorer': return 'text-green-400';
      case 'Pro': return 'text-blue-400';
      case 'Veteran': return 'text-purple-400';
      case 'Legend': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070A]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-white">
              TICK<span className="text-[#B6FF2E]">EX</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/events" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
              Browse
            </Link>
            <Link to="/feed" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
              Feed
            </Link>
            <Link to="/groups" className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors">
              Groups
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#141419] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#B6FF2E]/50 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Create Event Button - For Organizers/Admins */}
                {(user?.role === 'event-worker' || user?.role === 'admin') && (
                  <Button
                    onClick={() => navigate('/create-event')}
                    className="hidden md:flex items-center space-x-2 bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create Event</span>
                  </Button>
                )}

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="w-9 h-9 border-2 border-[#B6FF2E]/30">
                        <AvatarImage src={user?.profilePic} />
                        <AvatarFallback className="bg-[#141419] text-white">
                          {user?.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className={`text-xs font-mono ${getRankColor(user?.rank || '')}`}>
                          {user?.rank}
                        </p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#141419] border-white/10">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-white">{user?.username}</p>
                      <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="text-[#A1A1AA] focus:text-white focus:bg-white/5 cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/tickets')} className="text-[#A1A1AA] focus:text-white focus:bg-white/5 cursor-pointer">
                      <Ticket className="w-4 h-4 mr-2" />
                      My Tickets
                    </DropdownMenuItem>
                    {(user?.role === 'event-worker' || user?.role === 'admin') && (
                      <DropdownMenuItem onClick={() => navigate('/organizer')} className="text-[#A1A1AA] focus:text-white focus:bg-white/5 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate('/admin')} className="text-[#A1A1AA] focus:text-white focus:bg-white/5 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-white/5 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-[#A1A1AA] hover:text-white"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold"
                >
                  Join TICKEX
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141419] border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#B6FF2E]/50"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                </div>
              </form>
              <Link to="/events" className="px-2 py-2 text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Browse
              </Link>
              <Link to="/feed" className="px-2 py-2 text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Feed
              </Link>
              <Link to="/groups" className="px-2 py-2 text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                Groups
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="px-2 py-2 text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/tickets" className="px-2 py-2 text-[#A1A1AA] hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>
                    My Tickets
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}