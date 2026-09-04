export type Format = 'PDF' | 'EPUB' | 'TXT' | 'DOCX' | 'Web'

export interface FeedItem {
  id: string
  title: string
  author: string
  format: Format
  minutes: number
  listeners: number
  /** The interest from the viewer's own library that caused this match. */
  matchTag: string
  /** Hue for the vinyl label — every item gets its own colour, like a real record sleeve. */
  hue: number
  blurb: string
  chapters: string[]
}

export type LibraryStatus = 'failed' | 'toStart' | 'continue' | 'completed'

export interface LibraryItem {
  id: string
  title: string
  meta: string
  status: LibraryStatus
  hue?: number
  isNew?: boolean
}

export const initialLibrary: LibraryItem[] = [
  { id: 'substack', title: 'substack.com', meta: 'Failed', status: 'failed' },
  {
    id: 'tiktok',
    title: 'TikTok_Next_2026_Trend_Report_NA',
    meta: '20 min - PDF',
    status: 'continue',
  },
]

export const feed: FeedItem[] = [
  {
    id: 'state-of-marketing',
    title: 'State of Marketing 2026',
    author: 'HubSpot Research',
    format: 'PDF',
    minutes: 52,
    listeners: 17,
    matchTag: 'Marketing trends',
    hue: 152,
    blurb:
      'A survey of 1,400 marketers on where budgets, channels and creative are heading this year. Short-form video keeps winning, email refuses to die, and AI moves from experiment to line item.',
    chapters: ['Executive summary', 'Where budgets moved', 'Channels that grew', 'The AI line item'],
  },
  {
    id: 'great-work',
    title: 'How to Do Great Work',
    author: 'Paul Graham',
    format: 'Web',
    minutes: 48,
    listeners: 23,
    matchTag: 'Essays',
    hue: 32,
    blurb:
      'A long essay on picking a field, working on what you are curious about, and staying with it long enough for the compounding to kick in. Saved from a web page, read aloud in one sitting.',
    chapters: ['Choosing what to work on', 'Curiosity as a compass', 'Working hard, honestly', 'Staying the course'],
  },
  {
    id: 'attention',
    title: 'Attention Is All You Need',
    author: 'Vaswani et al.',
    format: 'PDF',
    minutes: 35,
    listeners: 41,
    matchTag: 'AI research',
    hue: 258,
    blurb:
      'The paper that introduced the Transformer. Dense on the page, surprisingly listenable when the equations are skipped and the ideas are read in order.',
    chapters: ['Introduction', 'Model architecture', 'Why self-attention', 'Results'],
  },
  {
    id: 'stripe-letter',
    title: 'Stripe Annual Letter 2025',
    author: 'Patrick & John Collison',
    format: 'PDF',
    minutes: 40,
    listeners: 12,
    matchTag: 'Business',
    hue: 210,
    blurb:
      'A yearly letter on the state of the internet economy: payment volume, the businesses that grew fastest, and what the founders think is underrated right now.',
    chapters: ['The year in numbers', 'What grew', 'Underrated things', 'Looking ahead'],
  },
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    format: 'EPUB',
    minutes: 320,
    listeners: 31,
    matchTag: 'Philosophy',
    hue: 8,
    blurb:
      'Private notes of a Roman emperor to himself, never meant to be published. Twelve books of reminders on patience, duty and how to meet the day.',
    chapters: ['Book I', 'Book II', 'Book III', 'Book IV'],
  },
  {
    id: 'gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    format: 'EPUB',
    minutes: 290,
    listeners: 9,
    matchTag: 'Classics',
    hue: 48,
    blurb:
      'A summer on Long Island, a mansion with the lights always on, and a narrator who is never quite sure what he is looking at. Public domain, in nine chapters.',
    chapters: ['Chapter I', 'Chapter II', 'Chapter III', 'Chapter IV'],
  },
]

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
