# Deploy — highlander.lab980.com

Static site (`index.html` + `assets/`). No build step. Served by nginx from the
repo checkout at `/var/www/highlander`.

## First-time setup

```sh
# 1. Repo is already cloned at the docroot:
#    git clone git@github.com:ivjames/highlander.git /var/www/highlander

# 2. Install the server block (symlink so `git pull` keeps it current):
sudo ln -s /var/www/highlander/deploy/nginx/highlander.lab980.com.conf \
           /etc/nginx/sites-available/highlander.lab980.com.conf
sudo ln -s /etc/nginx/sites-available/highlander.lab980.com.conf \
           /etc/nginx/sites-enabled/

# 3. Test config and reload:
sudo nginx -t && sudo systemctl reload nginx
```

## TLS

The config assumes a **shared wildcard `*.lab980.com` certificate** at
`/etc/letsencrypt/live/lab980.com/`. If lab980 instead issues a per-host cert,
run:

```sh
sudo certbot --nginx -d highlander.lab980.com
```

and point `ssl_certificate` / `ssl_certificate_key` at
`/etc/letsencrypt/live/highlander.lab980.com/`.

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
