import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Calendar, 
  Ticket, 
  DollarSign,
  Eye,
  Edit,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events } = useEventStore();
  
  const myEvents = events.filter(e => e.organizer._id === user?._id);
  const publishedEvents = myEvents.filter(e => e.status === 'published');
  const draftEvents = myEvents.filter(e => e.status === 'draft');
  
  // Calculate stats
  const totalRevenue = myEvents.reduce((acc, event) => {
    return acc + event.ticketTiers.reduce((tierAcc, tier) => {
      return tierAcc + (tier.price * (tier.sold || 0));
    }, 0);
  }, 0);
  
  const totalTickets = myEvents.reduce((acc, event) => {
    return acc + event.ticketTiers.reduce((tierAcc, tier) => tierAcc + (tier.sold || 0), 0);
  }, 0);
  
  const totalViews = myEvents.reduce((acc, event) => acc + (event.likes.length * 10 + 50), 0);

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Organizer Dashboard</h1>
            <p className="text-[#A1A1AA]">Manage your events and track performance</p>
          </div>
          <Button 
            onClick={() => navigate('/create-event')}
            className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">KES {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Tickets Sold</p>
                  <p className="text-2xl font-bold text-white">{totalTickets}</p>
                </div>
                <div className="w-12 h-12 bg-[#B6FF2E]/20 rounded-full flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-[#B6FF2E]" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-green-400 text-sm">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Event Views</p>
                  <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-red-400 text-sm">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                -3% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Active Events</p>
                  <p className="text-2xl font-bold text-white">{publishedEvents.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-[#A1A1AA] text-sm">
                {draftEvents.length} drafts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-[#141419] border border-white/10 p-1">
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              My Events
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            {myEvents.length > 0 ? (
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Image */}
                      <div className="lg:w-48 h-48 lg:h-auto relative">
                        <img
                          src={event.media[0]}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={event.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-sm text-[#A1A1AA] mb-4">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-white/10 text-white hover:bg-white/5">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-[#07070A] rounded-lg p-3">
                            <p className="text-xs text-[#A1A1AA]">Tickets Sold</p>
                            <p className="text-lg font-bold text-white">
                              {event.ticketTiers.reduce((acc, tier) => acc + (tier.sold || 0), 0)}
                            </p>
                          </div>
                          <div className="bg-[#07070A] rounded-lg p-3">
                            <p className="text-xs text-[#A1A1AA]">Revenue</p>
                            <p className="text-lg font-bold text-white">
                              KES {event.ticketTiers.reduce((acc, tier) => acc + (tier.price * (tier.sold || 0)), 0).toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-[#07070A] rounded-lg p-3">
                            <p className="text-xs text-[#A1A1AA]">Views</p>
                            <p className="text-lg font-bold text-white">{event.likes.length * 10 + 50}</p>
                          </div>
                        </div>

                        {/* Ticket Tiers */}
                        <div className="space-y-2">
                          {event.ticketTiers.map((tier) => (
                            <div key={tier.tier} className="flex items-center gap-4">
                              <span className="text-sm text-white w-20">{tier.tier}</span>
                              <div className="flex-1 h-2 bg-[#07070A] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[#B6FF2E] rounded-full"
                                  style={{ width: `${((tier.sold || 0) / tier.quantity) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-[#A1A1AA]">
                                {tier.sold || 0}/{tier.quantity}
                              </span>
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
                <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[#A1A1AA]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
                <p className="text-[#A1A1AA] mb-4">Create your first event to get started</p>
                <Button 
                  onClick={() => navigate('/create-event')}
                  className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-[#141419] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-around">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                      <div key={month} className="flex flex-col items-center">
                        <div 
                          className="w-12 bg-[#B6FF2E]/20 rounded-t-lg"
                          style={{ height: `${(i + 1) * 30 + 50}px` }}
                        >
                          <div 
                            className="w-full bg-[#B6FF2E] rounded-t-lg"
                            style={{ height: `${(i + 1) * 20}px` }}
                          />
                        </div>
                        <span className="text-xs text-[#A1A1AA] mt-2">{month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#141419] border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Ticket Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Music', 'Sports', 'Gaming', 'Technology'].map((category, i) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white">{category}</span>
                          <span className="text-[#A1A1AA]">{[45, 30, 15, 10][i]}%</span>
                        </div>
                        <Progress value={[45, 30, 15, 10][i]} className="h-2 bg-[#07070A]" />
                      </div>
                    ))}
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