import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FeedItem } from '../data'
import { ChevronLeftIcon, CloseIcon, DotsIcon, GearIcon, ListIcon, PauseIcon, PlayIcon, SearchIcon } from './Icons'
import { Vinyl } from './Vinyl'

interface Props {
  item: FeedItem | null
  open: boolean
  onClose: () => void
}

/** Seconds per word at 1.0×. Roughly the pace of a calm narrator. */
const WORD_SECONDS = 0.34
const SPEEDS = [1, 1.25, 1.5, 2]

interface Word {
  text: string
  section: number
  paragraph: number
}

function mmss(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

/**
 * The Peech reading view. The document is read aloud from the start; the word
 * being spoken is highlighted and the page follows it. Nothing is synthesised
 * here, the clock simply advances one word at a time.
 */
export function Reader({ item, open, onClose }: Props) {
  const [wordIdx, setWordIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const words = useMemo<Word[]>(() => {
    if (!item) return []
    const out: Word[] = []
    item.sections.forEach((sec, si) =>
      sec.paragraphs.forEach((p, pi) =>
        p.split(/\s+/).forEach((text) => out.push({ text, section: si, paragraph: pi })),
      ),
    )
    return out
  }, [item])

  // Where each part starts, so the part counter and the clock know their bounds.
  const partStarts = useMemo(() => {
    const starts: number[] = []
    words.forEach((w, i) => {
      if (starts[w.section] === undefined) starts[w.section] = i
    })
    return starts
  }, [words])

  const totalParts = item ? Math.max(item.sections.length, Math.round(item.minutes / 2.4)) : 0
  const part = words[wordIdx]?.section ?? 0
  const partStart = partStarts[part] ?? 0
  const partEnd = partStarts[part + 1] ?? words.length
  const partElapsed = (wordIdx - partStart) * WORD_SECONDS
  const partTotal = (partEnd - partStart) * WORD_SECONDS
  const speed = SPEEDS[speedIdx]

  useEffect(() => {
    if (open) {
      setWordIdx(0)
      setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [open, item?.id])

  // The clock: one word per tick, a little longer after sentence-ending punctuation.
  useEffect(() => {
    if (!playing || words.length === 0) return
    const current = words[wordIdx]
    if (!current) return
    if (wordIdx >= words.length - 1) {
      const t = setTimeout(() => setPlaying(false), 600)
      return () => clearTimeout(t)
    }
    const pause = /[.!?]$/.test(current.text) ? 1.8 : /[,;:]$/.test(current.text) ? 1.3 : 1
    const t = setTimeout(() => setWordIdx((i) => i + 1), (WORD_SECONDS * 1000 * pause) / speed)
    return () => clearTimeout(t)
  }, [playing, wordIdx, words, speed])

  // Keep the spoken word on screen, between the top bar and the player bar.
  useEffect(() => {
    const scroller = scrollRef.current
    const el = scroller?.querySelector<HTMLElement>('[data-cur="true"]')
    if (!scroller || !el) return
    const sr = scroller.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const topSafe = sr.top + 120
    const bottomSafe = sr.bottom - 160
    if (r.top < topSafe || r.bottom > bottomSafe) {
      // Scroll the text container only. scrollIntoView would also drag the
      // overflow-hidden phone viewport, shifting the whole screen.
      const target = scroller.scrollTop + (r.top - sr.top) - sr.height / 2 + r.height / 2
      scroller.scrollTo({ top: target, behavior: 'smooth' })
    }
  }, [wordIdx, open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ') {
        e.preventDefault()
        setPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const jumpTo = useCallback((i: number) => {
    setWordIdx(i)
    setPlaying(true)
  }, [])

  const cycleSpeed = () => setSpeedIdx((i) => (i + 1) % SPEEDS.length)

  let globalIndex = 0

  return (
    <div className="reader" data-open={open} aria-hidden={!open} role="dialog" aria-label="Reader">
      {item && (
        <>
          <div className="reader__top">
            <button className="reader__back" onClick={onClose} aria-label="Back to library">
              <ChevronLeftIcon />
            </button>
            <div className="pill pill--dark">
              <button className="pill__btn" aria-label="Search in document">
                <SearchIcon />
              </button>
              <button className="pill__btn" aria-label="Reading settings">
                <GearIcon />
              </button>
              <button className="pill__btn" aria-label="More">
                <DotsIcon />
              </button>
            </div>
          </div>

          <div className="reader__scroll" ref={scrollRef}>
            {item.sections.map((sec, si) => (
              <section key={sec.heading} className="part">
                {si > 0 && (
                  <div className="part__divider">
                    <button
                      className="part__play"
                      onClick={() => jumpTo(partStarts[si])}
                      aria-current={part === si ? 'true' : undefined}
                    >
                      {playing && part === si ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                      {playing && part === si ? `Playing Part ${si + 1}` : `Play Part ${si + 1}`}
                    </button>
                    <span className="part__rule" aria-hidden />
                  </div>
                )}
                <h2 className="part__heading">{sec.heading}</h2>
                {sec.paragraphs.map((p, pi) => (
                  <p key={pi} className="part__text">
                    {p.split(/\s+/).map((w) => {
                      const i = globalIndex++
                      const cur = i === wordIdx
                      const done = i < wordIdx
                      return (
                        <span key={i}>
                          <span
                            className="w"
                            data-cur={cur}
                            data-done={done}
                            onClick={() => jumpTo(i)}
                            role="button"
                            tabIndex={-1}
                          >
                            {w}
                          </span>{' '}
                        </span>
                      )
                    })}
                  </p>
                ))}
              </section>
            ))}
            <p className="part__end">End of preview · {item.minutes} min in full</p>
          </div>

          <div className="bar">
            <span className="bar__thumb" aria-hidden>
              <Vinyl size={44} hue={item.hue} spinning paused={!playing} speed={4} />
            </span>
            <span className="bar__text">
              <span className="bar__title">{item.title}</span>
              <span className="bar__time">
                {mmss(partElapsed)} <span className="bar__sep">/ {mmss(partTotal)}</span>
              </span>
            </span>
            <button className="bar__btn bar__parts" aria-label={`Part ${part + 1} of ${totalParts}, show contents`}>
              <span className="bar__badge">
                {part + 1}/{totalParts}
              </span>
              <ListIcon size={18} />
            </button>
            <button className="bar__btn bar__speed" onClick={cycleSpeed} aria-label={`Speed ${speed}×, change`}>
              x{Number.isInteger(speed) ? speed.toFixed(1) : String(speed)}
            </button>
            <button
              className="bar__btn bar__play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon size={20} /> : <PlayIcon size={20} style={{ marginLeft: 2 }} />}
            </button>
            <button className="bar__btn" onClick={onClose} aria-label="Close player">
              <CloseIcon size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
