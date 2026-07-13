/**
 * @param {string[]} filenames - Staged file paths.
 * @returns {string[]} File paths passed through for CLI commands.
 */
const toRelativePaths = (filenames) => [...filenames];

/**
 * @param {string} command - Base command to run.
 * @param {string[]} filenames - Staged file paths.
 * @returns {string} Command with quoted file arguments.
 */
const buildCommand = (command, filenames) => {
  const fileArgs = toRelativePaths(filenames).map(JSON.stringify).join(" ");

  return `${command} ${fileArgs}`;
};

/** @param {string[]} filenames - Staged file paths. */
const buildOxlintCommand = (filenames) => {
  // Payload-generated types use blanket eslint-disable; skip them.
  const filtered = filenames.filter((f) => !f.endsWith("payload-types.ts"));
  if (filtered.length === 0) return "";
  return buildCommand("pnpm exec oxlint --fix", filtered);
};

/** @param {string[]} filenames - Staged file paths. */
const buildOxfmtCommand = (filenames) => {
  // oxfmt ignores package-lock.json (exits 2), so skip it.
  const filtered = filenames.filter((f) => !f.endsWith("package-lock.json"));
  if (filtered.length === 0) return "";
  return buildCommand("pnpm exec oxfmt", filtered);
};

/** @type {import("lint-staged").Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}": [buildOxlintCommand, buildOxfmtCommand],
  "*.{json,jsonc,css,scss,html,yml,yaml,toml,graphql,gql}": buildOxfmtCommand,
};

export default config;
