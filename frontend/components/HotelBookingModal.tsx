
import React, { useState, useMemo } from 'react';
import { 
  X, Calendar, Users, Bed, ArrowLeft, ArrowRight, Check, 
  CreditCard, ShieldCheck, Info, MapPin, Star, Download,
  Home, ClipboardCheck, Phone, Mail, Tag, Loader2, User
} from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Checkbox from './Checkbox';
import Textarea from './Textarea';

interface Room {
  id: string;
  name: string;
  price: number;
  image: string;
  amenities: string[];
  // Added occupancy property to fix the error: Property 'occupancy' does not exist on type 'Room'
  occupancy: number;
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  selectedRoom: Room | null;
  fullName: string;
  email: string;
  phone: string;
  specialRequests: string;
  isForSomeoneElse: boolean;
  paymentMethod: 'card' | 'bank' | 'paypal';
}

interface HotelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: any;
  initialRoom?: Room | null;
}

const HotelBookingModal: React.FC<HotelBookingModalProps> = ({ isOpen, onClose, hotel, initialRoom }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: '2024-06-15',
    checkOut: '2024-06-18',
    adults: 2,
    children: 0,
    roomsCount: 1,
    selectedRoom: initialRoom || null,
    fullName: '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    specialRequests: '',
    isForSomeoneElse: false,
    paymentMethod: 'card'
  });

  // --- CALCULATIONS ---
  const nights = useMemo(() => {
    const start = new Date(bookingData.checkIn);
    const end = new Date(bookingData.checkOut);
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
  }, [bookingData.checkIn, bookingData.checkOut]);

  const subtotal = (bookingData.selectedRoom?.price || 0) * nights * bookingData.roomsCount;
  const serviceCharge = subtotal * 0.10;
  const vat = subtotal * 0.15;
  const totalAmount = subtotal + serviceCharge + vat;

  const nextStep = () => {
    if (step === 5) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(6);
      }, 2000);
    } else {
      setStep(s => s + 1);
    }
  };
  
  const prevStep = () => setStep(s => s - 1);

  if (!isOpen || !hotel) return null;

  const steps = [
    { id: 1, name: 'Dates & Guests' },
    { id: 2, name: 'Room' },
    { id: 3, name: 'Details' },
    { id: 4, name: 'Review' },
    { id: 5, name: 'Payment' },
    { id: 6, name: 'Done' }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-5xl h-full md:h-[90vh] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-black text-xs">TE</div>
             <div>
                <h2 className="text-lg font-bold text-slate-900 leading-none">Hotel Booking</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{hotel.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Progress Stepper */}
        {step < 6 && (
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[600px]">
              {steps.slice(0, 5).map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    step >= s.id ? 'bg-sky-500 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-400'
                  }`}>
                    {step > s.id ? <Check size={14} strokeWidth={3} /> : s.id}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-sky-600' : 'text-slate-400'}`}>{s.name}</span>
                  {i < 4 && <div className={`h-px flex-1 mx-3 ${step > s.id ? 'bg-sky-500' : 'bg-slate-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50/50">
          
          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-2xl mx-auto space-y-8">
              
              {/* STEP 1: DATES & GUESTS */}
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-slate-900">When are you visiting?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input 
                      label="Check-in Date" 
                      type="date" 
                      value={bookingData.checkIn} 
                      onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                      leftIcon={<Calendar size={18} />}
                    />
                    <Input 
                      label="Check-out Date" 
                      type="date" 
                      value={bookingData.checkOut} 
                      onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                      leftIcon={<Calendar size={18} />}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <Counter label="Adults" sub="13+ years" value={bookingData.adults} onChange={(v) => setBookingData({...bookingData, adults: v})} min={1} />
                    <Counter label="Children" sub="2-12 years" value={bookingData.children} onChange={(v) => setBookingData({...bookingData, children: v})} min={0} />
                    <Counter label="Rooms" sub="Max 4" value={bookingData.roomsCount} onChange={(v) => setBookingData({...bookingData, roomsCount: v})} min={1} max={4} />
                  </div>
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-500 shrink-0 shadow-sm"><Info size={20} /></div>
                    <p className="text-xs text-sky-700 font-medium">You've selected a <span className="font-black underline">{nights} night stay</span>. Prices will be adjusted accordingly.</p>
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE ROOM */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-slate-900">Choose your room</h3>
                  <div className="space-y-4">
                    {hotel.rooms.map((room: Room) => (
                      <div 
                        key={room.id}
                        onClick={() => setBookingData({...bookingData, selectedRoom: room})}
                        className={`group bg-white rounded-3xl border-2 p-4 cursor-pointer transition-all hover:shadow-xl flex gap-6 ${
                          bookingData.selectedRoom?.id === room.id ? 'border-sky-500 shadow-sky-100 ring-8 ring-sky-50' : 'border-slate-100'
                        }`}
                      >
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                          <img src={room.image} className="w-full h-full object-cover" alt={room.name} />
                        </div>
                        <div className="flex-1 py-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 group-hover:text-sky-600">{room.name}</h4>
                            <div className="text-right">
                              <span className="text-lg font-black text-sky-600">LKR {room.price.toLocaleString()}</span>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">per night</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                             {room.amenities.slice(0, 3).map(a => <span key={a} className="text-[9px] font-black uppercase tracking-tighter bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md border border-slate-100">{a}</span>)}
                          </div>
                          <div className="mt-auto flex justify-end">
                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                               bookingData.selectedRoom?.id === room.id ? 'bg-sky-500 border-sky-500' : 'border-slate-200'
                             }`}>
                                {bookingData.selectedRoom?.id === room.id && <Check size={12} className="text-white" strokeWidth={4} />}
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: GUEST DETAILS */}
              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                   <h3 className="text-2xl font-black text-slate-900">Guest Information</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Fix: Added User to imports from lucide-react */}
                      <Input label="Full Name (Lead Guest)" placeholder="Enter your full name" value={bookingData.fullName} onChange={e => setBookingData({...bookingData, fullName: e.target.value})} leftIcon={<User size={18} />} />
                      <Input label="Email Address" type="email" placeholder="you@example.com" value={bookingData.email} onChange={e => setBookingData({...bookingData, email: e.target.value})} leftIcon={<Mail size={18} />} />
                      <Input label="Phone Number" placeholder="+94 77 123 4567" value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} leftIcon={<Phone size={18} />} className="sm:col-span-2" />
                      <div className="sm:col-span-2">
                         <Checkbox label="I'm booking for someone else" checked={bookingData.isForSomeoneElse} onChange={() => setBookingData({...bookingData, isForSomeoneElse: !bookingData.isForSomeoneElse})} />
                      </div>
                      <Textarea label="Special Requests" placeholder="E.g. High floor, early check-in, dietary needs..." value={bookingData.specialRequests} onChange={e => setBookingData({...bookingData, specialRequests: e.target.value})} className="sm:col-span-2" />
                   </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-slate-900">Review your booking</h3>
                  <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 bg-slate-900 text-white flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20">
                          <img src={hotel.imageUrl} className="w-full h-full object-cover" alt={hotel.name} />
                       </div>
                       <div>
                          <h4 className="font-black text-lg">{hotel.name}</h4>
                          <p className="text-sky-300 text-xs flex items-center gap-1"><MapPin size={14} /> {hotel.city}, Sri Lanka</p>
                       </div>
                    </div>
                    <div className="p-8 space-y-6">
                       <div className="grid grid-cols-2 gap-8 text-sm">
                          <div>
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Stay Details</p>
                             <p className="font-bold text-slate-900">{bookingData.checkIn} — {bookingData.checkOut}</p>
                             <p className="text-slate-500 font-medium">{nights} Nights • {bookingData.roomsCount} Room(s)</p>
                          </div>
                          <div>
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Room Selection</p>
                             <p className="font-bold text-slate-900">{bookingData.selectedRoom?.name}</p>
                             <p className="text-slate-500 font-medium">Max {bookingData.selectedRoom?.occupancy} Guests</p>
                          </div>
                       </div>
                       <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                          <ShieldCheck className="text-emerald-500" size={20} />
                          <p className="text-xs text-slate-600 font-medium">Free cancellation before 48 hours. Flexible rescheduling available.</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT */}
              {step === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-2xl font-black text-slate-900">Finalize Payment</h3>
                  <div className="grid grid-cols-1 gap-4">
                     <PaymentOption 
                        title="Credit / Debit Card" 
                        icon={<CreditCard size={20} />} 
                        active={bookingData.paymentMethod === 'card'} 
                        onClick={() => setBookingData({...bookingData, paymentMethod: 'card'})} 
                     />
                     <PaymentOption 
                        title="PayPal" 
                        icon={<div className="font-black italic text-blue-800">P</div>} 
                        active={bookingData.paymentMethod === 'paypal'} 
                        onClick={() => setBookingData({...bookingData, paymentMethod: 'paypal'})} 
                     />
                  </div>

                  {bookingData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 animate-in slide-in-from-bottom-2">
                       <Input label="Card Number" placeholder="0000 0000 0000 0000" leftIcon={<CreditCard size={18} />} />
                       <div className="grid grid-cols-2 gap-4">
                          <Input label="Expiry Date" placeholder="MM/YY" />
                          <Input label="CVC" placeholder="***" type="password" />
                       </div>
                       <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <ShieldCheck size={16} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">256-bit SSL Secure Payment Gateway</span>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: CONFIRMATION */}
              {step === 6 && (
                <div className="space-y-8 py-10 text-center animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200">
                     <ClipboardCheck size={48} />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
                     <p className="text-slate-500 font-medium">Your stay at {hotel.name} is all set. We've sent the details to your email.</p>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 max-w-sm mx-auto">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Confirmation ID</div>
                     <div className="text-xl font-black text-sky-600 tracking-wider">TE-BNB-4492-2024</div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
                     <Button variant="ghost" className="rounded-full w-full sm:w-auto px-8" leftIcon={<Download size={18} />}>Download PDF Invoice</Button>
                     <Button onClick={onClose} className="rounded-full w-full sm:w-auto px-10 shadow-xl shadow-sky-200">Return Home</Button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* SIDE SUMMARY (Hidden on Step 6) */}
          {step < 6 && (
            <aside className="hidden lg:block w-96 bg-white border-l border-slate-100 p-8 shadow-inner overflow-y-auto">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Booking Summary</h4>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                      <img src={hotel.imageUrl} className="w-full h-full object-cover" alt={hotel.name} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-900 leading-tight">{hotel.name}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(hotel.stars)].map((_, i) => <Star key={i} size={10} className="text-amber-400" fill="currentColor" />)}
                      </div>
                   </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-50">
                   <SummaryItem icon={<Calendar size={14} />} label="Nights" value={`${nights} Nights`} />
                   <SummaryItem icon={<Users size={14} />} label="Guests" value={`${bookingData.adults} Adults, ${bookingData.children} Child`} />
                   <SummaryItem icon={<Bed size={14} />} label="Room" value={bookingData.selectedRoom?.name || 'Not selected'} />
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-900">LKR {subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">Service Charge (10%)</span>
                      <span className="font-bold text-slate-900">LKR {serviceCharge.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-slate-400 font-medium">VAT (15%)</span>
                      <span className="font-bold text-slate-900">LKR {vat.toLocaleString()}</span>
                   </div>
                   <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-black text-slate-900">TOTAL</span>
                      <div className="text-right">
                         <span className="text-2xl font-black text-sky-600 block leading-none">LKR {totalAmount.toLocaleString()}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inclusive of taxes</span>
                      </div>
                   </div>
                </div>
              </div>

              {step === 4 && (
                <div className="mt-10 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
                   <Tag className="text-orange-500 shrink-0" size={18} />
                   <p className="text-[10px] text-orange-700 font-bold leading-relaxed">Early Bird Discount Applied! You've saved LKR 4,500 on this booking.</p>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* Action Footer */}
        {step < 6 && (
          <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <Button 
              variant="ghost" 
              onClick={step === 1 ? onClose : prevStep} 
              className="rounded-full px-8"
              leftIcon={<ArrowLeft size={18} />}
            >
              {step === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={nextStep} 
              isLoading={isLoading}
              disabled={step === 2 && !bookingData.selectedRoom}
              className="rounded-full px-12 shadow-xl shadow-orange-500/20"
              rightIcon={step === 5 ? <ShieldCheck size={18} /> : <ArrowRight size={18} />}
            >
              {step === 5 ? 'Pay & Confirm' : 'Continue'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const Counter: React.FC<{ label: string; sub: string; value: number; onChange: (v: number) => void; min: number; max?: number }> = ({ label, sub, value, onChange, min, max = 10 }) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-3">
    <div className="text-center">
      <p className="font-bold text-slate-900 text-sm leading-none">{label}</p>
      <p className="text-[10px] text-slate-400 mt-1">{sub}</p>
    </div>
    <div className="flex items-center gap-4">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-100"
      >
        -
      </button>
      <span className="font-black text-slate-900 w-4 text-center">{value}</span>
      <button 
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-100"
      >
        +
      </button>
    </div>
  </div>
);

const SummaryItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{value}</span>
  </div>
);

const PaymentOption: React.FC<{ title: string; icon: React.ReactNode; active: boolean; onClick: () => void }> = ({ title, icon, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
      active ? 'border-sky-500 bg-sky-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-300'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
       {icon}
    </div>
    <span className={`font-bold ${active ? 'text-sky-900' : 'text-slate-600'}`}>{title}</span>
    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-sky-500 bg-sky-500' : 'border-slate-200'}`}>
       {active && <Check size={12} className="text-white" strokeWidth={4} />}
    </div>
  </div>
);

export default HotelBookingModal;
