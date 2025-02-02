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
		  card: {
			DEFAULT: "hsl(var(--card))",
			foreground: "hsl(var(--card-foreground))",
		  },
		  popover: {
			DEFAULT: "hsl(var(--popover))",
			foreground: "hsl(var(--popover-foreground))",
		  },
		  destructive: {
			DEFAULT: "hsl(var(--destructive))",
			foreground: "hsl(var(--destructive-foreground))",
		  },
		  muted: {
			DEFAULT: "hsl(var(--muted))",
			foreground: "hsl(var(--muted-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
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
		animation: {
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
		  },
		
		  keyframes: {
			"accordion-down": {
			  from: { height: "0" },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: "0" },
			},
		  },
	  },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
