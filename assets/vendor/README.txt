motion-lite.js
==============
Third-party code: Motion (formerly Framer Motion's animation engine), version 13.4.0,
MIT licensed. See LICENSE-motion.md. https://motion.dev

This is not the full library. It is a tree-shaken build containing only the two
functions the site uses (`animate` from "motion/mini" and `inView` from "motion"),
exposed as window.MotionLite. About 10 KB (4 KB gzipped) versus 147 KB for the full bundle.

Rebuild:
  npm install motion@13.4.0 esbuild
  entry.js:
    import { animate } from "motion/mini";
    import { inView } from "motion";
    window.MotionLite = { animate, inView };
  npx esbuild entry.js --bundle --minify --format=iife --target=es2019 --legal-comments=none --outfile=motion-lite.js
