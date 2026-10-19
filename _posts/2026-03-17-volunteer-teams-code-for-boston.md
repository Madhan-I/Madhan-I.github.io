---
title: "Leading people who don't have to show up"
teaser: "What civic tech volunteering in Boston taught me about delivery"
summary: Coordinating volunteers and mentoring developers at Code for Boston, on a heat pump outreach app and an open police data platform.
retro: "A look back at 2022–2023, published here when this site launched in 2026."
tags: [Leadership, Mentoring, Civic Tech]
---

In 2022 I was on-site in Boston for John Hancock, restarting a platform programme that had been frozen for two years. On Tuesday evenings I joined Code for Boston, a volunteer group that builds free, open-source software for public-service organisations. Hack nights ran on Zoom every week and in person at the Cambridge Innovation Center once or twice a month.

I didn't go there to write features. I did the same job I do at work: coordinating volunteers and mentoring developers so a team could finish what it started.

## A heat pump app with five moving parts

In August 2022 Code for Boston started the Boston Heat Pump Accelerator with the Urban League of Eastern Massachusetts and the Heat Smart Alliance. The aim was to reach owners of Boston homes most likely to benefit from heat pump retrofits, tax credits and installation support, with equity at the centre.

The project ran as five workstreams:

- **Data analysis** in Python and Jupyter, grouping city property parcels into canvassing routes
- **Backend** in Ruby on Rails and PostgreSQL, holding homes, surveyors, surveys and assignments
- **Frontend** in React, so canvassers could see a property and record a visit from their phone
- **Partnerships** and **marketing**, taking the approach to other organisations

Five groups of part-time volunteers, each moving at its own speed, is a release train without the contracts. The data team's routes were useless until the API could store them, and the app was useless until both existed. Keeping those dependencies visible in one shared backlog mattered more than any single feature.

Delivery came together in 2023 with Docker, automated pipelines in GitHub Actions and a deployment to a Kubernetes-based cloud. That's familiar ground for me from container work on Azure, and it's where mentoring paid off most.

## Restarting a stalled platform, again

In spring 2023 Code for Boston restarted the National Police Data Coalition. It's an open platform that brings together independently collected police-conduct data from journalists, attorneys and community members, for researchers, lawyers and policymakers. It had started strongly in 2021 and slowed in 2022.

I'd seen this pattern before, at work that same year: old code, lost context and new people. The playbook transferred almost unchanged. Separate the still-valid backlog from the stale one, make the first contribution easy (one Docker setup, seed data, clear test instructions), and show progress quickly. By late 2023 the team was shipping again: incident search, an officer view and partner features on a Flask, PostgreSQL and Next.js stack.

## What volunteer teams teach you

**Nobody has to show up.** At work, a sprint plan has an employment contract behind it. On a hack night it doesn't. People come back when the work matters and the next step is clear.

**Clarity beats authority.** Small tasks someone can finish in one evening, a backlog anyone can read, and the reason behind the work said out loud. Those did more than any deadline could.

**Mentoring is the multiplier.** A newer developer who gets unstuck in their first session comes back. One who spends the night fighting setup usually doesn't.

**Restarts follow the same rules everywhere.** Recover the context, shrink the first steps, make progress visible.

## Why it matters for my day job

A release train is a team of teams, and most people on it don't report to the person running it. Volunteering sharpened the skill that matters most there: leading through clarity and trust, not a title.
