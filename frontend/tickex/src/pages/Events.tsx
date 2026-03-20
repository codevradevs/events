import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Filter, ChevronDown, Heart, Ticket, X, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Music', 'Sports', 'Arts', 'Food', 'Business', 'Technology', 'Education', 'Other'];
const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Date: Soonest', value: 'date-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
];

export default function Events() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { events, isLoading, hasMore, currentPage, filters, setFilters, fetchEvents } = useEventStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('recommended');
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    setSearchQuery(search);
    if (category) setSelectedCategory(category);
    const newFilters = { ...(search && { search }), ...(category && { category }) };
    setFilters(newFilters);
    fetchEvents(1, true);
  }, []);

  const handleSearch = useCallback((query: string) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, search: query || undefined };
      setFilters(newFilters);
      if (query) setSearchParams({ search: query }); else setSearchParams({});
      fetchEvents(1, true);
    }, 400);
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newFilters = { ...filters, category: category === 'All' ? undefined : category };
    setFilters(newFilters);
    fetchEvents(1, true);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSelectedCategory('All');
    setSearchParams({});
    fetchEvents(1, true);
  };

  const toggleLike = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setLikedEvents(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  const FALLBACK = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800';

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Discover Events</h1>
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
              <Input placeholder="Search events, artists, or cities..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); handleSearch(e.target.value); }}
                className="pl-10 bg-[#141419] border-white/10 text-white placeholder:text-[#A1A1AA] h-12" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 px-4">Sort by<ChevronDown className="w-4 h-4 ml-2" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#141419] border-white/10">
                {sortOptions.map((o) => (
                  <DropdownMenuItem key={o.value} onClick={() => setSelectedSort(o.value)} className={`text-white hover:bg-white/5 ${selectedSort === o.value ? 'text-[#B6FF2E]' : ''}`}>{o.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-[#B6FF2E] text-[#07070A]' : 'bg-[#141419] border border-white/10 text-[#A1A1AA] hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[#A1A1AA]">Showing <span className="text-white font-semibold">{events.length}</span>{hasMore ? '+' : ''} events</p>
          {(filters.search || filters.category) && (
            <Button variant="ghost" onClick={clearFilters} className="text-[#B6FF2E] hover:text-[#B6FF2E]/80">
              <X className="w-4 h-4 mr-1" />Clear filters
            </Button>
          )}
        </div>

        {events.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4"><Search className="w-10 h-10 text-[#A1A1AA]" /></div>
            <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-[#A1A1AA] mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">Clear all filters</Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event._id} onClick={() => navigate(`/events/${event._id}`)}
                  className="group bg-[#141419] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#B6FF2E]/30 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.posterUrl || event.media?.[0] || FALLBACK} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141419] to-transparent opacity-60" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {(event.featured?.isFeatured) && <Badge className="bg-[#B6FF2E] text-[#07070A]">Featured</Badge>}
                      {(event.isVerified || event.verified) && <Badge className="bg-blue-500/80 text-white">Verified</Badge>}
                    </div>
                    <button onClick={(e) => toggleLike(e, event._id)} className="absolute top-3 right-3 w-10 h-10 bg-[#07070A]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                      <Heart className={`w-5 h-5 ${likedEvents.includes(event._id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    </button>
                    <div className="absolute bottom-3 right-3">
                      <span className="px-3 py-1 bg-[#07070A]/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                        {event.ticketTiers[0]?.price === 0 ? 'Free' : `KES ${event.ticketTiers[0]?.price?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-mono text-[#B6FF2E] uppercase tracking-wider">{event.category}</span>
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#B6FF2E] transition-colors">{event.title}</h3>
                    <div className="space-y-2 text-sm text-[#A1A1AA]">
                      <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{event.locationName || event.venue || event.location?.name}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#B6FF2E] rounded-full flex items-center justify-center">
                          <span className="text-[#07070A] text-xs font-bold">{event.organizer?.username?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-[#A1A1AA]">{event.organizer?.username}</span>
                      </div>
                      <Button size="sm" className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90" onClick={(e) => { e.stopPropagation(); navigate(`/events/${event._id}`); }}>
                        <Ticket className="w-4 h-4 mr-1" />Get Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#B6FF2E] animate-spin" /></div>}
            {!isLoading && hasMore && (
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => fetchEvents(currentPage + 1, false)} className="border-white/10 text-white hover:bg-white/5">Load More</Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
