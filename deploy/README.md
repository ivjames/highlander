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
cd /var/www/highlander && git status -sb   # expect: ## main...origin/main
cd /var/www/highlander && git pull
```

No reload needed — nginx serves the files directly. (Reload nginx only when
this `.conf` changes.)

**Check the branch first.** `git pull` reports "Already up to date" truthfully
about whatever branch the docroot happens to be on, so a checkout left on
another branch serves a frozen site while every deploy looks clean.
`ivjames/forest` did exactly that on this droplet for three weeks. If
`git status -sb` isn't `## main...origin/main`:

```sh
git pull origin main                # unblocks this deploy
git checkout -B main origin/main    # then pin it, or the next bare pull goes quiet again
git branch -u origin/main main
```

### Verify what is live

A 200 only proves nginx answered, not which build it served:

```sh
git fetch -q origin main
curl -s https://highlander.lab980.com/ | git hash-object --stdin
git rev-parse origin/main:index.html
```

Identical hashes mean the deploy landed. Fetch first and compare against
`origin/main`, not local `main` — a stale clone and a stale deploy hash
identically, so the local-branch form of this check passes in exactly the case
it exists to catch. Verified 2026-09-07: both sides read `8fc82b68…`, so the
live site matches `origin/main`.

## Notes

- The docroot is a live git checkout, so `deploy/`, `*.md`, and `.git/` are
  explicitly denied in the server block — only `index.html` and `assets/` are
  public. Confirmed live 2026-09-07: `/HANDOFF.md` and `/deploy/README.md`
  return 403 and `/.git/config` is not served. (`/.git/config` comes back 404
  rather than the 403 this block's `deny all` would produce, so something at
  server level is answering it first — the deny here is what should be relied
  on, since that server-level config is outside this repo.)
- **This vhost is enabled straight out of the checkout** — the symlink points
  into `deploy/nginx/`. So it is a tracked file on the droplet: never edit the
  installed copy, because `git pull` re-syncs it. The lab980 droplet's
  `fix-nginx-http2` sweep knows this and skips it by design, reporting it each
  night rather than rewriting it; anything that needs changing here is a commit
  to this repo.
- Assets under `/assets/` are cached 30 days; `index.html` is served
  `no-cache` so content edits appear on the next request.
