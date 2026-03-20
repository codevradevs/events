import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Clock, Download, Share2, ChevronRight, CheckCircle2, XCircle, Clock4 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const FALLBACK = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400';

export default function Tickets() {
  const navigate = useNavigate();
  const { userTickets, fetchMyTickets } = useEventStore();
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);

  useEffect(() => { fetchMyTickets(); }, []);

  const upcomingTickets = userTickets.filter(t => new Date(t.event?.date) > new Date() && t.paymentStatus === 'completed');
  const pastTickets = userTickets.filter(t => new Date(t.event?.date) <= new Date() && t.paymentStatus === 'completed');

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    if (status === 'pending') return <Clock4 className="w-5 h-5 text-yellow-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  const getImage = (ticket: any) => ticket.event?.posterUrl || ticket.event?.media?.[0] || FALLBACK;
  const getVenue = (ticket: any) => ticket.event?.locationName || ticket.event?.venue || ticket.event?.location?.name || '';

  const TicketCard = ({ ticket, faded = false }: { ticket: any; faded?: boolean }) => (
    <div className={`bg-[#141419] border border-white/10 rounded-2xl overflow-hidden ${faded ? 'opacity-60' : ''}`}>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto relative">
          <img src={getImage(ticket)} alt={ticket.event?.title} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2">
            <Badge className="bg-[#B6FF2E] text-[#07070A]">{ticket.tier}</Badge>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">{ticket.event?.title}</h3>
              <div className="space-y-2 text-sm text-[#A1A1AA]">
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{new Date(ticket.event?.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{new Date(ticket.event?.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</div>
                {getVenue(ticket) && <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{getVenue(ticket)}</div>}
              </div>
            </div>
            {getStatusIcon(ticket.paymentStatus)}
          </div>
          {!faded && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <Button size="sm" className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
                onClick={() => { setSelectedTicket(ticket); setShowQRDialog(true); }}>
                Show QR Code
              </Button>
              <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                <Download className="w-4 h-4 mr-2" />Download
              </Button>
              <Button size="sm" variant="ghost" className="text-[#A1A1AA] hover:text-white">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">My Tickets</h1>
            <p className="text-[#A1A1AA]">Manage your event tickets</p>
          </div>
          <Button onClick={() => navigate('/events')} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">Browse Events</Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="bg-[#141419] border border-white/10 p-1">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]">Upcoming ({upcomingTickets.length})</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]">Past ({pastTickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingTickets.length > 0 ? (
              <div className="space-y-4">{upcomingTickets.map(t => <TicketCard key={t._id} ticket={t} />)}</div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-[#A1A1AA]" /></div>
                <h3 className="text-xl font-semibold text-white mb-2">No upcoming tickets</h3>
                <p className="text-[#A1A1AA] mb-4">Browse events and get your first ticket</p>
                <Button onClick={() => navigate('/events')} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">Browse Events <ChevronRight className="w-4 h-4 ml-2" /></Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastTickets.length > 0 ? (
              <div className="space-y-4">{pastTickets.map(t => <TicketCard key={t._id} ticket={t} faded />)}</div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4"><Clock className="w-10 h-10 text-[#A1A1AA]" /></div>
                <h3 className="text-xl font-semibold text-white mb-2">No past tickets</h3>
                <p className="text-[#A1A1AA]">Your attended events will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
          <DialogContent className="bg-[#141419] border-white/10 max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white text-center">Your Ticket</DialogTitle>
              <DialogDescription className="text-[#A1A1AA] text-center">Show this QR code at the event entrance</DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl">
                  <QRCodeSVG value={selectedTicket.qrCode || selectedTicket._id} size={200} className="mx-auto" />
                </div>
                <div className="text-center">
                  <h4 className="text-white font-semibold">{selectedTicket.event?.title}</h4>
                  <p className="text-[#A1A1AA] text-sm">{selectedTicket.tier} Ticket</p>
                  <p className="text-[#B6FF2E] text-sm mt-1">Show this at the entrance</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
