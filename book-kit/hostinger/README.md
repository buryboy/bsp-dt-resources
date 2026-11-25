# School site: dt.bsphosted.fr (Hostinger)

Every push to `main` runs `.github/workflows/school-site.yml`, which builds the open student-facing site
(`make_home.py` + `build_ipad_site.py`, plus `htaccess` here as `.htaccess`) and force-pushes it to the
`hostinger-site` branch. Hostinger's Git deployment pulls that branch into the subdomain's `public_html`.

One-time setup in hPanel (Websites → dt.bsphosted.fr → Advanced → Git):
1. Empty the subdomain's `public_html` first (Hostinger only deploys into an empty folder). Download a backup zip of it if you like.
2. Repository: `https://github.com/buryboy/bsp-dt-resources.git` · Branch: `hostinger-site` · Directory: leave empty (public_html).
3. Click Create, then Deploy once.
4. Turn on Auto Deployment and copy the webhook URL it shows.
5. GitHub → buryboy/bsp-dt-resources → Settings → Webhooks → Add webhook: paste the URL, content type `application/json`, "Just the push event", Add.
After that, each push to `main` is live on dt.bsphosted.fr about a minute later. If the site uses Hostinger's CDN, purge it when a change doesn't show.
