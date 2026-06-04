/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Treatment {
  id: string;
  title: string;
  category: 'Hydrotherapy' | 'Sound Healing' | 'Massage' | 'Aromatherapy' | 'Skincare';
  duration: number; // in minutes
  price: number; // in USD
  description: string;
  benefits: string[];
  image: string;
}

export interface BreathingPreset {
  id: string;
  name: string;
  description: string;
  inhale: number; // seconds
  hold1: number; // seconds
  exhale: number; // seconds
  hold2: number; // seconds
  benefit: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  category: 'mindfulness' | 'sleep' | 'vitality' | 'stress';
  options: {
    text: string;
    score: number;
    tip: string;
  }[];
}

export interface AssessmentResult {
  scores: {
    mindfulness: number;
    sleep: number;
    vitality: number;
    stress: number;
  };
  overallIndex: number;
  remedies: string[];
  recommendedTreatments: string[];
}

export interface Booking {
  id: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  addOns: string[];
  customerName: string;
  customerEmail: string;
  notes: string;
  totalPrice: number;
  createdAt: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar: string;
}

export interface GuestReview {
  name: string;
  origin: string;
  review: string;
  rating: number;
}

export interface AppNotification {
  id: string;
  type: 'booking_confirmed' | 'diagnostic_ready' | 'sanctuary_alert';
  title: string;
  subject: string;
  message: string;
  recipientEmail: string;
  timestamp: string;
  isRead: boolean;
  bookingId?: string;
}

