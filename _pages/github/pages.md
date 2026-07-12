---
layout: single
title: GitHub Pages
permalink: /github/pages/
---

## What Is GitHub Pages?

GitHub Pages is a free static site hosting service that publishes websites directly from a GitHub repository. You push your site files to a repo, and GitHub serves them at `username.github.io` or a custom domain. No server to manage, no runtime to patch, no database to maintain. It just serves files.

The trade-off is straightforward: you get free, reliable hosting with HTTPS, but your site has to be static. No server-side processing, no PHP, no database queries at request time. For documentation, portfolios, blogs, and project landing pages, that is exactly what you want.

## How It Powers This Site

This site is built with [Jekyll](https://jekyllrb.com/), a static site generator, and hosted on GitHub Pages. Here is how the pieces fit together:

- **Repository** -- All site content, layouts, CSS, and configuration live in a single GitHub repo. Every change is version-controlled, just like code.
- **Markdown authoring** -- Pages are written in Markdown with YAML front matter. Jekyll converts them to HTML during the build.
- **Jekyll build** -- When you push to the repo, GitHub Pages runs Jekyll automatically. Layouts, includes, Liquid templates, and Sass all compile into a finished static site.
- **Custom domain** -- DNS is handled through Cloudflare (DNS-only, grey-clouded). GitHub Pages serves the site, Cloudflare resolves the domain.
- **Free HTTPS** -- GitHub Pages provides a TLS certificate for the custom domain automatically.

## Key Concepts

| Concept | What It Means |
|---|---|
| **Static site** | Pre-built HTML files. No server-side code executes when a visitor loads a page. |
| **Jekyll** | A Ruby-based static site generator. Reads Markdown + Liquid templates and outputs HTML. |
| **Front matter** | YAML block at the top of each file that sets layout, title, permalink, and other metadata. |
| **Layouts** | HTML templates in `_layouts/` that wrap page content. Pages specify which layout to use in front matter. |
| **Includes** | Reusable HTML snippets in `_includes/` (like the sidebar) that keep layouts DRY. |
| **Liquid** | Jekyll's template language. Used for conditionals, loops, variables, and filters in HTML and Markdown. |
| **Collections** | Grouped content types (like `_pages/`) with shared defaults and output settings. |
| **_config.yml** | Site-wide settings: title, URL, theme, plugins, build defaults. Changes require a Jekyll rebuild. |

## Local Development

You do not have to push to GitHub to see changes. Running Jekyll locally gives you instant feedback and catches build errors before they hit production.

```bash
# Install dependencies
bundle install

# Serve the site with live reload
bundle exec jekyll serve

# Build once without serving
bundle exec jekyll build
```

The local server runs at `http://localhost:4000` by default and auto-rebuilds when files change.

## Deployment Workflow

```bash
git add .                            # stage changes
git commit -m "describe the change"  # commit
git push                             # GitHub Pages builds and deploys automatically
```

That is it. Push to the repo, and GitHub Pages takes care of the build and deploy. If the build fails, GitHub sends an email with the error. You can also check the Actions tab in your repo for build status.

The more I use it, the more I like it. The ability to create locally and flush out all of the bugs before publishing is really handy, and I appreciate even more that GitHub provides the service and ability to do it for free. Thanks GitHub!