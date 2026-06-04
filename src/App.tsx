/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import PortalView from './components/PortalView';
import AssessmentView from './components/AssessmentView';
import BookingView from './components/BookingView';
import { Sparkles, HeartPulse, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { audioEngine } from './utils/AudioEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  // Used to carry over selected treatments between catalog and reservation
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            setActiveTab={setActiveTab} 
            setSelectedTreatmentId={setSelectedTreatmentId}
          />
        );
      case 'services':
        return (
          <ServicesView 
            setActiveTab={setActiveTab} 
            selectedTreatmentId={selectedTreatmentId}
            setSelectedTreatmentId={setSelectedTreatmentId}
          />
        );
      case 'portal':
        return <PortalView />;
      case 'assessment':
        return (
          <AssessmentView 
            setActiveTab={setActiveTab} 
            setSelectedTreatmentId={setSelectedTreatmentId}
          />
        );
      case 'booking':
        return (
          <BookingView 
            selectedTreatmentId={selectedTreatmentId} 
            setSelectedTreatmentId={setSelectedTreatmentId}
          />
        );
      default:
        return <HomeView setActiveTab={setActiveTab} setSelectedTreatmentId={setSelectedTreatmentId} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-[#2E3A2F]">
      
      {/* 5-page Integrated Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Contents with Smooth Page Fade-in Transitions */}
      <main className="flex-grow pt-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Silent Editorial Footer */}
      <footer className="border-t border-[#EBE6DC] bg-[#FAF7F1] py-12 px-6 md:px-12 mt-20 text-[#8A8172]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 bg-[#2E3A2F] text-white rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-[#C5A880]" />
              </span>
              <h4 className="font-serif text-sm tracking-widest text-[#2E3A2F] font-bold">AETHERA</h4>
            </div>
            <p className="text-[11px] leading-relaxed">
              Merging antique elements of hot volcanic thermal basalt therapy, rich planetary soundwaves, mineral balneotherapy, and yogic respiration science.
            </p>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#2E3A2F]">Sanctuary Chapters</h5>
            <ul className="space-y-1.5 text-[11px]">
              {['Sanctuary Welcome', 'Clinical Therapies', 'Pranayama Core', 'Health Assessment', 'Reservation Drawer'].map((item, idx) => {
                const links = ['home', 'services', 'portal', 'assessment', 'booking'];
                return (
                  <li key={idx}>
                    <button 
                      onClick={() => {
                        audioEngine.playSingingBowl(220);
                        setActiveTab(links[idx]);
                      }}
                      className="hover:text-[#2E3A2F] transition-colors cursor-pointer text-left"
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#2E3A2F]">Sanctuary Hours</h5>
            <p className="text-[11px] leading-relaxed">
              Morning shift Solar: 07:00 AM — 01:00 PM <br />
              Evening shift Lunar: 02:00 PM — 09:00 PM <br />
              Open Sunday through Saturday.
            </p>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#2E3A2F]">Therapy Credentials</h5>
            <div className="text-[10px] leading-relaxed space-y-1 bg-[#F3ECE0] p-3 rounded-lg border border-[#E3DACF]">
              <span className="text-[#2E3A2F] font-bold block">● SECURED INTEGRATION STATUS</span>
              <span>Web Audio API active. High Fidelity 44.1kHz organic chime synthesis running securely on current client sandbox environment.</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#EBE6DC] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] space-y-4 sm:space-y-0">
          <span>&copy; 2026 Aethera Premium Wellness LLC. All therapeutic rights reserved.</span>
          <div className="flex space-x-6">
            <span className="hover:text-[#2E3A2F] cursor-pointer">Somatic Wavers</span>
            <span className="hover:text-[#2E3A2F] cursor-pointer">Privacy Charter</span>
            <span className="hover:text-[#2E3A2F] cursor-pointer">Terms of Peace</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
