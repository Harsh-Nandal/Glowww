// Deliberately has zero imports from the `firebase` package. Importing
// `firebase/app` / `firebase/auth` executes SDK platform-detection code at
// module-load time that isn't safe in Next.js's Node-based prerendering —
// it crashes the whole static export (every page, not just checkout), since
// the broken chunk gets shared across build workers. Anything that only
// needs the boolean (e.g. the checkout page, rendered/prerendered on the
// server) must import it from here instead of from `./firebase`.
export const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
