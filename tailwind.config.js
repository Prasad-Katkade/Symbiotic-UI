/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
 safelist: [
    { pattern: /(bg|text|border)-(red|green|blue|purple|yellow|gray|zinc|black|white)-(100|400|500|600|800|900)/ },
    {
      pattern: /text-(red|green|blue|purple|yellow|gray|zinc|black|white)-(400|500|600|700|800|900)/,
    },
    { pattern: /text-(xs|sm|base|lg|xl|2xl)/ },
    { pattern: /(top|bottom|left|right)-(0|2|4|8|auto)/ },
    { pattern: /^(p|px|py|m|mx|my)-(0|1|2|4|6|8|10|12)$/ }
  ]
}
