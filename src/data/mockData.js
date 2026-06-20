// Seeded mock data — all in-memory, no persistence required
// The wedding is ~6 months away from app launch to keep the demo feeling alive

export const wedding = {
  coupleNames: 'Elara & Marcus',
  date: '2026-10-10',
  venue: 'The Greenhouse Estate',
  city: 'Hudson Valley, NY',
  budget: 57900,    // overall budget cap
  guestCount: 120,  // estimated guest count
}

// ─── Budget ───────────────────────────────────────────────────────────────────
// status: 'paid' | 'partial' | 'upcoming'
export const budgetItems = [
  { id: 'b1', category: 'Venue',           planned: 12000, actual: 12000, status: 'paid',     note: 'The Greenhouse Estate — full payment' },
  { id: 'b2', category: 'Catering',        planned: 14000, actual: 8500,  status: 'partial',  note: '50% deposit paid, balance due Sep 1' },
  { id: 'b3', category: 'Photography',     planned: 4800,  actual: 2400,  status: 'partial',  note: 'Deposit paid — Claire Moreau Studio' },
  { id: 'b4', category: 'Florals',         planned: 5200,  actual: 0,     status: 'upcoming', note: 'Consultation booked for June' },
  { id: 'b5', category: 'Music',           planned: 3500,  actual: 1500,  status: 'partial',  note: 'String quartet — deposit paid' },
  { id: 'b6', category: 'Stationery',      planned: 900,   actual: 720,   status: 'paid',     note: 'Invitations + day-of suite — Letra Press' },
  { id: 'b7', category: 'Cake',            planned: 1200,  actual: 0,     status: 'upcoming', note: 'Tasting scheduled for July' },
  { id: 'b8', category: 'Attire',          planned: 5500,  actual: 3200,  status: 'partial',  note: 'Dress alterations pending' },
  { id: 'b9', category: 'Hair & Makeup',   planned: 1800,  actual: 600,   status: 'partial',  note: '3 artists booked — trial done' },
  { id: 'b10', category: 'Honeymoon',      planned: 8000,  actual: 1400,  status: 'partial',  note: 'Flights booked — hotel deposit paid' },
]

// ─── Guests ───────────────────────────────────────────────────────────────────
export const guests = [
  { id: 'g1',  firstName: 'Catherine', lastName: 'Beaumont',     side: 'bride',  group: 'family',     rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't1' },
  { id: 'g2',  firstName: 'Henri',     lastName: 'Beaumont',     side: 'bride',  group: 'family',     rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'gluten-free', tableId: 't1' },
  { id: 'g3',  firstName: 'Sophie',    lastName: 'Beaumont',     side: 'bride',  group: 'family',     rsvp: 'confirmed', plusOne: true,  plusOneName: 'Tom Wilder', dietary: 'none',        tableId: 't1' },
  { id: 'g4',  firstName: 'James',     lastName: 'Whitfield',    side: 'groom',  group: 'family',     rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't2' },
  { id: 'g5',  firstName: 'Patricia',  lastName: 'Whitfield',    side: 'groom',  group: 'family',     rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'vegetarian',  tableId: 't2' },
  { id: 'g6',  firstName: 'Oliver',    lastName: 'Whitfield',    side: 'groom',  group: 'family',     rsvp: 'confirmed', plusOne: true,  plusOneName: 'Lena Moss',  dietary: 'none',        tableId: 't2' },
  { id: 'g7',  firstName: 'Isabelle',  lastName: 'Fontaine',     side: 'bride',  group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't3' },
  { id: 'g8',  firstName: 'Lucas',     lastName: 'Vernet',       side: 'mutual', group: 'friends',    rsvp: 'confirmed', plusOne: true,  plusOneName: 'Aya Diallo', dietary: 'vegan',       tableId: 't3' },
  { id: 'g9',  firstName: 'Camille',   lastName: 'Leclerc',      side: 'bride',  group: 'friends',    rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g10', firstName: 'Thomas',    lastName: 'Girard',       side: 'groom',  group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't4' },
  { id: 'g11', firstName: 'Nora',      lastName: 'Ellis',        side: 'mutual', group: 'friends',    rsvp: 'confirmed', plusOne: true,  plusOneName: 'Sam Ellis',  dietary: 'halal',       tableId: 't4' },
  { id: 'g12', firstName: 'Ethan',     lastName: 'Rhodes',       side: 'groom',  group: 'friends',    rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g13', firstName: 'Margaux',   lastName: 'Simon',        side: 'bride',  group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'vegetarian',  tableId: 't3' },
  { id: 'g14', firstName: 'Antoine',   lastName: 'Dupont',       side: 'mutual', group: 'colleagues', rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g15', firstName: 'Diana',     lastName: 'Chen',         side: 'bride',  group: 'colleagues', rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't5' },
  { id: 'g16', firstName: 'Rafael',    lastName: 'Mora',         side: 'groom',  group: 'colleagues', rsvp: 'declined',  plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g17', firstName: 'Elise',     lastName: 'Martin',       side: 'bride',  group: 'family',     rsvp: 'confirmed', plusOne: true,  plusOneName: 'Paul Martin',dietary: 'none',        tableId: 't1' },
  { id: 'g18', firstName: 'Hugo',      lastName: 'Bernard',      side: 'groom',  group: 'family',     rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g19', firstName: 'Alice',     lastName: 'Nguyen',       side: 'mutual', group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'gluten-free', tableId: 't5' },
  { id: 'g20', firstName: 'Marc',      lastName: 'Leblanc',      side: 'groom',  group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't4' },
  { id: 'g21', firstName: 'Juliette',  lastName: 'Petit',        side: 'bride',  group: 'friends',    rsvp: 'declined',  plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g22', firstName: 'Samuel',    lastName: 'Price',        side: 'groom',  group: 'colleagues', rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't5' },
  { id: 'g23', firstName: 'Léa',       lastName: 'Rousseau',     side: 'bride',  group: 'family',     rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'vegetarian',  tableId: null },
  { id: 'g24', firstName: 'Dimitri',   lastName: 'Papadopoulos', side: 'groom',  group: 'friends',    rsvp: 'confirmed', plusOne: true,  plusOneName: 'Maria P.',   dietary: 'none',        tableId: 't6' },
  { id: 'g25', firstName: 'Hana',      lastName: 'Kato',         side: 'mutual', group: 'colleagues', rsvp: 'pending',   plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g26', firstName: 'Victor',    lastName: 'Roux',         side: 'bride',  group: 'family',     rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'none',        tableId: 't6' },
  { id: 'g27', firstName: 'Anaïs',     lastName: 'Caron',        side: 'bride',  group: 'friends',    rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'halal',       tableId: 't6' },
  { id: 'g28', firstName: 'Felix',     lastName: 'Koch',         side: 'groom',  group: 'friends',    rsvp: 'declined',  plusOne: false, plusOneName: '',           dietary: 'none',        tableId: null },
  { id: 'g29', firstName: 'Priya',     lastName: 'Sharma',       side: 'mutual', group: 'colleagues', rsvp: 'confirmed', plusOne: false, plusOneName: '',           dietary: 'vegetarian',  tableId: 't7' },
  { id: 'g30', firstName: 'Gabriel',   lastName: 'Santos',       side: 'groom',  group: 'friends',    rsvp: 'confirmed', plusOne: true,  plusOneName: 'Liz Santos', dietary: 'none',        tableId: 't7' },
]

// ─── Checklist ────────────────────────────────────────────────────────────────
export const tasks = [
  { id: 'c1',  task: 'Set your total budget',            phase: '12+ months',  done: true,  dueDate: '2024-11-01' },
  { id: 'c2',  task: 'Create your guest list',           phase: '12+ months',  done: true,  dueDate: '2024-11-15' },
  { id: 'c3',  task: 'Book your venue',                  phase: '12+ months',  done: true,  dueDate: '2024-12-01' },
  { id: 'c4',  task: 'Set the wedding date',             phase: '12+ months',  done: true,  dueDate: '2024-10-20' },
  { id: 'c5',  task: 'Book officiant or celebrant',      phase: '6–12 months', done: true,  dueDate: '2025-01-15' },
  { id: 'c6',  task: 'Book photographer',                phase: '6–12 months', done: true,  dueDate: '2025-02-01' },
  { id: 'c7',  task: 'Book caterer',                     phase: '6–12 months', done: true,  dueDate: '2025-02-15' },
  { id: 'c8',  task: 'Book music / entertainment',       phase: '6–12 months', done: true,  dueDate: '2025-03-01' },
  { id: 'c9',  task: 'Order wedding attire',             phase: '6–12 months', done: true,  dueDate: '2025-03-15' },
  { id: 'c10', task: 'Send save-the-dates',              phase: '6–12 months', done: true,  dueDate: '2025-03-01' },
  { id: 'c11', task: 'Book florist',                     phase: '3–6 months',  done: false, dueDate: '2026-05-15' },
  { id: 'c12', task: 'Plan the ceremony',                phase: '3–6 months',  done: false, dueDate: '2026-06-01' },
  { id: 'c13', task: 'Order wedding cake',               phase: '3–6 months',  done: false, dueDate: '2026-06-15' },
  { id: 'c14', task: 'Book hair and makeup artists',     phase: '3–6 months',  done: true,  dueDate: '2026-05-01' },
  { id: 'c15', task: 'Send formal invitations',          phase: '3–6 months',  done: true,  dueDate: '2026-05-01' },
  { id: 'c16', task: 'Arrange accommodation for guests', phase: '3–6 months',  done: false, dueDate: '2026-06-30' },
  { id: 'c17', task: 'Confirm all vendor contracts',     phase: '1–3 months',  done: false, dueDate: '2026-08-01' },
  { id: 'c18', task: 'Create seating chart',             phase: '1–3 months',  done: false, dueDate: '2026-08-15' },
  { id: 'c19', task: 'Write your vows',                  phase: '1–3 months',  done: false, dueDate: '2026-09-01' },
  { id: 'c20', task: 'Finalise menu choices',            phase: '1–3 months',  done: false, dueDate: '2026-08-20' },
  { id: 'c21', task: 'Arrange transport',                phase: '1–3 months',  done: false, dueDate: '2026-09-01' },
  { id: 'c22', task: 'Confirm final guest count',        phase: 'Final weeks', done: false, dueDate: '2026-09-27' },
  { id: 'c23', task: 'Final dress fitting',              phase: 'Final weeks', done: false, dueDate: '2026-09-20' },
  { id: 'c24', task: 'Prepare vendor payments',          phase: 'Final weeks', done: false, dueDate: '2026-10-04' },
  { id: 'c25', task: 'Pack for honeymoon',               phase: 'Final weeks', done: false, dueDate: '2026-10-09' },
]

// ─── Seating Tables ───────────────────────────────────────────────────────────
export const tables = [
  { id: 't1', name: 'The Wisteria Table', capacity: 8  },
  { id: 't2', name: 'The Jasmine Table',  capacity: 8  },
  { id: 't3', name: 'The Olive Table',    capacity: 6  },
  { id: 't4', name: 'The Cedar Table',    capacity: 6  },
  { id: 't5', name: 'The Linden Table',   capacity: 8  },
  { id: 't6', name: 'The Sage Table',     capacity: 6  },
  { id: 't7', name: 'The Fern Table',     capacity: 6  },
  { id: 't8', name: 'The Birch Table',    capacity: 10 },
]

// ─── Vendors ──────────────────────────────────────────────────────────────────
// status: 'pending' | 'contracted' | 'deposit-paid' | 'fully-paid'
export const vendors = [
  { id: 'v1', name: 'The Greenhouse Estate',     category: 'Venue',          contact: 'Sarah Mitchell',  email: 'events@greenhouse.com',          phone: '+1 845 555 0101', status: 'fully-paid',   depositPaid: 12000, totalCost: 12000, note: 'Full buyout, outdoor ceremony included' },
  { id: 'v2', name: 'Maison Cuisine Co.',         category: 'Catering',       contact: 'Chef Pierre D.',  email: 'pierre@maisoncuisine.com',        phone: '+1 845 555 0202', status: 'deposit-paid', depositPaid: 4200,  totalCost: 14000, note: 'Plated dinner, 5 courses, wine pairing' },
  { id: 'v3', name: 'Claire Moreau Studio',       category: 'Photography',    contact: 'Claire Moreau',   email: 'hello@clairemoreaustudio.com',    phone: '+1 212 555 0303', status: 'deposit-paid', depositPaid: 2400,  totalCost: 4800,  note: '8hr coverage + engagement session' },
  { id: 'v4', name: 'Bloom & Branch Florals',     category: 'Florals',        contact: 'Lily Ashford',    email: 'lily@bloomandbranch.com',         phone: '+1 845 555 0404', status: 'contracted',   depositPaid: 0,     totalCost: 5200,  note: 'Consultation June 12 — greenery arch' },
  { id: 'v5', name: 'Hudson String Quartet',      category: 'Music',          contact: 'James Whitmore',  email: 'bookings@hudsonquartet.com',      phone: '+1 845 555 0505', status: 'deposit-paid', depositPaid: 1500,  totalCost: 3500,  note: 'Ceremony + cocktail hour repertoire' },
  { id: 'v6', name: 'Letra Press',                category: 'Stationery',     contact: 'Ana Reyes',       email: 'ana@letrapress.com',              phone: '+1 718 555 0606', status: 'fully-paid',   depositPaid: 900,   totalCost: 900,   note: 'Invitations + day-of suite delivered' },
  { id: 'v7', name: 'Sweet Architecture',         category: 'Cake',           contact: 'Mia Torres',      email: 'mia@sweetarchitecture.com',       phone: '+1 845 555 0707', status: 'contracted',   depositPaid: 0,     totalCost: 1200,  note: 'Tasting July 8 — elderflower & lemon' },
  { id: 'v8', name: 'Hudson Valley Hair & Co.',   category: 'Hair & Makeup',  contact: 'Priya Nair',      email: 'priya@hvhair.com',                phone: '+1 845 555 0808', status: 'deposit-paid', depositPaid: 600,   totalCost: 1800,  note: '3 artists booked — trial completed' },
  { id: 'v9', name: 'Valley Valet Transport',     category: 'Transport',      contact: 'Tom Briggs',      email: 'tom@valleyvalet.com',             phone: '+1 845 555 0909', status: 'pending',      depositPaid: 0,     totalCost: 1400,  note: 'Getting quotes for shuttle + vintage car' },
]

// ─── Wedding Day Timeline ─────────────────────────────────────────────────────
// type: 'prep' | 'photo' | 'ceremony' | 'reception' | 'other'
export const timelineEvents = [
  { id: 'e1',  time: '08:00', duration: 120, name: 'Bridal prep — hair & makeup',   location: 'Bridal Suite',            type: 'prep',      notes: 'Priya + team arrive at 8am sharp' },
  { id: 'e2',  time: '09:30', duration: 60,  name: 'Groom & groomsmen getting ready', location: 'Garden Room',           type: 'prep',      notes: 'Champagne and calm' },
  { id: 'e3',  time: '11:00', duration: 30,  name: 'First look & couple portraits',  location: 'Walled Garden',           type: 'photo',     notes: 'Claire to coordinate, private moment' },
  { id: 'e4',  time: '11:30', duration: 45,  name: 'Bridal party portraits',         location: 'Orchard & South Lawn',    type: 'photo',     notes: 'Group shots + individual portraits' },
  { id: 'e5',  time: '13:00', duration: 60,  name: 'Lunch & rest',                   location: 'Bridal Suite',            type: 'other',     notes: 'Light meal, touch-ups, relaxation' },
  { id: 'e6',  time: '14:15', duration: 15,  name: 'String quartet begins',          location: 'Outdoor Ceremony Space',  type: 'ceremony',  notes: 'Pre-ceremony music as guests are seated' },
  { id: 'e7',  time: '14:30', duration: 15,  name: 'Guests seated',                  location: 'Outdoor Ceremony Space',  type: 'ceremony',  notes: 'Ushers guide guests to seats' },
  { id: 'e8',  time: '15:00', duration: 45,  name: 'Wedding ceremony',               location: 'Outdoor Ceremony Space',  type: 'ceremony',  notes: 'Officiant: Rev. Daniel Marsh' },
  { id: 'e9',  time: '15:45', duration: 75,  name: 'Cocktail hour',                  location: 'South Terrace',           type: 'reception', notes: 'Canapés, signature cocktails, lawn games' },
  { id: 'e10', time: '16:30', duration: 30,  name: 'Family formals',                 location: 'Walled Garden',           type: 'photo',     notes: 'Both families, then separate shots' },
  { id: 'e11', time: '17:00', duration: 10,  name: 'Grand entrance',                 location: 'Great Hall',              type: 'reception', notes: 'Introduction + first dance' },
  { id: 'e12', time: '17:15', duration: 105, name: 'Dinner service',                 location: 'Great Hall',              type: 'reception', notes: '5-course plated dinner, wine service' },
  { id: 'e13', time: '19:00', duration: 30,  name: 'Speeches & toasts',              location: 'Great Hall',              type: 'reception', notes: 'Best man, maid of honour, father of bride' },
  { id: 'e14', time: '19:30', duration: 15,  name: 'Cake cutting',                   location: 'Great Hall',              type: 'reception', notes: 'Followed by dessert service' },
  { id: 'e15', time: '20:00', duration: 180, name: 'Dancing & evening reception',    location: 'Great Hall',              type: 'reception', notes: 'DJ takes over from string quartet' },
  { id: 'e16', time: '23:00', duration: 30,  name: 'Last dance & sparkler send-off', location: 'Front Steps',             type: 'reception', notes: 'End of evening — transport from 23:15' },
]
