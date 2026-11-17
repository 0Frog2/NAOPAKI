/* =========================================================================
   NAOPAKI — PROJECT LIST
   This is the only file you need to edit to add, remove or reorder work.

   Each project:
     slug   – short id used in the link (lowercase, no spaces)  e.g. "sleepwalk"
     title  – shown in capitals
     type   – "PHOTO" or "VIDEO" (used by the filter)
     year   – e.g. "2026"
     line   – one short line (optional, keep it minimal)
     cover  – image shown in the work list / grid
     media  – what shows when the project opens, top to bottom:
                { type: "image",   src: "assets/img/work/file.jpg", alt: "..." }
                { type: "youtube", id: "dQw4w9WgXcQ" }            ← the code after watch?v=
                { type: "vimeo",   id: "76979871" }               ← the number in the Vimeo link
                { type: "video",   src: "assets/video/clip.mp4", poster: "..." }  ← small clips only
   Images are laid out automatically: tall (portrait) photos sit side by side,
   wide (landscape) photos and videos take the full width.
   ========================================================================= */

const IMG = "assets/img/work/";
const PLACEHOLDER_VIDEO = { type: "video", src: "assets/video/placeholder-loop.mp4", poster: "assets/video/placeholder-poster.jpg" };

window.NAOPAKI_PROJECTS = [
  {
    slug: "sleepwalk", title: "Sleepwalk", type: "PHOTO", year: "2026",
    line: "Placeholder — editorial shot after dark.",
    cover: IMG + "p01-1.jpg",
    media: [1, 2, 3, 4].map(i => ({ type: "image", src: IMG + `p01-${i}.jpg`, alt: "Sleepwalk — frame " + i }))
  },
  {
    slug: "concrete-hymn", title: "Concrete Hymn", type: "VIDEO", year: "2026",
    line: "Placeholder — music video.",
    cover: IMG + "p02-1.jpg",
    media: [PLACEHOLDER_VIDEO, { type: "image", src: IMG + "p02-2.jpg", alt: "Concrete Hymn — still" }, { type: "image", src: IMG + "p02-3.jpg", alt: "Concrete Hymn — still" }]
  },
  {
    slug: "backwards", title: "Backwards", type: "PHOTO", year: "2025",
    line: "Placeholder — portrait series.",
    cover: IMG + "p03-1.jpg",
    media: [1, 2, 3, 4].map(i => ({ type: "image", src: IMG + `p03-${i}.jpg`, alt: "Backwards — frame " + i }))
  },
  {
    slug: "no-signal", title: "No Signal", type: "VIDEO", year: "2025",
    line: "Placeholder — short film.",
    cover: IMG + "p04-1.jpg",
    media: [PLACEHOLDER_VIDEO, { type: "image", src: IMG + "p04-2.jpg", alt: "No Signal — still" }, { type: "image", src: IMG + "p04-4.jpg", alt: "No Signal — still" }]
  },
  {
    slug: "iron-bloom", title: "Iron Bloom", type: "PHOTO", year: "2025",
    line: "Placeholder — artist press shots.",
    cover: IMG + "p05-1.jpg",
    media: [1, 2, 3, 4].map(i => ({ type: "image", src: IMG + `p05-${i}.jpg`, alt: "Iron Bloom — frame " + i }))
  },
  {
    slug: "low-light", title: "Low Light", type: "VIDEO", year: "2025",
    line: "Placeholder — live session.",
    cover: IMG + "p06-1.jpg",
    media: [PLACEHOLDER_VIDEO, { type: "image", src: IMG + "p06-2.jpg", alt: "Low Light — still" }, { type: "image", src: IMG + "p06-3.jpg", alt: "Low Light — still" }]
  },
  {
    slug: "dead-air", title: "Dead Air", type: "PHOTO", year: "2024",
    line: "Placeholder — cover artwork shoot.",
    cover: IMG + "p07-1.jpg",
    media: [1, 2, 3, 4].map(i => ({ type: "image", src: IMG + `p07-${i}.jpg`, alt: "Dead Air — frame " + i }))
  },
  {
    slug: "turn", title: "Turn", type: "VIDEO", year: "2024",
    line: "Placeholder — visualiser.",
    cover: IMG + "p08-1.jpg",
    media: [PLACEHOLDER_VIDEO, { type: "image", src: IMG + "p08-2.jpg", alt: "Turn — still" }, { type: "image", src: IMG + "p08-3.jpg", alt: "Turn — still" }]
  }
];
