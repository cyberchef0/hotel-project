"use client";

import { useState } from "react";
import { formatCurrency, calculateNights } from "@/lib/utils";
import { 
  HiOutlineX, HiOutlineUser, HiOutlinePhone, HiOutlineMail,
  HiOutlineCreditCard, HiOutlineCash,
  HiOutlineCheckCircle, HiOutlineClock, HiOutlineDocumentText
} from "react-icons/hi";

interface GuestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: { id: string; name: string; price: number; capacity: number };
  initialCheckIn: string;
  initialCheckOut: string;
  initialAdults: number;
  initialChildren: number;
}

export default function GuestBookingModal({ 
  isOpen, onClose, room, initialCheckIn, initialCheckOut, initialAdults, initialChildren
}: GuestBookingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const [formData, setFormData] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    paymentMethod: "PAY_AT_HOTEL",
    specialRequests: "",
    arrivalTime: "",
    nationality: "",
  });

  if (!isOpen) return null;

  const nights = initialCheckIn && initialCheckOut
    ? calculateNights(new Date(initialCheckIn), new Date(initialCheckOut))
    : 0;
  const totalPrice = nights * room.price;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && (!formData.guestName || !formData.guestPhone)) {
      setError("Name and Phone Number are required.");
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          roomId: room.id,
          checkIn: initialCheckIn,
          checkOut: initialCheckOut,
          adults: initialAdults,
          children: initialChildren
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const data = await res.json();
      
      if (formData.paymentMethod === "ONLINE") {
        const chapaRes = await fetch("/api/chapa/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: data.id, 
            amount: totalPrice,
            guestEmail: formData.guestEmail,
            guestName: formData.guestName,
            guestPhone: formData.guestPhone
          })
        });
        
        const chapaData = await chapaRes.json();
        if (!chapaRes.ok) {
           throw new Error(chapaData.error || "Failed to initialize payment gateway");
        }
        
        if (chapaData.checkoutUrl) {
           window.location.href = chapaData.checkoutUrl;
           return;
        }
      }

      setReferenceNumber(data.referenceNumber);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        {!success && (
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
            <HiOutlineX className="w-5 h-5" />
          </button>
        )}

        <div className="p-8">
          {success ? (
            <div className="text-center py-12 px-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineCheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-500 mb-8">Thank you for booking with LuxeHotel. We look forward to hosting you.</p>
              <div className="bg-gray-50 rounded-2xl p-6 inline-block max-w-sm w-full border border-gray-100 mb-8">
                <p className="text-sm text-gray-500 mb-1">Your Booking Reference</p>
                <p className="text-2xl font-mono font-bold text-amber-600">{referenceNumber}</p>
              </div>
              <div>
                <button onClick={() => { onClose(); window.location.href = "/"; }} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition">
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-900">Finalize your Booking</h2>
                <div className="flex items-center space-x-2 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full bg-amber-500 transition-all duration-300 ${step >= i ? 'w-full' : 'w-0'}`} />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 font-medium">Step {step} of 4</p>
              </div>

              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Options</h3>
                    <div className="space-y-3">
                      <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'PAY_AT_HOTEL' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-200'}`}>
                        <input type="radio" name="paymentMethod" value="PAY_AT_HOTEL" checked={formData.paymentMethod === 'PAY_AT_HOTEL'} onChange={handleChange} className="mt-1" />
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <HiOutlineCash className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-900">Pay at Property</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">No payment required now. Pay when you arrive at the hotel.</p>
                        </div>
                      </label>
                      <label className={`flex items-start p-4 border rounded-2xl cursor-pointer transition ${formData.paymentMethod === 'ONLINE' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-200'}`}>
                        <input type="radio" name="paymentMethod" value="ONLINE" checked={formData.paymentMethod === 'ONLINE'} onChange={handleChange} className="mt-1" />
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <HiOutlineCreditCard className="w-5 h-5 text-amber-600" />
                            <span className="font-semibold text-gray-900">Online Payment</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Securely pay via Chapa (Credit Card, Telebirr, CBE Birr).</p>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Details (Optional)</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                      <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500" placeholder="E.g., early check-in, high floor..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Arrival</label>
                        <div className="relative">
                          <HiOutlineClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nationality / ID</label>
                        <div className="relative">
                          <HiOutlineDocumentText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white" placeholder="Optional" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Review & Confirm</h3>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="space-y-4">
                        <div className="flex justify-between pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500">Guest Name</p>
                            <p className="font-semibold text-gray-900">{formData.guestName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-semibold text-gray-900">{formData.guestPhone}</p>
                          </div>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500">Check-in</p>
                            <p className="font-semibold text-gray-900">{initialCheckIn}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Check-out</p>
                            <p className="font-semibold text-gray-900">{initialCheckOut}</p>
                          </div>
                        </div>
                        <div className="flex justify-between pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500">Guests</p>
                            <p className="font-semibold text-gray-900">{initialAdults} Adults, {initialChildren} Children</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-semibold text-gray-900">{formData.paymentMethod === 'ONLINE' ? 'Online' : 'At Property'}</p>
                          </div>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-gray-600">{formatCurrency(room.price)} × {nights} nights</p>
                            <p className="text-gray-900 font-medium">{formatCurrency(totalPrice)}</p>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-lg font-bold text-gray-900">Total Price</p>
                            <p className="text-2xl font-bold text-amber-600">{formatCurrency(totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 rounded-xl p-4 flex items-start space-x-3">
                      <HiOutlineCheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900">
                        <strong>Cancellation Policy:</strong> Free cancellation up to 48 hours prior to check-in.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={prevStep} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition">
                    Back
                  </button>
                ) : <div />}
                
                {step < 4 ? (
                  <button onClick={nextStep} className="px-8 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-md">
                    Continue
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={loading} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition shadow-lg disabled:opacity-50 flex items-center space-x-2">
                    {loading ? "Confirming..." : "Confirm Booking"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
