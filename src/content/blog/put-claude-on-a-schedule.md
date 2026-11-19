---
title: "Put Claude on a schedule"
description: "How I use a scheduled Claude task for the first round of PR review, the instructions I give it, and why schedules are useful well beyond code."
pubDatetime: 2026-11-19T10:30:00.0000
slug: put-claude-on-a-schedule
featured: false
tags: ["software", "ai", "productivity"]
---

If you work with me, you may have noticed that PRs assigned to me for review get reviewed quickly. That's not me watching GitHub all day. It's a scheduled Claude task.

On a fixed schedule, an agent pulls the PRs where I'm a requested reviewer and does a thorough first round of review: correctness first, then good practices and approach. It leaves its comments on the PR. Unless a PR is critical, this first pass saves a lot of the time I'd otherwise spend on manual review.

Thanks to Yash Gulati for suggesting I share it with everyone.

## Not just for engineers

Schedules aren't a code-review feature. A schedule is just Claude following instructions you wrote, on a timer. If you're not on the engineering team, you can still use them for plenty of day-to-day work:

- a summary of your Slack threads
- emails that need your attention
- an update or request from a customer that you missed

Literally, the sky is the limit.

## Setting one up

1. In the Claude app, open the **Scheduled** section.
2. Add a new task and choose when it runs (hourly, daily, and so on).
3. Write the instructions.

Here are my PR review instructions. Swap in your own GitHub username, repo and start date:

```text
"Assigned to me" means I am in the reviewer / review-request field
(gh search prs --review-requested <your-github-username>). The GitHub
assignee field isn't used by my team, so don't filter on it. Only look at
<org>/<repo>; ignore review requests from other repos.

Each run, pull all the PRs assigned to me. For each one, do a thorough first
round of code review with attention on correctness, good practices and the
best possible approach. The goal is to keep the codebase from turning into
slop over time. Follow the CLAUDE.md files in the repo and leave review
comments on the PR.

Never review or comment on a merged or closed PR. Only open, unmerged PRs are
in scope. Check this twice:
1. When building the list, drop any PR where
   GET /repos/<org>/<repo>/pulls/<number> doesn't return state == "open" and
   merged == false. Search results and saved lists go stale.
2. Right before posting any review, reply or comment, fetch the PR again. A PR
   can merge while its review is being written. If it has merged or closed
   since, don't post. List it as skipped in the run report instead.

If needed, use a new git worktree for reviews.

Only consider PRs from <start date> onwards.
```

## Make it yours

You can add your own preferences directly to the instructions, or to your global `CLAUDE.md`. I've added a few high-level rules there, for example to focus on correctness first, then code quality.

Pick one thing you check by hand every day and put it on a schedule.
