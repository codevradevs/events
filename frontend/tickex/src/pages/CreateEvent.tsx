import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, ChevronLeft, Loader2, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories = ['Music', 'Sports', 'Arts', 'Food', 'Business', 'Technology', 'Education', 'Other'];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ticketTiers, setTicketTiers] = useState([{ name: 'General', price: 0, quantity: 100 }]);
  const [formData, setFormData] = useState({ title: '', description: '', category: '', date: '', time: '', venue: '', locationName: '', county: '', country: 'Kenya' });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const addTier = () => setTicketTiers([...ticketTiers, { name: '', price: 0, quantity: 100 }]);
  const removeTier = (i: number) => setTicketTiers(ticketTiers.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: string, value: string | number) =>
    setTicketTiers(ticketTiers.map((t, idx) => idx === i ? { ...t, [field]: value } : t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append('ticketTiers', JSON.stringify(ticketTiers));
      fd.append('status', 'published');
      if (imageFile) fd.append('poster', imageFile);

      await api.post('/api/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/organizer');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.title && formData.description && formData.category;
    if (step === 2) return formData.date && formData.time && formData.venue;
    return true;
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => step === 1 ? navigate('/organizer') : setStep(step - 1)} className="text-[#A1A1AA] hover:text-white mr-4">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div><h1 className="text-2xl font-black text-white">Create Event</h1><p className="text-[#A1A1AA]">Step {step} of 3</p></div>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => <div key={s} className={`flex-1 h-2 rounded-full ${s <= step ? 'bg-[#B6FF2E]' : 'bg-[#141419]'}`} />)}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader><CardTitle className="text-white">Event Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div><Label className="text-white">Event Title</Label><Input placeholder="Give your event a catchy name" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                <div><Label className="text-white">Description</Label><Textarea placeholder="Tell people what your event is about" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2 min-h-[120px]" /></div>
                <div>
                  <Label className="text-white">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                    <SelectTrigger className="bg-[#07070A] border-white/10 text-white mt-2"><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent className="bg-[#141419] border-white/10">
                      {categories.map((c) => <SelectItem key={c} value={c} className="text-white">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Event Poster</Label>
                  <div className="mt-2 border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[#B6FF2E]/30 transition-colors" onClick={() => fileRef.current?.click()}>
                    {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" /> : <><Upload className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" /><p className="text-[#A1A1AA]">Click to upload event poster</p></>}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader><CardTitle className="text-white">Date & Location</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-white">Date</Label><Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                  <div><Label className="text-white">Time</Label><Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                </div>
                <div><Label className="text-white">Venue Name</Label><Input placeholder="e.g., Nairobi National Park" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                <div><Label className="text-white">Location / Area</Label><Input placeholder="e.g., Westlands, Nairobi" value={formData.locationName} onChange={(e) => setFormData({ ...formData, locationName: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label className="text-white">County</Label><Input placeholder="e.g., Nairobi" value={formData.county} onChange={(e) => setFormData({ ...formData, county: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                  <div><Label className="text-white">Country</Label><Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="bg-[#07070A] border-white/10 text-white mt-2" /></div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader><CardTitle className="text-white">Ticket Tiers</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {ticketTiers.map((tier, i) => (
                  <div key={i} className="bg-[#07070A] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Tier {i + 1}</h4>
                      {ticketTiers.length > 1 && <Button type="button" variant="ghost" size="sm" onClick={() => removeTier(i)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><Label className="text-[#A1A1AA] text-sm">Name</Label><Input value={tier.name} onChange={(e) => updateTier(i, 'name', e.target.value)} placeholder="e.g., VIP" className="bg-[#141419] border-white/10 text-white mt-1" /></div>
                      <div><Label className="text-[#A1A1AA] text-sm">Price (KES)</Label><Input type="number" value={tier.price} onChange={(e) => updateTier(i, 'price', Number(e.target.value))} className="bg-[#141419] border-white/10 text-white mt-1" /></div>
                      <div><Label className="text-[#A1A1AA] text-sm">Quantity</Label><Input type="number" value={tier.quantity} onChange={(e) => updateTier(i, 'quantity', Number(e.target.value))} className="bg-[#141419] border-white/10 text-white mt-1" /></div>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addTier} className="w-full border-white/10 text-white hover:bg-white/5"><Plus className="w-4 h-4 mr-2" />Add Ticket Tier</Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="border-white/10 text-white hover:bg-white/5">Back</Button> : <div />}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep(step + 1)} disabled={!canProceed()} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 disabled:opacity-50">Continue</Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90">
                {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : <><Check className="w-4 h-4 mr-2" />Create Event</>}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
