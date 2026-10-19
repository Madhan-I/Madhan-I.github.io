---
title: "Opening the Massachusetts statehouse, one volunteer at a time"
teaser: "MAPLE, Google Cloud and Firebase, and getting newcomers in the door"
summary: How I supported MAPLE, Code for Boston's platform for testimony to the Massachusetts legislature, by getting new volunteers set up on its Google Cloud and Firebase project.
outcome: "New volunteers got into MAPLE's Google Cloud and Firebase project faster, so they could help a live platform that lets Massachusetts residents speak to their legislature."
retro: "A look back at 2022–2025, published here when this site launched in 2026."
tags: [Community, Delivery]
---

From September 2022 to August 2025, while I was on-site in Boston for John Hancock, I was a volunteer member of Code for Boston. MAPLE was one of four projects I supported, and the busiest of them.

## The project

MAPLE, the Massachusetts Platform for Legislative Engagement, is a live site where residents submit testimony on bills to the state legislature and read what others have said. The aim is simple: shine a light on the statehouse and make it easier for ordinary people to be heard. It soft-launched in March 2023 and kept growing from there.

## The tech

MAPLE is a Next.js web app running on Google Cloud and Firebase: a Firestore database, Cloud Functions for the back end and Firebase sign-in for users. Search runs on Typesense, and a separate development site on Vercel lets volunteers test changes safely.

## How I supported it

I was on the non-technical side. New contributors couldn't do anything until they had been added to the Firebase project and had Google Cloud sign-in working on their own machine. That's a small hurdle for an experienced developer and a big one for a first-time volunteer.

I helped newcomers through that setup and pointed them to good first issues, so their first evening went on the project rather than on permissions.

## What I learned

**Access is the first deliverable.** On a cloud project, nobody contributes until they can get in. Treating access as a task in its own right, not an afterthought, kept people coming back.

**Clear first steps keep volunteers.** A labelled "good first issue" and a working setup did more for retention than any welcome message.

## Why it matters for my day job

On a release train, new team members lose days to access requests and environment setup. MAPLE was a reminder that removing that friction is delivery work, and that it pays back quickly.
