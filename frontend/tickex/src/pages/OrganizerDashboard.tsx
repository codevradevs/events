import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import type { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Calendar, Ticket, DollarSign, Eye, Edit, BarChart3, ArrowUpRight, Loader2 } from 'lucide-react';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/events/organizer/my-events').then(({ data }) => setEvents(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const publishedEvents = events.filter(e => e.status === 'published');
  const totalRevenue = events.reduce((acc, e) => acc + e.ticketTiers.reduce((s, t) => s + (t.price * (t.sold || 0)), 0), 0);
  const totalTickets = events.reduce((acc, e) => acc + e.ticketTiers.reduce((s, t) => s + (t.sold || 0), 0), 0);
  const calculatedRevenue = events.reduce((acc, e) => acc + ((e as any).calculatedRevenue || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Loader2 className="w-8 h-8 text-[#B6FF2E] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Organizer Dashboard</h1>
            <p className="text-[#A1A1AA]">Manage your events and track performance</p>
          </div>
          <Button onClick={() => navigate('/create-event')} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
            <Plus className="w-4 h-4 mr-2" />Create Event
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `KES ${(calculatedRevenue || totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
            { label: 'Tickets Sold', value: totalTickets, icon: Ticket, color: 'text-[#B6FF2E]', bg: 'bg-[#B6FF2E]/20' },
            { label: 'Total Events', value: events.length, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/20' },
            { label: 'Active Events', value: publishedEvents.length, icon: Calendar, color: 'text-purple-400', bg: 'bg-purple-500/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="bg-[#141419] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-[#A1A1AA] text-sm">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>
                  <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}><Icon className={`w-6 h-6 ${color}`} /></div>
                </div>
                <div className={`flex items-center mt-4 ${color} text-sm`}><ArrowUpRight className="w-4 h-4 mr-1" />Live data</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-[#141419] border border-white/10 p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"><Calendar className="w-4 h-4 mr-2" />My Events</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"><BarChart3 className="w-4 h-4 mr-2" />Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event._id} className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-48 h-48 lg:h-auto relative">
                        <img src={event.posterUrl || event.media?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <Badge className={event.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}>{event.status}</Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-sm text-[#A1A1AA]">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5" onClick={() => navigate(`/events/${event._id}`)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-[#07070A] rounded-lg p-3"><p className="text-xs text-[#A1A1AA]">Sold</p><p className="text-lg font-bold text-white">{event.ticketTiers.reduce((a, t) => a + (t.sold || 0), 0)}</p></div>
                          <div className="bg-[#07070A] rounded-lg p-3"><p className="text-xs text-[#A1A1AA]">Revenue</p><p className="text-lg font-bold text-white">KES {event.ticketTiers.reduce((a, t) => a + (t.price * (t.sold || 0)), 0).toLocaleString()}</p></div>
                          <div className="bg-[#07070A] rounded-lg p-3"><p className="text-xs text-[#A1A1AA]">Attendees</p><p className="text-lg font-bold text-white">{event.attendees?.length || 0}</p></div>
                        </div>
                        <div className="space-y-2">
                          {event.ticketTiers.map((tier) => (
                            <div key={tier.name || tier.tier} className="flex items-center gap-4">
                              <span className="text-sm text-white w-20">{tier.name || tier.tier}</span>
                              <div className="flex-1 h-2 bg-[#07070A] rounded-full overflow-hidden">
                                <div className="h-full bg-[#B6FF2E] rounded-full" style={{ width: `${Math.min(100, ((tier.sold || 0) / tier.quantity) * 100)}%` }} />
                              </div>
                              <span className="text-sm text-[#A1A1AA]">{tier.sold || 0}/{tier.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="w-10 h-10 text-[#A1A1AA]" /></div>
                <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
                <p className="text-[#A1A1AA] mb-4">Create your first event to get started</p>
                <Button onClick={() => navigate('/create-event')} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"><Plus className="w-4 h-4 mr-2" />Create Event</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-[#141419] border-white/10">
                <CardHeader><CardTitle className="text-white">Ticket Sales by Event</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 5).map((event) => {
                      const sold = event.ticketTiers.reduce((a, t) => a + (t.sold || 0), 0);
                      const total = event.ticketTiers.reduce((a, t) => a + t.quantity, 0);
                      return (
                        <div key={event._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white truncate max-w-[200px]">{event.title}</span>
                            <span className="text-[#A1A1AA]">{sold}/{total}</span>
                          </div>
                          <Progress value={total > 0 ? (sold / total) * 100 : 0} className="h-2 bg-[#07070A]" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[#141419] border-white/10">
                <CardHeader><CardTitle className="text-white">Revenue by Event</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 5).map((event) => {
                      const rev = event.ticketTiers.reduce((a, t) => a + (t.price * (t.sold || 0)), 0);
                      return (
                        <div key={event._id} className="flex items-center justify-between">
                          <span className="text-white text-sm truncate max-w-[200px]">{event.title}</span>
                          <span className="text-[#B6FF2E] font-semibold text-sm">KES {rev.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
