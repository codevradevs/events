import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, User, Loader2, ArrowLeft, Check } from 'lucide-react';

const interestsList = [
  'Music', 'Gaming', 'Sports', 'Arts', 'Nightlife', 
  'Food', 'Technology', 'Business', 'Wellness', 'Travel'
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const validateStep1 = () => {
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        interests: selectedInterests,
      });
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-24">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => step === 1 ? navigate('/') : setStep(1)}
          className="mb-6 text-[#A1A1AA] hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {step === 1 ? 'Back to home' : 'Back'}
        </Button>

        <Card className="bg-[#141419] border-white/10">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="flex space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 1 ? 'bg-[#B6FF2E] text-[#07070A]' : 'bg-white/10 text-[#A1A1AA]'
                }`}>1</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2 ? 'bg-[#B6FF2E] text-[#07070A]' : 'bg-white/10 text-[#A1A1AA]'
                }`}>2</div>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center">
              {step === 1 ? 'Create your account' : 'What are you into?'}
            </CardTitle>
            <CardDescription className="text-[#A1A1AA] text-center">
              {step === 1 
                ? 'Join TICKEX and start discovering events'
                : 'Select your interests for personalized recommendations'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 bg-red-500/10 border-red-500/20">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                    />
                  </div>
                  <p className="text-xs text-[#A1A1AA]">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A1A1AA]" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 bg-[#07070A] border-white/10 text-white placeholder:text-[#A1A1AA] h-12"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12"
                >
                  Continue
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-[#B6FF2E] text-[#07070A]'
                          : 'bg-[#07070A] border border-white/10 text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      {selectedInterests.includes(interest) && (
                        <Check className="w-3 h-3 inline mr-1" />
                      )}
                      {interest}
                    </button>
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 font-semibold h-12"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create account'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSubmit}
                  className="w-full text-[#A1A1AA] hover:text-white"
                >
                  Skip for now
                </Button>
              </form>
            )}

            {step === 1 && (
              <div className="mt-6 text-center">
                <p className="text-[#A1A1AA]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#B6FF2E] hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}