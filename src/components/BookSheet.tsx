import { useEffect, useRef } from 'react'
import { formatDuration, type FeedItem } from '../data'
import { BookmarkIcon, PlayIcon } from './Icons'
import { ListenerStack } from './LiveFeed'
import { Vinyl } from './Vinyl'

interface Props {
  item: FeedItem | null
  open: boolean
  saved: boolean
  onClose: () => void
  onToggleSave: (item: FeedItem) => void
  onJoin: (item: FeedItem) => void
}

const DISMISS_DISTANCE = 120
const DISMISS_VELOCITY = 0.11 // px per ms; a flick closes regardless of distance
const DRAG_SLOP = 6 // px of movement before a tap becomes a drag

export function BookSheet({ item, open, saved, onClose, onToggleSave, onJoin }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ startY: number; startT: number; dy: number; active: boolean; captured: boolean } | null>(null)

  // Focus the sheet when it opens; Escape closes it.
  useEffect(() => {
    if (!open) return
    const el = sheetRef.current
    const prev = document.activeElement as HTMLElement | null
    el?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  // Reset scroll each time a new item shows.
  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = 0
  }, [open, item?.id])

  const onPointerDown = (e: React.PointerEvent) => {
    if (!open || drag.current?.active) return
    // Only start a drag from the top of the scroll area, otherwise let it scroll.
    const scroller = scrollRef.current
    const fromScroller = scroller?.contains(e.target as Node)
    if (fromScroller && scroller && scroller.scrollTop > 0) return
    // Record the start, but do not capture yet: a plain tap must still reach its button.
    drag.current = { startY: e.clientY, startT: performance.now(), dy: 0, active: true, captured: false }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d?.active) return
    let dy = e.clientY - d.startY
    const el = sheetRef.current
    if (!d.captured) {
      if (Math.abs(dy) < DRAG_SLOP) return
      d.captured = true
      d.startY = e.clientY
      d.startT = performance.now()
      dy = 0
      el?.setPointerCapture(e.pointerId)
      el?.setAttribute('data-dragging', 'true')
    }
    // Damping above the resting position: it gives, but less and less.
    if (dy < 0) dy = -Math.pow(-dy, 0.7)
    d.dy = dy
    if (el) el.style.transform = `translateY(${dy}px)`
  }

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d?.active) return
    d.active = false
    if (!d.captured) return
    const el = sheetRef.current
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    el?.removeAttribute('data-dragging')
    if (el) el.style.transform = ''
    const elapsed = performance.now() - d.startT
    const velocity = d.dy / Math.max(elapsed, 1)
    if (d.dy > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY) onClose()
  }

  return (
    <>
      <div className="backdrop" data-open={open} onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        className="sheet"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        aria-hidden={!open}
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="sheet__grip" aria-hidden>
          <span />
        </div>

        {item && (
          <>
            <div className="sheet__scroll" ref={scrollRef}>
              <div className="book">
                <Vinyl size={96} hue={item.hue} spinning speed={8} />
                <div>
                  <h2 className="book__title" id="sheet-title">
                    {item.title}
                  </h2>
                  <p className="book__author">{item.author}</p>
                  <p className="book__meta">
                    {formatDuration(item.minutes)} · {item.format} · {item.chapters.length}+ parts
                  </p>
                </div>
              </div>

              <div className="liverow">
                <ListenerStack count={item.listeners} seed={item.hue} large />
                <span className="liverow__hint">
                  <span className="dot" aria-hidden />
                  listening right now
                </span>
              </div>

              <p className="why">
                Shown because you listen to <span className="why__tag">{item.matchTag}</span>
              </p>

              <p className="blurb">{item.blurb}</p>

              <div className="contents">
                <div className="contents__h">Contents</div>
                <ol>
                  {item.chapters.map((c, i) => (
                    <li key={c}>
                      <span>{c}</span>
                      <span>{formatDuration(Math.max(2, Math.round(item.minutes / (item.chapters.length + 1)) + (i % 2)))}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="sheet__actions">
              <button
                className="btn btn--icon"
                aria-pressed={saved}
                aria-label={saved ? 'Remove from bookmarks' : 'Save to bookmarks'}
                onClick={() => onToggleSave(item)}
              >
                <BookmarkIcon size={22} filled={saved} />
              </button>
              <button className="btn btn--primary" onClick={() => onJoin(item)}>
                <PlayIcon size={18} />
                Join listening
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
