# How to Deploy SyncStream & Get Your URL

Since this project uses **multiple services** (Java Backend, Next.js Frontend, Redis), the easiest way to deploy it for free/cheap with a single public link is **Railway.app**.

## Prerequisites
1.  **Git**: You need to have Git installed. (It seems it wasn't detecting in your terminal, so ensure it's in your PATH).
2.  **GitHub Account**: You need to push this code to a new repository.

## Step 1: Push Code to GitHub
1.  Open a terminal where `git` works.
2.  Run the following commands in the `SyncStream` folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of SyncStream"
    # Create a new repo on GitHub.com and copy the URL
    git remote add origin <YOUR_GITHUB_REPO_URL>
    git push -u origin master
    ```

## Step 2: Deploy on Railway
1.  Go to [Railway.app](https://railway.app/) and sign up.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your `SyncStream` repository.
4.  **Important**: Railway will auto-detect the Dockerfiles.
    *   It might try to deploy them as separate services, which is GOOD.
    *   You need to add a **Redis** service in Railway manually (Click "New" -> "Database" -> "Redis").
5.  **Configure Variables**:
    *   In the **Backend Service** settings, set `SPRING_REDIS_HOST` to the internal Railway Redis URL.
    *   In the **Frontend Service** settings, set `NEXT_PUBLIC_API_URL` to your **Backend Service's Public URL**.

## Step 3: Get Your Link
Railway will provide a **Public Domain** (e.g., `syncstream-production.up.railway.app`) for your Frontend. 
**Share this link with anyone!**

---

## Alternative: Local Tunnel (Immediate Demo)
If you just want to show someone *right now* without deploying:
1.  Download [ngrok](https://ngrok.com/).
2.  Run `ngrok http 3000`.
3.  Copy the `https://....ngrok-free.app` link and share it.
    *   *Note: Remote Code Execution might fail if the backend isn't also tunneled, but real-time typing will work effortlessly.*
