import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Ticket, 
  Star,
  ChevronRight,
  Music,
  Utensils,
  Dumbbell,
  Palette,
  Moon,
  Heart,
  Briefcase,
  Users2,
  Smartphone,
  Mail,
  MessageCircle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const { featuredEvents, trendingEvents, fetchFeaturedEvents, fetchTrendingEvents } = useEventStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchFeaturedEvents();
    fetchTrendingEvents(1);
  }, []);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo('.hero-headline', 
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.hero-subheadline',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo('.hero-search',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 }
      );
      gsap.fromTo('.hero-featured',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.6 }
      );

      // Featured section scroll animation
      ScrollTrigger.create({
        trigger: featuredRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.featured-headline',
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo('.featured-card',
            { x: 80, opacity: 0, stagger: 0.15 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
          );
        },
        once: true
      });

      // How it works section
      ScrollTrigger.create({
        trigger: howItWorksRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.hiw-headline',
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo('.hiw-step',
            { x: 100, opacity: 0, rotate: 5 },
            { x: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
          );
        },
        once: true
      });

      // Organizer section
      ScrollTrigger.create({
        trigger: organizerRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.org-headline',
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo('.org-card',
            { x: 100, opacity: 0, scale: 0.95 },
            { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true
      });

      // App section
      ScrollTrigger.create({
        trigger: appRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.app-text',
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
          );
          gsap.fromTo('.app-phone',
            { x: 100, opacity: 0, rotate: 8 },
            { x: 0, opacity: 1, rotate: 0, duration: 0.8, ease: 'power3.out' }
          );
        },
        once: true
      });
    });

    return () => ctx.revert();
  }, []);

  const categories = [
    { name: 'Music', icon: Music, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
    { name: 'Food & Drink', icon: Utensils, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
    { name: 'Sports', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1461896836934-b0d8571816a2?w=400' },
    { name: 'Arts', icon: Palette, image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400' },
    { name: 'Nightlife', icon: Moon, image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400' },
    { name: 'Wellness', icon: Heart, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
    { name: 'Business', icon: Briefcase, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
    { name: 'Community', icon: Users2, image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400' },
  ];

  const testimonials = [
    { name: 'Amina', location: 'Nairobi', quote: 'I found my new favorite DJ here.', avatar: 'A' },
    { name: 'Brian', location: 'Kampala', quote: 'Sold out my workshop in 48 hours.', avatar: 'B' },
    { name: 'Chioma', location: 'Lagos', quote: 'The reminders saved me twice.', avatar: 'C' },
    { name: 'David', location: 'Accra', quote: 'Easy checkout, every time.', avatar: 'D' },
    { name: 'Emma', location: 'Kigali', quote: 'Great for discovering local gems.', avatar: 'E' },
    { name: 'Frank', location: 'Dar es Salaam', quote: 'My go-to for weekend plans.', avatar: 'F' },
  ];

  const faqs = [
    { question: 'How do I get my ticket?', answer: 'After purchase, your ticket with a unique QR code will be available in the "My Tickets" section. You can also download it as a PDF.' },
    { question: 'Can I get a refund?', answer: 'Refund policies vary by event. Check the event details page for specific refund information, or contact the organizer directly.' },
    { question: 'How do I transfer a ticket?', answer: 'Go to "My Tickets", select the ticket you want to transfer, and click "Transfer Ticket". Enter the recipient\'s email address.' },
    { question: 'What payment methods are accepted?', answer: 'We accept M-Pesa, credit/debit cards, and Airtel Money for most events.' },
    { question: 'How do I host an event?', answer: 'Sign up as an event organizer, complete verification, and use our event creation tools to set up your event page.' },
    { question: 'Is there a mobile app?', answer: 'Yes! Download the TICKEX app from the App Store or Google Play for the best mobile experience.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920" 
            alt="Concert crowd"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070A]/95 via-[#07070A]/70 to-[#07070A]/40" />
        </div>

        {/* Diagonal X Pattern */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 800" fill="none">
            <path d="M0 0L400 800M400 0L0 800" stroke="white" strokeWidth="1"/>
          </svg>
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="hero-headline text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight">
                Find your next<br />
                <span className="text-[#B6FF2E]">experience</span>
              </h1>
              <p className="hero-subheadline text-lg sm:text-xl text-[#A1A1AA] max-w-lg">
                Discover gigs, festivals, and local events. Save favorites, get tickets, and share the plan with friends.
              </p>
              
              {/* Search Card */}
              <div className="hero-search bg-[#141419]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                    <Input 
                      placeholder="Search events, artists, or cities"
                      className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          navigate(`/events?search=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
                        }
                      }}
                    />
                  </div>
                  <Button 
                    className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12 px-8"
                    onClick={() => navigate('/events')}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Featured Card */}
            {featuredEvents[0] && (
              <div className="hero-featured hidden lg:block">
                <div 
                  className="bg-[#141419] border border-white/10 rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => navigate(`/events/${featuredEvents[0]._id}`)}
                >
                  <div className="relative h-64">
                    <img 
                      src={featuredEvents[0].posterUrl || featuredEvents[0].media?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'} 
                      alt={featuredEvents[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#B6FF2E] text-[#07070A] text-xs font-bold uppercase tracking-wider rounded-full">
                        {featuredEvents[0].category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{featuredEvents[0].title}</h3>
                    <div className="flex items-center text-[#A1A1AA] text-sm space-x-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredEvents[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {featuredEvents[0].locationName || featuredEvents[0].venue || ''}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="mt-4 text-[#B6FF2E] hover:text-[#B6FF2E]/80 p-0"
                      onClick={() => navigate(`/events/${featuredEvents[0]._id}`)}
                    >
                      View event <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Featured Events */}
      <section ref={featuredRef} className="relative py-24 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 300 600" fill="none">
            <path d="M0 0L300 600M300 0L0 600" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="featured-headline text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                This week's<br />picks
              </h2>
              <p className="text-lg text-[#A1A1AA] max-w-md">
                A shortlist of the most exciting events around you—updated every Monday.
              </p>
              <Button 
                className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12 px-8"
                onClick={() => navigate('/events')}
              >
                Explore all events
              </Button>
            </div>

            {/* Right Card Stack */}
            <div className="relative h-[500px]">
              {featuredEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event._id}
                  className={`featured-card absolute w-full bg-[#141419] border border-white/10 rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform ${
                    index === 0 ? 'z-30 top-0' : index === 1 ? 'z-20 top-8 scale-[0.95]' : 'z-10 top-16 scale-[0.9]'
                  }`}
                  style={{ transform: `translateY(${index * 20}px)` }}
                  onClick={() => navigate(`/events/${event._id}`)}
                >
                  <div className="relative h-48">
                    <img 
                      src={event.posterUrl || event.media?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141419] to-transparent" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-mono text-[#B6FF2E] uppercase tracking-wider">
                      {event.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-3">{event.title}</h3>
                    <div className="flex items-center text-[#A1A1AA] text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Browse by Category */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Browse by category</h2>
            <p className="text-lg text-[#A1A1AA] max-w-xl">
              From music and food to sports and workshops—find what moves you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/events?category=${category.name.toLowerCase()}`)}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07070A]/90 via-[#07070A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <category.icon className="w-6 h-6 text-[#B6FF2E] mb-2" />
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Trending Near You */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Trending near you</h2>
            <p className="text-lg text-[#A1A1AA]">
              Popular events happening this weekend—based on your city.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
            {trendingEvents.map((event) => (
              <div
                key={event._id}
                className="flex-shrink-0 w-80 bg-[#141419] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#B6FF2E]/30 transition-colors"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                <div className="relative h-44">
                  <img 
                    src={event.posterUrl || event.media?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-[#07070A]/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {event.ticketTiers[0]?.price === 0 ? 'Free' : `KES ${event.ticketTiers[0]?.price}`}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                  <div className="flex items-center text-[#A1A1AA] text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: How It Works */}
      <section ref={howItWorksRef} className="relative py-24 overflow-hidden">
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="dotGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotGrid)"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="hiw-headline text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Get tickets in<br />3 steps
              </h2>
              <p className="text-lg text-[#A1A1AA] max-w-md">
                Search, book, and go—no printing, no hassle.
              </p>
              {!isAuthenticated && (
                <Button 
                  className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12 px-8"
                  onClick={() => navigate('/register')}
                >
                  Create an account
                </Button>
              )}
            </div>

            {/* Right Steps */}
            <div className="space-y-4">
              {[
                { step: 1, title: 'Discover events', desc: 'Filter by date, location, and vibe.', icon: Search },
                { step: 2, title: 'Book in seconds', desc: 'Secure checkout with instant confirmation.', icon: Ticket },
                { step: 3, title: 'Show up & enjoy', desc: 'Digital tickets + reminders.', icon: Star },
              ].map((item) => (
                <div
                  key={item.step}
                  className="hiw-step bg-[#141419] border border-white/10 rounded-2xl p-6 flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-[#B6FF2E] rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#07070A]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-mono text-[#B6FF2E]">STEP {item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-[#A1A1AA]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: For Organizers */}
      <section ref={organizerRef} className="relative py-24 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 300 600" fill="none">
            <path d="M0 0L300 600M300 0L0 600" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="org-headline text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Sell out your<br />next event
              </h2>
              <p className="text-lg text-[#A1A1AA] max-w-md">
                Create a page, set tickets, and get paid—fast.
              </p>
              <Button 
                className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12 px-8"
                onClick={() => navigate(isAuthenticated ? '/create-event' : '/register')}
              >
                Start as an organizer
              </Button>
            </div>

            {/* Right Organizer Card */}
            <div className="org-card bg-[#141419] border border-white/10 rounded-3xl overflow-hidden">
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800" 
                  alt="Photography Walk"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141419] to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Photography Walk</h3>
                <div className="flex items-center text-[#A1A1AA] text-sm mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Sat, Sep 06 • 9:00 AM
                </div>
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-[#07070A] border border-white/10 rounded-full text-sm text-white">
                    Standard • KES 1,200
                  </span>
                  <span className="px-4 py-2 bg-[#B6FF2E]/10 border border-[#B6FF2E]/30 rounded-full text-sm text-[#B6FF2E]">
                    VIP • KES 2,500
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Loved by the community</h2>
            <p className="text-lg text-[#A1A1AA]">
              Real stories from people who find and host events on TICKEX.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="bg-[#141419] border border-white/10 rounded-2xl p-6 relative"
                style={{ marginTop: index % 2 === 1 ? '2rem' : '0' }}
              >
                <div className="absolute top-0 left-6 w-12 h-1 bg-[#B6FF2E] rounded-full -translate-y-1/2" />
                <p className="text-white text-lg mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#B6FF2E] text-[#07070A] font-bold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-[#A1A1AA] text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: App Download */}
      <section ref={appRef} className="relative py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="app-text space-y-6">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Take TICKEX<br />with you
              </h2>
              <p className="text-lg text-[#A1A1AA] max-w-md">
                Get tickets, share events, and get reminders—right from your pocket.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-14 px-6"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 h-14 px-6"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>

            {/* Right Phone Mockup */}
            <div className="app-phone relative flex justify-center">
              <div className="relative w-72 h-[500px] bg-[#141419] border-4 border-[#B6FF2E]/30 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#07070A] rounded-b-2xl" />
                <div className="pt-10 px-4 h-full">
                  <div className="bg-[#07070A] rounded-2xl p-4 mb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-[#B6FF2E] rounded-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-[#07070A]" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">Neon Nights Tour</p>
                        <p className="text-[#A1A1AA] text-xs">Tonight • 8PM</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-[#B6FF2E]/10 text-[#B6FF2E] text-xs rounded">VIP</span>
                      <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">KES 3,500</span>
                    </div>
                  </div>
                  <div className="bg-[#07070A] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Your Ticket</span>
                      <span className="text-[#B6FF2E] text-xs">Active</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="w-full h-24 bg-[#07070A] rounded flex items-center justify-center">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-[#07070A]' : 'bg-transparent'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Newsletter */}
      <section className="py-24 relative overflow-hidden">
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="dotGrid2" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.5" fill="white"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotGrid2)"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Get the drop first</h2>
              <p className="text-lg text-[#A1A1AA]">
                Weekly picks, early access, and exclusive invites—no spam.
              </p>
            </div>
            <div className="bg-[#141419] border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                  <Input 
                    placeholder="you@example.com"
                    className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                  />
                </div>
                <Button className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12 px-8">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Questions answered</h2>
            <p className="text-lg text-[#A1A1AA]">
              Everything you need to know about tickets, refunds, and hosting.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-[#141419] border border-white/10 rounded-xl px-6 data-[state=open]:border-[#B6FF2E]/30"
              >
                <AccordionTrigger className="text-white hover:text-[#B6FF2E] py-5 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#A1A1AA] pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 12: Footer */}
      <footer className="bg-[#141419] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-black tracking-tight text-white">
                  TICK<span className="text-[#B6FF2E]">EX</span>
                </span>
              </Link>
              <p className="text-[#A1A1AA]">Find your next experience.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-[#A1A1AA] hover:text-white transition-colors">Browse</Link></li>
                <li><Link to="/events" className="text-[#A1A1AA] hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/organizer" className="text-[#A1A1AA] hover:text-white transition-colors">Organizers</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">About</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Terms</Link></li>
                <li><Link to="/" className="text-[#A1A1AA] hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-[#A1A1AA] text-sm">© 2026 TICKEX. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-[#A1A1AA] hover:text-[#B6FF2E] transition-colors">
                <Users className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A1A1AA] hover:text-[#B6FF2E] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#A1A1AA] hover:text-[#B6FF2E] transition-colors">
                <Smartphone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}