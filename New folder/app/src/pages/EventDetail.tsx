import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Heart, 
  Share2,
  ChevronLeft,
  Ticket,
  Loader2,
  QrCode
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, purchaseTicket, likeEvent } = useEventStore();
  const { isAuthenticated, user } = useAuthStore();
  
  const event = events.find(e => e._id === id);
  
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Event not found</h2>
          <Button onClick={() => navigate('/events')} className="bg-[#B6FF2E] text-[#07070A]">
            Browse Events
          </Button>
        </div>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!selectedTier) return;
    
    setIsPurchasing(true);
    try {
      const ticket = await purchaseTicket(event._id, selectedTier, paymentMethod);
      setPurchasedTicket(ticket);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const selectedTierData = event.ticketTiers.find(t => t.tier === selectedTier);
  const totalPrice = selectedTierData ? selectedTierData.price * ticketCount : 0;

  const isLiked = event.likes.includes(user?._id || '');

  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero Image */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        <img
          src={event.media[0]}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/50 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-[#07070A]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-[#07070A] transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => likeEvent(event._id)}
            className="w-10 h-10 bg-[#07070A]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
          <button className="w-10 h-10 bg-[#07070A]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-[#B6FF2E] text-[#07070A]">{event.category}</Badge>
              {event.featured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
              {event.isVerified && <Badge className="bg-blue-500 text-white">Verified</Badge>}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-[#A1A1AA]">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {new Date(event.date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-[#141419] border border-white/10 p-1">
                <TabsTrigger value="about" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]">
                  About
                </TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]">
                  Location
                </TabsTrigger>
                <TabsTrigger value="organizer" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]">
                  Organizer
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <div className="bg-[#141419] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">About this event</h3>
                  <p className="text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                    {event.description}
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-3">Event Details</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center text-[#A1A1AA]">
                        <Users className="w-5 h-5 mr-3 text-[#B6FF2E]" />
                        <span>{event.attendees.length} people attending</span>
                      </div>
                      <div className="flex items-center text-[#A1A1AA]">
                        <Heart className="w-5 h-5 mr-3 text-[#B6FF2E]" />
                        <span>{event.likes.length} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <div className="bg-[#141419] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Venue</h3>
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="w-5 h-5 text-[#B6FF2E] mt-1" />
                    <div>
                      <p className="text-white font-medium">{event.location.name}</p>
                      {event.location.address && (
                        <p className="text-[#A1A1AA]">{event.location.address}</p>
                      )}
                    </div>
                  </div>
                  {/* Map Placeholder */}
                  <div className="aspect-video bg-[#07070A] rounded-xl flex items-center justify-center border border-white/10">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-[#B6FF2E] mx-auto mb-2" />
                      <p className="text-[#A1A1AA]">Map view coming soon</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organizer" className="mt-6">
                <div className="bg-[#141419] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={event.organizer.profilePic} />
                      <AvatarFallback className="bg-[#B6FF2E] text-[#07070A] text-xl">
                        {event.organizer.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{event.organizer.username}</h3>
                      <p className="text-[#B6FF2E] text-sm">{event.organizer.rank}</p>
                      {event.organizer.bio && (
                        <p className="text-[#A1A1AA] mt-1">{event.organizer.bio}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
                      Follow
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                      View Profile
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Tickets */}
          <div className="lg:col-span-1">
            <div className="bg-[#141419] border border-white/10 rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Select Tickets</h3>
              
              {/* Ticket Tiers */}
              <div className="space-y-3 mb-6">
                {event.ticketTiers.map((tier) => (
                  <button
                    key={tier.tier}
                    onClick={() => setSelectedTier(tier.tier)}
                    disabled={tier.quantity - (tier.sold || 0) <= 0}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedTier === tier.tier
                        ? 'border-[#B6FF2E] bg-[#B6FF2E]/10'
                        : 'border-white/10 hover:border-white/20'
                    } ${tier.quantity - (tier.sold || 0) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{tier.tier}</p>
                        <p className="text-sm text-[#A1A1AA]">
                          {tier.quantity - (tier.sold || 0)} remaining
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">
                          {tier.price === 0 ? 'Free' : `KES ${tier.price.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    {selectedTier === tier.tier && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[#A1A1AA]">Quantity</span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTicketCount(Math.max(1, ticketCount - 1));
                              }}
                              className="w-8 h-8 bg-[#07070A] rounded-full flex items-center justify-center text-white"
                            >
                              -
                            </button>
                            <span className="text-white font-medium">{ticketCount}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTicketCount(Math.min(10, ticketCount + 1));
                              }}
                              className="w-8 h-8 bg-[#07070A] rounded-full flex items-center justify-center text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Payment Method */}
              {selectedTier && (
                <div className="mb-6">
                  <p className="text-sm text-[#A1A1AA] mb-2">Payment Method</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                        paymentMethod === 'mpesa'
                          ? 'border-[#B6FF2E] bg-[#B6FF2E]/10 text-white'
                          : 'border-white/10 text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      M-Pesa
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#B6FF2E] bg-[#B6FF2E]/10 text-white'
                          : 'border-white/10 text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      Card
                    </button>
                  </div>
                </div>
              )}

              {/* Total & CTA */}
              {selectedTier && (
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#A1A1AA]">Total</span>
                    <span className="text-2xl font-bold text-white">
                      {totalPrice === 0 ? 'Free' : `KES ${totalPrice.toLocaleString()}`}
                    </span>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    disabled={!selectedTier || isPurchasing || !isAuthenticated}
                    className="w-full bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 h-12 font-semibold"
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : !isAuthenticated ? (
                      'Sign in to purchase'
                    ) : (
                      <>
                        <Ticket className="w-4 h-4 mr-2" />
                        Get Tickets
                      </>
                    )}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-center text-sm text-[#A1A1AA] mt-3">
                      <button onClick={() => navigate('/login')} className="text-[#B6FF2E] hover:underline">
                        Sign in
                      </button>{' '}
                      or{' '}
                      <button onClick={() => navigate('/register')} className="text-[#B6FF2E] hover:underline">
                        create an account
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-[#141419] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Ticket Purchased! 🎉
            </DialogTitle>
            <DialogDescription className="text-[#A1A1AA] text-center">
              Your ticket has been confirmed. Show this QR code at the entrance.
            </DialogDescription>
          </DialogHeader>
          
          {purchasedTicket && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl">
                <QRCodeSVG
                  value={purchasedTicket.qrCode}
                  size={200}
                  className="mx-auto"
                />
                <p className="text-center text-[#07070A] text-xs mt-2 font-mono">
                  {purchasedTicket.qrCode}
                </p>
              </div>
              
              <div className="bg-[#07070A] rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A1A1AA]">Event</span>
                  <span className="text-white font-medium">{event.title}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#A1A1AA]">Tier</span>
                  <span className="text-white font-medium">{purchasedTicket.tier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Amount</span>
                  <span className="text-white font-medium">
                    {purchasedTicket.amount === 0 ? 'Free' : `KES ${purchasedTicket.amount.toLocaleString()}`}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate('/tickets')}
                  className="flex-1 bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  View My Tickets
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessDialog(false)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}