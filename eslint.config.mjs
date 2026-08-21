import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Assets servidos como estão: bundles gerados pela ferramenta de design,
    // a LP entregue pronta e a tag em JS puro das páginas estáticas. Nada aqui
    // passa pelo pipeline de build do Next, então as regras de React/TS não se
    // aplicam.
    "public/**",
    // Exportações originais do design — fonte para scripts/montar-paginas-design.mjs.
    "design/**",
  ]),
]);

export default eslintConfig;
