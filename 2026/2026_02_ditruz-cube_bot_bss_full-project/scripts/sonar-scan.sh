#!/bin/bash
# Usage: sonar-scan.sh <project-key> <path-to-csproj>
# Reads SONAR_SCANNER_HOST and SONAR_SCANNER_TOKEN from .env at the repo root
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env file not found at $ENV_FILE"
  echo "Copy .env.example to .env and fill in SONAR_SCANNER_TOKEN"
  exit 1
fi

# Load .env
set -a
source "$ENV_FILE"
set +a

if [ -z "$SONAR_SCANNER_TOKEN" ]; then
  echo "ERROR: SONAR_SCANNER_TOKEN is not set in .env"
  exit 1
fi

# Auto-install dotnet-sonarscanner if missing
if ! dotnet tool list --global 2>/dev/null | grep -q dotnet-sonarscanner; then
  echo "Installing dotnet-sonarscanner..."
  dotnet tool install --global dotnet-sonarscanner
fi

# Ensure dotnet tools are on PATH
export PATH="$PATH:$HOME/.dotnet/tools"

PROJECT_KEY="$1"
CSPROJ_PATH="$2"
PROJECT_DIR="$(dirname "$CSPROJ_PATH")"

echo "Starting SonarQube scan for: $PROJECT_KEY"
echo "Host: $SONAR_SCANNER_HOST"

cd "$PROJECT_DIR"

dotnet sonarscanner begin \
  /key:"$PROJECT_KEY" \
  /d:sonar.host.url="$SONAR_SCANNER_HOST" \
  /d:sonar.login="$SONAR_SCANNER_TOKEN"

dotnet build --no-incremental

dotnet sonarscanner end \
  /d:sonar.login="$SONAR_SCANNER_TOKEN"

echo "Scan complete — view results at $SONAR_SCANNER_HOST/dashboard?id=$PROJECT_KEY"
