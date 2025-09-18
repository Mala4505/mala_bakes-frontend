// module.exports = {
//   content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         base: 'var(--color-base)',
//         text: 'var(--color-text)',
//         muted: 'var(--color-muted)',
//         accent: 'var(--color-accent)',
//       },
//     },
//   },
//   plugins: [],
// };

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#dfe2b9',       // light background
        // base: '#f0f4f5',       // light background
        text: '#2f383b',       // primary text
        muted: '#d0d8da',      // borders, secondary text
        accent: '#1e2426',     // buttons, highlights
        deep: '#121617',       // hover states, shadows
      },
    },
  },
  plugins: [],
};
