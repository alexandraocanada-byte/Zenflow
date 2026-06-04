/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, DollarSign, ArrowRight, ShieldCheck, HelpCircle, X, ChevronRight, Activity, Calendar } from 'lucide-react';
import { TREATMENTS } from '../data';
import { Treatment } from '../types';
import { audioEngine } from '../utils/AudioEngine';

interface ServicesProps {
  setActiveTab: (tab: string) => void;
  setSelectedTreatmentId: (id: string | null) => void;
  selectedTreatmentId: string | null;
}

export default function ServicesView({ setActiveTab, setSelectedTreatmentId, selectedTreatmentId }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [modalDetailsId, setModalDetailsId] = useState<string | null>(null);

  // Categories available
  const categories = ['All', 'Hydrotherapy', 'Sound Healing', 'Massage', 'Aromatherapy', 'Skincare'];

  // Handle clicking direct category tabs
  const handleCategoryChange = (cat: string) => {
    audioEngine.playSingingBowl(349.23); // F note for crisp high feedback
    setActiveCategory(cat);
  };

  // Safe tracking of open parameter
  useEffect(() => {
    if (selectedTreatmentId) {
      setModalDetailsId(selectedTreatmentId);
    }
  }, [selectedTreatmentId]);

  const handleCloseModal = () => {
    audioEngine.playSingingBowl(220); // Low A hum
    setModalDetailsId(null);
    setSelectedTreatmentId(null);
  };

  const handleRouteToBook = (therapyId: string) => {
    audioEngine.playSingingBowl(440); // Sound feedback
    setSelectedTreatmentId(therapyId);
    setModalDetailsId(null);
    setActiveTab('booking');
  };

  const filteredTreatments = activeCategory === 'All' 
    ? TREATMENTS 
    : TREATMENTS.filter(t => t.category === activeCategory);

  const selectedTherapy = TREATMENTS.find(t => t.id === modalDetailsId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5 }}
      className="space-y-12 pb-20 max-w-7xl mx-auto px-4"
    >
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Catalog of Curated Rituals</span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#2E3A2F] font-bold">Signature Clinical Modalities</h3>
        <p className="text-xs text-[#5E574F] leading-relaxed">
          Please explore our physical restoration procedures. Select any therapy card to inspect medical reports, cellular benefits, and direct booking calendars.
        </p>
      </div>

      {/* Filter Menu */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-[#EBE6DC] pb-5">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <motion.button
              key={cat}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-full cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#2E3A2F] text-[#FDFBF7] shadow-sm font-semibold'
                  : 'bg-[#F3ECE0]/60 hover:bg-[#FAF7F1] text-[#5E574F] border border-[#E3DACF]'
              }`}
            >
              {cat}
            </motion.button>
          );
        })}
      </div>

      {/* Real-time Cards Layout */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredTreatments.map((therapy) => (
            <motion.div
              layout
              id={`therapy-card-${therapy.id}`}
              key={therapy.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              onClick={() => {
                audioEngine.playSingingBowl(293.66); // Rich note when selecting detailed panel
                setModalDetailsId(therapy.id);
              }}
              className="bg-[#FDFBF7] rounded-2xl border border-[#E5DFD4] overflow-hidden group cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Media frame */}
                <div className="h-48 relative overflow-hidden bg-[#FAF7F1] border-b border-[#E5DFD4]">
                  <img
                    src={therapy.image}
                    alt={therapy.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#FAF7F1]/90 backdrop-blur px-2.5 py-0.5 rounded-full text-[9px] uppercase font-mono tracking-widest text-[#2E3A2F] font-semibold">
                    {therapy.category}
                  </div>
                </div>

                {/* Narrative */}
                <div className="p-5.5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#8A8172]">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-[#C5A880]" />
                      <span>{therapy.duration} MINUTES</span>
                    </span>
                    <span className="flex items-center space-x-0.5 font-bold text-[#2E3A2F]">
                      <DollarSign className="h-3 w-3" />
                      <span>{therapy.price} USD</span>
                    </span>
                  </div>

                  <h4 className="font-serif text-lg text-[#2E3A2F] font-bold group-hover:text-[#C5A880] transition-colors leading-snug">
                    {therapy.title}
                  </h4>
                  <p className="text-[11px] text-[#5E574F] leading-relaxed line-clamp-3">
                    {therapy.description}
                  </p>
                </div>
              </div>

              {/* Action indicators */}
              <div className="p-5.5 pt-0 flex justify-between items-center border-t border-[#FAF7F1]">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#C5A880] font-bold">
                  Inspect Ritual Reports
                </span>
                <span className="h-6 w-6 rounded-full bg-[#FAF7F1] flex items-center justify-center text-[#2E3A2F] group-hover:bg-[#2E3A2F] group-hover:text-[#FDFBF7] transition-all">
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* MODAL DISPLAY DRAMATIC DRAWER */}
      <AnimatePresence>
        {selectedTherapy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#FDFBF7] rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-[#D5CBB9] relative overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Escape control button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#FAF7F1] cursor-pointer text-[#8A8172] transition-colors"
                id="close-services-modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title & Classification */}
              <div className="space-y-1.5 pr-8">
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#C5A880] font-bold bg-[#FAF7F1] border border-[#E3DACF] px-2.5 py-0.5 rounded-full">
                  {selectedTherapy.category} Specialist Care
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#2E3A2F] font-bold">
                  {selectedTherapy.title}
                </h3>
              </div>

              {/* Image banner display */}
              <div className="h-52 md:h-64 rounded-2xl overflow-hidden relative border border-[#E5DFD4]">
                <img
                  src={selectedTherapy.image}
                  alt={selectedTherapy.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center space-x-4 text-[#FDFBF7] text-xs font-mono">
                  <span className="bg-[#2E3A2F]/90 px-3 py-1 rounded-full">{selectedTherapy.duration} Mins</span>
                  <span className="bg-[#C5A880]/90 text-black px-3 py-1 rounded-full font-bold">${selectedTherapy.price} USD</span>
                </div>
              </div>

              {/* Paragraph details */}
              <div className="space-y-2">
                <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#8A8172] font-semibold">
                  Aura Description & Process
                </h5>
                <p className="text-xs text-[#5E574F] leading-relaxed">
                  {selectedTherapy.description}
                </p>
              </div>

              {/* Medical and body biological benefits */}
              <div className="space-y-3.5">
                <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#2E3A2F] font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>Verified Cellular Benefits:</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedTherapy.benefits.map((b, i) => (
                    <div key={i} className="bg-[#FAF7F1] border border-[#EBE6DC] p-3 rounded-xl text-[11px] text-[#2E3A2F] leading-tight flex items-start space-x-1.5">
                      <span className="text-[#C5A880] text-xs font-semibold">✦</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive bottom checkout links */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#EBE6DC] gap-4">
                <div className="flex items-center space-x-2 text-[10px] font-mono text-[#8A8172]">
                  <Activity className="h-3.5 w-3.5 text-[#2E3A2F]" />
                  <span>SYSTEM REGISTERED CAPABILITY AVAILABLE</span>
                </div>

                <div className="flex space-x-2.5 w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCloseModal}
                    className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl border border-[#D5CBB9] text-xs font-semibold text-[#5E574F] hover:bg-[#FAF7F1] cursor-pointer"
                  >
                    Return
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRouteToBook(selectedTherapy.id)}
                    className="flex-1 sm:flex-none py-2.5 px-6 rounded-xl bg-[#2E3A2F] text-[#FDFBF7] text-xs font-bold font-mono tracking-wider uppercase transition-colors shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Secure Booking</span>
                  </motion.button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
