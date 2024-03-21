To be able to open front local you need:

1 - Generate a Cert and the key using the bash script this way: 

.\generate-cert.sh dev.notifichedigitali.it

2 - It will generate 2 files: dev.notifichedigitali.it.crt  & dev.notifichedigitali.it.key 

- Convert crt & key to .pem with openssl: 

openssl x509 -in dev.notifichedigitali.it.cert -out certi.pem
openssl rsa -in dev.notifichedigitali.it.key -out rsakey.pem

3 - Edit with notepad 2 PEM files and join them in one file, save file as _cert.pem
4 - Open Chrome / Settings / Certicates and import dev.notifichedigitali.it.cert to Trusted Store