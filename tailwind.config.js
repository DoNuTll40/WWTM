/* eslint-disable no-undef */
const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Noto Sans Thai Looped", "serif"],
    },
    extend: {},
  },
  safelist: [
    {
      pattern: /to-(red|blue|green|yellow|purple|gray|pink|indigo|teal|cyan|amber|lime)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /from-(red|blue|green|yellow|purple|gray|pink|indigo|teal|cyan|amber|lime)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
    {
      pattern: /bg-(red|blue|green|yellow|purple|gray|pink|indigo|teal|cyan|amber|lime)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  plugins: [],
});

