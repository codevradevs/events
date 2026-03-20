import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  Shield, 
  CheckCircle,
  XCircle,
  Search,
  Ban,
  Trash2,
  Settings,
  DollarSign
} from 'lucide-react';
// Dialog imports available for future use

// Mock users for admin
const mockUsers = [
  { _id: '1', username: 'spotter', email: 'spotter@example.com', role: 'user', rank: 'Explorer', status: 'active', joinedAt: '2026-01-15' },
  { _id: '2', username: 'djtempo', email: 'djtempo@example.com', role: 'event-worker', rank: 'Pro', status: 'active', joinedAt: '2026-01-10' },
  { _id: '4', username: 'chef_mike', email: 'mike@example.com', role: 'event-worker', rank: 'Explorer', status: 'pending', joinedAt: '2026-03-18' },
  { _id: '5', username: 'mc_jones', email: 'jones@example.com', role: 'event-worker', rank: 'Rookie', status: 'pending', joinedAt: '2026-03-19' },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { events } = useEventStore();
  
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFee, setPlatformFee] = useState(5);

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-[#A1A1AA] mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')} className="bg-[#B6FF2E] text-[#07070A]">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const pendingEvents = events.filter(e => !e.isVerified);
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const verifyEvent = () => {
    // Implementation would verify event
  };

  const approveUser = (userId: string) => {
    setUsers(users.map(u => u._id === userId ? { ...u, status: 'active' } : u));
  };

  const banUser = (userId: string) => {
    setUsers(users.map(u => u._id === userId ? { ...u, status: 'banned' } : u));
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Panel</h1>
            <p className="text-[#A1A1AA]">Manage platform settings and users</p>
          </div>
          <Badge className="bg-red-500 text-white px-4 py-1">
            <Shield className="w-4 h-4 mr-2" />
            Admin Access
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Total Events</p>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#B6FF2E]/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-[#B6FF2E]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Pending Verifications</p>
                  <p className="text-2xl font-bold text-white">{pendingEvents.length + users.filter(u => u.status === 'pending').length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#141419] border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#A1A1AA] text-sm">Platform Revenue</p>
                  <p className="text-2xl font-bold text-white">KES 45,000</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
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
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <h2 className="text-xl font-bold text-white mb-4">Pending Verification</h2>
            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-[#141419] border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img
                          src={event.media[0]}
                          alt={event.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{event.title}</h3>
                          <p className="text-sm text-[#A1A1AA]">{event.organizer.username}</p>
                          <p className="text-sm text-[#A1A1AA]">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                          <Badge className="mt-2 bg-yellow-500/20 text-yellow-400">Pending</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 text-white hover:bg-green-600"
                          onClick={() => verifyEvent()}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white">All caught up!</h3>
                <p className="text-[#A1A1AA]">No pending event verifications</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">User Management</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#141419] border-white/10 text-white w-64"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-[#141419] border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{user.username}</h3>
                        <p className="text-sm text-[#A1A1AA]">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className="bg-[#07070A] text-white">{user.role}</Badge>
                          <Badge className="bg-[#07070A] text-white">{user.rank}</Badge>
                          <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-400' : user.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-green-500 text-white hover:bg-green-600"
                          onClick={() => approveUser(user._id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => banUser(user._id)}
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        {user.status === 'banned' ? 'Unban' : 'Ban'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-[#141419] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-white mb-2 block">Platform Fee (%)</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(Number(e.target.value))}
                      className="w-24 bg-[#07070A] border-white/10 text-white"
                    />
                    <span className="text-[#A1A1AA]">% of each ticket sale</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h3 className="text-white font-semibold mb-4">Danger Zone</h3>
                  <div className="flex gap-4">
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="destructive">
                      <Ban className="w-4 h-4 mr-2" />
                      Emergency Shutdown
                    </Button>
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