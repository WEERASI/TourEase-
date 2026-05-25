
import React, { useState } from 'react';
import { X, Calendar, Users, ArrowLeft, ArrowRight, CreditCard, Check, ShieldCheck, User, Info, Loader2, PartyPopper } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Checkbox from './Checkbox';
import Textarea from './Textarea';
import { apiRequest } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  pricePerPerson: number;
  tourId?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, tourTitle, pricePerPerson, tourId }) => {
  const [step, setStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  // Contact info (from Step 2)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  if (!isOpen) return null;

  const totalGuests = adults + children;
  const totalPrice = totalGuests * pricePerPerson;

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const steps = [
    { id: 1, name: 'Date & Guests' },
    { id: 2, name: 'Guest Details' },
    { id: 3, name: 'Review' },
    { id: 4, name: 'Confirm' },
  ];

  const handleConfirmBooking = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSubmitError('Please log in to book a tour.');
      return;
    }

    if (!tourId) {
      setSubmitError('Tour information is missing. Please try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          bookingType: 'tour',
          referenceId: tourId,
          bookingDate: bookingDate,
          guests: {
            adults: adults,
            children: children,
          },
          totalPrice: totalPrice,
          contactInfo: {
            name: contactName.trim() || 'Guest',
            email: contactEmail.trim(),
            phone: contactPhone.trim(),
          },
          specialRequests: specialRequests.trim(),
        }),
      });

      if (response.success) {
        setConfirmedBookingId(response.data?._id || 'N/A');
        setStep(5); // Success screen
      } else {
        setSubmitError(response.message || 'Booking failed. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep(1);
    setAdults(2);
    setChildren(0);
    setIsAgreed(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setSpecialRequests('');
    setSubmitError('');
    setConfirmedBookingId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={step !== 5 ? handleClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl rounded-[var(--radius-xl)] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 5 ? 'Booking Confirmed!' : 'Book Your Tour'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">{tourTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator — hidden on success screen */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1 last:flex-none">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${step > s.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : step === s.id ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}
                `}>
                  {step > s.id ? <Check size={16} strokeWidth={3} /> : s.id}
                </div>
                <span className={`text-xs font-bold hidden sm:inline ${step >= s.id ? 'text-sky-600' : 'text-slate-400'}`}>
                  {s.name}
                </span>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 rounded-full ${step > s.id ? 'bg-sky-500' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">

          {/* STEP 1: DATE & GUESTS */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar size={20} className="text-sky-500" />
                  Select Departure Date
                </h3>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full"
                  leftIcon={<Calendar size={18} />}
                />
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 flex items-start gap-2">
                  <Info size={16} className="text-sky-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-sky-800 leading-relaxed">
                    Popular dates fill up fast. We recommend booking at least 2 weeks in advance.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users size={20} className="text-sky-500" />
                  Number of Guests
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Adults</p>
                      <p className="text-xs text-slate-500">Age 13+</p>
                    </div>
                    <Counter value={adults} onChange={setAdults} min={1} />
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Children</p>
                      <p className="text-xs text-slate-500">Age 3-12</p>
                    </div>
                    <Counter value={children} onChange={setChildren} min={0} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST DETAILS */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900">Primary Contact Details</h3>
                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-sm uppercase tracking-wider">
                    <User size={16} />
                    Lead Traveler
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name *"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Phone Number *"
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Email Address *"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>

                {totalGuests > 1 && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2">
                    <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      Booking for <strong>{totalGuests} guests</strong> ({adults} adults{children > 0 ? `, ${children} children` : ''}). All guests will be on this booking.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Special Requests</h3>
                <Textarea
                  placeholder="Tell us about any dietary requirements, physical limitations, or special occasions..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full translate-x-1/2 -translate-y-1/2" />
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sky-100 text-sm">
                  <div className="flex justify-between">
                    <span>Tour:</span>
                    <span className="font-bold text-white text-right max-w-[60%]">{tourTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-bold text-white">{new Date(bookingDate + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travelers:</span>
                    <span className="font-bold text-white">{adults} Adults{children > 0 ? `, ${children} Children` : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead Contact:</span>
                    <span className="font-bold text-white">{contactName || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Price Breakdown</h3>
                <div className="space-y-3 p-6 border border-slate-100 rounded-2xl">
                  <div className="flex justify-between text-slate-600">
                    <span>LKR {pricePerPerson.toLocaleString()} x {totalGuests} Guests</span>
                    <span className="font-bold text-slate-900">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Service Fees</span>
                    <span className="font-bold text-slate-900">Included</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total Amount</span>
                    <span className="text-2xl font-black text-sky-600">LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Checkbox
                label={
                  <span className="text-sm">I have read and agree to the <a href="#" className="text-sky-600 font-bold hover:underline">Cancellation Policy</a> and <a href="#" className="text-sky-600 font-bold hover:underline">Terms of Service</a>.</span>
                }
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                required
              />
            </div>
          )}

          {/* STEP 4: CONFIRM & SUBMIT */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
              <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mx-auto">
                <CreditCard size={40} />
              </div>
              <div className="max-w-sm mx-auto space-y-3">
                <h3 className="text-2xl font-bold text-slate-900">Confirm Your Booking</h3>
                <p className="text-slate-500">
                  You are about to book <strong className="text-slate-900">{tourTitle}</strong> for <strong className="text-sky-600">LKR {totalPrice.toLocaleString()}</strong>.
                </p>
              </div>

              {/* Summary card */}
              <div className="text-left bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Date</span><span className="font-semibold text-slate-800">{new Date(bookingDate + 'T00:00:00').toLocaleDateString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Guests</span><span className="font-semibold text-slate-800">{totalGuests} people</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Contact</span><span className="font-semibold text-slate-800">{contactName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-800">{contactEmail}</span></div>
              </div>

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-left">
                  ⚠️ {submitError}
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck size={14} />
                <span>Free cancellation up to 48 hours before departure</span>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <div className="text-center py-10 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <PartyPopper size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed! 🎉</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Your booking for <strong className="text-slate-800">{tourTitle}</strong> has been submitted successfully.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 max-w-sm mx-auto space-y-3">
                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Booking Reference</p>
                <p className="text-sm font-mono font-bold text-emerald-800 bg-white px-3 py-2 rounded-lg border border-emerald-200 break-all">
                  #{confirmedBookingId.slice(-8).toUpperCase()}
                </p>
                <div className="text-sm text-emerald-700 space-y-1 text-left">
                  <div className="flex justify-between"><span>Date:</span><span className="font-semibold">{new Date(bookingDate + 'T00:00:00').toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span>Guests:</span><span className="font-semibold">{totalGuests}</span></div>
                  <div className="flex justify-between"><span>Total:</span><span className="font-semibold">LKR {totalPrice.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Status:</span><span className="font-semibold text-amber-600">Pending Confirmation</span></div>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                A confirmation email will be sent to <strong>{contactEmail}</strong>. The tour operator will confirm your booking shortly.
              </p>
            </div>
          )}

        </div>

        {/* Footer Buttons */}
        {step < 5 && (
          <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={step === 1 ? handleClose : prevStep}
              className="rounded-full px-8 border-slate-200 text-slate-600"
              leftIcon={step > 1 ? <ArrowLeft size={18} /> : undefined}
              disabled={isSubmitting}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < 3 && (
              <Button
                variant="secondary"
                className="rounded-full px-10 shadow-lg shadow-orange-500/20"
                onClick={nextStep}
                disabled={step === 2 && (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim())}
                rightIcon={<ArrowRight size={18} />}
              >
                Continue
              </Button>
            )}

            {step === 3 && (
              <Button
                variant="secondary"
                className="rounded-full px-10 shadow-lg shadow-orange-500/20"
                onClick={nextStep}
                disabled={!isAgreed}
                rightIcon={<ArrowRight size={18} />}
              >
                Confirm & Pay
              </Button>
            )}

            {step === 4 && (
              <Button
                variant="secondary"
                className="rounded-full px-10 shadow-lg shadow-orange-500/20"
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                rightIcon={isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </Button>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/80 flex justify-center">
            <Button variant="secondary" className="rounded-full px-12 shadow-lg" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

const Counter: React.FC<{ value: number; onChange: (v: number) => void; min: number }> = ({ value, onChange, min }) => (
  <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-slate-200">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-sky-600 transition-colors"
    >
      <ArrowLeft size={14} />
    </button>
    <span className="w-6 text-center font-black text-slate-900">{value}</span>
    <button
      onClick={() => onChange(value + 1)}
      className="w-8 h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-sky-600 transition-colors"
    >
      <ArrowRight size={14} />
    </button>
  </div>
);

export default BookingModal;
