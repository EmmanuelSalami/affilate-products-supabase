Below is a **polished, beginner-friendly “Quick-Start” README** that walks a brand-new learner from *zero* (no GitHub repo, no Vercel account) to a live Supabase-powered site.

---


# Affiliate-Product-Showcase 🛒✨  
Showcase any set of affiliate products with a beautiful Amazon-style layout.  
Built with **Next.js 15**, **Supabase** (PostgreSQL in the cloud), and **Vercel**.

---

## 1  Features
| | |
|-|-|
| 🔍 **Dynamic catalogue** | Reads products from a Supabase `products` table |
| ➕/➖ **Add / Delete** | Secure POST & DELETE endpoints protected by an **API Key** |
| ⚡ **Next.js 15** | Fast SSR pages + `/api` routes (no external server) |
| 📱 **Responsive design** | Looks great on phone, tablet, or desktop |
| 💬 **Open GET** | Anyone can browse products without a key |

---

## 2  What you need before you start

| Tool | Why you need it | Where to get it |
|-|-|-|
| **Node ≥ 20** | runs the dev server | <https://nodejs.org> |
| **npm (comes with Node)** | installs packages | installed automatically |
| **Git** | gets code from GitHub | <https://git-scm.com> |
| **GitHub account** | stores your own copy of the code | <https://github.com/join> |
| **Supabase account** | free hosted Postgres DB | <https://supabase.com> |
| **Vercel account** | 1-click cloud hosting | <https://vercel.com/signup> |

*(Students who only **clone + deploy** still need GitHub & Vercel accounts, but no CLI installs.)*

---

## 3  Clone & Run locally (optional)

```bash
git clone https://github.com/YourUsername/affiliate-product-showcase.git
cd affiliate-product-showcase
npm install          # ⏳ first-time only
npm run dev          # 🔥 http://localhost:3000
```

---

## 4  Set up Supabase  ⚙️

| Column name | Data type | Primary Key | “Is Nullable” | Why |
|-------------|-----------|-------------|---------------|-----|
| **id**          | `text` | ✅ (check) | ❌ (untick) | Used as unique identifier |
| **title**       | `text` |            | ❌ (untick) | Shown on the card and used for search |
| description | `text` |            | ✅ (keep ticked) | Optional extra info |
| imageUrl    | `text` |            | ✅ (keep ticked) | Falls back to placeholder if empty |
| **productUrl**  | `text` |            | ❌ (untick) | Button needs a link |

1. **Create the project** (Supabase Dashboard → *New Project*).  
2. **Open Table Editor → New Table**  
   - Name: `products`  
   - Region: any  
   - Add the columns exactly as in the table above.  
3. **Disable Row-Level Security** *(or add a “Public Read” policy)*  
   - Auth  →  Policies  →  Toggle RLS off for `products`.  
4. Copy **`Settings → API`**  
   - `SUPABASE_URL`  
   - `SUPABASE_ANON_KEY`  
   - Paste these into `.env` and also into Vercel → Settings → Environment Variables before deploy.

---

## 5  Configure environment variables

Create **`.env.`** (not committed): just rename the **.env.example** file to **.env** and then add the below:

```bash
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=ey...
API_KEY=make-up-your-own-secure-key
```

👉 `API_KEY` protects **POST** & **DELETE** requests.

---

---

## 6  Update social-media placeholders  🎨  
Open **`pages/index.js`** and search for the three example links:

```jsx
href="https://instagram.com/your_username"
href="https://twitter.com/your_username"
href="https://tiktok.com/@your_username"
```

Replace `your_username` with your real handles (or remove icons you don’t need).

---

## 7  Push this project to **your own** GitHub repo 🚀

> **Why bother?**  
> You cloned *my* template. If you push straight away you’ll overwrite the original author’s repo (or you’ll get a permission error).  
> Instead, push to **your own** fresh repository.

### 7-A  Check what remotes (if any) are already set

```bash
git remote -v         # lists remote names + URLs

# expected outputs
# (a) nothing -–> no remote set  ✅
# (b) origin https://github.com/SomeoneElsesRepo.git  ❌ you’ll replace this
```

### 7-B  If a remote called `origin` already exists, remove it (so you don’t accidentally push to the wrong place)

```bash
git remote remove origin   # safe even if “origin” is missing
```

*(Nothing prints if it works.)*

### 7-C  Create a **new empty repo** on GitHub (> 10 seconds)

1. Open <https://github.com/new> in a browser  
2. **Repository name** → e.g. `affiliate-product-showcase`  
3. **Visibility** → Public (or Private)  
4. **DON’T tick** ✓ “Add README”, “Add .gitignore”, “Add license”  
5. Click **Create repository**.  
   GitHub now shows some command-line snippets.

Copy the **HTTPS** URL from the top – it looks like:

```
https://github.com/<YourUser>/<NewRepo>.git
```

### 7-D  Connect your local project to that new repo

```bash
git remote add origin https://github.com/<YourUser>/<NewRepo>.git
git branch -M main           # ensures your branch is called “main”
```

> 💡 `origin` is just a nickname; it could be “github” or “banana”.  
> Most tutorials stick with “origin”.

### 7-E  Commit (if you haven’t already)

```bash
git add .
git commit -m "First Supabase version"
```

Check your commit & remote:

```bash
git status           # should say “nothing to commit”
git remote -v        # should show the *new* URL for origin
```

### 7-F  Push!

```bash
git push -u origin main
```

- First push may ask **GitHub username / personal-access token** (PAT).  
  Follow the browser link Git prints to generate one if you haven’t before.  
- After success, refresh your GitHub repo page → you’ll see your files.

That’s it – your copy now lives in GitHub and can be imported into **Vercel** (see Step 8).
```

Copy-paste this block over your current Step 7 in the README and you’re good to go.

---

## 8  Deploy to Vercel  ☁️

1. Log in at <https://vercel.com>
2. **“Add → Project” → Import Git Repository**  
   choose your repo
3. Framework preset **auto-detects “Next.js”**
4. **Environment Variables**  
   add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `API_KEY`
5. Click **Deploy**

🟢 In ~60 seconds you’ll get a URL like  
`https://affiliate-product-showcase.vercel.app`

---

## 9  Using the API

| Action | Method & Path | Headers | Body example |
|-|-|-|-|
| **List products** | `GET /api/products` | – | – |
| **Search** | `GET /api/products?title=sony` | – | – |
| **Get by id** | `GET /api/products?id=123` | – | – |
| **Create** | `POST /api/products` | `x-api-key: <API_KEY>` |```json { "title":"Watch", "productUrl":"https://amazon.com/...", "description":"Nice", "imageUrl":"" }```|
| **Delete** | `DELETE /api/products` | `x-api-key: <API_KEY>` |```json { "ids":["123","456"] }```|

Tip: test with **Postman** or command-line:  
```bash
curl -X POST https://<your-url>/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"title":"Test","productUrl":"https://..."}'
```

---

## 10  FAQ / Troubleshooting

| Problem | Fix |
|-|-|
| **Hydration error** | Make sure you **didn’t copy Date.now / Math.random** into render output |
| **401 in Postman** | Add `x-api-key` header with your `API_KEY` |
| **Supabase “empty array”** | Check RLS policy or that you inserted rows |
| **Env vars not found on Vercel** | Settings → Environment Variables → redeploy |

---

