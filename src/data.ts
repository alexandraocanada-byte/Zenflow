/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Treatment, BreathingPreset, QuizQuestion, TeamMember, GuestReview } from './types';

// Let's reference the premium generated studio images
export const HERO_COVER_IMAGE = "/src/assets/images/hero_cover_wellness_1780530058195.png";
export const SPA_PRODUCTS_IMAGE = "/src/assets/images/spa_products_wellness_1780530073231.png";

export const TREATMENTS: Treatment[] = [
  {
    id: 't1',
    title: 'Thermal Mineral Inhalation',
    category: 'Hydrotherapy',
    duration: 65,
    price: 185,
    description: 'Immerse in geothermal mountain salt-infused vapor micro-baths. Designed to fully cleanse pathways, reset somatic cycles, and oxygenate blood deep within cellular layers.',
    benefits: ['Clears respiratory and lymphatic systems', 'Unlocks deeper baseline lung capacity', 'Instils profound muscular tranquility'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't2',
    title: 'Vibrational Sound Bath',
    category: 'Sound Healing',
    duration: 75,
    price: 210,
    description: 'Surrender to multi-frequency acoustic oscillations of heavy copper Himalayan bowls and planetary gongs. This resonance shifts cortical waves into active delta and theta states for effortless subconscious release.',
    benefits: ['Normalizes neural firing and cognitive strain', 'Soothes chronic central nervous tension', 'Stimulates creative deep-sleep states'],
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't3',
    title: 'Igneous Basalt Massage',
    category: 'Massage',
    duration: 90,
    price: 245,
    description: 'Hand-sculpted volcanic stones heated sequentially are glided along deep myofascial meridians using aromatic pine-needle extract, melting stubborn structural contractions.',
    benefits: ['Addresses deep localized structural pain', 'Promotes rapid systemic waste clearance', 'Imparts grounding Earth-aligned stability'],
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 't4',
    title: 'Somatic Botanical Aromatherapy',
    category: 'Aromatherapy',
    duration: 60,
    price: 165,
    description: 'We fuse absolute single-source organic essential oils of botanical absolute lavender, white cypress, and bitter bergamot using gentle lymphatic friction sweeps to recalibrate mood centers.',
    benefits: ['Lowers systemic cortisol dramatically', 'Elevates native serotonin and focus', 'Nourishes dry skin cell barriers beautifully'],
    image: SPA_PRODUCTS_IMAGE
  },
  {
    id: 't5',
    title: 'Ozone Active Botanical Facial',
    category: 'Skincare',
    duration: 80,
    price: 220,
    description: 'A pressurized facial elixir utilizing organic cold-pressed sea-buckthorn fruit flesh and hyperbaric pure active oxygen to regenerate dermal structure while giving you a pristine, glowing finish.',
    benefits: ['Dramatically enhances skin cellular elasticity', 'Evens hyperpigmentation and fine lines', 'Deeply hydrates starved dermal layers'],
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80'
  }
];

export const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: 'b1',
    name: 'Soma Reset (Box Breathing)',
    description: 'A structured, symmetrical rhythm utilized by elite performance teams to stabilize high stress, regulate adrenaline output, and return to cold cognitive calm.',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    benefit: 'Neutralizes autonomic panic triggers instantly and refocuses attention.'
  },
  {
    id: 'b2',
    name: 'Deep Serenity (4-7-8 Pranayama)',
    description: 'An ancient yogic ritual that acts as a natural tranquilizer for the nervous system, helping to initiate deeper sleep cycles and reduce hyper-arousing mental noise.',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    benefit: 'Induces delta brainwaves, lowers blood pressure, and prepares you for restorative sleep.'
  },
  {
    id: 'b3',
    name: 'Aethera Expansion (Coherent Breath)',
    description: 'A slow rhythm centering on smooth, steady inflation and deflation without breath holding. Ideal for long-form mindfulness sitting and cardiac coherence training.',
    inhale: 6,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    benefit: 'Saves cardiovascular energy, optimizes vagal nerve tone, and harmonizes heart rate.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How do you typically feel upon waking in the morning hours?',
    category: 'sleep',
    options: [
      { text: 'Deeply recharged, clear-minded, and ready to meet the day.', score: 4, tip: 'Maintain your current sleep hygiene routines!' },
      { text: 'Mildly fatigued, requiring dynamic physical movement or caffeine to activate.', score: 3, tip: 'Try shifting dinner to 3 hours before sleep.' },
      { text: 'Frequently stiff and cloudy, with racing thoughts about outstanding tasks.', score: 2, tip: 'Integrate 5 minutes of somatic stretching before bed.' },
      { text: 'Concurrently exhausted, groggy, and physically depleted.', score: 1, tip: 'Consider a thermal salt inhalation session to boost morning metabolic release.' }
    ]
  },
  {
    id: 2,
    question: 'When faced with tight schedules or conflict, how does your physical body respond?',
    category: 'stress',
    options: [
      { text: 'I observe a slight elevation in heartbeat, but breathe through it calmly.', score: 4, tip: 'Your parasympathetic reflex is highly stable.' },
      { text: 'I experience localized stiffness in my jaw, neck, or shoulders.', score: 3, tip: 'Deep localized massage like Igneous Basalt Massage is highly recommended.' },
      { text: 'I experience superficial breathing patterns and physical heart fluttering.', score: 2, tip: 'Utilize Box Breathing for 3 minutes to halt adrenaline surges.' },
      { text: 'I feel total overwhelm, brain fog, and severe somatic contraction.', score: 1, tip: 'Invest heavily in an acoustic Sound Bath to recalibrate neural waves.' }
    ]
  },
  {
    id: 3,
    question: 'How regularly are you able to remain fully anchored in the current moment without digital distraction?',
    category: 'mindfulness',
    options: [
      { text: 'Throughout the day. I dedicate blocks of absolute quietude offline.', score: 4, tip: 'A pristine practice of digital boundaries.' },
      { text: 'Occasionally, although notifications persistently pull my focus away.', score: 3, tip: 'Institute a 20-minute morning phone-free sanctuary window.' },
      { text: 'Rarely. My focus is highly fragmented between competing task feeds.', score: 2, tip: 'Coherent breathing for 5 minutes can restore dynamic attention filters.' },
      { text: 'Almost never. I feel persistent background restlessness and sensory overload.', score: 1, tip: 'You require therapeutic sensory isolation and nature immersion.' }
    ]
  },
  {
    id: 4,
    question: 'How would you rate your natural metabolic energy and physical digestion during the day?',
    category: 'vitality',
    options: [
      { text: 'Consistent, clean, and light. No post-meal energy slumps.', score: 4, tip: 'Excellent metabolic biome alignment.' },
      { text: 'Moderate. I experience temporary mid-afternoon drowsiness.', score: 3, tip: 'Avoid processed sugars at lunch; substitute with botanical herbal teas.' },
      { text: 'Inconsistent. I alternate between hyperactive stress-energy and sudden crashes.', score: 2, tip: 'Avoid drinking ice-cold liquids during main warm food meals.' },
      { text: 'Sluggish, slow, accompanied by persistent physical heaviness.', score: 1, tip: 'Try dry-brushing and ozone active oxygen procedures to boost lymph flow.' }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Evelyn Vancamp',
    role: 'Somatic Sound Practitioner',
    description: 'With over twelve years of clinical practice in acoustic therapeutic fields, Evelyn masterfully guides high-frequency sound therapies, utilizing planetary symphonies to balance cortical activity.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Dr. Alistair Sterling',
    role: 'Balneotherapy Director',
    description: 'An expert in medical thermal cures, Alistair designs our biological mineral inhalation profiles and therapeutic hydrotherapy programs, ensuring maximum nutrient cellular absorption.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Mirai Thorne',
    role: 'Senior Myofascial Specialist',
    description: 'Combining deep tissue biomechanics and ancestral basalt heating systems, Mirai provides exceptionally tailored physical therapy sessions to release complex emotional memories held in muscles.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  }
];

export const GUEST_REVIEWS: GuestReview[] = [
  {
    name: 'Marcus Sterling',
    origin: 'Geneva, Switzerland',
    review: 'Aethera is not simply an escape; it is a profound systematic reboot. The thermal mineral inhalation combined with box breathing felt like I arrived back in my own physical body for the first time in years.',
    rating: 5
  },
  {
    name: 'Clara Jenkins',
    origin: 'London, UK',
    review: 'The Acoustic Sound Bath was a majestic, almost cinematic transcendental experience. My background heart-rate stress dropped by 20 beats under Evelyn’s guidance. Simply extraordinary.',
    rating: 5
  },
  {
    name: 'Julianne Harris',
    origin: 'Austin, Texas',
    review: 'I completed the interactive assessment and secured a customized package of Igneous Basalt Massage and active botanical facials. The attention to detail, organic botanical scents, and peaceful silence is absolute mastery.',
    rating: 5
  }
];
