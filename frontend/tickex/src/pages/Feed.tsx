import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEventStore } from '@/store/eventStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, Ticket, MoreHorizontal, TrendingUp, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { FeedPost } from '@/types';

export default function Feed() {
  const { feedPosts, fetchFeed } = useEventStore();
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    fetchFeed().then(() => {}).catch(() => {});
  }, []);

  useEffect(() => { setPosts(feedPosts); }, [feedPosts]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]);
    api.post(`/api/feed/${postId}/like`).catch(() => {});
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const { data } = await api.post('/api/feed', { content: newPost });
      setPosts([data, ...posts]);
      setNewPost('');
    } catch {
      // feed endpoint may not exist yet — optimistic update
      setPosts([{ _id: Date.now().toString(), author: user as any, content: newPost, likes: [], comments: [], createdAt: new Date().toISOString() }, ...posts]);
      setNewPost('');
    } finally {
      setPosting(false);
    }
  };

  const getRankColor = (rank: string) => {
    const map: Record<string, string> = { Rookie: 'text-gray-400 border-gray-400', Explorer: 'text-green-400 border-green-400', Pro: 'text-blue-400 border-blue-400', Veteran: 'text-purple-400 border-purple-400', Legend: 'text-yellow-400 border-yellow-400' };
    return map[rank] || 'text-gray-400 border-gray-400';
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">For You</h1>
          <div className="flex items-center space-x-2"><TrendingUp className="w-5 h-5 text-[#B6FF2E]" /><span className="text-sm text-[#A1A1AA]">Trending</span></div>
        </div>

        {/* Create Post */}
        <div className="bg-[#141419] border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePic} />
              <AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <Input placeholder="Share an event or update..." value={newPost} onChange={(e) => setNewPost(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePost()}
              className="bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA]" />
          </div>
          <div className="flex justify-end mt-3">
            <Button onClick={handlePost} disabled={posting || !newPost.trim()} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
            </Button>
          </div>
        </div>

        {/* Feed Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-[#141419] rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp className="w-10 h-10 text-[#A1A1AA]" /></div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-[#A1A1AA]">Be the first to post something!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-[#141419] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author?.profilePic} />
                      <AvatarFallback className="bg-[#B6FF2E] text-[#07070A]">{post.author?.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{post.author?.username}</span>
                        {post.author?.rank && <span className={`text-xs px-2 py-0.5 rounded-full border ${getRankColor(post.author.rank)}`}>{post.author.rank}</span>}
                      </div>
                      <span className="text-xs text-[#A1A1AA]">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="text-[#A1A1AA] hover:text-white"><MoreHorizontal className="w-5 h-5" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#07070A] border-white/10">
                      <DropdownMenuItem className="text-white hover:bg-white/5">Save post</DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-white/5">Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="px-4 pb-3"><p className="text-white">{post.content}</p></div>

                {post.media && post.media.length > 0 && (
                  <div className="relative">
                    <img src={post.media[0]} alt="Post media" className="w-full aspect-video object-cover" />
                    {post.event && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Link to={`/events/${post.event._id}`} className="block bg-[#07070A]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs text-[#B6FF2E] uppercase tracking-wider">{post.event.category}</span>
                              <h3 className="text-white font-semibold">{post.event.title}</h3>
                              <div className="flex items-center text-[#A1A1AA] text-sm mt-1">
                                <Calendar className="w-4 h-4 mr-1" />{new Date(post.event.date).toLocaleDateString()}
                                <MapPin className="w-4 h-4 ml-3 mr-1" />{post.event.locationName || post.event.venue || post.event.location?.name}
                              </div>
                            </div>
                            <Button size="sm" className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"><Ticket className="w-4 h-4 mr-1" />Get Tickets</Button>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => handleLike(post._id)} className={`flex items-center space-x-1 ${likedPosts.includes(post._id) ? 'text-red-500' : 'text-[#A1A1AA] hover:text-white'}`}>
                      <Heart className={`w-6 h-6 ${likedPosts.includes(post._id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes.length + (likedPosts.includes(post._id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-[#A1A1AA] hover:text-white"><MessageCircle className="w-6 h-6" /><span className="text-sm">{post.comments.length}</span></button>
                    <button className="flex items-center space-x-1 text-[#A1A1AA] hover:text-white"><Share2 className="w-6 h-6" /></button>
                  </div>
                  <button className="text-[#A1A1AA] hover:text-white"><Bookmark className="w-6 h-6" /></button>
                </div>

                {post.comments.length > 0 && (
                  <div className="px-4 pb-4 space-y-2">
                    {post.comments.slice(0, 2).map((c, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="font-semibold text-white text-sm">{c.user?.username}</span>
                        <span className="text-[#A1A1AA] text-sm">{c.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
