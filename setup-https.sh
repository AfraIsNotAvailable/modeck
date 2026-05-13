#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if ! command -v mkcert &>/dev/null; then
  echo "mkcert not found. Install it:"
  echo "  Ubuntu/Debian: sudo apt install mkcert"
  echo "  Arch:          sudo pacman -S mkcert"
  echo "  Mac:           brew install mkcert"
  exit 1
fi

mkcert -install

IP=$(ip route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if($i=="src") print $(i+1); exit}')
echo "Generating cert for IP: $IP"

HOSTNAME=$(cat /etc/hostname)
mkcert \
  -key-file "$SCRIPT_DIR/server/key.pem" \
  -cert-file "$SCRIPT_DIR/server/cert.pem" \
  "$HOSTNAME.local" "$IP" localhost 127.0.0.1

echo ""
echo "Done! Certs written to server/key.pem and server/cert.pem"
echo ""
echo "Next: cd client && npm run build"
