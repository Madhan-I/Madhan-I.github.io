---
period: "Nov 2026"
title: "What AI-Native SAFe taught me about grounded AI"
teaser: "A 2.5-hour upgrade, and the one lesson I had already seen in production."
summary: "I earned the AI-Native SAFe SM and POPM badges. One lesson matched work I already do: AI should read your facts."
outcome: "Earned the AI-Native SAFe Upgrade and the AI-Native Scrum Master and POPM certifications on 9 Nov 2026, and tied its grounding lesson to a compliance engine we took into production, where a person reviews every flagged case."
hashtags: [AINative, SAFe, ReleaseTrainEngineer, AIDelivery]
tags: [AI, Delivery]
image: /assets/images/share/post-2026-11-11.jpg
---

On 9 November 2026 I finished the AI-Native SAFe Upgrade from Scaled Agile. My previous SAFe upgrade was SAFe 6.0, in March 2023. This one took about two and a half hours: a short course called AI-Native Ready, an overview module, and a final quiz.

Four new badges came out of it, all issued that day: AI-Native Ready, AI-Native SAFe Upgrade, Certified AI-Native SAFe Scrum Master, and Certified AI-Native SAFe Product Owner/Product Manager. The last two replace the SAFe 6 versions of the certifications I already held.

I want to be clear about what it is. It is not a new way to run an Agile Release Train. It is a course about how a person works with AI. One lesson, though, matched work I already do, and that is worth writing down.

## The course in four ideas

The first lesson is about mindset. It separates "bolted-on" AI from "baked-in" AI. Bolted-on means you do the work the way you always have and hand it to AI at the end to tidy up. Baked-in means AI is part of the thinking from the start.

The second lesson is about prompting. The course teaches three elements: Perspective, Objective and Background. You tell the AI who it should act as, what you need, and what situation sits behind the request. The same short question gets a much better answer once all three are in it.

The third lesson is about grounding. The fourth is about moving from doing every task yourself to orchestrating a system where AI handles steps and you direct the outcome.

## The lesson I had already seen in production

Lesson 3 starts with a plain warning: AI doesn't know what it doesn't know, and it won't tell you when it is guessing. The course's answer is retrieval-augmented generation, or RAG. Instead of predicting what your documents probably say, the AI reads what they actually say.

I know this one from my own work. Since September 2025 I have run release governance for a global insurer's Core API, Customer Engagement and Compliance AI products. We took a hybrid compliance engine into production: rules where rules work, and an AI layer that uses RAG to bring the right policy context into each decision.

False alarms in onboarding dropped from 30% to 10-15%. Every flagged case still goes to a person for review.

That last sentence matters more to me than the percentages. The course calls the person in that setup the human-on-the-loop. In regulated work, the AI proposes and a person decides.

## What I am taking from it

The bolted-on or baked-in question is a good test to run on my own week. Before a piece of delivery work, I want to ask whether AI is in the thinking or only in the cleanup. I have not changed my routine because of one course, and I would rather say so than pretend I have.

If another Release Train Engineer asked me what to take from the upgrade, I would give three things. Give the AI the context a new team member would need. Ground it in your own documents. Keep a named person accountable for the final call.

A 2.5-hour course will not change a delivery system. What it gave me is a sharper set of questions, and one clear label for something I had already watched work.
