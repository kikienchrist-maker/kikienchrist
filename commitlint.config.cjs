module.exports = {
  "extends": [
    "@commitlint/config-conventional"
  ],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "perf",
        "refactor",
        "docs",
        "style",
        "test",
        "chore",
        "build",
        "ci",
        "revert"
      ]
    ],
    "type-case": [
      2,
      "always",
      "lower-case"
    ],
    "type-empty": [
      2,
      "never"
    ],
    "scope-case": [
      2,
      "always",
      "lower-case"
    ],
    "scope-empty": [
      1,
      "never"
    ],
    "subject-case": [
      2,
      "always",
      "sentence-case"
    ],
    "subject-empty": [
      2,
      "never"
    ],
    "subject-max-length": [
      2,
      "always",
      72
    ],
    "body-leading-blank": [
      1,
      "always"
    ],
    "footer-leading-blank": [
      1,
      "always"
    ]
  }
};