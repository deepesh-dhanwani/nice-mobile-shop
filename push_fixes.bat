@echo off
git add -A
git commit -m "Fix Netlify API redirects and clean up admin login to remove exposed master password message"
git push origin main
