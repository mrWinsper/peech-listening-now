import { useCallback, useEffect, useRef, useState } from 'react'
import { feed as seedFeed, initialLibrary, formatDuration, type FeedItem, type LibraryItem } from './data'
import { BookSheet } from './components/BookSheet'
import { LiveFeed } from './components/LiveFeed'
import { Player } from './components/Player'
import { Vinyl } from './components/Vinyl'
import {
  BatteryIcon,
  CheckIcon,
  DotsIcon,
  PersonIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  SignalIcon,
  SyncFailIcon,
  WifiIcon,
} from './components/Icons'

const TABS = ['All', 'To Start', 'Continue', 'Completed'] as const
type Tab = (typeof TABS)[number]

const TAB_STATUS: Record<Tab, LibraryItem['status'][] | null> = {
  All: null,
  'To Start': ['toStart'],
  Continue: ['continue'],
  Completed: ['completed'],
}

export default function App() {
  const [tab, setTab] = useState<Tab>('All')
  const [library, setLibrary] = useState<LibraryItem[]>(initialLibrary)
  const [feed, setFeed] = useState<FeedItem[]>(seedFeed)
  const [saved, setSaved] = useState<Set<string>>(() => new Set())

  const [selected, setSelected] = useState<FeedItem | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [nowPlaying, setNowPlaying] = useState<FeedItem | null>(null)
  const [playerOpen, setPlayerOpen] = useState(false)

  const [toast, setToast] = useState<{ text: string; key: number } | null>(null)
  const [toastShown, setToastShown] = useState(false)
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = useCallback((text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ text, key: Date.now() })
    setToastShown(true)
    toastTimer.current = window.setTimeout(() => setToastShown(false), 2200)
  }, [])

  // Live presence: listener counts drift by one now and then, so the rail feels current.
  useEffect(() => {
    const t = setInterval(() => {
      setFeed((f) => {
        const i = Math.floor(Math.random() * f.length)
        const delta = Math.random() < 0.5 ? -1 : 1
        return f.map((it, j) => (j === i ? { ...it, listeners: Math.max(2, it.listeners + delta) } : it))
      })
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const openSheet = (item: FeedItem) => {
    setSelected(item)
    setSheetOpen(true)
  }
  const closeSheet = useCallback(() => setSheetOpen(false), [])

  const toggleSave = (item: FeedItem) => {
    setSaved((s) => {
      const next = new Set(s)
      if (next.has(item.id)) {
        next.delete(item.id)
        showToast('Removed from bookmarks')
      } else {
        next.add(item.id)
        showToast('Saved to bookmarks')
      }
      return next
    })
  }

  const join = (item: FeedItem) => {
    setSheetOpen(false)
    setLibrary((lib) => {
      if (lib.some((l) => l.id === item.id)) return lib
      return [
        {
          id: item.id,
          title: item.title,
          meta: `${formatDuration(item.minutes)} - ${item.format}`,
          status: 'toStart',
          hue: item.hue,
          isNew: true,
        },
        ...lib,
      ]
    })
    showToast('Added to your library')
    // Let the sheet get out of the way before the player rises.
    window.setTimeout(() => {
      setNowPlaying(item)
      setPlayerOpen(true)
    }, 320)
  }

  const closePlayer = useCallback(() => setPlayerOpen(false), [])

  const openFromLibrary = (row: LibraryItem) => {
    const item = seedFeed.find((f) => f.id === row.id)
    if (!item) return
    setLibrary((lib) => lib.map((l) => (l.id === row.id ? { ...l, isNew: false, status: 'continue' } : l)))
    setNowPlaying(item)
    setPlayerOpen(true)
  }

  const visible = library.filter((l) => {
    const allowed = TAB_STATUS[tab]
    return allowed === null || allowed.includes(l.status)
  })
  const tabIndex = TABS.indexOf(tab)
  const selectedSaved = selected ? saved.has(selected.id) : false

  return (
    <div className="stage">
      <div className="phone">
        <div className="phone__viewport">
          <div className="screen" data-dimmed={sheetOpen}>
            <div className="status" aria-hidden>
              <span>9:41</span>
              <span className="status__right">
                <SignalIcon />
                <WifiIcon />
                <BatteryIcon />
              </span>
            </div>

            <header className="header">
              <h1>Library</h1>
              <div className="pill">
                <button className="pill__btn" aria-label="Search">
                  <SearchIcon />
                </button>
                <button className="pill__btn" aria-label="Profile">
                  <PersonIcon />
                </button>
              </div>
            </header>

            <nav className="tabs" role="tablist" aria-label="Library filter">
              {TABS.map((t) => (
                <button
                  key={t}
                  role="tab"
                  className="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
              <span className="tabs__ink" style={{ transform: `translateX(${tabIndex * 100}%)` }} aria-hidden />
            </nav>

            <div className="body">
              <div className="addrow">
                <button className="addrow__btn" aria-label="Add item">
                  <PlusIcon size={18} />
                </button>
              </div>

              <LiveFeed items={feed} saved={saved} onOpen={openSheet} />

              <div className="list" role="list">
                {visible.length === 0 && (
                  <div className="empty">
                    <b>Nothing here yet</b>
                    {tab === 'Completed'
                      ? 'Items you finish will show up here.'
                      : 'Items you have started will show up here.'}
                  </div>
                )}
                {visible.map((row) => (
                  <button
                    key={row.id}
                    role="listitem"
                    className="row"
                    onClick={() => openFromLibrary(row)}
                    disabled={row.status === 'failed'}
                    style={row.status === 'failed' ? { cursor: 'default' } : undefined}
                  >
                    {row.status === 'failed' ? (
                      <span className="row__icon row__icon--failed">
                        <SyncFailIcon />
                      </span>
                    ) : (
                      <span className="row__icon">
                        <Vinyl size={76} hue={row.hue} />
                        <span className="row__play">
                          <PlayIcon size={24} />
                        </span>
                      </span>
                    )}
                    <span className="row__text">
                      <span className="row__title">{row.title}</span>
                      <span
                        className={`row__meta${row.status === 'failed' ? ' row__meta--failed' : ''}${
                          row.isNew ? ' row__meta--new' : ''
                        }`}
                        style={{ display: 'block' }}
                      >
                        {row.isNew ? `Added · ${row.meta}` : row.meta}
                      </span>
                    </span>
                    <span className="row__more" aria-hidden>
                      <DotsIcon />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button className="fab" aria-label="Add to library">
              <PlusIcon size={30} />
            </button>
          </div>

          <div className="toast" data-show={toastShown} role="status" aria-live="polite">
            {toast && (
              <>
                <CheckIcon />
                {toast.text}
              </>
            )}
          </div>

          <BookSheet
            item={selected}
            open={sheetOpen}
            saved={selectedSaved}
            onClose={closeSheet}
            onToggleSave={toggleSave}
            onJoin={join}
          />

          <Player item={nowPlaying} open={playerOpen} onClose={closePlayer} />
        </div>
      </div>

      <p className="stage__note">
        <b>Peech · Listening now</b>
        <br />
        Prototype of a live rail on the Library screen. Tap a record to see the book and join.
      </p>
    </div>
  )
}
