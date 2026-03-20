import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter,
  ChevronDown,
  Heart,
  Ticket,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const categories = [
  'All', 'Music', 'Gaming', 'Sports', 'Arts', 'Nightlife', 'Conference', 'Festival', 'Workshop'
];

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Date: Soonest', value: 'date-asc' },
  { label: 'Date: Latest', value: 'date-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function Events() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, filters, setFilters } = useEventStore();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
      setFilters({ ...filters, search });
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilters({ ...filters, category: category === 'All' ? undefined : category.toLowerCase() as any });
  };

  const toggleLike = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredEvents = events.filter(event => {
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && event.category !== filters.category) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Discover Events</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
              <Input
                placeholder="Search events, artists, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#141419] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
              />
            </div>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-white/10 text-white hover:bg-white/5 h-12 px-4"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 h-12 px-4"
                >
                  Sort by
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#141419] border-white/10">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                    className={`text-white hover:bg-white/5 ${selectedSort === option.value ? 'text-[#B6FF2E]' : ''}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </form>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#B6FF2E] text-[#07070A]'
                    : 'bg-[#141419] border border-white/10 text-[#A1A1AA] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#A1A1AA]">
            Showing <span className="text-white font-semibold">{filteredEvents.length}</span> events
          </p>
          {(filters.search || filters.category) && (
            <Button
              variant="ghost"
              onClick={() => {
                setFilters({});
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className="text-[#B6FF2E] hover:text-[#B6FF2E]/80"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                onClick={() => navigate(`/events/${event._id}`)}
                className="group bg-[#141419] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#B6FF2E]/30 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.media[0]}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] to-transparent opacity-60" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {event.featured && (
                      <Badge className="bg-[#B6FF2E] text-[#07070A]">Featured</Badge>
                    )}
                    {event.isVerified && (
                      <Badge className="bg-blue-500/80 text-white">Verified</Badge>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(e, event._id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-[#07070A]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${likedEvents.includes(event._id) ? 'fill-red-500 text-red-500' : 'text-white'}`} 
                    />
                  </button>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 bg-[#07070A]/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                      {event.ticketTiers[0]?.price === 0 ? 'Free' : `KES ${event.ticketTiers[0]?.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#B6FF2E] uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#B6FF2E] transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 text-sm text-[#A1A1AA]">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location.name}
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-[#B6FF2E] rounded-full flex items-center justify-center">
                        <span className="text-[#07070A] text-xs font-bold">
                          {event.organizer.username[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-[#A1A1AA]">{event.organizer.username}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${event._id}`);
                      }}
                    >
                      <Ticket className="w-4 h-4 mr-1" />
                      Get Tickets
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#A1A1AA]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-[#A1A1AA] mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}