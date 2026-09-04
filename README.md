# Peech · Listening now

Web prototype of a feature for the Peech audio reader: a live rail on the Library
screen that shows what people with similar interests are listening to right now.

Tap a record → a bottom sheet with the book, live listener count, why it was matched,
a short description and contents → **Save to bookmarks** or **Join listening**.
Joining adds the book to your library and opens the Peech reader from the start:
the text is read aloud with the current word highlighted, the page follows the
voice, parts are separated by a **Play Part N** button, and the player bar at the
bottom shows time, part counter, speed, pause and close, as in the app today.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173. On desktop the app renders inside a phone frame;
on a narrow viewport it fills the screen.

## What is real and what is mocked

- UI, motion and gestures are real: drag the sheet down to dismiss (a quick flick
  is enough), Escape closes, the screen behind scales back like on iOS.
- The feed, listener counts, book blurbs and the reader text are mocked. Counts
  drift by one every few seconds to feel live; the reader advances one word at a
  time on a timer, no speech is synthesised. Tap any word to jump there.
- Listeners are anonymous by design: the rail shows how many, never who.

## Stack

React 19 + Vite + TypeScript, plain CSS with design tokens taken from the app's
screenshots (`src/index.css`). No UI or animation libraries.

```
src/
  data.ts                mock feed + initial library
  App.tsx                Library screen, tabs, toast, state
  components/
    LiveFeed.tsx         the "Listening now" rail
    BookSheet.tsx        bottom sheet with drag-to-dismiss
    Reader.tsx           reading view: word highlight, parts, player bar
    Vinyl.tsx            the Peech record; spins when someone is listening
    Icons.tsx
```
