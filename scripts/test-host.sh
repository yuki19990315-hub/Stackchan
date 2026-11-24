#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test tests/*.test.mjs
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
"${CC:-cc}" -Wall -Wextra -Werror -fsanitize=undefined tests/pcm-test.c -o "$tmp/pcm-test"
"$tmp/pcm-test"
echo "PCM exhaustive test PASS"
