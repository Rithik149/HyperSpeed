# HyperSpeed ⚡  
**Temporary File Sharing with Expiring Access Codes**

HyperSpeed is a SendAnywhere-style file sharing platform that allows users to upload files and share them using a short-lived access code. Files automatically expire and are removed from both disk and database, ensuring privacy and minimal storage usage.

This project focuses on backend correctness, persistence, and lifecycle management rather than simple in-memory state.

---

## 🚀 Features

- Upload files and generate a unique 6-digit access code
- Download files using the access code (one-time access)
- PostgreSQL-backed persistence (survives server restarts)
- Automatic expiration of files using timestamps
- Background cleanup job for expired files (DB + filesystem)
- No page reloads during upload or download

---

## 🧠 System Design Overview

### Upload Flow
1. File is uploaded and stored on disk
2. Metadata is stored in PostgreSQL
3. A unique access code is generated (DB-enforced uniqueness)
4. An absolute expiry timestamp is assigned

### Download Flow
1. Access code is validated against PostgreSQL
2. Expiry is checked server-side
3. File is streamed to the client
4. File and DB entry are deleted after successful download

### Cleanup Flow
- A background job periodically:
  - Finds expired entries
  - Deletes files from disk
  - Removes corresponding database rows

---

## 🛠 Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Storage:** Local filesystem
- **Other:** Multer (uploads)

---

## 📚 What I Learned

- Replacing in-memory state with database-backed persistence
- Handling race conditions using database constraints
- Designing time-based expiry systems
- Coordinating filesystem state with database state
- Writing safe background cleanup jobs

---

## 🧪 Status

This project is actively developed and intended as a backend-focused portfolio project.

