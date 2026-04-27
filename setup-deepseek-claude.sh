#!/usr/bin/env bash
set -euo pipefail

echo "== Check Node.js version =="
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found. Please install Node.js 18+ first."
  exit 1
fi

NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node.js $(node -v) detected. Need Node.js 18+."
  exit 1
fi
echo "OK: Node.js version $(node -v)"

echo
if ! command -v claude >/dev/null 2>&1; then
  echo "ERROR: claude command not found in PATH."
  echo "Install Claude Code CLI first, then run this script again."
  exit 1
fi
echo "OK: claude command found"

echo
read -r -s -p "Paste your DeepSeek API Key: " DEEPSEEK_API_KEY
echo
if [ -z "${DEEPSEEK_API_KEY}" ]; then
  echo "ERROR: API Key cannot be empty."
  exit 1
fi

ZSHRC="${HOME}/.zshrc"
BLOCK_START="# >>> Claude Code + DeepSeek setup >>>"
BLOCK_END="# <<< Claude Code + DeepSeek setup <<<"

echo "== Update ~/.zshrc =="
touch "$ZSHRC"

# Remove old managed block if it exists.
TMP_FILE="$(mktemp)"
awk -v start="$BLOCK_START" -v end="$BLOCK_END" '
  $0 == start {skip=1; next}
  $0 == end {skip=0; next}
  !skip {print}
' "$ZSHRC" > "$TMP_FILE"
mv "$TMP_FILE" "$ZSHRC"

# Append new managed block.
cat >> "$ZSHRC" <<EOF

$BLOCK_START
export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_AUTH_TOKEN="${DEEPSEEK_API_KEY}"
export ANTHROPIC_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
export CLAUDE_CODE_EFFORT_LEVEL="max"
$BLOCK_END
EOF

echo "OK: ~/.zshrc updated"

echo "== Load environment for current session =="
# shellcheck disable=SC1090
source "$ZSHRC"

echo "== Verify key variables =="
echo "ANTHROPIC_BASE_URL=$ANTHROPIC_BASE_URL"
echo "ANTHROPIC_MODEL=$ANTHROPIC_MODEL"
echo "CLAUDE_CODE_SUBAGENT_MODEL=$CLAUDE_CODE_SUBAGENT_MODEL"
echo "CLAUDE_CODE_EFFORT_LEVEL=$CLAUDE_CODE_EFFORT_LEVEL"

echo
echo "Setup complete."
echo "Run 'claude' then '/status' to confirm model and endpoint."
