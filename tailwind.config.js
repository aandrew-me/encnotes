/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"text-primary": "var(--text-primary)",
				"text-secondary": "var(--text-secondary)",
				"text-muted": "var(--text-muted)",
				"text-opposite": "var(--text-opposite)",
				"bg-primary": "var(--bg-primary)",
				"bg-secondary": "var(--bg-secondary)",
				"selected": "var(--selected)",
			},
		},
	},
	plugins: [],
};
