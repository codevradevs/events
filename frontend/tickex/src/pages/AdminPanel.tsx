import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Calendar, Shield, CheckCircle, XCircle, Search, Ban, Trash2, Settings, DollarSign, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [platformFee, setPlatformFee] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, platformEarnings: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/events').then(({ data }) => setEvents(data)),
      api.get('/api/users/profile').then(() => {}),
      api.get('/api/admin/platform-settings').then(({ data }) => setPlatformFee(data.platformFeePercentage || 5)),
      api.get('/api/admin/transaction-analytics').then(({ data }) => setStats(data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
        <Button onClick={() => navigate('/')} className="bg-[#B6FF2E] text-[#07070A]">Go Home</Button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <Loader2 className="w-8 h-8 text-[#B6FF2E] animate-spin" />
    </div>
  );

  const pendingEvents = events.filter(e => !e.verified && e.status !== 'cancelled');
  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));

  const verifyEvent = async (id: string) => {
    await api.post(`/api/admin/event/${id}/verify`);
    setEvents(events.map(e => e._id === id ? { ...e, verified: true, status: 'published' } : e));
  };

  const banEvent = async (id: string) => {
    await api.post(`/api/admin/event/${id}/ban`);
    setEvents(events.map(e => e._id === id ? { ...e, status: 'cancelled' } : e));
  };

  const banUser = async (id: string) => {
    await api.post(`/api/admin/user/${id}/ban`);
    setUsers(users.map(u => u._id === id ? { ...u, banned: true } : u));
  };

  const savePlatformFee = async () => {
    await api.put('/api/admin/platform-settings', { platformFeePercentage: platformFee });
    alert('Settings saved');
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-black text-white">Admin Panel</h1><p className="text-[#A1A1AA]">Manage platform settings and users</p></div>
          <Badge className="bg-red-500 text-white px-4 py-1"><Shield className="w-4 h-4 mr-2" />Admin Access</Badge>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-[#B6FF2E]', bg: 'bg-[#B6FF2E]/20' },
            { label: 'Pending Verifications', value: pendingEvents.length, icon: CheckCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
            { label: 'Platform Revenue', value: `KES ${(stats.platformEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/20' },
            { label: 'Total Revenue', value: `KES ${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/20' },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="bg-[#141419] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-[#A1A1AA] text-sm">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>
                  <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}><Icon className={`w-6 h-6 ${color}`} /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="bg-[#141419] border border-white/10 p-1">
            <TabsTrigger value="events" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"><Calendar className="w-4 h-4 mr-2" />Events</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"><Users className="w-4 h-4 mr-2" />Users</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Pending Verification ({pendingEvents.length})</h2>
            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div key={event._id} className="bg-[#141419] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img src={event.posterUrl || event.media?.[0] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'} alt={event.title} className="w-24 h-24 rounded-xl object-cover" />
                        <div>
                          <h3 className="text-lg font-bold text-white">{event.title}</h3>
                          <p className="text-sm text-[#A1A1AA]">{event.organizer?.username}</p>
                          <p className="text-sm text-[#A1A1AA]">{new Date(event.date).toLocaleDateString()}</p>
                          <Badge className="mt-2 bg-yellow-500/20 text-yellow-400">Pending</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={() => verifyEvent(event._id)}><CheckCircle className="w-4 h-4 mr-1" />Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => banEvent(event._id)}><XCircle className="w-4 h-4 mr-1" />Reject</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12"><CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-white">All caught up!</h3><p className="text-[#A1A1AA]">No pending event verifications</p></div>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-[#141419] border-white/10 text-white w-64" />
              </div>
            </div>
            {filteredUsers.length === 0 ? (
              <p className="text-[#A1A1AA] text-center py-8">No users found. User management requires additional API endpoint.</p>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => (
                  <div key={u._id} className="bg-[#141419] border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12"><AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">{u.username?.[0]?.toUpperCase()}</AvatarFallback></Avatar>
                        <div>
                          <h3 className="font-semibold text-white">{u.username}</h3>
                          <p className="text-sm text-[#A1A1AA]">{u.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-[#07070A] text-white">{u.role}</Badge>
                            <Badge className="bg-[#07070A] text-white">{u.rank}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => banUser(u._id)}><Ban className="w-4 h-4 mr-1" />Ban</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-[#141419] border-white/10">
              <CardHeader><CardTitle className="text-white">Platform Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-white mb-2 block">Platform Fee (%)</label>
                  <div className="flex items-center gap-4">
                    <Input type="number" value={platformFee} onChange={(e) => setPlatformFee(Number(e.target.value))} className="w-24 bg-[#07070A] border-white/10 text-white" />
                    <span className="text-[#A1A1AA]">% of each ticket sale</span>
                    <Button onClick={savePlatformFee} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">Save</Button>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-white font-semibold mb-4">Danger Zone</h3>
                  <div className="flex gap-4">
                    <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Clear Cache</Button>
                    <Button variant="destructive"><Ban className="w-4 h-4 mr-2" />Emergency Shutdown</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
