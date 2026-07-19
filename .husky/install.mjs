// .husky/install.mjs
if (process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

const husky = (await import("husky")).default;
husky();