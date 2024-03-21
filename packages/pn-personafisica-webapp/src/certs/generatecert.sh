#!/usr/bin/env bash

# print usage
DOMAIN=$1
if [ -z "$1" ]; then
    echo "USAGE: $0 tld"
    echo ""
    echo "This will generate a non-secure self-signed wildcard certificate for "
    echo "a given development tld."
    echo "This should only be used in a development environment."
    exit
fi

# Add wildcard
WILDCARD="*.$DOMAIN"

# Set our variables
cat <<EOF > req.cnf
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no
[req_distinguished_name]
C = US
ST = MD
O = home
localityName = home
commonName = $WILDCARD
organizationalUnitName = home
emailAddress = $(git config user.email)
[v3_req]
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1   = $DOMAIN
DNS.2   = *.$DOMAIN
DNS.3   = localhost
IP   = 127.0.0.1
EOF

# Generate our Private Key, and Certificate directly
openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
  -keyout "$DOMAIN.key" -config req.cnf \
  -out "$DOMAIN.crt" -sha256
rm req.cnf

echo ""
echo "Next manual steps:"
echo "- Use $DOMAIN.crt and $DOMAIN.key to configure Apache/nginx"
echo "- Import $DOMAIN.crt into Chrome settings: chrome://settings/certificates > tab 'Authorities'"
