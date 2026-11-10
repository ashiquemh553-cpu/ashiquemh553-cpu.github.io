# Ashique M H — UI/UX Portfolio

Static portfolio website for Ashique M H, Senior UI/UX Designer. Includes ten pages, project navigation, a theme switch, centered hover titles, a portrait, and a downloadable résumé. No build command or application server is required.

## Current status

The source repository is private. Uploading these files does not publish the website. Public publishing requires the owner's approval and a separate GitHub Pages setup step.

## GitHub Pages setup

This repository is named `ashiquemh553-cpu.github.io`, ready to serve as the account homepage. After public publishing is approved:

1. Confirm the repository's visibility and plan support GitHub Pages.
2. Open Settings → Pages.
3. Under Build and deployment, choose Deploy from a branch, then `main` and `/ (root)`, and save.
4. Open the deployment URL shown by GitHub after the build succeeds.

The `.nojekyll` file tells Pages to serve these files directly.

This export uses root-relative navigation. Use the account homepage repository described above or a custom domain. A repository hosted at a nested path such as /portfolio/ needs its asset and navigation paths adapted first.

## What visitors can access

GitHub Pages publishes this site to the public internet. A free account requires a public source repository for Pages. Visitors can view the portfolio, photo, professional email address, project descriptions, and résumé without signing in. This export allows search engines to index its pages.

The contact form creates an email draft in the visitor’s mail application. It does not store submissions or automatically send messages.

## Editing

The pages are regular HTML files. Styles and interaction code live in assets/site.css and assets/site.js. Replace assets/ashique-portrait.png to update the photo, and assets/ashique-mh-resume.pdf to update the résumé. Font license files are included in assets/fonts.

Project illustrations are schematic portfolio visuals, not production screenshots. No unverified case-study result metrics have been added.

## Setup references

- https://docs.github.com/en/pages/quickstart
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
