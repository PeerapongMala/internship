#!/bin/bash
# run-ftp.sh — Startup script for fauria/vsftpd container
# Remaps project env vars (.env) → vsftpd expected env vars

export FTP_PASS="${FTP_PASSWORD}"
export PASV_ADDRESS="${FTP_PASV_ADDRESS}"
export PASV_MIN_PORT="${FTP_PASV_MIN_PORT}"
export PASV_MAX_PORT="${FTP_PASV_MAX_PORT}"

# Disable DNS reverse lookup (fixes 16-second connection delay in Docker)
sed -i 's|/usr/sbin/vsftpd|echo reverse_lookup_enable=NO >> /etc/vsftpd/vsftpd.conf \&\& /usr/sbin/vsftpd|' /usr/sbin/run-vsftpd.sh

exec /usr/sbin/run-vsftpd.sh
