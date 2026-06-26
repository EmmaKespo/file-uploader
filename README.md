# Filefolder - Minimalist Cloud Storage & Sharing Platform

Filefolder is a self-contained, lightweight document management platform. It allows users to create secure accounts, manage files within a nested folder structure, view asset metadata, and create time-expiring public share links.


###  Core Features & How to Use Them

1. **Secure Accounts (`/auth/register` and `/auth/login`)**
   * **What it does:** Ensures that your files stay private. Only you can view your personal files and folders.
   * **How to use it:** Visit the registration page to create an account with a unique username and password. Once registered, log in to access your personal dashboard.

2. **The Cloud File Manager Dashboard (`/`)**
   * **What it does:** This acts like the "My Computer" interface on your desktop. It lists all the folders you've built and the files you have uploaded.
   * **Creating Folders:** Type a name into the "Create New Folder" box and click submit. You can click into a folder to open it and create *sub-folders* inside it!
   * **Uploading Files:** Click the file selector button, choose a file from your device, and click "Upload". 

3. **File Inspections & Downloading (`/files/:id`)**
   * **What it does:** Clicking on any file brings you to a dedicated summary window. It shows the file's exact size and the exact date/time it was saved.
   * **How to download:** A prominent **Download File** button is provided on this screen. Clicking it streams the file straight back to your computer or phone seamlessly.

4. **Expiring Folder Sharing (`/folders/:id/share`)**
   * **What it does:** Allows you to securely share a specific folder with an external friend, client, or coworker—even if they do not have an account on this system.
   * **How to use it:** Next to any folder, select a lifespan duration (e.g., *1 Day* or *10 Days*) and click **Share Link**. The system instantly generates a unique link. You can copy this link and email or text it to anyone. Once that timeframe passes, the link expires automatically, keeping your data secure.
 
 Tech Stack & Architecture Design
* **Runtime Environment:** Node.js (LTS version recommended)
* **Framework:** Express.js (Model-View-Controller pattern architectural layout)
* **View Engine:** Embedded JavaScript (EJS) rendered server-side
* **ORM:** Prisma Client interacting with a relational layer (PostgreSQL configured by default)
* **Authentication:** Passport.js (`passport-local` strategy) leveraging cookie-based session identifiers tracked statefully in the database using `@quixo3/prisma-session-store`.
* **File Ingestion:** Multer (Memory-backed multi-part form data interception writing to a temporary local disk buffer).
* **Persistent Object Storage:** Cloudinary SDK abstraction layers.


