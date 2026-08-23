import next from "eslint-config-next";
import nextTypeScript from "eslint-config-next/typescript";
const config = [...next, ...nextTypeScript, { ignores: [".next/**", "node_modules/**", "public/generated/**", "prototypes/**"] }, { rules: { "@typescript-eslint/no-explicit-any": "off", "react-hooks/set-state-in-effect": "off", "@typescript-eslint/no-empty-object-type": "off", "@typescript-eslint/no-require-imports": "off", "no-var": "off", "prefer-const": "off" } }];
export default config;
