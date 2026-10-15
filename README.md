# madhanirulandi.com

Your personal website. You own all of it. It runs free on GitHub Pages, needs no server, no paid plan except the yearly domain, and no help from anyone to keep running.

**Why it's fast and handles heavy traffic:** the site is plain files served from GitHub's global network. There is no database or server to overload. GitHub allows about 100 GB of traffic a month, roughly 500,000 visits.

**Why it's secure:** there is nothing on the site to hack. No server code, no database, no login, no forms and no outside scripts or trackers. Every page tells browsers to load only files from this site (Content-Security-Policy), and everything is served over HTTPS. The real risk is someone getting into your **GitHub** or **Cloudflare** account, so Part 5 matters.

| I want to… | Edit this file | Part |
|---|---|---|
| Change text, jobs, certificates | `_data/profile.yml` | 2 |
| Write a blog post | `_posts/` or pagescms.org | 3 |
| Change colours, fonts, hide a section | `_data/theme.yml` | 4 |

You can do all of this from any browser or your phone. Nothing to install.

---

## Part 1 — How it's set up (already done)

- **Code:** GitHub repository `Madhan-I/Madhan-I.github.io`, branch `main`.
- **Hosting:** GitHub → Settings → Pages → *Deploy from a branch* → `main` / `(root)`, custom domain `madhanirulandi.com`, **Enforce HTTPS** ticked.
- **Domain:** bought at Cloudflare. DNS records (all **DNS only**, grey cloud):

| Type | Name | Content |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `madhan-i.github.io` |

Keep the `CNAME` file in the repository. It tells GitHub which domain to serve.

---

## Part 2 — Change your content

All page text is in **one file: `_data/profile.yml`**.

1. Open your repository on github.com → `_data` → `profile.yml`.
2. Click the **pencil icon** (Edit).
3. Change the text. Keep the spaces at the start of each line exactly as they are.
4. Click **Commit changes**. The live site updates in about a minute.

| What you want | What to change in `profile.yml` |
|---|---|
| Add a new job | Copy one block under `experience:` and paste it at the top. Set `sector:` and `icon:` (chart, shield, mail, bank, layers, health, ticket) |
| Add a certification | Copy a `- name:` block in the right group, change name and year |
| Mark a certificate as current | Add `status: Active` under it (only if Credly or the issuer shows it as current) |
| Link a certificate | Add `url: https://…` under it |
| Add a resume download | Upload the PDF to `assets/resume/` and set `resume_file: "Madhan_Irulandi_Resume.pdf"` |
| Add your photo | Upload a square image to `assets/images/` and set `photo: "madhan-headshot-bright.jpg"` |
| Turn on visitor counts | Create a free GoatCounter account, then set `goatcounter: "yourcode"` in `_config.yml` |

**Keep LinkedIn and this file saying the same thing.** Recruiters compare them.

**Images:** upload them into the repository (`assets/images/`). For security, the site does not load images from other websites.

---

## Part 3 — Write a blog post

**Option A: visual editor (recommended, free).**
1. Go to **pagescms.org** and sign in with GitHub.
2. Choose `Madhan-I.github.io`. You'll see **Blog posts**.
3. Click **Add an entry**, write like in Word, add a cover image if you want, and click **Save**. It goes live in about a minute.

**Option B: directly on GitHub.**
1. Open `_posts` → **Add file → Create new file**.
2. Name it like `2026-11-03-how-i-run-pi-planning.md` (date first, words joined by hyphens).
3. Paste this at the top, then write below it:

```
---
title: How I run PI planning
summary: One sentence that makes people want to read it.
tags: [SAFe, Leadership]
---

Your article starts here. Leave a blank line between paragraphs.

## A subheading

- A bullet point
- Another one
```

4. Click **Commit changes**. The newest three posts also appear on the home page.

**Schedule a post for later:** give the file a future date, e.g. `2026-12-08-my-post.md`. It stays hidden and goes live automatically on that morning (around 06:15 India time). The 8 experience stories are already scheduled one per week, every Tuesday until 1 December 2026.

---

## Part 4 — Change how it looks

Open **`_data/theme.yml`** and change a word:

| Setting | Options |
|---|---|
| `preset:` | `navy` (corporate blue, current) · `teal` · `graphite` (most minimal) · `emerald` · `burgundy` |
| `display_font:` | `modern` (clean sans-serif headings) · `classic` (elegant serif) |
| `animate_hero:` | `true` · `false` (turns off the opening animation and slide-in transitions) |
| `show:` | set any section to `false` to hide it; its menu link hides too |
| `colors:` | type your own hex codes (e.g. `"#1D5FD1"`) to override the preset |

Commit, wait a minute, refresh. To undo, open the file's **History** and restore the previous version.

For bigger design changes (layout, spacing), the code is in `assets/css/style.css`.

---

## Part 5 — Keep it secure (do this once)

1. **GitHub two-factor login:** github.com → Settings → Password and authentication → enable 2FA (authenticator app or passkey). Save the recovery codes somewhere offline.
2. **Cloudflare two-factor login:** dash.cloudflare.com → My Profile → Authentication → enable 2FA.
3. **Verify your domain on GitHub** so nobody else can ever point it at their site: GitHub → Settings (your account) → Pages → **Add a domain** → `madhanirulandi.com` → add the TXT record it shows in Cloudflare DNS → **Verify**.
4. **Turn on DNSSEC:** Cloudflare → madhanirulandi.com → DNS → Settings → **Enable DNSSEC**. It protects visitors from fake copies of your site.
5. **Keep Registrar Lock on** (Cloudflare → Domain Registration → your domain). It's on by default; don't turn it off.
6. **Renewal:** keep auto-renew on and the card current. An expired domain is the most likely way this site goes offline.
7. **Pages CMS:** when it asks for GitHub access, give it this repository only.

Never put your phone number or home address on the site.

---

## Part 6 — If something breaks

- **The site didn't update after an edit:** almost always a spacing mistake in a `.yml` file. Open the **Actions** tab on GitHub; the red ✗ names the file and line. Fix it, or restore the old version from the file's **History**.
- **"Not secure" warning:** GitHub → repository Settings → Pages → check *Enforce HTTPS* is ticked and the domain shows a green tick. Check the Cloudflare records are grey-cloud **DNS only**.
- **Site down entirely:** check the domain hasn't expired in Cloudflare.

---

## What's in the folder

```
_data/profile.yml     ← all your page text
_data/theme.yml       ← colours, fonts, show/hide sections
_posts/               ← blog posts, one file each
assets/resume/        ← your resume PDF
assets/images/        ← photos and post images
assets/fonts/         ← fonts, hosted here (no Google or other outside services)
assets/css/style.css  ← layout and design code
assets/css/theme.css  ← generated from theme.yml (don't edit)
index.html            ← home page template
blog/index.html       ← list of all posts
_layouts/             ← page frame shared by every page
_config.yml           ← site title, description, address
CNAME                 ← your domain name
.pagescms.yml         ← settings for the free visual editor
```

Built with Jekyll, which GitHub Pages runs automatically.
