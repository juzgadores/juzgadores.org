const shadcnDirs = ["ui", "magicui", "mixcnui", "animata", "roadmap-ui"];
const shadcnImportPatterns = shadcnDirs.map(
  (dir) => `^@/components/${dir}/.+$`,
);

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],

  plugins: ["perfectionist", "tailwindcss"],

  rules: {
    "perfectionist/sort-imports": [
      "error",
      {
        type: "alphabetical",
        order: "desc",
        groups: [
          ["builtin", "react", "next", "lodash"],
          "unknown",
          "shadcn",
          ["internal-type", "internal"],
          [
            "parent-type",
            "parent",
            "sibling-type",
            "sibling",
            "index-type",
            "index",
          ],
          "object",
          "css",
        ],
        customGroups: {
          value: {
            react: ["^react(-dom)?$"],
            next: ["^@?next/?"],
            css: "\\.css$",
            lodash: ["lodash*"],
            shadcn: shadcnImportPatterns,
          },
          type: {
            react: ["react", "react-dom"],
            next: ["next"],
          },
        },
        internalPattern: ["^@/.+$"],
      },
    ],

    "perfectionist/sort-named-imports": [
      "error",
      {
        type: "line-length",
        order: "desc",
        groupKind: "types-first",
      },
    ],

    "perfectionist/sort-jsx-props": [
      "error",
      {
        groups: [
          "key",
          "id",
          "value",
          "src",
          "className",
          "multiline",
          "unknown",
          "callback",
          "shorthand",
          "render",
        ],
        customGroups: {
          key: "key",
          id: "id",
          render: "render",
          value: "value",
          src: "src",
          className: "className*",
          callback: "on*",
        },
      },
    ],

    "perfectionist/sort-named-exports": [
      "error",
      {
        type: "line-length",
        order: "desc",
      },
    ],

    "perfectionist/sort-exports": [
      "error",
      {
        type: "line-length",
        order: "desc",
      },
    ],
  },
};
