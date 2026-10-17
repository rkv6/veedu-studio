export type RoomKind = 'living' | 'kitchen' | 'bedroom' | 'villa'

export interface Project {
  id: string
  name: string
  place: string
  kind: RoomKind
  scope: string
  area: string
  budget: string
  note: string
  done: string
  took: string
  brief: string
  highlights: string[]
}

// Listed oldest to newest, the order the tape plays in.
export const projects: Project[] = [
  {
    id: 'p1', name: 'Mathew residence', place: 'Kowdiar', kind: 'living', scope: 'Living and dining', area: '1,850 sq ft', budget: '₹18 to 22 lakh',
    note: 'A teak-framed window wall, a sage sofa and one long dining table that seats ten when the family visits.',
    done: 'February 2025', took: '9 weeks',
    brief: 'A family of five wanted one open room that could handle a quiet Tuesday and a Sunday lunch for twenty. We took down a half wall, moved the dining table to the window and gave the sofa a corner of its own.',
    highlights: ['Teak window frames kept from the old house', 'Dining table built on site, seats ten', 'Warm lighting on three separate circuits'],
  },
  {
    id: 'p3', name: 'Nair kitchen', place: 'Pattom', kind: 'kitchen', scope: 'Modular kitchen', area: '220 sq ft', budget: '₹6 to 8 lakh',
    note: 'Moss green cabinets, a stone counter and a hood that actually clears the smoke from a tadka.',
    done: 'June 2025', took: '4 weeks',
    brief: 'The old kitchen was dark and the hood barely worked. We rebuilt the layout around a single working triangle, added a proper chimney and gave every pot a home.',
    highlights: ['Moss green marine ply cabinets', 'Ducted chimney with outdoor exhaust', 'Pull-out storage for tall vessels'],
  },
  {
    id: 'p2', name: 'Thaara villa', place: 'Kovalam', kind: 'villa', scope: 'Whole home', area: '3,400 sq ft', budget: '₹55 to 70 lakh',
    note: 'Laterite walls kept bare, deep verandahs and rooms that open onto a central courtyard.',
    done: 'November 2025', took: '5 months',
    brief: 'A coastal home for a couple who wanted the house to breathe. We left the laterite exposed, shaded every window with a deep verandah and opened each room to the courtyard.',
    highlights: ['Exposed laterite, sealed not painted', 'Cross ventilation in every bedroom', 'Courtyard with a rain chain and a tulsi thara'],
  },
  {
    id: 'p4', name: 'Sreya’s room', place: 'Vazhuthacaud', kind: 'bedroom', scope: 'Bedroom suite', area: '260 sq ft', budget: '₹3 to 4 lakh',
    note: 'A tall headboard, a study corner behind it and storage built into every spare wall.',
    done: 'August 2026', took: '3 weeks',
    brief: 'A college student needed a bedroom that doubled as a study. The tall headboard hides a desk behind it, and the wardrobes run wall to wall so the floor stays clear.',
    highlights: ['Desk and bookshelf behind the headboard', 'Full-height wardrobes with loft storage', 'Reading light on its own switch'],
  },
]

export type HomeType = 'Apartment' | 'Villa' | 'Plot'

export interface PlanRoom { x: number; y: number; w: number; h: number; label: string; court?: boolean }

export interface Listing {
  id: string
  title: string
  place: string
  type: HomeType
  beds: number
  area: number
  unit: string
  lakh: number
  detail: string
  plan: PlanRoom[]
}

export const listings: Listing[] = [
  {
    id: 'h1', title: 'Garden-facing 3 BHK', place: 'Kowdiar', type: 'Apartment', beds: 3, area: 1620, unit: 'sq ft', lakh: 135,
    detail: 'Fourth floor, east light in every bedroom, two covered parking slots.',
    plan: [
      { x: 10, y: 10, w: 70, h: 55, label: 'Living' }, { x: 10, y: 65, w: 70, h: 55, label: 'Dining' },
      { x: 80, y: 10, w: 45, h: 40, label: 'Kitchen' }, { x: 80, y: 50, w: 45, h: 70, label: 'Bed' },
      { x: 125, y: 10, w: 65, h: 50, label: 'Bed' }, { x: 125, y: 60, w: 65, h: 60, label: 'Master' },
    ],
  },
  {
    id: 'h2', title: 'Courtyard villa', place: 'Kovalam', type: 'Villa', beds: 4, area: 3200, unit: 'sq ft', lakh: 285,
    detail: 'Single storey around an open courtyard, ten minutes from the beach road.',
    plan: [
      { x: 10, y: 10, w: 110, h: 35, label: 'Living' }, { x: 120, y: 10, w: 70, h: 35, label: 'Kitchen' },
      { x: 10, y: 45, w: 70, h: 35, label: 'Bed' }, { x: 80, y: 45, w: 40, h: 35, label: 'Court', court: true },
      { x: 120, y: 45, w: 70, h: 35, label: 'Bed' }, { x: 10, y: 80, w: 90, h: 40, label: 'Master' },
      { x: 100, y: 80, w: 90, h: 40, label: 'Bed' },
    ],
  },
  {
    id: 'h3', title: 'Compact 2 BHK', place: 'Pattom', type: 'Apartment', beds: 2, area: 1050, unit: 'sq ft', lakh: 72,
    detail: 'Ready to move in, walking distance to the school and the market.',
    plan: [
      { x: 10, y: 10, w: 90, h: 55, label: 'Living' }, { x: 10, y: 65, w: 90, h: 55, label: 'Dining' },
      { x: 100, y: 10, w: 90, h: 35, label: 'Kitchen' }, { x: 100, y: 45, w: 90, h: 40, label: 'Master' },
      { x: 100, y: 85, w: 90, h: 35, label: 'Bed' },
    ],
  },
  {
    id: 'h4', title: 'Laterite weekender', place: 'Varkala', type: 'Villa', beds: 2, area: 1400, unit: 'sq ft', lakh: 98,
    detail: 'Two bedrooms and a long front verandah, five minutes from the cliff.',
    plan: [
      { x: 10, y: 10, w: 90, h: 75, label: 'Living' }, { x: 100, y: 10, w: 90, h: 38, label: 'Master' },
      { x: 100, y: 48, w: 90, h: 37, label: 'Bed' }, { x: 10, y: 85, w: 180, h: 35, label: 'Verandah' },
    ],
  },
  {
    id: 'h5', title: 'Corner plot, plan approved', place: 'Sreekaryam', type: 'Plot', beds: 0, area: 10, unit: 'cents', lakh: 64,
    detail: 'Two road-facing sides, clear title, and a sanctioned house plan we can build to.',
    plan: [{ x: 10, y: 10, w: 180, h: 110, label: 'Plot, 10 cents' }, { x: 45, y: 35, w: 110, h: 60, label: 'Approved plan' }],
  },
]

export const budgetBands = [
  { id: 'any', label: 'Any budget', test: () => true },
  { id: 'low', label: 'Under ₹80 lakh', test: (l: number) => l < 80 },
  { id: 'mid', label: '₹80 lakh to ₹1.5 crore', test: (l: number) => l >= 80 && l <= 150 },
  { id: 'high', label: 'Above ₹1.5 crore', test: (l: number) => l > 150 },
]

export const typeFilters: ('All' | HomeType)[] = ['All', 'Apartment', 'Villa', 'Plot']

export function formatPrice(lakh: number) {
  if (lakh < 100) return `₹${lakh} lakh`
  const cr = lakh / 100
  return `₹${Number.isInteger(cr) ? cr : cr.toFixed(2).replace(/0$/, '')} crore`
}

export const steps = [
  { title: 'Walk the space', text: 'We visit, measure and listen. For a home search we first ask how your week actually runs.' },
  { title: 'Draw it', text: 'Plans and a room-by-room design you can read, with materials named and priced.' },
  { title: 'Build with you', text: 'Our carpenters and site supervisor work to the drawing. You see progress every Friday.' },
  { title: 'Hand over', text: 'A snag walk, a clean home and a one-year check-in. Keys only when you are happy.' },
]
