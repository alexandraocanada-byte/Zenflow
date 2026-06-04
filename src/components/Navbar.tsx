/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Volume2, VolumeX, Sparkles, Mail, Inbox, Trash2, X, Check, CheckSquare } from 'lucide-react';
import { audioEngine } from '../utils/AudioEngine';
import { AppNotification } from '../types';
import { getLocalNotifications, markNotificationAsRead, deleteLocalNotification, markAllNotificationsAsRead } from '../utils/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const reloadNotifications = () => {
    setNotifications(getLocalNotifications());
  };

  useEffect(() => {
    reloadNotifications();
    window.addEventListener('aethera_notifications_updated', reloadNotifications);
    return () => {
      window.removeEventListener('aethera_notifications_updated', reloadNotifications);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    audioEngine.playSingingBowl(349.23);
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleToggleExpand = (id: string) => {
    audioEngine.playSingingBowl(261.63);
    if (expandedNotifId === id) {
      setExpandedNotifId(null);
    } else {
      setExpandedNotifId(id);
      // Automatically mark as read when expanded
      const updated = markNotificationAsRead(id);
      setNotifications(updated);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    audioEngine.playSingingBowl(150);
    const updated = deleteLocalNotification(id);
    setNotifications(updated);
    if (expandedNotifId === id) {
      setExpandedNotifId(null);
    }
  };

  const handleMarkAllAsRead = () => {
    audioEngine.playSingingBowl(440);
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Synchronize state with audio loop
  const handleToggleSound = () => {
    // play dynamic click response bowl tone
    audioEngine.playSingingBowl(330); // 330Hz (E4 note) for pristine navigation trigger
    const playing = audioEngine.toggleAmbientWind();
    setIsMuted(!playing);
  };

  useEffect(() => {
    return () => {
      // safe cleanup when unloading
      audioEngine.stopAmbientWind();
    };
  }, []);

  const tabs = [
    { id: 'home', label: 'Sanctuary' },
    { id: 'services', label: 'Therapies' },
    { id: 'portal', label: 'Pranayama Portal' },
    { id: 'assessment', label: 'Wellness Core' },
    { id: 'booking', label: 'Reservations' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDFBF7]/85 border-b border-[#EBE6DC] py-4 px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Editorial Sanctuary Brand Logo */}
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => {
            audioEngine.playSingingBowl(220);
            setActiveTab('home');
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="p-1.5 bg-[#2E3A2F] text-[#FDFBF7] rounded-full flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div>
            <h1 className="font-serif text-lg tracking-wider text-[#2E3A2F] font-bold">AETHERA</h1>
            <p className="text-[9px] tracking-widest text-[#8A8172] font-mono uppercase">Sanctuary of Somatic Healing</p>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex space-x-1 lg:space-x-2 bg-[#F3ECE0] p-1 rounded-full border border-[#E3DACF]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playSingingBowl(tab.id === 'portal' ? 293.66 : 220); // G or A notes
                  setActiveTab(tab.id);
                }}
                className={`relative px-4 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? 'text-[#FDFBF7] font-semibold' 
                    : 'text-[#5E574F] hover:text-[#2E3A2F]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavigationMarker"
                    className="absolute inset-0 bg-[#2E3A2F] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Audio Synthesis Panel & Actions */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleSound}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#D5CBB9] text-xs font-mono cursor-pointer transition-colors ${
              !isMuted 
                ? 'bg-[#E3EFE3] text-[#225522] border-[#AAD4AA]' 
                : 'bg-transparent text-[#5E574F]'
            }`}
            title="Toggle Organic Environmental Sound Waves"
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-[#8A8172]" />
                <span className="hidden sm:inline text-[10px] tracking-wider uppercase text-[#8A8172]">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-[#2E3A2F] animate-pulse" />
                <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-semibold text-[#2E3A2F]">Resonance On</span>
                {/* Active audio visual node */}
                <span className="flex space-x-0.5 items-center pl-1">
                  <span className="w-0.5 h-2 bg-[#2E3A2F] rounded-full animate-[bounce_1s_infinite_100ms]" />
                  <span className="w-0.5 h-3 bg-[#2E3A2F] rounded-full animate-[bounce_1s_infinite_300ms]" />
                  <span className="w-0.5 h-1.5 bg-[#2E3A2F] rounded-full animate-[bounce_1s_infinite_500ms]" />
                </span>
              </>
            )}
          </motion.button>
          
          {/* Virtual Mail & Alerts Inbox */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                audioEngine.playSingingBowl(293.66);
                setIsInboxOpen(!isInboxOpen);
              }}
              className={`p-2 rounded-full border cursor-pointer transition-all flex items-center justify-center relative ${
                unreadCount > 0 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' 
                  : 'bg-transparent text-[#5E574F] border-[#D5CBB9] hover:bg-[#FAF7F1]'
              }`}
              title="Aethera Message Box & Confirmation Emails"
            >
              <Mail className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#2E3A2F] text-[9px] font-mono font-bold text-white shadow-sm ring-2 ring-[#FDFBF7]">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {isInboxOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsInboxOpen(false)}
                  />

                  {/* Mailbox Drawer Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-3.5 w-80 sm:w-[440px] bg-[#FDFBF7] border border-[#E3DACF] rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
                  >
                    {/* Header */}
                    <div className="p-4 bg-[#2E3A2F] text-[#FDFBF7] flex justify-between items-center border-b border-[#242A24]">
                      <div>
                        <h4 className="font-serif text-sm font-bold tracking-wide flex items-center">
                          <Inbox className="h-4 w-4 text-[#C5A880] mr-1.5" />
                          <span>Holistic Sensory Alerts</span>
                        </h4>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-[9px] font-mono text-emerald-300 font-medium">To: jundrilcantiveros@gmail.com</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="p-1 px-2 text-[9px] bg-white/10 hover:bg-white/20 text-[#FDFBF7] rounded-md font-mono transition-all cursor-pointer flex items-center gap-1"
                            title="Mark all as read"
                          >
                            <Check className="h-3 w-3" />
                            <span>Read All</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            audioEngine.playSingingBowl(220);
                            setIsInboxOpen(false);
                          }}
                          className="p-1 hover:bg-white/10 text-white/70 hover:text-white rounded-md transition-colors cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Messages Body Container */}
                    <div className="flex-grow overflow-y-auto max-h-[380px] p-2 space-y-2 divide-y divide-[#FAF7F1] scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#8A8172] space-y-2">
                          <Inbox className="h-8 w-8 text-[#E3DACF] mx-auto opacity-60" />
                          <p className="font-serif italic font-medium">No alerts or confirmation messages found.</p>
                          <p className="text-[10px] text-[#A2998A]">Secure a reservation to generate a somatic voucher email.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isExpanded = expandedNotifId === notif.id;
                          return (
                            <div 
                              key={notif.id}
                              onClick={() => handleToggleExpand(notif.id)}
                              className={`p-3 rounded-xl transition-all cursor-pointer text-left ${
                                isExpanded 
                                  ? 'bg-[#F3ECE0]' 
                                  : notif.isRead 
                                    ? 'hover:bg-[#FAF7F1]' 
                                    : 'bg-emerald-500/5 hover:bg-emerald-500/10 border-l-2 border-[#2E3A2F]'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-0.5">
                                  <div className="flex items-center space-x-1.5">
                                    <span className={`text-[8px] uppercase font-mono px-1.5 py-0.5 rounded-full font-bold ${
                                      notif.type === 'booking_confirmed' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-[#C5A880]/20 text-[#8C6D40]'
                                    }`}>
                                      {notif.type === 'booking_confirmed' ? 'VOUCHER' : 'SYSTEM ALERT'}
                                    </span>
                                    {!notif.isRead && (
                                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                    )}
                                  </div>
                                  <h5 className="font-semibold text-xs text-[#2E3A2F] mt-1">{notif.subject}</h5>
                                </div>
                                <span className="text-[9px] text-[#8A8172] font-mono whitespace-nowrap pl-2">
                                  {notif.timestamp.split(' ')[0]}
                                </span>
                              </div>

                              {/* Preview Message line */}
                              {!isExpanded && (
                                <p className="text-[10px] text-[#5E574F] truncate mt-1">
                                  {notif.message.split('\n')[2] || notif.message.split('\n')[0]}...
                                </p>
                              )}

                              {/* Expanded Email Body */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mt-3 text-[11px] text-[#2E3A2F] leading-relaxed border-t border-[#E3DACF] pt-3.5 space-y-3"
                                  >
                                    <div className="bg-[#FDFBF7] p-2.5 rounded-lg border border-[#E3DACF] font-mono text-[9px] text-[#8A8172] space-y-1">
                                      <div><span className="font-bold text-[#2E3A2F]">From:</span> concierge@aethera-sanctuary.com</div>
                                      <div><span className="font-bold text-[#2E3A2F]">To:</span> {notif.recipientEmail}</div>
                                      <div><span className="font-bold text-[#2E3A2F]">Date:</span> {notif.timestamp}</div>
                                    </div>

                                    <div className="whitespace-pre-wrap font-serif text-[11px] text-[#4A453F] px-3 bg-[#FAF7F1] py-2.5 rounded-lg border border-[#FAF7F1]">
                                      {notif.message}
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                      <button 
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        className="text-red-600 hover:text-red-700 text-[10px] font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                        <span>Purge Alert</span>
                                      </button>
                                      <span className="text-[8px] font-mono text-[#8A8172]">Secured SHA-256 Envelope</span>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="p-3 bg-[#FAF7F1] border-t border-[#EBE6DC] text-center text-[10px] text-[#8A8172] font-mono leading-none">
                      Integrated Somatic Mail Monitor
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              audioEngine.playSingingBowl(349.23); // F note for action trigger
              setActiveTab('booking');
            }}
            className="bg-[#C5A880] text-[#1E221E] px-4 py-2 rounded-full text-xs font-medium tracking-wide cursor-pointer hover:bg-[#B7996F] hover:shadow-sm transition-all text-center"
          >
            Request Ritual
          </motion.button>
        </div>
      </div>

      {/* Mobile persistent navigation floating bar */}
      <div className="md:hidden mt-3 flex justify-around bg-[#F3ECE0]/90 backdrop-blur border border-[#E3DACF] rounded-full p-1 max-w-sm mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audioEngine.playSingingBowl(220);
                setActiveTab(tab.id);
              }}
              className={`px-2 py-1.5 text-[10px] uppercase tracking-wider font-semibold rounded-full ${
                isActive 
                  ? 'bg-[#2E3A2F] text-[#FDFBF7]' 
                  : 'text-[#5E574F]'
              }`}
            >
              {tab.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    </header>
  );
}
