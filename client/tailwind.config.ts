import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
	  ],
  theme: {
	container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {
		colors: {
		  main: 'var(--main)',
		  overlay: 'var(--overlay)',
		  bg: 'var(--bg)',
		  bw: 'var(--bw)',
		  blank: 'var(--blank)',
		  text: 'var(--text)',
		  mtext: 'var(--mtext)',
		  border: 'var(--border)',
		  ring: 'var(--ring)',
		  ringOffset: 'var(--ring-offset)',
		  
		  secondaryBlack: '#212121', 
		},
		borderRadius: {
		  base: '5px'
		},
		boxShadow: {
		  shadow: 'var(--shadow)'
		},
		translate: {
		  boxShadowX: '4px',
		  boxShadowY: '4px',
		  reverseBoxShadowX: '-4px',
		  reverseBoxShadowY: '-4px',
		},
		fontWeight: {
		  base: '500',
		  heading: '700',
		},
	  },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
