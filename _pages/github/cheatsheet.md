---
layout: single
title: GitHub Cheatsheet
permalink: /github/cheatsheet/
---

## Why GitHub Matters

Git is not just for developers anymore. In modern IT, GitHub is where infrastructure lives.

- Terraform modules
- Ansible roles
- Kubernetes manifests
- Runbooks
- Automation scripts
- IaC (Infrastructure as Code)

All start in a repo. Whether you are a network engineer pushing config backups, a security analyst tracking findings, or a sysadmin versioning your dotfiles, knowing Git is a baseline skill. If your work can be stored in a file, it belongs in a repo.

GitHub adds collaboration on top of Git: pull requests for review, issues for tracking, Actions for CI/CD, and Pages for documentation. If you are not comfortable with Git on the command line, you are doing more work than necessary and doing it slower.

This cheatsheet covers the commands you will actually use day to day.

You do not have to use GitHub specifically. I host [Forgejo](https://github.com/forgejo/forgejo), a community-driven Gitea fork, locally for all of my IaC and personal projects. It offers the same pull requests, issues, Actions-compatible CI, and repository management as GitHub, but runs on your own hardware. If self-hosting appeals to you, the [Forgejo Docker image](https://hub.docker.com/r/forgejo/forgejo) makes deployment straightforward. The Git commands in this cheatsheet work identically regardless of which platform backs your remote.

## Essential Git Commands

| Command | Description |
|---|---|
| `git init` | Initialize a new repository in the current directory |
| `git clone <url>` | Clone a remote repository to your local machine |
| `git status` | Show working tree status (staged, unstaged, untracked) |
| `git add <file>` | Stage changes for the next commit |
| `git add .` | Stage all changes in the working directory |
| `git commit -m "msg"` | Commit staged changes with a message |
| `git commit -am "msg"` | Stage tracked files and commit in one step |
| `git push` | Push local commits to the remote |
| `git push -u origin <branch>` | Push and set upstream tracking for a new branch |
| `git pull` | Fetch and merge changes from the remote |
| `git pull --rebase` | Fetch and rebase your local commits on top of remote |
| `git fetch` | Download remote changes without merging |
| `git branch` | List local branches |
| `git branch <name>` | Create a new branch |
| `git branch -d <name>` | Delete a merged local branch |
| `git checkout <branch>` | Switch to a branch |
| `git checkout -b <name>` | Create and switch to a new branch |
| `git switch <branch>` | Switch branches (modern alternative to checkout) |
| `git switch -c <name>` | Create and switch to a new branch (modern) |
| `git merge <branch>` | Merge a branch into the current branch |
| `git rebase <branch>` | Rebase current branch onto another branch |
| `git stash` | Stash uncommitted changes |
| `git stash pop` | Apply the most recent stash and remove it |
| `git stash list` | List all stashes |
| `git stash drop` | Discard the most recent stash |
| `git log --oneline` | Show commit history in compact format |
| `git log --oneline --graph` | Show commit history with branch graph |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git remote -v` | List remote repositories and their URLs |
| `git remote add origin <url>` | Add a remote named origin |
| `git reset <file>` | Unstage a file without discarding changes |
| `git reset --hard HEAD~1` | Undo the last commit and discard changes |
| `git reset --soft HEAD~1` | Undo the last commit but keep changes staged |
| `git revert <hash>` | Create a new commit that undoes a previous commit |
| `git rm <file>` | Remove a file from the working tree and index |
| `git mv <old> <new>` | Rename or move a file |
| `git tag <name>` | Create a lightweight tag |
| `git tag -a <name> -m "msg"` | Create an annotated tag |
| `git blame <file>` | Show who last modified each line of a file |
| `git cherry-pick <hash>` | Apply a specific commit onto the current branch |

## GitHub CLI (gh)

| Command | Description |
|---|---|
| `gh auth login` | Authenticate with GitHub |
| `gh repo clone <repo>` | Clone a repository |
| `gh repo create` | Create a new repository |
| `gh repo fork <repo>` | Fork a repository |
| `gh pr create` | Create a pull request |
| `gh pr list` | List open pull requests |
| `gh pr checkout <number>` | Checkout a pull request locally |
| `gh pr merge <number>` | Merge a pull request |
| `gh issue create` | Create a new issue |
| `gh issue list` | List open issues |
| `gh issue status` | Show issue and PR status for the current repo |
| `gh api <endpoint>` | Make an authenticated API request |

GitHub deprecated password authentication for Git operations and API calls, and personal access tokens are increasingly scoped, rotating, and tedious to manage. The `gh` CLI handles all of that for you. It authenticates via OAuth, stores tokens securely, and keeps them refreshed. If you are still copying PATs (Personal Access Tokens) into terminal prompts or curl headers, `gh auth login` will save you time and reduce the risk of leaked credentials. It is worth adopting now rather than scrambling the next time GitHub tightens auth requirements.

## Daily Workflow

```
git switch -c feature/my-change     # start a branch
# ... make changes ...
git add .                            # stage everything
git commit -m "describe the change"  # commit
git push -u origin feature/my-change # push and set upstream
gh pr create                         # open a pull request
```

## Why Publish Public Knowledge

I have been building a lot of applications and MCP projects lately, and I am still learning new things. Git tags, for example, are something I only recently started using with purpose. If I am going to talk about these tools and workflows, it only makes sense to provide the foundation I am building on top of. This cheatsheet is that foundation to help others that are on similar journeys.