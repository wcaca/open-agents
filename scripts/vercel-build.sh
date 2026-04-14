#!/bin/bash
set -e

# Install Bun
if ! command -v bun &> /dev/null; then
  curl -fsSL https://bun.sh/install | bash
fi

# Source bun path
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# Install dependencies
bun install

# Build the project
bun run build
