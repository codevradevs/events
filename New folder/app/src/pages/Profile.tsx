import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Trophy,
  Ticket,
  Heart,
  Edit,
  Check
} from 'lucide-react';

const rankProgression = [
  { rank: 'Rookie', minXP: 0, color: 'text-gray-400', bgColor: 'bg-gray-400' },
  { rank: 'Explorer', minXP: 50, color: 'text-green-400', bgColor: 'bg-green-400' },
  { rank: 'Pro', minXP: 200, color: 'text-blue-400', bgColor: 'bg-blue-400' },
  { rank: 'Veteran', minXP: 500, color: 'text-purple-400', bgColor: 'bg-purple-400' },
  { rank: 'Legend', minXP: 1000, color: 'text-yellow-400', bgColor: 'bg-yellow-400' },
];

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, followUser, unfollowUser } = useAuthStore();
  const { events } = useEventStore();
  
  // For demo, we'll use the current user or a mock user
  const isOwnProfile = !id || id === currentUser?._id;
  const user = isOwnProfile ? currentUser : {
    _id: '2',
    username: 'djtempo',
    email: 'djtempo@example.com',
    role: 'event-worker',
    category: 'DJ',
    bio: 'Professional DJ with 5 years of experience in Nairobi nightlife.',
    experienceYears: 5,
    rank: 'Pro',
    followers: ['1', '3'],
    following: [],
    interests: ['DJ', 'Music', 'Nightlife'],
    ticketsBought: [],
    eventsCreated: ['1', '5'],
    chats: [],
    xp: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [activeTab, setActiveTab] = useState('events');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
          <Button onClick={() => navigate('/')} className="bg-[#B6FF2E] text-[#07070A]">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const currentRankIndex = rankProgression.findIndex(r => r.rank === user.rank);
  const nextRank = rankProgression[currentRankIndex + 1];
  const xpToNextRank = nextRank ? nextRank.minXP - user.xp : 0;
  const xpProgress = nextRank 
    ? ((user.xp - rankProgression[currentRankIndex].minXP) / (nextRank.minXP - rankProgression[currentRankIndex].minXP)) * 100
    : 100;

  const userEvents = events.filter(e => (user as any).eventsCreated?.includes(e._id));
  const attendedEvents = events.filter(e => (user as any).ticketsBought?.includes(e._id));

  const handleFollow = () => {
    const userId = (user as any)._id as string;
    if (isFollowing) {
      unfollowUser(userId);
      setIsFollowing(false);
    } else {
      followUser(userId);
      setIsFollowing(true);
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Rookie': return '🌱';
      case 'Explorer': return '🔍';
      case 'Pro': return '⭐';
      case 'Veteran': return '🏆';
      case 'Legend': return '👑';
      default: return '🌱';
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-[#141419] border border-white/10 rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-[#B6FF2E]/30">
                {/* Avatar image would go here */}
                <AvatarFallback className="bg-[#B6FF2E] text-[#07070A] text-4xl font-bold">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#141419] rounded-full flex items-center justify-center border-2 border-[#B6FF2E]">
                <span className="text-lg">{getRankIcon(user.rank)}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.username}</h1>
                <Badge className={`${rankProgression[currentRankIndex].bgColor} text-[#07070A]`}>
                  {user.rank}
                </Badge>
                {user.role === 'event-worker' && (
                  <Badge className="bg-purple-500 text-white">{user.category}</Badge>
                )}
                {user.role === 'admin' && (
                  <Badge className="bg-red-500 text-white">Admin</Badge>
                )}
              </div>
              
              {user.bio && (
                <p className="text-[#A1A1AA] mb-4 max-w-lg">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.followers?.length || 0}</p>
                  <p className="text-sm text-[#A1A1AA]">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.following?.length || 0}</p>
                  <p className="text-sm text-[#A1A1AA]">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{userEvents.length}</p>
                  <p className="text-sm text-[#A1A1AA]">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.ticketsBought?.length || 0}</p>
                  <p className="text-sm text-[#A1A1AA]">Tickets</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {isOwnProfile ? (
                <Button 
                  variant="outline" 
                  className="border-white/10 text-white hover:bg-white/5"
                  onClick={() => {}}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  onClick={handleFollow}
                  className={isFollowing ? 'bg-white/10 text-white' : 'bg-[#B6FF2E] text-[#07070A]'}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Following
                    </>
                  ) : (
                    'Follow'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-[#B6FF2E]" />
                <span className="text-white font-medium">{user.xp} XP</span>
              </div>
              {nextRank && (
                <span className="text-sm text-[#A1A1AA]">
                  {xpToNextRank} XP to {nextRank.rank}
                </span>
              )}
            </div>
            <Progress value={xpProgress} className="h-2 bg-[#07070A]" />
            <div className="flex justify-between mt-2">
              {rankProgression.map((rank) => (
                <div 
                  key={rank.rank}
                  className={`text-xs ${user.xp >= rank.minXP ? rank.color : 'text-[#A1A1AA]'}`}
                >
                  {rank.rank}
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-[#A1A1AA] mb-3">Interests</p>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span 
                    key={interest}
                    className="px-3 py-1 bg-[#07070A] border border-white/10 rounded-full text-sm text-white"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#141419] border border-white/10 p-1 w-full">
            <TabsTrigger 
              value="events" 
              className="flex-1 data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger 
              value="attended"
              className="flex-1 data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Attended
            </TabsTrigger>
            <TabsTrigger 
              value="liked"
              className="flex-1 data-[state=active]:bg-[#B6FF2E] data-[state=active]:text-[#07070A]"
            >
              <Heart className="w-4 h-4 mr-2" />
              Liked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            {userEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {userEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="bg-[#141419] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#B6FF2E]/30 transition-colors"
                  >
                    <div className="relative h-40">
                      <img src={event.media[0]} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[#B6FF2E] text-[#07070A]">{event.category}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                      <div className="flex items-center text-[#A1A1AA] text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
                <p className="text-[#A1A1AA]">
                  {isOwnProfile ? 'Create your first event to see it here' : 'This user hasn\'t created any events yet'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attended" className="mt-6">
            {attendedEvents.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {attendedEvents.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/events/${event._id}`)}
                    className="bg-[#141419] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#B6FF2E]/30 transition-colors"
                  >
                    <div className="relative h-40">
                      <img src={event.media[0]} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{event.title}</h3>
                      <div className="flex items-center text-[#A1A1AA] text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No attended events</h3>
                <p className="text-[#A1A1AA]">
                  {isOwnProfile ? 'Get tickets to events to see them here' : 'This user hasn\'t attended any events yet'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No liked events</h3>
              <p className="text-[#A1A1AA]">
                {isOwnProfile ? 'Like events to save them here' : 'This user hasn\'t liked any events yet'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}