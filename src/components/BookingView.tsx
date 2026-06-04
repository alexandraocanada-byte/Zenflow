/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Calendar, CheckSquare, Plus, CheckCircle2, Trash2, ShieldCheck, Mail, User, Info, DollarSign } from 'lucide-react';
import { TREATMENTS } from '../data';
import { Booking, AppNotification } from '../types';
import { getLocalBookings, saveLocalBooking, saveLocalNotification } from '../utils/storage';
import { audioEngine } from '../utils/AudioEngine';

interface BookingProps {
  selectedTreatmentId: string | null;
  setSelectedTreatmentId: (id: string | null) => void;
}

export default function BookingView({ selectedTreatmentId, setSelectedTreatmentId }: BookingProps) {
  // Booking Form State
  const [therapyId, setTherapyId] = useState<string>(selectedTreatmentId || TREATMENTS[0].id);
  const [bookDate, setBookDate] = useState<string>('2026-06-04');
  const [selectedSlot, setSelectedSlot] = useState<string>('02:00 PM - Deep Tissue Spine');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState('jundrilcantiveros@gmail.com');
  const [customerNotes, setCustomerNotes] = useState('');
  
  // Custom add-ons state
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  
  // History and success trigger
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [recentBooking, setRecentBooking] = useState<Booking | null>(null);

  // Sync when preselection triggers
  useEffect(() => {
    if (selectedTreatmentId) {
      setTherapyId(selectedTreatmentId);
    }
  }, [selectedTreatmentId]);

  // Load existing bookings on mount
  useEffect(() => {
    setMyBookings(getLocalBookings());
  }, []);

  const timeSlots = [
    '09:00 AM - Sunrise Release',
    '11:30 AM - Meridian Flow',
    '02:00 PM - Deep Tissue Spine',
    '04:30 PM - Sound Bath Sunset',
    '07:00 PM - Starry Inhalation'
  ];

  const addOnDetails = [
    { name: 'Organic Infusion Tea Pairing', price: 15, desc: 'We brew clinical chamomile extract served with raw peak pine honey.' },
    { name: 'Private Geothermal Salt Room', price: 35, desc: 'A exclusive 30-minute hyperbaric dry salt chamber inhalation.' },
    { name: 'Micro-Steam Sensory Isolation', price: 45, desc: 'Soak in individual herbal mist steam before active diagnostic massage.' }
  ];

  const activeTherapy = TREATMENTS.find(t => t.id === therapyId) || TREATMENTS[0];

  // Recalculate dynamic cost
  const calculatedAddOnCosts = selectedAddOns.reduce((total, addOnName) => {
    const detail = addOnDetails.find(a => a.name === addOnName);
    return total + (detail ? detail.price : 0);
  }, 0);

  const totalPrice = activeTherapy.price + calculatedAddOnCosts;

  // Handles
  const handleToggleAddOn = (name: string) => {
    audioEngine.playSingingBowl(329.63); // E chime
    if (selectedAddOns.includes(name)) {
      setSelectedAddOns(selectedAddOns.filter(item => item !== name));
    } else {
      setSelectedAddOns([...selectedAddOns, name]);
    }
  };

  const handleSlotSelect = (slot: string) => {
    audioEngine.playSingingBowl(293.66); // D chime
    setSelectedSlot(slot);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      audioEngine.playSingingBowl(150); // Warning tone
      return;
    }

    // Play profound singing bowl sound
    audioEngine.playSingingBowl(220); // Low A hum
    setTimeout(() => {
       audioEngine.playSingingBowl(440); // high harmony!
    }, 400);

    const bookingPayload: Booking = {
      id: `bk-${Date.now()}`,
      serviceId: therapyId,
      date: bookDate,
      timeSlot: selectedSlot,
      addOns: [...selectedAddOns],
      customerName,
      customerEmail,
      notes: customerNotes,
      totalPrice,
      createdAt: new Date().toLocaleDateString()
    };

    const updated = saveLocalBooking(bookingPayload);
    setMyBookings(updated);
    setRecentBooking(bookingPayload);
    setShowSuccessModal(true);

    // Save corresponding notification email message
    try {
      const therapy = TREATMENTS.find(t => t.id === therapyId) || TREATMENTS[0];
      const newNotif: AppNotification = {
        id: `notif-bk-${Date.now()}`,
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        subject: `Your Sacred Sanctuary Ritual Reservation [${bookingPayload.id.toUpperCase()}]`,
        message: `Dear ${customerName},\n\nYour session for ${therapy.title} has been successfully scheduled for ${bookDate} during the ${selectedSlot.split(' - ')[0]} shift.\n\nDetails:\n- Scheduled: ${bookDate} @ ${selectedSlot}\n- Estimated Price: $${totalPrice} USD\n- Custom Add-Ons: ${selectedAddOns.length > 0 ? selectedAddOns.join(', ') : 'None'}\n- Personal Notes: ${customerNotes || 'No special requests submitted'}\n\nWe look forward to welcoming you to the Aethera Sanctuary Space.\n\nWarm regards,\nAethera Holistic Team`,
        recipientEmail: customerEmail,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
        isRead: false,
        bookingId: bookingPayload.id
      };
      saveLocalNotification(newNotif);
      window.dispatchEvent(new Event('aethera_notifications_updated'));
    } catch (err) {
      console.error('Error generating reservation email notification:', err);
    }

    // Clear form
    setCustomerNotes('');
    setSelectedAddOns([]);
  };

  const handleCancelReservation = (id: string) => {
    audioEngine.playSingingBowl(150); // Warning chime

    const current = getLocalBookings();
    const target = current.find(b => b.id === id);
    const filtered = current.filter(b => b.id !== id);
    localStorage.setItem('aethera_salon_appointments', JSON.stringify(filtered));
    setMyBookings(filtered);

    if (target) {
      try {
        const therapy = TREATMENTS.find(t => t.id === target.serviceId) || TREATMENTS[0];
        const cancelNotif: AppNotification = {
          id: `notif-cancel-${Date.now()}`,
          type: 'sanctuary_alert',
          title: 'Booking Cancelled',
          subject: `Cancellation Confirmation: ${therapy.title} [${id.toUpperCase()}]`,
          message: `Dear ${target.customerName},\n\nThis message confirms that your sanctuary reservation for ${therapy.title} scheduled on ${target.date} was successfully cancelled.\n\nIf this was done in error or you want to reschedule your holistic treatment, please visit our Reservation Desk or contact our concierge.\n\nWarm regards,\nAethera Holistic Team`,
          recipientEmail: target.customerEmail,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString(),
          isRead: false,
          bookingId: id
        };
        saveLocalNotification(cancelNotif);
        window.dispatchEvent(new Event('aethera_notifications_updated'));
      } catch (err) {
        console.error('Cancellation notification delivery error:', err);
      }
    }
  };

  const closeSuccessAndFinish = () => {
    audioEngine.playSingingBowl(220);
    setShowSuccessModal(false);
    setSelectedTreatmentId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-20 max-w-7xl mx-auto px-4"
    >
      {/* Editorial Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Secure Sanctuary Slots</span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#2E3A2F] font-bold">The Reservation Desk</h3>
        <p className="text-xs text-[#5E574F] leading-relaxed">
          Please input security details, customize aromatherapy blends, and lock therapeutic time slots. Payments are completed safely at sanctuary checkout desks during arrival.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Reservation Inputs Form (Left side) */}
        <form onSubmit={handleSubmitBooking} className="lg:col-span-7 bg-[#F3ECE0] rounded-3xl p-6 md:p-8 border border-[#E3DACF] space-y-6 shadow-sm">
          <div className="flex items-center space-x-1.5 text-[#2E3A2F]">
            <Calendar className="h-4.5 w-4.5 text-[#C5A880]" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Ritual Specifications:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Treatment Selector */}
            <div className="space-y-1.5Col">
              <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#5E574F] block">Select Core Therapy</label>
              <select
                value={therapyId}
                onChange={(e) => {
                  audioEngine.playSingingBowl(349.23);
                  setTherapyId(e.target.value);
                }}
                className="w-full bg-[#FDFBF7] border border-[#E3DACF] rounded-xl px-3.5 py-3 text-xs text-[#2E3A2F] focus:outline-none focus:border-[#C5A880] transition-colors"
              >
                {TREATMENTS.map(t => (
                  <option key={t.id} value={t.id}>{t.title} (${t.price} USD)</option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#5E574F] block">Preferred Attendance Date</label>
              <input
                type="date"
                min="2026-06-04"
                max="2026-06-30"
                value={bookDate}
                onChange={(e) => {
                  audioEngine.playSingingBowl(220);
                  setBookDate(e.target.value);
                }}
                className="w-full bg-[#FDFBF7] border border-[#E3DACF] rounded-xl px-3.5 py-2.5 text-xs text-[#2E3A2F] focus:outline-none focus:border-[#C5A880] transition-colors"
                required
              />
            </div>
          </div>

          {/* Time Slot Chips list */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#5E574F] block">Available Time Slots / Shifts</span>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <motion.button
                    type="button"
                    key={slot}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotSelect(slot)}
                    className={`px-3 py-2 text-[10px] uppercase tracking-wide rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#2E3A2F] text-[#FDFBF7] border-transparent shadow-sm font-semibold'
                        : 'bg-[#FDFBF7] text-[#1E221E] border-[#E3DACF] hover:bg-[#FAF7F1]'
                    }`}
                  >
                    {slot.split(' - ')[0]}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Addons checkbox cards */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#5E574F] block">Botanical Custom Add-ons</span>
            <div className="grid grid-cols-1 gap-2.5">
              {addOnDetails.map((addOn) => {
                const isChecked = selectedAddOns.includes(addOn.name);
                return (
                  <div
                    key={addOn.name}
                    onClick={() => handleToggleAddOn(addOn.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                      isChecked
                        ? 'bg-[#E3EFE3] border-emerald-500/50'
                        : 'bg-[#FDFBF7] border-[#E3DACF] hover:bg-[#F9F5EE]'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <h5 className="text-xs font-semibold text-[#2E3A2F]">{addOn.name}</h5>
                      <p className="text-[10px] text-[#8A8172] leading-snug">{addOn.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-[#2E3A2F]">
                      <span className="text-xs font-mono font-bold text-teal-800">+${addOn.price}</span>
                      <span className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center ${isChecked ? 'bg-[#2E3A2F] text-white border-transparent' : 'border-[#D5CBB9]'}`}>
                        {isChecked && '✓'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer vital details */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#5E574F] block">Customer Vital Credentials</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#8A8172]">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E3DACF] rounded-xl px-10 py-2.5 text-xs text-[#2E3A2F] focus:outline-none focus:border-[#C5A880] transition-colors"
                  required
                />
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#8A8172]">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#E3DACF] rounded-xl px-10 py-2.5 text-xs text-[#2E3A2F] focus:outline-none focus:border-[#C5A880] transition-colors"
                  required
                />
              </div>
            </div>

            <textarea
              placeholder="List any physical alignments, structural pains, skin sensitivity report, or therapist gender preferences..."
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E3DACF] rounded-xl px-4 py-3 text-xs text-[#2E3A2F] focus:outline-none focus:border-[#C5A880] transition-colors h-18"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 bg-[#2E3A2F] text-[#FDFBF7] rounded-xl text-xs font-bold font-mono tracking-widest uppercase transition-colors hover:bg-[#3D4C3E] cursor-pointer shadow flex items-center justify-center space-x-1.5"
          >
            <span>Transcribe Sanctuary Request</span>
          </motion.button>
        </form>

        {/* Invoice Summary (Right side) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF7F1] rounded-3xl p-6.5 border border-[#EBE6DC] space-y-5 shadow-sm">
            <h4 className="font-serif text-lg text-[#2E3A2F] pb-3 border-b border-[#EBE6DC] font-bold">
              Attendance Balance sheet
            </h4>

            {/* active treatment brief */}
            <div className="space-y-3.5">
              <div className="flex justify-between text-xs font-medium text-[#2E3A2F]">
                <span>{activeTherapy.title} ({activeTherapy.category})</span>
                <span className="font-mono font-bold">${activeTherapy.price} USD</span>
              </div>
              <p className="text-[11px] text-[#8A8172] leading-snug">
                Duration: {activeTherapy.duration} Minutes of uninterrupted clinical therapy.
              </p>
            </div>

            {/* selected addons display */}
            {selectedAddOns.length > 0 && (
              <div className="space-y-2 border-t border-dashed border-[#EBE6DC] pt-3.5">
                <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-[#8A8172]">Customized Additions:</span>
                {selectedAddOns.map((addOnName) => {
                  const detail = addOnDetails.find(a => a.name === addOnName);
                  return (
                    <div key={addOnName} className="flex justify-between items-center text-[11px] text-[#5E574F]">
                      <span>✦ {addOnName}</span>
                      <span className="font-mono">${detail?.price} USD</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* total display */}
            <div className="border-t border-[#EBE6DC] pt-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#8A8172] font-semibold block">Total Estimated Cost</span>
                <span className="text-[10px] text-emerald-800 tracking-wide block leading-none font-bold mt-1">Payable upon arrival</span>
              </div>
              <span className="text-3xl font-serif font-bold text-[#2E3A2F] flex items-center">
                <DollarSign className="h-5 w-5 text-[#C5A880]" />
                <span>{totalPrice}</span>
              </span>
            </div>

            {/* Safe certificate */}
            <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#FAF7F1] flex items-start space-x-2 text-[10px] text-[#5E574F]">
              <ShieldCheck className="h-4 w-4 text-[#C5A880] mt-0.5" />
              <span>Complimentary organic tea and thermal sauna boots included on every core ticket selection.</span>
            </div>
          </div>

          {/* Secure disclaimer support */}
          <div className="bg-[#F3ECE0]/50 p-4 rounded-2xl border border-[#E3DACF] text-[10px] text-[#8A8172] leading-normal flex items-start space-x-2.5">
            <Info className="h-4 w-4 text-[#C5A880] flex-shrink-0" />
            <span>Canceling/rescheduling requires 24 hours notice. Undergoing active physical thermal sessions requires compliance with center health waiver.</span>
          </div>
        </div>

      </div>

      {/* HISTORIC APPOINTMENTS LOGS */}
      {myBookings.length > 0 && (
        <section className="bg-[#FDFBF7] rounded-3xl p-6 md:p-8 border border-[#E5DFD4] space-y-6">
          <div className="flex items-center space-x-1.5 text-[#2E3A2F] pb-2 border-b border-[#FAF7F1]">
            <CheckSquare className="h-4.5 w-4.5 text-[#C5A880]" />
            <h4 className="font-serif text-xl font-bold">Reserving Sanctuary Diary ({myBookings.length})</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EBE6DC] text-[#8A8172] uppercase font-mono text-[9px] tracking-wider pb-2">
                  <th className="py-2.5 font-bold">Core Ritual</th>
                  <th className="py-2.5 font-bold">Schedule Shift</th>
                  <th className="py-2.5 font-bold">Guest Detail</th>
                  <th className="py-2.5 font-bold text-right">Invoice Sum</th>
                  <th className="py-2.5 text-right font-bold pr-2">Abrogate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAF7F1]">
                {myBookings.map((b) => {
                  const therapy = TREATMENTS.find(t => t.id === b.serviceId) || TREATMENTS[0];
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF7F1]/50 text-[#2E3A2F]">
                      <td className="py-3 font-semibold">
                        {therapy.title}
                        <span className="block text-[10px] font-mono text-[#8A8172] font-normal">{therapy.category} Procedure</span>
                      </td>
                      <td className="py-3 font-mono">
                        {b.date}
                        <span className="block text-[10px] text-[#8A8172] font-normal">{b.timeSlot}</span>
                      </td>
                      <td className="py-3">
                        {b.customerName}
                        <span className="block text-[10px] text-[#8A8172] font-normal">{b.customerEmail}</span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold font-medium text-emerald-800">
                        ${b.totalPrice} USD
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleCancelReservation(b.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 cursor-pointer"
                          title="Cancel Reservation Ticket"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CONFETTI SUCCESS INTERACTIVE MODAL */}
      <AnimatePresence>
        {showSuccessModal && recentBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="bg-[#2E3A2F] text-[#FDFBF7] p-6 md:p-8 rounded-3xl max-w-md w-full border border-white/10 text-center space-y-6 relative overflow-hidden"
            >
              {/* background lighting details */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.15),transparent)] pointer-events-none" />

              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-[#C5A880] text-black rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">Ritual Log Transcribed</h3>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase">RESERVATION CODE: {recentBooking.id.toUpperCase()}</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 text-left text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/50">Core Healing:</span>
                  <span className="font-semibold text-white">
                    {(() => {
                      const t = TREATMENTS.find(tr => tr.id === recentBooking.serviceId);
                      return t ? t.title : '';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Appointment Shift:</span>
                  <span className="font-mono text-white">{recentBooking.date} / {recentBooking.timeSlot.split(' - ')[0]}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-white/50">Primary Guest:</span>
                  <span className="text-white">{recentBooking.customerName}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white/50 font-bold">Checkout Price Estimator:</span>
                  <span className="text-[#C5A880] font-mono text-lg font-bold">${recentBooking.totalPrice} USD</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200/80 leading-relaxed italic pr-2 pl-2">
                \"We have registered your session. A secure physical wellness voucher has been transmitted to your credentials list. Relax, prepare, and reside in calm.\"
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={closeSuccessAndFinish}
                className="w-full py-3 bg-[#C5A880] text-[#1E221E] font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer hover:bg-[#D7BA91] shadow-md transition-colors"
              >
                Enter Sanctuary Hall
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
