# INSTALLATION to a UBUNTU server

## Requirements

- `node` - at least v21

- `degit` - optional, used to copy a git repo without .git dir.
  - `npm i -g degit`

- `pnpm` - a faster, more efficient `npm`
  - `npm i -g pnpm`

- `nginx` - used as a reverse proxy.
  - `apt install nginx` - for more on `apt` see https://ubuntu.com/server/docs/package-management

## 1. Create a ligerbots system user and group

- `sudo useradd -r ligerbots -b /opt`
  - which adds `ligerbots` user to /etc/passwd with homedir set to `/opt/ligerbots`
  - and adds `ligerbots` group to /etc/group

## 2. Make the service directory

- `mkdir /opt/ligerbots`
- `chown ligerbots:ligerbots /opt/ligerbots`
- `cd /opt/ligerbots`

## 3. Clone the repo

- For development - to allow you to `git pull` etc.:
  - `git clone https://github.com/raisch/ligerbots-website-frontend.git`
  - `mv ./ligerbots-website-frontend ./frontend`

- For production - will make a copy of the repo without .git:
  - `degit raisch/ligerbots-website-frontend ./frontend`

## 4. Build service

- `chown -R ligerbots:ligerbots /opt/ligerbots/frontend` - change the owner of the service
- `cd /opt/ligerbots/frontend`
- `pnpm install` - install all service requirements

## 5. Run service

- `cd /opt/ligerbots/frontend`

- For development:
  - `pnpm run dev`

- For production:
  - `pnpm run build` -- builds the js bundles
  - `pnpm run preview`

## 6. Configure NGINX (must be root):

- `export RUNTIME='dev'` - use 'dev' for development and 'prod' for production
- `export DOMAIN="YOUR SERVER DOMAIN"` - replace with the domain of your base server.
- `cp ./system/$RUNTIME/nginx.conf /etc/nginx/sites-available/ligerbots.$DOMAIN`
- `ln -s /etc/nginx/sites-available/ligerbots.$DOMAIN /etc/nginx/sites-enabled/ligerbots.$DOMAIN`
- `nginx -t` - to test nginx's config, if there are issues listed here, fix them.
- `systemctl restart nginx` - restart the system service
- `systemctl status nginx` - and check its status.

Note: This configuration utilizes nginx as a reverse proxy such that
- incoming `http` and `wss` (websocket) requests to `ligerbots.$DOMAIN` are proxied to/from the node service, and
- incoming requests to `liberbots.$DOMAIN/assets` are proxied to the backend CMS service.

The only difference between the dev and prod configurations is the port number of the backend service
which is `4000` for dev and `4173` for prod.

### Install as a system service (must be root):

- `export RUNTIME='dev'` - use 'dev' for development and 'prod' for production
- `cp ./system/$RUNTIME/systemd.ligerbots.service /etc/systemd/system/ligerbots-frontend-$RUNTIME.service`
- `chmod 664 /etc/systemd/system/ligerbots-frontend-$RUNTIME.service`
- `systemctl daemon-reload`
- `systemctl reset-failed`
- `systemctl start ligerbots-frontend-$RUNTIME`
- `systemctl status ligerbots-frontend-$RUNTIME` to assure the service is running.
- `systemctl enable ligerbots-frontend-$RUNTIME` to set the service to start on boot.

Note: The only difference between the dev and prod configuration is the command the service uses to run,
which is `npm run dev` for dev and `npm run preview` for prod.

### Uninstall system service (must be root):
- `export RUNTIME='dev'` - use 'dev' for development and 'prod' for production
- `systemctl stop ligerbots-frontend-$RUNTIME`
- `systemctl disable ligerbots-frontend-$RUNTIME`
- `rm /etc/systemd/system/ligerbots-frontend-$RUNTIME.service`
- also remove any `ligerbots-front-end-$RUNTIME.*` files or related symlinks in `/usr/lib/systemd/system`  if they exist
- `systemctl daemon-reload`
- `systemctl reset-failed`

### To view service logs
- `journalctl --unit=ligerbots-frontend-$RUNTIME.service`
  - add `-f` to follow (view new entries as they occur), `ctrl-c` to end