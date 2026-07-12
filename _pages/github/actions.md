---
layout: single
title: GitHub Actions
permalink: /github/actions/
---

## What Are GitHub Actions?

GitHub Actions is a CI/CD (Continuous Integration/Continuous Deployment) platform built directly into GitHub. You define workflows in YAML files inside your repo, and GitHub runs them automatically when events occur: a push, a pull request, a tag creation, a schedule, or even a manual trigger. No separate CI server to maintain, no webhook configuration to debug. The workflow file lives right next to the code it tests and deploys.

Each workflow is a series of jobs, and each job is a series of steps that run on a virtual machine GitHub provisions for you. Steps can run shell commands or use pre-built actions from the marketplace. When the workflow finishes, you get a pass/fail result, logs, and artifacts all in one place.

## How I Use GitHub Actions

I use Actions primarily for CI/CD (Continuous Integration/Continuous Deployment) on projects that live on GitHub. A typical workflow looks like this:

- **On every push** -- Run linting and tests so regressions are caught immediately.
- **On pull requests** -- Run the full test suite and report status back to the pull request (PR).
- **On tag creation** -- Build release artifacts (binaries, Docker images) and publish them.

The key principle is simple: if something can be automated, automate it. If a step requires human judgment, make it a gate, not a bottleneck. Actions handles the mechanical parts so you can focus on the work that actually needs you.

## Key Concepts

| Concept | What It Means |
|---|---|
| **Workflow** | A YAML file in `.github/workflows/` that defines an automated process. |
| **Event** | The trigger that starts a workflow (push, pull request (PR), tag, schedule, manual). |
| **Job** | A group of steps that execute on the same runner. Jobs can run in parallel or depend on each other. |
| **Step** | A single task within a job: a shell command or a reusable action. |
| **Action** | A reusable unit of workflow logic. Can be from the marketplace or written in-repo. |
| **Runner** | The virtual machine that executes the job. GitHub provides Ubuntu, Windows, and macOS runners. |
| **Artifact** | A file or directory produced by a workflow that you can download after the run. |

## A Simple CI Workflow

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install -r requirements.txt
      - run: pytest
```

Push this to `.github/workflows/ci.yml` and every push or pull request (PR) against `main` will run your test suite automatically.

## Git Tags and Release Publishing

Git tags mark specific commits as release points. They are how you tell Actions (and consumers of your project) that version 1.2.0 is ready. When you push a tag, a workflow can pick it up, build your artifact, and publish it.

### Creating and Pushing Tags

```bash
# Create an annotated tag
git tag -a v1.2.0 -m "Release v1.2.0"

# Push the tag to remote
git push origin v1.2.0
```

Annotated tags (`-a`) are preferred over lightweight tags because they store the tagger, date, and message. This matters when you are publishing releases, because the tag message becomes the release notes starting point.

### Tagging Strategy

| Strategy | Example | When To Use |
|---|---|---|
| **Semantic versioning** | `v1.2.0` | Most projects. Major.Minor.Patch. |
| **Pre-release** | `v1.2.0-beta.1` | Testing before a stable release. |
| **Patch tags** | `v1.2.1` | Bug fixes only. No new features. |

## Publishing Docker Images to Docker Hub

This is the workflow I use most often. When a tag is pushed, Actions builds a Docker image and pushes it to Docker Hub with the tag as the image version. Combined with a `latest` tag on the default branch, consumers always get the newest stable build.

```yaml
name: Publish Docker Image

on:
  push:
    tags:
      - 'v*'

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Extract version from tag
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKERHUB_USERNAME }}/myapp
          tags: |
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=semver,pattern={{major}}
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### Setup Required in Docker Hub and GitHub

Before this workflow runs, you need two things configured:

1. **Docker Hub access token** -- Create a token in Docker Hub under Account Settings > Security. This becomes the `DOCKERHUB_TOKEN` secret.
2. **GitHub repository secrets** -- Go to your repo Settings > Secrets and variables > Actions. Add `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.

Once configured, every tagged push publishes a versioned image to Docker Hub automatically.

## The Full Release Cycle

```bash
# 1. Make your changes and commit
git add .
git commit -m "add new feature"

# 2. Update version in code (README, setup.py, etc.)

# 3. Tag the release
git tag -a v1.2.0 -m "Release v1.2.0"

# 4. Push commits and tags
git push origin main --tags

# 5. GitHub Actions builds, tests, and publishes
#    Docker image appears on Docker Hub within minutes
```

Tags give you traceability. Every Docker image on Docker Hub maps back to an exact commit. If something breaks, you know exactly which version introduced it and can roll back by pulling the previous tag.

## Caveats: Pushing Without a Tag

Here is a common trap. You make a change to your repo, push it to GitHub, but forget to create or update a tag. What happens?

**The CI workflow runs. The Docker publish workflow does not.**

The reason is in the trigger configuration. Look at the two workflows:

- **CI workflow** triggers on `push` to `main` and on `pull_request`. Every commit to main runs tests and linting. That part fires every time.

- **Docker publish workflow** triggers on `push` with `tags: ['v*']`. This means it only runs when a tag matching `v*` is pushed. A regular commit push does not match this pattern, so the workflow is skipped entirely.

So you end up with a situation where your code passes CI on the new commit, but Docker Hub still has the image from the last tag. The SHA in the repo has changed, but nobody told Docker Hub about it.

### What Does Not Happen

- Docker Hub does not get a rebuilt image.
- The `latest` tag is not updated (it is only updated during a tag-triggered build in the workflow above).
- Anyone pulling your image gets the old build, not the one with your latest changes.

### What You Should Do

If you want the new commit to ship as a release, tag it and push the tag:

```bash
git tag -a v1.2.1 -m "Patch: fix the thing"
git push origin v1.2.1
```

If you are not ready to release, that is fine. CI still runs and validates your change. Just know that Docker Hub will not update until a tag is pushed.

### What If You Want Every Push to Publish?

You can change the Docker workflow trigger to also run on pushes to main, but think carefully before doing this. Every merge to main would overwrite the `latest` tag on Docker Hub, which means anyone pulling `latest` gets an unversioned, potentially unstable build. The tag-based approach exists to protect consumers from breakage between releases.

## Intentional Releases

This is a trap I personally fell into. When your pipeline automatically builds and publishes on every push to main, you lose control over what ships and when. A typo fix and a breaking change get the same treatment: pushed straight to consumers.

Shifting from "push to main, build, deliver" to "push to main with a tag update, build, deliver" is a game changer because it is gated. I am the human in the loop. As the developer and maintainer, I have to do things with intent. The tag is the gate, and I decide when to open it.