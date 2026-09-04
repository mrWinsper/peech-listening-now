import type { FeedItem } from '../data'
import { BookmarkIcon } from './Icons'
import { Vinyl } from './Vinyl'

/**
 * Anonymous listeners. Peech never shows who is listening, only how many,
 * so avatars are colour, not faces or initials.
 */
export function ListenerStack({
  count,
  seed,
  large = false,
}: {
  count: number
  seed: number
  large?: boolean
}) {
  const shown = Math.min(3, count)
  return (
    <span className={`listeners${large ? ' listeners--lg' : ''}`}>
      <span className="stack" aria-hidden>
        {Array.from({ length: shown }, (_, i) => (
          <span
            key={i}
            className="stack__a"
            style={{ background: `hsl(${(seed + i * 47) % 360} 50% ${52 - i * 6}%)` }}
          />
        ))}
      </span>
      <span className="listeners__n">{count}</span>
    </span>
  )
}

interface Props {
  items: FeedItem[]
  saved: Set<string>
  onOpen: (item: FeedItem) => void
}

export function LiveFeed({ items, saved, onOpen }: Props) {
  return (
    <section className="live" aria-labelledby="live-title">
      <div className="live__head">
        <h2 className="live__title" id="live-title">
          <span className="dot" aria-hidden />
          Listening now
        </h2>
        <span className="live__sub">People with your interests</span>
      </div>
      <div className="rail" role="list">
        {items.map((item, i) => (
          <button
            key={item.id}
            role="listitem"
            className="card"
            style={{ '--i': i } as React.CSSProperties}
            onClick={() => onOpen(item)}
            aria-label={`${item.title} by ${item.author}, ${item.listeners} listening now`}
          >
            {saved.has(item.id) && (
              <span className="card__saved" aria-label="Saved">
                <BookmarkIcon size={16} filled />
              </span>
            )}
            <div className="card__disc">
              <Vinyl size={84} hue={item.hue} spinning speed={9 + (i % 3) * 2} />
            </div>
            <div>
              <div className="card__title">{item.title}</div>
              <div className="card__author">{item.author}</div>
            </div>
            <div className="card__foot">
              <ListenerStack count={item.listeners} seed={item.hue} />
              <span className="tag">{item.format}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
