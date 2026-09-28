# GRAM-DISHA — Production VPS Deployment Guide

**Target Environment:** Linux VPS (Ubuntu 22.04/24.04 LTS) | Docker 24+ | Docker Compose v2

---

## 1. Prerequisites
- VPS with at least 2 vCPUs, 4 GB RAM, 40 GB SSD.
- Ports `80` and `443` open in security firewall.
- Domain DNS pointed to your VPS public IP.

---

## 2. Launching with Docker Compose
```bash
# Clone the repository
git clone https://github.com/team-ergon/gram-disha.git
cd gram-disha/deploy

# Launch production stack (MySQL + FastAPI + React Nginx)
docker compose up -d --build

# Verify container health
docker compose ps
```

---

## 3. Database Initialization
The MySQL container automatically mounts and executes the initialization scripts:
1. `01_schema.sql` (Tables & Relations)
2. `02_sources.sql` (Provenance registers)
3. `03_schemes.sql` (Baseline rules)

---

## 4. SSL Termination with Certbot
```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d gramdisha.in -d www.gramdisha.in
```
