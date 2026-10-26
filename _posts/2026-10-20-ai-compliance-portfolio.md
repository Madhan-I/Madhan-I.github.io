---
period: "Sep 2025 – Present"
title: "Running a portfolio where AI has to be right"
teaser: "Keeping AI compliance right at portfolio scale"
summary: How we cut onboarding false positives from 30% to 10–15% at 95%+ average portfolio predictability.
outcome: "Onboarding false positives cut from 30% to 10–15%, with a multi-million-dollar portfolio held at 95%+ average predictability."
hashtags: [AIGovernance, ComplianceAI, PortfolioManagement, SAFe, AKS]
tags: [AI, Delivery]
redirect_from:
  - /blog/2026/10/ai-compliance-portfolio-manulife/
---

In September 2025 I took over end-to-end governance for a global insurer's Core API, Customer Engagement and Compliance AI products, reporting portfolio health and roadmap decisions directly to executive leadership.

One of those products is a compliance engine, and in compliance every wrong answer turns into manual work for someone else.

## The problem worth solving

Onboarding checks were flagging around 30% of cases as possible issues. Most of them weren't. Each false alarm meant a person had to stop, review and clear it. Multiply that across every new customer and you have a quiet cost that never shows up as a single big incident, but drains time every single day.

The engineering answer was a hybrid compliance engine: traditional rules where rules work, and an AI layer using retrieval-augmented generation (RAG) to bring the right policy context into each decision. My job was to give that work direction and make sure it shipped without putting the rest of the portfolio at risk.

## Keeping everything else steady

A portfolio doesn't pause while you modernize one part of it. At the same time we were:

- moving 15 core services onto Azure Kubernetes Service (AKS)
- moving 7 microservices onto Gradle
- strengthening API security across the platform

Any one of those can derail a quarter. What kept them on track was disciplined PI planning and sprint governance: clear priorities, honest capacity, and risks raised early instead of late. I set portfolio priorities that balanced scale, efficiency and risk.

## What changed

- Onboarding false positives fell from **30% to 10–15%**, cutting compliance review cost.
- The portfolio held a sustained **High** health rating, with **under 5% sprint variance**.
- We averaged **95%+ of planned work delivered each planning cycle** (ART predictability and story-point completion) on multi-million-dollar roadmaps.

## What I took from it

AI work is still delivery work. The model matters, but so do the boring things around it: a clear definition of "done", a team that can say "not this sprint", and a portfolio view that shows leadership where the risk really sits. When those are in place, the interesting work gets to happen safely.

*If you're running AI-enabled platforms in a regulated business and want delivery you can predict, I'd be glad to compare notes.*
