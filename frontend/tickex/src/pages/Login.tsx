import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="w-full max-w-md">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 text-[#A1A1AA] hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to home
        </Button>
        <Card className="bg-[#141419] border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white text-center">
              Welcome back to <span className="text-[#B6FF2E]">TICKEX</span>
            </CardTitle>
            <CardDescription className="text-[#A1A1AA] text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                  <Input id="email" type="email" placeholder="you@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12" required />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12">
                {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign in'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-[#A1A1AA]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#B6FF2E] hover:underline">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
