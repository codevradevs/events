import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEventStore } from '@/store/eventStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Badge component available for future use
import { 
  Plus, 
  Trash2, 
  Upload,
  ChevronLeft,
  Loader2,
  Check
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  'concert', 'gaming', 'conference', 'festival', 'sports', 'nightlife', 'workshop', 'community'
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createEvent } = useEventStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [ticketTiers, setTicketTiers] = useState([{ tier: 'General', price: 0, quantity: 100 }]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    address: '',
    media: [] as string[],
  });

  const addTicketTier = () => {
    setTicketTiers([...ticketTiers, { tier: '', price: 0, quantity: 100 }]);
  };

  const removeTicketTier = (index: number) => {
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const updateTicketTier = (index: number, field: string, value: string | number) => {
    setTicketTiers(ticketTiers.map((tier, i) => 
      i === index ? { ...tier, [field]: value } : tier
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventDate = new Date(`${formData.date}T${formData.time}`);
      
      await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        date: eventDate.toISOString(),
        location: {
          name: formData.location,
          address: formData.address,
        },
        ticketTiers: ticketTiers.map(t => ({
          tier: t.tier,
          price: Number(t.price),
          quantity: Number(t.quantity),
          sold: 0,
        })),
        media: formData.media.length > 0 ? formData.media : ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'],
        organizer: user || undefined,
      });

      navigate('/organizer');
    } catch (error) {
      console.error('Failed to create event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.title && formData.description && formData.category;
    }
    if (step === 2) {
      return formData.date && formData.time && formData.location;
    }
    return true;
  };

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? navigate('/organizer') : setStep(step - 1)}
            className="text-[#A1A1AA] hover:text-white mr-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black text-white">Create Event</h1>
            <p className="text-[#A1A1AA]">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-[#B6FF2E]' : 'bg-[#141419]'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your event a catchy name"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-[#07070A] border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell people what your event is about"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#07070A] border-white/10 text-white mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-[#07070A] border-white/10 text-white mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141419] border-white/10">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-white capitalize">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Event Image</Label>
                  <div className="mt-2 border-2 border-dashed border-white/10 rounded-xl p-8 text-center">
                    <Upload className="w-8 h-8 text-[#A1A1AA] mx-auto mb-2" />
                    <p className="text-[#A1A1AA]">Drag and drop an image, or click to browse</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Location */}
          {step === 2 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Date & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-white">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="bg-[#07070A] border-white/10 text-white mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time" className="text-white">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="bg-[#07070A] border-white/10 text-white mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-white">Venue Name</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Nairobi National Park"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-[#07070A] border-white/10 text-white mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white">Address</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-[#07070A] border-white/10 text-white mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Tickets */}
          {step === 3 && (
            <Card className="bg-[#141419] border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Ticket Tiers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {ticketTiers.map((tier, index) => (
                  <div key={index} className="bg-[#07070A] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-medium">Ticket Tier {index + 1}</h4>
                      {ticketTiers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTicketTier(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-[#A1A1AA] text-sm">Name</Label>
                        <Input
                          value={tier.tier}
                          onChange={(e) => updateTicketTier(index, 'tier', e.target.value)}
                          placeholder="e.g., VIP"
                          className="bg-[#141419] border-white/10 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#A1A1AA] text-sm">Price (KES)</Label>
                        <Input
                          type="number"
                          value={tier.price}
                          onChange={(e) => updateTicketTier(index, 'price', Number(e.target.value))}
                          placeholder="0"
                          className="bg-[#141419] border-white/10 text-white mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-[#A1A1AA] text-sm">Quantity</Label>
                        <Input
                          type="number"
                          value={tier.quantity}
                          onChange={(e) => updateTicketTier(index, 'quantity', Number(e.target.value))}
                          placeholder="100"
                          className="bg-[#141419] border-white/10 text-white mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addTicketTier}
                  className="w-full border-white/10 text-white hover:bg-white/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ticket Tier
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < 3 ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90 disabled:opacity-50"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#B6FF2E] text-[#07070A] hover:bg-[#B6FF2E]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}