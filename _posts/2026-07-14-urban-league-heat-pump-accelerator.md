---
title: "A heat pump app with five moving parts"
teaser: "Codespaces, Docker and a Kubernetes-based cloud for the Urban League"
summary: How I supported the Urban League Heat Pump Accelerator at Code for Boston, helping newcomers set up Codespaces and Docker on a project with five workstreams.
outcome: "Newcomers got Codespaces and Docker running and joined one of five workstreams, instead of losing their first nights to setup."
hashtags: [CodeForBoston, ClimateTech, Codespaces, Docker, HeatPumps]
retro: "A look back at 2022–2025, published here when this site launched."
redirect_from:
  - /blog/2026/03/urban-league-heat-pump-accelerator/
tags: [Community, Delivery]
---

The Urban League Heat Pump Accelerator was one of four Code for Boston projects I supported as a volunteer member while I was on-site in Boston, from September 2022 to August 2025.

## The project

It's a partnership with the Urban League of Eastern Massachusetts and the Heat Smart Alliance. The goal is to reach owners of Boston homes most likely to benefit from heat pump retrofits, tax credits and installation support, with equity at the center.

## The tech

The project ran as five workstreams:

- **Data analysis** in Python and Jupyter, grouping city property parcels into canvassing routes
- **Backend** in Ruby on Rails and PostgreSQL, holding homes, surveyors, surveys and assignments
- **Frontend** in React, so canvassers could see a property and record a visit from their phone
- **Partnerships** and **marketing**, taking the approach to other organizations

Code ran in Docker, with automated deploys through GitHub Actions to a Kubernetes-based cloud, and GitHub Codespaces gave volunteers a one-click development environment.

## How I supported it

I was on the non-technical side. I helped newcomers get GitHub access, Codespaces and Docker working, and pointed each of them to the workstream that matched their skills.

## What I learned

**It's a release train without the contracts.** Five groups of part-time volunteers moved at their own speeds. The data team's routes needed the backend to store them, and the app needed both. Keeping new people flowing into the right group mattered as much as any single feature.

**First evenings decide everything.** New people arrived almost every week. Those who were set up and working in their first session came back; those who weren't usually didn't.

## Why it matters for my day job

Dependencies between teams and fast onboarding are the two things that make or break a release train. This project showed both at small scale, with no budget and no reporting lines.
