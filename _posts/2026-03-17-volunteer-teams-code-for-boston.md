---
title: "Delivering with people who don't have to show up"
teaser: "What civic tech volunteering in Boston taught me about delivery"
summary: What I learned as a volunteer member of Code for Boston, helping newcomers get set up across four civic tech projects.
retro: "A look back at 2022–2025, published here when this site launched in 2026."
tags: [Community, Leadership]
---

From September 2022 to August 2025 I was on-site in Boston for John Hancock. Alongside that work I joined Code for Boston, a volunteer group that builds free, open-source software for public-service organisations. Hack nights ran on Tuesday evenings, on Zoom every week and in person at the Cambridge Innovation Center once or twice a month.

Each project had several teams, some technical and some not. I was a volunteer member on the non-technical side. My part was simple and, it turned out, important: helping newcomers who wanted to contribute get set up, from cloud accounts to the tools each team used, so they could start on real work instead of losing their first evening to setup.

## Four projects, one job

I was part of four projects during those years. Each ran on a different cloud setup, and on every one my job was the same: get new people into that setup and working.

## MAPLE: testimony for the Massachusetts legislature {#maple}

**The work.** MAPLE, the Massachusetts Platform for Legislative Engagement, is a live site where residents submit testimony on bills to the state legislature and read what others have said. It soft-launched in March 2023 and became Code for Boston's busiest project.

**The tech.** A Next.js web app on Google Cloud and Firebase (Firestore database, Cloud Functions, sign-in), with Typesense for search and a Vercel test site.

**How I supported it.** New contributors couldn't do anything until they had access to the Firebase project and Google Cloud sign-in set up on their machine. I helped them through that, so their first evening went on the project rather than on permissions.

## Urban League Heat Pump Accelerator {#heat-pump}

**The work.** A partnership with the Urban League of Eastern Massachusetts and the Heat Smart Alliance to reach owners of Boston homes most likely to benefit from heat pump retrofits, tax credits and installation support, with equity at the centre.

**The tech.** Five workstreams: data analysis in Python and Jupyter, grouping city property parcels into canvassing routes; a Ruby on Rails and PostgreSQL backend; a React app for canvassers; plus partnerships and marketing. Code ran in Docker, with automated deploys through GitHub Actions to a Kubernetes-based cloud, and GitHub Codespaces for one-click setup.

**How I supported it.** I helped newcomers get Codespaces, Docker and their GitHub access working and pointed them to the right workstream. Five groups of part-time volunteers looked a lot like a release train without the contracts, and how quickly new people got set up decided whether they came back.

## National Police Data Coalition {#npdc}

**The work.** An open platform that brings together independently collected police-conduct data from journalists, attorneys and community members, for researchers, lawyers and policymakers. It started strongly in 2021, slowed in 2022 and restarted in spring 2023.

**The tech.** A Python Flask API with PostgreSQL and a Next.js front end, run locally with Docker Compose and hosted on Heroku.

**How I supported it.** A restart brings a wave of new volunteers at once. I guided them through Docker and account setup so they could run the platform and contribute from their first evening. It felt familiar: at work I was restarting a programme frozen for two years, and the first blocker there was the same. People can't contribute until they can get in.

## HEAT: Home Energy Analysis Tool {#heat}

**The work.** A live tool for Heat Smart Alliance energy coaches and homeowners. It estimates a home's heating needs from past gas bills and local weather, and checks whether a proposed heat pump is big enough, replacing a manual spreadsheet.

**The tech.** A Remix and React web app on the Epic Stack, with a Python rules engine running in the browser, deployed on Fly.io.

**How I supported it.** I helped first-time contributors get the stack, Docker and their accounts running, so they could start on real issues quickly.

## What volunteer teams teach you

**Nobody has to show up.** At work, a sprint plan has an employment contract behind it. On a hack night it doesn't. People come back when the work matters and the next step is clear.

**Onboarding is the multiplier.** A newcomer who is set up and contributing in their first session comes back. One who spends the night fighting account access and installs usually doesn't.

**Non-technical work keeps technical work moving.** Welcoming people, getting them access and pointing them to the right team isn't glamorous, but without it the developers spend their evenings answering setup questions instead of building.

**Restarts follow the same rules everywhere.** Recover the context, make the first step easy, make progress visible.

## Why it matters for my day job

A release train is a team of teams, and it slows down quickly when new people can't get started. Volunteering reminded me that removing small blockers for others is real delivery work, whatever your title.
