# School site: dt.bsphosted.fr (Hostinger)

Every push to `main` runs `.github/workflows/school-site.yml`. It builds the open student-facing site
(`make_home.py` + `build_ipad_site.py`, plus `htaccess` here as `.htaccess`) and:

1. **Uploads it to `public_html` by FTPS**, using the repository secrets (GitHub → Settings → Secrets and
   variables → Actions) `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD` (from hPanel → Files → FTP Accounts). After the
   first run only changed files are sent (the action keeps `.ftp-deploy-sync-state.json` on the server). Files
   are never deleted from the server. If the secrets are missing the step is skipped.
2. Keeps a copy of the built site on the `hostinger-site` branch.

Hostinger's Git deployment (hPanel → Advanced → Git) is blocked when hPanel is opened as a managed client, so it
is not used. If FTPS will not connect, change `protocol: ftps` to `protocol: ftp` in the workflow.
If a change does not show, purge Hostinger's CDN cache (Websites → Performance → CDN) if it is on.
