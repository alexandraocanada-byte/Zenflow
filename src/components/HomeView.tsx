/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, MapPin, ChevronRight, Star, HeartPulse, UserCheck, MessageSquare } from 'lucide-react';
import { HERO_COVER_IMAGE, TEAM_MEMBERS, GUEST_REVIEWS } from '../data';
import { audioEngine } from '../utils/AudioEngine';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setSelectedTreatmentId: (id: string | null) => void;
}

export default function HomeView({ setActiveTab, setSelectedTreatmentId }: HomeProps) {
  // Recommendation state
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [expandedTherapist, setExpandedTherapist] = useState<number | null>(null);

  const energyGoals = [
    { id: 'stress', title: 'Adrenaline Detox', icon: '🍃', therapyId: 't2', recommendation: 'Vibrational Sound Bath', description: 'Surrender to 75 minutes of cortical resonance cycles designed to ground high-stress nervous loops.' },
    { id: 'sleep', title: 'Deep Circadian Reset', icon: '🌌', therapyId: 't3', recommendation: 'Igneous Basalt Massage', description: 'Volcanic warmth slowly targeted down long spinal meridians triggers deep delta recovery states.' },
    { id: 'fatigue', title: 'Physical Restoration', icon: '🔥', therapyId: 't1', recommendation: 'Thermal Mineral Inhalation', description: 'Clear out systemic congestion and build cellular capacity in our warm mineral chambers.' },
    { id: 'skincare', title: 'Dermal Rejuvenation', icon: '✨', therapyId: 't5', recommendation: 'Ozone Active Orchid Facial', description: 'Infuse active, hyperbaric pure oxygen directly into dry epidermal layers for immediate skin clarity.' }
  ];

  // Sounds & Handlers
  const handleRecommendClick = (goal: typeof energyGoals[0]) => {
    audioEngine.playSingingBowl(349.23); // F note
    setSelectedGoal(goal.id);
  };

  const handleNextReview = () => {
    audioEngine.playSingingBowl(440); // A note
    setActiveReviewIndex((prev) => (prev + 1) % GUEST_REVIEWS.length);
  };

  const handlePrevReview = () => {
    audioEngine.playSingingBowl(415.3); // G# note
    setActiveReviewIndex((prev) => (prev === 0 ? GUEST_REVIEWS.length - 1 : prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-20 pb-20"
    >
      {/* 1. HERO SHOWCASE */}
      <section className="relative h-[80vh] min-h-[550px] w-full bg-[#1E221E] overflow-hidden rounded-t-3xl md:rounded-3xl shadow-xl flex items-center justify-center p-6 md:p-16">
        {/* Cinematic Backdrop Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_COVER_IMAGE}
            alt="Aethera Interior"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E221E] via-[#1E221E]/30 to-[#1E221E]/10" />
        </div>

        {/* Hero Copy Overlay */}
        <div className="relative z-10 max-w-4xl text-center space-y-6 md:space-y-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center space-x-2 bg-[#F3ECE0]/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10"
          >
            <Compass className="h-4 w-4 text-[#C5A880] animate-spin-slow" />
            <span className="text-[10px] uppercase tracking-widest text-[#E3DACF] font-mono font-medium">Reopen the connection with Self</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7.5xl text-[#FDFBF7] tracking-tight leading-none"
          >
            Somatic Sanctuaries <br />
            <span className="text-[#C5A880] italic font-normal">For Modern Mindsets</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-sm md:text-base text-[#D5CBB9] max-w-2xl leading-relaxed"
          >
            We deploy planetary harmonics, mineral thermal balneotherapy, and hot volcanic basalt systems to systematically calm hyper-aroused neural cycles and restore physical coherence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioEngine.playSingingBowl(293.66);
                setActiveTab('portal');
              }}
              className="bg-[#2E3A2F] text-[#FDFBF7] border border-[#2E3A2F] px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold cursor-pointer shadow-md hover:bg-[#3D4C3E] transition-all"
            >
              Enter Breathing Portal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                audioEngine.playSingingBowl(220);
                setActiveTab('services');
              }}
              className="bg-transparent text-[#FDFBF7] border border-white/20 hover:border-white/40 px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all"
            >
              Explore Somatic Therapies
            </motion.button>
          </motion.div>
        </div>

        {/* Dynamic bottom telemetry banner */}
        <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between z-10 border-t border-white/5 pt-4 text-white/40 text-[10px] font-mono uppercase tracking-widest bg-emerald-900/10 px-3 py-1 rounded-md backdrop-blur-xs">
          <span>COORDINATES: CLOUD SANCTUARY</span>
          <span>HUMAN VAGAL TONE: HARMONIC SYSTEM</span>
          <span>● PRESSURE: ACTIVE REST</span>
        </div>
      </section>

      {/* 2. THE RITUAL SELECTOR (DYNAMIC / CLICKABLE INTERACTIVE COMPONENT) */}
      <section className="bg-[#F3ECE0] rounded-3xl p-8 md:p-12 border border-[#E3DACF] max-w-7xl mx-auto shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center space-x-1.5 text-[#2E3A2F]">
              <Sparkles className="h-4 w-4" />
              <span className="text-[11px] font-mono tracking-widest uppercase font-semibold">Interactive Assistant</span>
            </div>
            <h3 className="font-serif text-3xl text-[#2E3A2F] font-bold tracking-tight">Somatic Symptom Diagnosis</h3>
            <p className="text-xs text-[#5E574F] leading-relaxed">
              Select your primary physical challenge below. Our assistant will isolate a clinically recommended wellness pathway and generate custom, direct routing options.
            </p>

            <div className="bg-[#FDFBF7]/80 rounded-2xl p-4 border border-[#EBE6DC] text-xs space-y-2 mt-4">
              <span className="font-mono text-[#8A8172] text-[10px] uppercase font-semibold tracking-wider">Sanctuary Location</span>
              <div className="flex items-center space-x-2 text-[#2E3A2F] font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#C5A880]" />
                <span>101 Solaria Peak Road, Pine Valley</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#8A8172]">Select your dominant state:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {energyGoals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <motion.button
                    key={g.id}
                    onClick={() => handleRecommendClick(g)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-start text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E3A2F] text-[#FDFBF7] border-transparent shadow'
                        : 'bg-[#FDFBF7] text-[#1E221E] border-[#E5DFD4] hover:bg-[#F9F5EE]'
                    }`}
                  >
                    <span className="text-2xl mr-3">{g.icon}</span>
                    <div>
                      <h4 className="text-xs font-semibold tracking-wide">{g.title}</h4>
                      <p className={`text-[10px] line-clamp-2 mt-1 ${isSelected ? 'text-[#C5A880]' : 'text-[#8A8172]'}`}>
                        Identify systemic imbalances
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Simulated AI Result recommendation card box */}
            <AnimatePresence mode="wait">
              {selectedGoal && (
                <motion.div
                  key={selectedGoal}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="bg-[#2E3A2F] text-[#FDFBF7] p-5 rounded-2xl border border-white/10 space-y-3.5"
                >
                  {(() => {
                    const goalObj = energyGoals.find(g => g.id === selectedGoal)!;
                    return (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] font-semibold flex items-center space-x-1">
                            <HeartPulse className="h-3 w-3 mr-1" /> Custom Prescription
                          </span>
                          <span className="text-[9px] font-mono text-white/50">MATCHED PATH: 94% ACCURACY</span>
                        </div>
                        <div>
                          <h4 className="font-serif text-lg text-[#FDFBF7] font-semibold">{goalObj.recommendation}</h4>
                          <p className="text-xs text-[#E3DACF] mt-1 leading-relaxed">
                            {goalObj.description}
                          </p>
                        </div>
                        <div className="flex justify-end pt-2">
                          <motion.button
                            whileHover={{ x: 3 }}
                            onClick={() => {
                              audioEngine.playSingingBowl(330);
                              setSelectedTreatmentId(goalObj.therapyId);
                              setActiveTab('services');
                            }}
                            className="inline-flex items-center space-x-1.5 text-xs text-[#C5A880] hover:text-[#D9BC93] font-medium uppercase tracking-wider cursor-pointer"
                          >
                            <span>Reserve Recommended Slot</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </motion.button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 3. PHILOSOPHY ROW */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Organic Philosophy</span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#2E3A2F] font-bold leading-tight">
            We bypass superficial aesthetics. We heal through bio-harmony.
          </h3>
          <p className="text-xs md:text-sm text-[#5E574F] leading-relaxed">
            Unlike commercial spas, Aethera treats stress as a physical biochemical footprint. By utilizing high-resonance acoustics, active ozone, heated volcanic mass, and specific respiratory intervals, we physically override the hyper-aroused flight indicators of the sympathetic chest loop.
          </p>
          <div className="space-y-4 pt-2">
            {[
              { t: 'Decentralized Nervous Tuning', c: 'Vibrational bowls reset alpha wavelengths in under 15 minutes.' },
              { t: 'Natural Element Delivery', c: 'We employ 100% pure thermal mountain minerals and bio-essential oil extracts.' },
              { t: 'Interactive Practitioner Oversight', c: 'Every medical session includes detailed individualized vital mapping.' }
            ].map((p, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <span className="text-[#C5A880] text-sm mt-0.5">✦</span>
                <div>
                  <h4 className="text-xs font-semibold text-[#2E3A2F] tracking-wide">{p.t}</h4>
                  <p className="text-[11px] text-[#8A8172] mt-0.5">{p.c}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#EBE6DC] shadow-md group">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=700&q=80"
            alt="Relaxed face"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-[#2E3A2F]/20 mix-blend-multiply" />
          <div className="absolute bottom-4 left-4 right-4 bg-[#FDFBF7]/90 backdrop-blur rounded-xl p-4 border border-[#E3DACF]">
            <span className="text-[9px] font-mono uppercase text-[#C5A880] font-bold">Solaria Sunset Sound Bath</span>
            <p className="text-[11px] text-[#5E574F] italic mt-1 leading-snug">
              \"The exact frequency for delta cortical synchronization is 220Hz. We play standard planetary brass on sunset pools.\"
            </p>
          </div>
        </div>
      </section>

      {/* 4. MASTER THERAPISTS CLINIC */}
      <section className="bg-[#FAF7F1] py-16 px-6 md:px-12 border-y border-[#EBE6DC]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">The Care Team</span>
            <h3 className="font-serif text-3xl text-[#2E3A2F] font-bold">Master Healing Guides</h3>
            <p className="text-xs text-[#8A8172]">
              Every ritual is governed by clinical somatic clinicians with a minimum of ten years of residency in holistic health research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
            {TEAM_MEMBERS.map((member, idx) => {
              const isExpanded = expandedTherapist === idx;
              return (
                <motion.div
                  key={member.name}
                  layout
                  className="bg-[#FDFBF7] rounded-2xl p-5 border border-[#E5DFD4] space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border border-[#C5A880]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#2E3A2F] tracking-wide">{member.name}</h4>
                      <p className="text-[10px] font-mono text-[#C5A880] uppercase font-semibold">{member.role}</p>
                    </div>
                  </div>
                  
                  {/* Bio expand */}
                  <motion.div layout className="text-xs text-[#5E574F] leading-relaxed">
                    {isExpanded ? member.description : `${member.description.slice(0, 105)}...`}
                  </motion.div>

                  <div className="flex justify-between items-center pt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        audioEngine.playSingingBowl(440);
                        setExpandedTherapist(isExpanded ? null : idx);
                      }}
                      className="text-[10px] tracking-wider uppercase font-semibold text-[#2E3A2F] hover:text-[#C5A880] flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Credentials' : 'View Credentials'}</span>
                      <UserCheck className="h-3 w-3 ml-1" />
                    </motion.button>

                    <span className="text-[8.5px] font-mono text-[#8A8172] bg-[#FAF7F1] px-2 py-0.5 rounded border border-[#EBE6DC]">
                      15+ YR EXP
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS SLIDER */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-10">
        <div className="inline-flex items-center space-x-1.5 text-[#C5A880]">
          <MessageSquare className="h-4.5 w-4.5" />
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold">Resonant Stories</span>
        </div>

        <div className="relative h-44 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReviewIndex}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <p className="font-serif text-lg sm:text-xl text-[#2E3A2F] leading-relaxed italic pr-4 pl-4 max-w-2xl mx-auto">
                \"{GUEST_REVIEWS[activeReviewIndex].review}\"
              </p>
              <div>
                <h5 className="text-xs font-bold text-[#1E221E] tracking-wide">
                  {GUEST_REVIEWS[activeReviewIndex].name}
                </h5>
                <p className="text-[10px] font-mono text-[#8A8172] uppercase">
                  {GUEST_REVIEWS[activeReviewIndex].origin}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Indicator & Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevReview}
            className="p-2 bg-[#F3ECE0] hover:bg-[#EAE2D4] rounded-full text-[#2E3A2F] border border-[#D5CBB9] cursor-pointer text-xs"
          >
            ←
          </motion.button>
          
          <div className="flex space-x-1.5">
            {GUEST_REVIEWS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioEngine.playSingingBowl(330);
                  setActiveReviewIndex(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  activeReviewIndex === idx ? 'w-4 bg-[#2E3A2F]' : 'bg-[#D5CBB9]'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextReview}
            className="p-2 bg-[#F3ECE0] hover:bg-[#EAE2D4] rounded-full text-[#2E3A2F] border border-[#D5CBB9] cursor-pointer text-xs"
          >
            →
          </motion.button>
        </div>
      </section>
    </motion.div>
  );
}
