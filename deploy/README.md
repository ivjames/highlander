# Deploy — highlander.lab980.com

Static site (`index.html` + `assets/`). No build step. Served by nginx from the
repo checkout at `/var/www/highlander`.

## First-time setup

The repo is already cloned at the docroot:
`git clone git@github.com:ivjames/highlander.git /var/www/highlander`

**Order matters:** the HTTPS block references a per-host cert, and nginx will
refuse to load an `ssl` server that points at cert files that don't exist yet.
So issue the cert *before* enabling the vhost.

```sh
# 1. Issue the per-host cert first (certbot uses the running nginx to answer
#    the ACME challenge; our vhost is not enabled yet, so it won't conflict):
sudo certbot certonly --nginx -d highlander.lab980.com

# 2. Now that /etc/letsencrypt/live/highlander.lab980.com/ exists, enable the
#    vhost (symlink so `git pull` keeps it current):
sudo ln -s /var/www/highlander/deploy/nginx/highlander.lab980.com.conf \
           /etc/nginx/sites-available/highlander.lab980.com.conf
sudo ln -s /etc/nginx/sites-available/highlander.lab980.com.conf \
           /etc/nginx/sites-enabled/

# 3. Test and reload:
sudo nginx -t && sudo systemctl reload nginx
```

Renewal is automatic via certbot's systemd timer; it reloads nginx on renew.
Confirm with `sudo certbot renew --dry-run`.

## Updating the site

```sh
cd /var/www/highlander && git pull
```

No reload needed — nginx serves the files directly. (Reload nginx only when
this `.conf` changes.)

## Notes

- The docroot is a live git checkout, so `deploy/`, `*.md`, and `.git/` are
  explicitly denied in the server block — only `index.html` and `assets/` are
  public.
- Assets under `/assets/` are cached 30 days; `index.html` is served
  `no-cache` so content edits appear on the next request.
