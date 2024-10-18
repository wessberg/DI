import shared from "@wessberg/ts-config/eslint.config.js";

export default [
	...shared,
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/class-literal-property-style": "off"
		}
	}
];
