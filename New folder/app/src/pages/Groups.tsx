import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Users, 
  MessageCircle,
  Hash,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Mock groups data
const mockGroups = [
  {
    _id: '1',
    name: 'Nairobi Gamers',
    description: 'For gaming enthusiasts in Nairobi. LAN parties, tournaments, and more!',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    members: 234,
    category: 'Gaming',
    isJoined: true,
  },
  {
    _id: '2',
    name: 'Music Lovers KE',
    description: 'Discover and discuss the best music events in Kenya.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    members: 567,
    category: 'Music',
    isJoined: false,
  },
  {
    _id: '3',
    name: 'Weekend Runners',
    description: 'Join us for weekend runs around Nairobi. All levels welcome!',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400',
    members: 189,
    category: 'Sports',
    isJoined: true,
  },
  {
    _id: '4',
    name: 'Tech Events Nairobi',
    description: 'Stay updated on tech conferences, meetups, and workshops.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    members: 892,
    category: 'Technology',
    isJoined: false,
  },
  {
    _id: '5',
    name: 'Foodies Unite',
    description: 'Discover the best food events, festivals, and pop-ups.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    members: 445,
    category: 'Food',
    isJoined: false,
  },
  {
    _id: '6',
    name: 'Nightlife Crew',
    description: 'For those who love to party and explore the nightlife scene.',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=400',
    members: 678,
    category: 'Nightlife',
    isJoined: true,
  },
];

export default function Groups() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState(mockGroups);
  const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'joined' && group.isJoined);
    return matchesSearch && matchesTab;
  });

  const toggleJoin = (groupId: string) => {
    setGroups(groups.map(group => 
      group._id === groupId 
        ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
        : group
    ));
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Groups</h1>
            <p className="text-[#A1A1AA]">Connect with people who share your interests</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141419] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Group</DialogTitle>
                <DialogDescription className="text-[#A1A1AA]">
                  Start a community around your interests
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-white mb-2 block">Group Name</label>
                  <Input 
                    placeholder="Enter group name"
                    className="bg-[#07070A] border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white mb-2 block">Description</label>
                  <Input 
                    placeholder="What's this group about?"
                    className="bg-[#07070A] border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-white mb-2 block">Category</label>
                  <Input 
                    placeholder="e.g., Music, Sports, Gaming"
                    className="bg-[#07070A] border-white/10 text-white"
                  />
                </div>
                <Button className="w-full bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#141419] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-[#B6FF2E] text-[#07070A]'
                : 'bg-[#141419] border border-white/10 text-[#A1A1AA] hover:text-white'
            }`}
          >
            All Groups
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === 'joined'
                ? 'bg-[#B6FF2E] text-[#07070A]'
                : 'bg-[#141419] border border-white/10 text-[#A1A1AA] hover:text-white'
            }`}
          >
            My Groups
          </button>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden hover:border-[#B6FF2E]/30 transition-colors"
              >
                {/* Cover Image */}
                <div className="relative h-32">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#07070A]/80 backdrop-blur-sm text-white">
                      <Hash className="w-3 h-3 mr-1" />
                      {group.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{group.name}</h3>
                  <p className="text-sm text-[#A1A1AA] mb-4 line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#A1A1AA] text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {group.members.toLocaleString()} members
                    </div>
                    
                    <div className="flex gap-2">
                      {group.isJoined && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5"
                          onClick={() => navigate('/chat')}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => toggleJoin(group._id)}
                        className={group.isJoined 
                          ? 'bg-white/10 text-white hover:bg-white/20' 
                          : 'bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90'
                        }
                      >
                        {group.isJoined ? 'Leave' : 'Join'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-[#A1A1AA]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'joined' ? 'No groups joined yet' : 'No groups found'}
            </h3>
            <p className="text-[#A1A1AA]">
              {activeTab === 'joined' 
                ? 'Join groups to connect with like-minded people' 
                : 'Try a different search term'}
            </p>
          </div>
        )}

        {/* Trending Topics */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-[#B6FF2E]" />
            Trending Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {['#Afrobeats', '#Gaming', '#Tech', '#FoodFestival', '#Nightlife', '#Sports', '#ArtExhibition'].map((topic) => (
              <button
                key={topic}
                className="px-4 py-2 bg-[#141419] border border-white/10 rounded-full text-sm text-[#A1A1AA] hover:text-white hover:border-[#B6FF2E]/30 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}