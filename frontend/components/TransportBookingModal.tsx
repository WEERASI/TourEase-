
import React, { useState } from 'react';
import { X, MapPin, Calendar, Clock, Users, ArrowRight, ShieldCheck, Info, Car, Plane, AlertCircle } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';

interface TransportBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  transport: any;
  searchParams: any;
}

const TransportBookingModal: React.FC<TransportBookingModalProps> = ({ isOpen, onClose, transport, searchParams }) => {
  const [step, setStep] = useState(1);
  const [flightNumber, setFlightNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !transport) return null;

  const handleComplete = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setStep(1);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 md:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Reserve Transport</h2>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mt-1">{transport.vehicleName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Route Summary */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-8">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                       <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5" />
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup</p>
                          <p className="text-sm font-bold text-slate-900">{searchParams.pickup}</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5" />
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop-off</p>
                          <p className="text-sm font-bold text-slate-900">{searchParams.dropoff}</p>
                       </div>
                    </div>
                 </div>
                 <div className="h-16 w-px bg-slate-200" />
                 <div className="text-center px-4">
                    <Calendar size={18} className="text-sky-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-900 whitespace-nowrap">{searchParams.date}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{searchParams.time}</p>
                 </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="Lead Passenger Name" placeholder="e.g. David Smith" leftIcon={<Users size={18} />} />
                  <Input label="Contact WhatsApp/Phone" placeholder="+94 7X XXX XXXX" />
                </div>
                
                {searchParams.type === 'Airport Transfer' && (
                  <div className="animate-in slide-in-from-top-2">
                    <Input 
                      label="Flight Number (Optional)" 
                      placeholder="e.g. UL102 or QR664" 
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      leftIcon={<Plane size={18} />}
                      helperText="We'll track your flight for delay-free pickup."
                    />
                  </div>
                )}

                <Textarea label="Instructions for Driver" placeholder="e.g. Arrival hall exit 2, child seat required, extra large surfboards..." />
              </div>

              {/* Price Disclosure */}
              <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                 <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                 <p className="text-xs text-orange-800 leading-relaxed font-medium">
                   Highway tolls (LKR 300 - 800) are usually not included and should be paid to the driver directly. No hidden booking fees.
                 </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total to Pay</p>
                <p className="text-2xl font-black text-sky-600 leading-none mt-1">LKR {transport.price.toLocaleString()}</p>
              </div>
              <Button 
                variant="secondary" 
                size="lg" 
                className="px-12 rounded-full shadow-xl shadow-orange-500/20"
                onClick={handleComplete}
                rightIcon={<ArrowRight size={20} />}
              >
                Confirm & Book
              </Button>
            </div>
          </>
        ) : (
          <div className="p-16 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
               <ShieldCheck size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Booking Received!</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
              Your transport is confirmed. Driver details will be sent to your WhatsApp 3 hours before pickup.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 inline-block">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Booking Ref</span>
               <span className="text-xl font-black text-sky-600 tracking-wider">TE-DRV-9821</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportBookingModal;
