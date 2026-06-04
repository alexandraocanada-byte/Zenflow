/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Play, Pause, RotateCcw, Volume2, Sparkles, AlertCircle, RefreshCw, BarChart2, Activity } from 'lucide-react';
import { BREATHING_PRESETS } from '../data';
import { BreathingPreset } from '../types';
import { audioEngine } from '../utils/AudioEngine';

export default function PortalView() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('b1');
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Timer & state indices
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest Hold'>('Inhale');
  const [timeRemaining, setTimeRemaining] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [showFinishedToast, setShowFinishedToast] = useState<boolean>(false);

  const activePreset = BREATHING_PRESETS.find(p => p.id === selectedPresetId) || BREATHING_PRESETS[0];

  // Keeping variables stable for state updates
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound mapping for breathing phases
  const playPhaseSound = (nextPhase: typeof phase) => {
    switch (nextPhase) {
      case 'Inhale':
        audioEngine.playSingingBowl(220); // Low peaceful A note
        break;
      case 'Hold':
        audioEngine.playSingingBowl(261.63); // Stable C note
        break;
      case 'Exhale':
        audioEngine.playSingingBowl(329.63); // Soft E note
        break;
      case 'Rest Hold':
        audioEngine.playSingingBowl(392.0); // Gentle G note
        break;
    }
  };

  // Preset swap triggers reset
  const handlePresetSelect = (id: string) => {
    audioEngine.playSingingBowl(349.23); // clean F trigger
    setSelectedPresetId(id);
    resetLoop();
  };

  // Reset function
  const resetLoop = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    setPhase('Inhale');
    const preset = BREATHING_PRESETS.find(p => p.id === selectedPresetId) || BREATHING_PRESETS[0];
    setTimeRemaining(preset.inhale);
  };

  const toggleTimer = () => {
    audioEngine.playSingingBowl(isActive ? 220 : 330);
    setIsActive(!isActive);
  };

  // Life loop timer
  useEffect(() => {
    if (isActive) {
      // Warm chime at trigger start
      if (sessionSeconds === 0) {
        playPhaseSound('Inhale');
      }

      // 1. Session total clock and math tracker
      sessionTimerRef.current = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);

      // 2. State cycle tracker
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // State division logic
            let nextPhase: typeof phase = 'Inhale';
            let nextDuration = 4;

            if (phase === 'Inhale') {
              if (activePreset.hold1 > 0) {
                nextPhase = 'Hold';
                nextDuration = activePreset.hold1;
              } else {
                nextPhase = 'Exhale';
                nextDuration = activePreset.exhale;
              }
            } else if (phase === 'Hold') {
              nextPhase = 'Exhale';
              nextDuration = activePreset.exhale;
            } else if (phase === 'Exhale') {
              if (activePreset.hold2 > 0) {
                nextPhase = 'Rest Hold';
                nextDuration = activePreset.hold2;
              } else {
                nextPhase = 'Inhale';
                nextDuration = activePreset.inhale;
                setCyclesCompleted(c => c + 1);
              }
            } else if (phase === 'Rest Hold') {
              nextPhase = 'Inhale';
              nextDuration = activePreset.inhale;
              setCyclesCompleted(c => c + 1);
            }

            // Play phase-specific singing bowl resonance
            playPhaseSound(nextPhase);
            setPhase(nextPhase);
            return nextDuration;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isActive, phase, activePreset, selectedPresetId]);

  // Synchronize dynamic values on initial loading
  useEffect(() => {
    setTimeRemaining(activePreset.inhale);
  }, [selectedPresetId]);

  // Calculate current scaling factor for the animated breathing orb
  const getOrbStyle = () => {
    if (!isActive) return { scale: 1.0, transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' };
    
    // Inhale -> expands to maximum size (1.6)
    // Hold -> remains large and glows
    // Exhale -> contracts back to minimal state (0.9)
    // Hold2 -> remains minimal
    switch (phase) {
      case 'Inhale':
        const inhalePercent = (activePreset.inhale - timeRemaining) / activePreset.inhale;
        return { 
          scale: 0.95 + (inhalePercent * 0.65), 
          backgroundColor: '#2E3A2F',
          boxShadow: `0 0 ${20 + inhalePercent * 40}px rgba(197, 168, 128, 0.35)`
        };
      case 'Hold':
        return { 
          scale: 1.6, 
          backgroundColor: '#242F25',
          boxShadow: '0 0 70px rgba(197, 168, 128, 0.5)'
        };
      case 'Exhale':
        const exhalePercent = timeRemaining / activePreset.exhale; // counts down to zero, so size contracts
        return { 
          scale: 0.9 + (exhalePercent * 0.7), 
          backgroundColor: '#3D4C3E',
          boxShadow: `0 0 ${15 + exhalePercent * 30}px rgba(197, 168, 128, 0.2)`
        };
      case 'Rest Hold':
        return { 
          scale: 0.9, 
          backgroundColor: '#1E2520',
          boxShadow: '0 0 10px rgba(197, 168, 128, 0.1)'
        };
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale': return 'Breath in slowly through your nose';
      case 'Hold': return 'Retain life-energy inside lungs';
      case 'Exhale': return 'Sigh out audibly through the mouth';
      case 'Rest Hold': return 'Rest in absolute emptiness';
    }
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
        <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Vagal Nerve Coherence Desk</span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#2E3A2F] font-bold">Pranayama breathing temple</h3>
        <p className="text-xs text-[#5E574F] leading-relaxed">
          Slowing breathing down to coherent ratios resets cardiovascular cycles, balances blood alkaline and ph values, and empties excessive cortical racing noise.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Preset Selection Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-[#F3ECE0] rounded-3xl p-6 border border-[#E3DACF] space-y-5">
            <div className="flex items-center space-x-1.5 text-[#2E3A2F]">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Select Conscious Rhythm</span>
            </div>

            <div className="space-y-3">
              {BREATHING_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <motion.button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`text-left p-4.5 rounded-2xl w-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E3A2F] text-[#FDFBF7] border-transparent shadow'
                        : 'bg-[#FDFBF7] text-[#1E221E] border-[#E5DFD4] hover:bg-[#F9F5EE]'
                    }`}
                  >
                    <h4 className="text-xs font-bold tracking-wide">{preset.name}</h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${isSelected ? 'text-[#D5CBB9]' : 'text-[#8A8172]'}`}>
                      {preset.description}
                    </p>
                    <div className="flex space-x-2 mt-3 text-[9px] font-mono tracking-wider uppercase opacity-85">
                      <span className="bg-black/10 px-2 py-0.5 rounded">In: {preset.inhale}s</span>
                      {preset.hold1 > 0 && <span className="bg-black/10 px-2 py-0.5 rounded">Hold: {preset.hold1}s</span>}
                      <span className="bg-black/10 px-2 py-0.5 rounded">Out: {preset.exhale}s</span>
                      {preset.hold2 > 0 && <span className="bg-black/10 px-2 py-0.5 rounded">Hold2: {preset.hold2}s</span>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Calming Telemetry Insights */}
          <div className="bg-[#FAF7F1] rounded-3xl p-6 border border-[#EBE6DC] space-y-4">
            <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] font-bold flex items-center space-x-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Diagnostic Session Progress:</span>
            </h5>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#FDFBF7] border border-[#EBE6DC] p-3 rounded-2xl">
                <span className="text-lg font-bold text-[#2E3A2F]">{cyclesCompleted}</span>
                <p className="text-[8px] font-mono text-[#8A8172] uppercase tracking-wider mt-1">Cycles Completed</p>
              </div>
              <div className="bg-[#FDFBF7] border border-[#EBE6DC] p-3 rounded-2xl">
                <span className="text-lg font-bold text-[#2E3A2F]">{sessionSeconds}s</span>
                <p className="text-[8px] font-mono text-[#8A8172] uppercase tracking-wider mt-1">Somatic Sync</p>
              </div>
              <div className="bg-[#FDFBF7] border border-[#EBE6DC] p-3 rounded-2xl">
                <span className="text-lg font-bold text-[#2E3A2F]">{(cyclesCompleted * 4.2).toFixed(1)}L</span>
                <p className="text-[8px] font-mono text-[#8A8172] uppercase tracking-wider mt-1">Oxygen Volume</p>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start space-x-2.5">
              <span className="text-teal-600 text-xs font-semibold mt-0.5">✦</span>
              <p className="text-[10px] text-teal-800 leading-snug">
                <span className="font-semibold uppercase tracking-wide">Physiologist Tip: </span>
                {activePreset.benefit}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Active Orb Visual Core (The breath loop) */}
        <div className="lg:col-span-7 bg-[#1E221E] rounded-3xl p-8 relative overflow-hidden shadow-lg flex flex-col items-center justify-between min-h-[480px]">
          {/* Constellation backdrops */}
          <div className="absolute inset-0 bg-dotted-pattern opacity-10" />

          {/* Telemetry labels */}
          <div className="w-full flex justify-between items-center text-white/30 text-[9px] font-mono uppercase tracking-widest z-10">
            <span>RHYTHM: {activePreset.name.split(' (')[0]}</span>
            <span className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-[#C5A880] animate-pulse" />
              <span>{isActive ? 'ACTIVE SYNAPTIC STABILIZATION' : 'IDLE SANCTUARY'}</span>
            </span>
          </div>

          {/* Central ORB */}
          <div className="my-auto py-12 relative flex items-center justify-center">
            {/* Visual background ripple effects */}
            {isActive && (
              <motion.div
                key={phase}
                className="absolute inset-0 rounded-full border border-[#C5A880]/15"
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            <motion.div
              style={getOrbStyle() as any}
              className="w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center text-[#FDFBF7] relative transition-all duration-1000 select-none z-10"
            >
              {/* Internal visual core display */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
                  {isActive ? phase : 'Ready'}
                </span>
                <h4 className="text-3xl md:text-4.5xl font-serif font-bold tracking-tight">
                  {isActive ? `${timeRemaining}s` : 'Soma'}
                </h4>
              </div>
            </motion.div>
          </div>

          {/* Controller buttons & action indicators */}
          <div className="w-full space-y-5 text-center flex flex-col items-center z-10">
            <div className="min-h-10 px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phase + isActive}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-[#D5CBB9] font-medium italic"
                >
                  {isActive ? getPhaseInstruction() : 'Click the tranquilization play switch to start therapeutic loop.'}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Controls panel */}
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetLoop}
                className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white/70 hover:text-white border border-white/10 cursor-pointer text-xs"
                title="Reset Session clock"
              >
                <RotateCcw className="h-4 w-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTimer}
                className="p-4 px-6 bg-[#C5A880] hover:bg-[#D4B991] text-[#1E221E] rounded-full font-serif font-bold text-xs tracking-wider uppercase flex items-center space-x-2 cursor-pointer shadow-lg"
              >
                {isActive ? (
                  <>
                    <Pause className="h-4 w-4 fill-current text-[#1E221E]" />
                    <span>Pause Healing</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current text-[#1E221E]" />
                    <span>Initiate Prana</span>
                  </>
                )}
              </motion.button>

              {/* Synthetic chime bell button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  audioEngine.playSingingBowl(220); // Tibetan bell at 220Hz
                }}
                className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-[#C5A880] border border-white/10 cursor-pointer text-xs"
                title="Sound Bell Manual"
              >
                <Volume2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

        </div>

      </div>

    </motion.div>
  );
}
