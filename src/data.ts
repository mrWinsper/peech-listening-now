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
  /** The first parts of the document, as the reader shows them. */
  sections: Section[]
}

export interface Section {
  heading: string
  paragraphs: string[]
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
    sections: [
      {
        heading: '1 Executive summary',
        paragraphs: [
          'Marketing budgets grew for the third year in a row, but the money is not going where it went before. Teams told us they are spending less on broad awareness and more on channels they can measure the same week. Short-form video is now the most common first purchase for a new budget line, ahead of paid search for the first time since we began asking.',
        ],
      },
      {
        heading: '2 Where budgets moved',
        paragraphs: [
          'The biggest shift is not a channel but a habit. Nearly half of respondents now review spend weekly rather than quarterly, and the teams that do report higher confidence in every other answer in this survey. Email kept its place as the channel with the best reported return, a result that has not changed in six editions of this report.',
        ],
      },
    ],
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
    sections: [
      {
        heading: 'Choosing what to work on',
        paragraphs: [
          'The first step is to decide what to work on, and this is harder than it looks, because you cannot know in advance which fields will suit you. The best you can do is to pick something you are drawn to, start, and pay attention to whether the interest grows. Curiosity that survives contact with the boring parts of a subject is the signal to trust.',
        ],
      },
      {
        heading: 'Working hard, honestly',
        paragraphs: [
          'Once you have found the thing, the work itself is mostly a matter of showing up and being honest about what is actually good. Most people overestimate how much talent matters and underestimate how much of great work is simply continuing after the point where it stops being fun for a while.',
        ],
      },
    ],
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
    sections: [
      {
        heading: '1 Introduction',
        paragraphs: [
          'Recurrent networks have been the standard approach to sequence transduction, but their sequential nature limits how much of the computation can run in parallel. The model described in this paper removes recurrence entirely and relies on attention to draw global dependencies between input and output, which allows far more parallel training.',
        ],
      },
      {
        heading: '2 Model architecture',
        paragraphs: [
          'The encoder maps an input sequence of symbol representations to a sequence of continuous representations. The decoder then generates an output sequence one element at a time, consuming the previously generated symbols as additional input. Both sides are built from stacked layers of self-attention and simple position-wise feed-forward networks.',
        ],
      },
    ],
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
    sections: [
      {
        heading: 'The year in numbers',
        paragraphs: [
          'Businesses on Stripe processed more volume this year than in the previous two combined, and the fastest growth came from companies that did not exist when the last letter was written. That pattern, new companies growing faster than the aggregate, has held for a decade and is the most reliable thing we know about the internet economy.',
        ],
      },
      {
        heading: 'Underrated things',
        paragraphs: [
          'We continue to think that boring infrastructure is underrated. Faster settlement, better fraud tooling and cleaner tax handling are not exciting to describe, but each one changed the growth rate of tens of thousands of businesses this year, and none of them would have made a headline.',
        ],
      },
    ],
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
    sections: [
      {
        heading: 'Book II',
        paragraphs: [
          'Begin the morning by saying to thyself, I shall meet with the busy-body, the ungrateful, arrogant, deceitful, envious, unsocial. All these things happen to them by reason of their ignorance of what is good and evil.',
        ],
      },
      {
        heading: 'Book II, continued',
        paragraphs: [
          'Remember how long thou hast been putting off these things, and how often thou hast received an opportunity from the gods, and yet dost not use it. Thou must now at last perceive of what universe thou art a part, and of what administrator of the universe thy existence is an efflux.',
        ],
      },
    ],
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
    sections: [
      {
        heading: 'Chapter I',
        paragraphs: [
          'In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since. Whenever you feel like criticizing any one, he told me, just remember that all the people in this world have not had the advantages that you have had.',
          'He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.',
        ],
      },
      {
        heading: 'Chapter II',
        paragraphs: [
          'About half way between West Egg and New York the motor road hastily joins the railroad and runs beside it for a quarter of a mile, so as to shrink away from a certain desolate area of land. This is a valley of ashes.',
        ],
      },
    ],
  },
]

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} h ${m} min` : `${h} h`
}
