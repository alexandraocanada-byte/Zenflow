/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, HelpCircle, ArrowRight, RefreshCw, Star, Heart, CheckCircle2, ShieldAlert } from 'lucide-react';
import { QUIZ_QUESTIONS, TREATMENTS } from '../data';
import { AssessmentResult, QuizQuestion } from '../types';
import { saveLocalAssessment, getLocalAssessment } from '../utils/storage';
import { audioEngine } from '../utils/AudioEngine';

interface AssessmentProps {
  setActiveTab: (tab: string) => void;
  setSelectedTreatmentId: (id: string | null) => void;
}

export default function AssessmentView({ setActiveTab, setSelectedTreatmentId }: AssessmentProps) {
  // Assessment state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, { score: number; tip: string; val: string }>>({});
  const [activeResult, setActiveResult] = useState<AssessmentResult | null>(null);

  // Load existing results on mount
  useEffect(() => {
    const saved = getLocalAssessment();
    if (saved) {
      setActiveResult(saved);
    }
  }, []);

  const totalSteps = QUIZ_QUESTIONS.length;
  const currentQuestionIdx = currentStep;
  const activeQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (option: typeof activeQuestion.options[0], optionVal: string) => {
    audioEngine.playSingingBowl(329.63); // E note for selection chime

    // Update answer
    const newAnswers = {
      ...answers,
      [activeQuestion.id]: {
        score: option.score,
        tip: option.tip,
        val: optionVal
      }
    };
    setAnswers(newAnswers);

    // Stagger step increment
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(c => c + 1);
        audioEngine.playSingingBowl(349.23); // F note for next layout transition
      } else {
        // Compute Results!
        calculateHolisticResult(newAnswers);
      }
    }, 450);
  };

  const calculateHolisticResult = (completedAnswers: typeof answers) => {
    audioEngine.playSingingBowl(440); // A high-end completion tone!

    // Compute metric score per categories
    let mindfulnessSum = 0;
    let sleepSum = 0;
    let vitalitySum = 0;
    let stressSum = 0;

    QUIZ_QUESTIONS.forEach((q) => {
      const ans = completedAnswers[q.id];
      if (ans) {
        if (q.category === 'mindfulness') mindfulnessSum = ans.score;
        else if (q.category === 'sleep') sleepSum = ans.score;
        else if (q.category === 'vitality') vitalitySum = ans.score;
        else if (q.category === 'stress') stressSum = ans.score;
      }
    });

    // Translate score out of 4 into a 100-basis score
    const mapToPercent = (score: number) => {
      if (score === 4) return 95;
      if (score === 3) return 75;
      if (score === 2) return 50;
      return 25;
    };

    const scores = {
      mindfulness: mapToPercent(mindfulnessSum || 3),
      sleep: mapToPercent(sleepSum || 3),
      vitality: mapToPercent(vitalitySum || 3),
      stress: mapToPercent(stressSum || 3)
    };

    // Overall holistic balance average
    const overallIndex = Math.round(
      (scores.mindfulness + scores.sleep + scores.vitality + (100 - scores.stress)) / 4
    );

    // Extract advice tips based on answers
    const remedies: string[] = [];
    QUIZ_QUESTIONS.forEach((q) => {
      const ans = completedAnswers[q.id];
      if (ans && ans.score < 4) {
        remedies.push(ans.tip);
      }
    });
    
    if (remedies.length === 0) {
      remedies.push('Your health reserves are pristine! Continue taking daily 5-minute cold air nature walks.');
    }

    // Recommendation rules logic matching treatment ideas
    const recommendedTreatments: string[] = [];
    if (scores.stress > 60) {
      recommendedTreatments.push('t2'); // Sound Bath
    }
    if (scores.sleep < 60) {
      recommendedTreatments.push('t3'); // Basalt Massage
    }
    if (scores.vitality < 65) {
      recommendedTreatments.push('t1'); // Inhalation
    }
    if (recommendedTreatments.length === 0) {
      recommendedTreatments.push('t4'); // Somatic Aromatherapy
    }

    const calculatedResult: AssessmentResult = {
      scores,
      overallIndex,
      remedies,
      recommendedTreatments
    };

    setActiveResult(calculatedResult);
    saveLocalAssessment(calculatedResult);
  };

  const handleResetAssessment = () => {
    audioEngine.playSingingBowl(220);
    setAnswers({});
    setCurrentStep(0);
    setActiveResult(null);
    localStorage.removeItem('aethera_health_result');
  };

  // Render SVG concentric diagnostic circles
  const renderSVGGauge = (indexValue: number) => {
    // Circle definitions
    const radius = 64;
    const circumference = Math.PI * 2 * radius;
    const strokeDashoffset = circumference - (indexValue / 100) * circumference;

    return (
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-[#EBE6DC] fill-transparent"
            strokeWidth="8px"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-[#C5A880] fill-transparent"
            strokeWidth="8px"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>

        <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl font-bold text-[#2E3A2F]">{indexValue}%</span>
          <span className="text-[8px] font-mono tracking-widest text-[#8A8172] uppercase font-bold mt-1">Holistic Sync</span>
        </div>
      </div>
    );
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
        <span className="text-[10px] font-mono tracking-widest text-[#C5A880] uppercase font-bold">Holistic Health Diagnostics</span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#2E3A2F] font-bold">Wellness Core Assessment</h3>
        <p className="text-xs text-[#5E574F] leading-relaxed">
          Somatic health begins with deep molecular assessment. Complete our interactive 4-step survey to catalog indices of cortisol tension, circadian rhythms, and metabolic fire.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeResult ? (
            /* ACTIVE QUIZ FORM */
            <motion.div
              key="quiz-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="bg-[#F3ECE0] rounded-3xl p-6 md:p-10 border border-[#E3DACF] space-y-8 shadow-sm"
            >
              {/* Progress Stepper indicators */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E3DACF]">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#2E3A2F] text-[#FDFBF7] text-[10px] font-mono py-1 px-2.5 rounded-full font-bold uppercase tracking-wider">
                    Diagnostic {currentStep + 1} of {totalSteps}
                  </span>
                  <span className="hidden sm:inline text-[9px] font-mono text-[#8A8172] uppercase font-medium">
                    Category: <span className="font-bold text-[#2E3A2F]">{activeQuestion?.category}</span>
                  </span>
                </div>
                {/* Horizontal progress bar */}
                <div className="w-24 bg-[#EBE6DC] h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#C5A880] h-full transition-all duration-300" 
                    style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* Selected question text layout */}
              <div className="space-y-4">
                <span className="text-sm text-[#C5A880]">✦</span>
                <h4 className="font-serif text-xl sm:text-2xl text-[#2E3A2F] font-semibold leading-relaxed">
                  {activeQuestion?.question}
                </h4>
              </div>

              {/* Answers Grid Clickable List */}
              <div className="grid grid-cols-1 gap-3">
                {activeQuestion?.options.map((option, index) => {
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(option, option.text)}
                      className="bg-[#FDFBF7] hover:bg-[#FDFBF7]/90 text-left p-4.5 rounded-2xl border border-[#E5DFD4] hover:border-[#C5A880]/50 transition-all cursor-pointer flex justify-between items-center group shadow-sm text-xs"
                      id={`quiz-button-step-${currentStep}-${index}`}
                    >
                      <span className="text-[#5E574F] group-hover:text-[#2E3A2F] font-medium leading-relaxed">
                        {option.text}
                      </span>
                      <span className="h-5 w-5 rounded-full border border-[#D5CBB9] group-hover:border-[#C5A880] group-hover:bg-[#C5A880] flex items-center justify-center transition-all">
                        <ArrowRight className="h-3 w-3 text-transparent group-hover:text-black" />
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Small caution text */}
              <div className="flex items-center space-x-2 text-[9px] font-mono text-[#8A8172]">
                <HelpCircle className="h-3.5 w-3.5 text-[#C5A880]" />
                <span>Your answers are saved strictly in your sandbox storage cache.</span>
              </div>
            </motion.div>
          ) : (
            /* COMPREHENSIVE ASSESSMENT INTERACTIVE REPORT */
            <motion.div
              key="quiz-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FDFBF7] rounded-3xl p-6 md:p-10 border border-[#E5DFD4] shadow-md space-y-10"
            >
              <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-[#EBE6DC] gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center space-x-1 text-[#2E3A2F]">
                    <Trophy className="h-4.5 w-4.5 text-[#C5A880]" />
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Diagnostics Complete</span>
                  </div>
                  <h4 className="font-serif text-2xl text-[#2E3A2F] font-bold">Your Personal Holistic Balance Sheet</h4>
                  <p className="text-[11px] text-[#8A8172]">
                    Calculated based on dynamic autonomic physiological criteria.
                  </p>
                </div>

                {/* Concentric Circle Index */}
                {renderSVGGauge(activeResult.overallIndex)}
              </div>

              {/* Categoric breakdowns styled in custom pill graphs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Circadian Sleep Quality', val: activeResult.scores.sleep, color: 'bg-emerald-700', text: 'circadian cycles' },
                  { label: 'Cortisol Hyper-Arousal', val: activeResult.scores.stress, color: 'bg-orange-600', text: 'adrenaline loops' },
                  { label: 'Vagal Nerve Mindfulness', val: activeResult.scores.mindfulness, color: 'bg-teal-600', text: 'mindfulness focus' },
                  { label: 'Cellular Biome Vitality', val: activeResult.scores.vitality, color: 'bg-[#C5A880]', text: 'metabolic fire' }
                ].map((scoreObj) => (
                  <div key={scoreObj.label} className="bg-[#FAF7F1] border border-[#EBE6DC] p-4.5 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#8A8172] block">{scoreObj.label}</span>
                      <span className="text-xl font-serif font-black text-[#2E3A2F] mt-1 block">
                        {scoreObj.label.includes('Cortisol') ? `${100 - scoreObj.val}% Calm` : `${scoreObj.val}% Balance`}
                      </span>
                    </div>

                    {/* mini visual linear track */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-[#EBE6DC] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${scoreObj.color}`} 
                          style={{ width: `${scoreObj.val}%` }}
                        />
                      </div>
                      <span className="text-[8.5px] font-mono text-[#8A8172] uppercase block">
                        Mapped {scoreObj.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mapped recipes and tips */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                <div className="md:col-span-7 bg-[#FAF7F1] p-6 rounded-2xl border border-[#EBE6DC] space-y-4">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#2E3A2F] font-bold flex items-center space-x-1.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
                    <span>Personalized Vital Recipes:</span>
                  </h5>
                  <div className="space-y-3">
                    {activeResult.remedies.map((tip, idx) => (
                      <div key={idx} className="flex space-x-2 text-xs leading-relaxed text-[#5E574F] bg-[#FDFBF7] p-3 rounded-xl border border-[#EBE6DC]">
                        <span className="text-[#C5A880] font-bold">✦</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5 bg-[#2E3A2F] text-[#FDFBF7] p-6 rounded-2xl space-y-4">
                  <h5 className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] font-bold">
                    Targeted Healing Ritual
                  </h5>
                  <p className="text-[11px] text-[#D5CBB9] leading-relaxed">
                    Based on your high adrenal and circadian scores, we have compiled a recommended clinical treatment layout:
                  </p>

                  <div className="space-y-3.5 pt-1">
                    {activeResult.recommendedTreatments.map((therapyId) => {
                      const therapy = TREATMENTS.find(t => t.id === therapyId);
                      if (!therapy) return null;
                      return (
                        <div key={therapy.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                          <h6 className="text-xs font-bold text-white tracking-wide">{therapy.title}</h6>
                          <div className="flex justify-between items-center text-[9px] font-mono text-[#C5A880] mt-1">
                            <span>DURATION: {therapy.duration} MINS</span>
                            <span>COST: ${therapy.price} USD</span>
                          </div>
                          
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={() => {
                              audioEngine.playSingingBowl(349.23);
                              setSelectedTreatmentId(therapy.id);
                              setActiveTab('booking');
                            }}
                            className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-300 hover:text-emerald-200 mt-2 flex items-center cursor-pointer"
                          >
                            <span>Lock appointment slot</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Reset Diagnostic controls */}
              <div className="flex justify-between items-center pt-4 border-t border-[#EBE6DC]">
                <span className="text-[9px] font-mono text-[#8A8172]">RECOMMENDATION SYSTEM ACTIVE</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetAssessment}
                  className="px-4 py-2 bg-[#F3ECE0] hover:bg-[#EAE2D4] text-[#2E3A2F] text-xs font-semibold rounded-lg flex items-center space-x-1.5 border border-[#D5CBB9] cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Redo Wellness Diagnostic</span>
                </motion.button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
