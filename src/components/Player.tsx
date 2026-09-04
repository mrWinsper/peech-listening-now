import { useEffect, useState } from 'react'
import type { FeedItem } from '../data'
import { ChevronDownIcon, PauseIcon, PlayIcon, SkipIcon } from './Icons'
import { ListenerStack } from './LiveFeed'
import { Vinyl } from './Vinyl'

interface Props {
  item: FeedItem | null
  open: boolean
  onClose: () => void
}

function mmss(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/**
 * A stand-in for the real Peech player. It opens at the start of the book
 * (the prototype joins from the beginning, not from where the group is)
 * and only pretends to play: the clock ticks, nothing is synthesised.
 */
export function Player({ item, open, onClose }: Props) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const total = (item?.minutes ?? 0) * 60

  useEffect(() => {
    if (open) {
      setPos(0)
      setPlaying(true)
    } else {
      setPlaying(false)
    }
  }, [open, item?.id])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setPos((p) => Math.min(total, p + 1)), 1000)
    return () => clearInterval(t)
  }, [playing, total])

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

  const skip = (d: number) => setPos((p) => Math.min(total, Math.max(0, p + d)))

  return (
    <div
      className="player"
      data-open={open}
      style={{ '--h': item?.hue ?? 150 } as React.CSSProperties}
      aria-hidden={!open}
      role="dialog"
      aria-label="Player"
    >
      {item && (
        <>
          <div className="player__top">
            <button className="player__close" onClick={onClose} aria-label="Close player">
              <ChevronDownIcon />
            </button>
            <span className="player__kicker">Now playing · from the start</span>
            <span style={{ width: 40 }} />
          </div>

          <div className="player__art">
            <Vinyl size={250} hue={item.hue} spinning paused={!playing} speed={4} />
          </div>

          <h2 className="player__title">{item.title}</h2>
          <p className="player__author">{item.author}</p>

          <div className="player__scrub">
            <div className="player__bar" aria-hidden>
              <div className="player__fill" style={{ transform: `scaleX(${total ? pos / total : 0})` }} />
            </div>
            <div className="player__times">
              <span>{mmss(pos)}</span>
              <span>-{mmss(total - pos)}</span>
            </div>
          </div>

          <div className="player__ctl">
            <button className="skip" onClick={() => skip(-15)} aria-label="Back 15 seconds">
              <SkipIcon dir={-1} />
            </button>
            <button
              className="play"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon size={30} /> : <PlayIcon size={30} style={{ marginLeft: 4 }} />}
            </button>
            <button className="skip" onClick={() => skip(15)} aria-label="Forward 15 seconds">
              <SkipIcon dir={1} />
            </button>
          </div>

          <div className="player__foot">
            <span>1.0×</span>
            <ListenerStack count={item.listeners + 1} seed={item.hue} />
            <span>{item.format}</span>
          </div>
        </>
      )}
    </div>
  )
}
