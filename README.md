# ThetaSofts Inbox App 📬

A mobile application built with **React Native** and **Expo Router** to manage contact form inquiries and newsletter subscribers.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The app uses `EXPO_PUBLIC_API_URL` to point to the backend server. 

Create a `.env` (or `.env.local`) file in the project root:

```env
# Demo / Production API Server
EXPO_PUBLIC_API_URL=https://thetasofts-inbox.hutchinsonapac.com
```

> **Note:** If `EXPO_PUBLIC_API_URL` is omitted, the app will automatically attempt to connect to your local development machine IP on port `4000` (or `http://localhost:4000` when running on web).

### 3. Start the Development Server

#### Option A: Using `.env` / `.env.local`
```bash
npx expo start -c
```

#### Option B: Inline Environment Variable
You can also supply the demo API URL directly in your terminal command:

```bash
EXPO_PUBLIC_API_URL="https://thetasofts-inbox.hutchinsonapac.com" npx expo start -c
```

*(The `-c` flag ensures Metro clears its cache and immediately applies the environment variable).*

---

## 📱 Running on Devices / Simulators

Once Expo CLI is running:

- Press `a` or run `npm run android` to open on an Android emulator / connected device.
- Press `i` or run `npm run ios` to open on an iOS simulator.
- Press `w` or run `npm run web` to run on the web browser.
- Scan the terminal QR code with the **Expo Go** app on your physical iOS or Android device.

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Starts the Expo development server (`expo start`) |
| `npm run android` | Runs the app on Android |
| `npm run ios` | Runs the app on iOS |
| `npm run web` | Starts the app in a web browser |
| `npm run lint` | Runs ESLint checks |
| `npm run build:apk` | Runs the APK build script |

---

## 📂 Project Structure

```text
src/
├── app/                  # Expo Router file-based routes
│   ├── (tabs)/           # Main bottom-tab screens (Inbox, Subscribers)
│   ├── contact/          # Contact detail view
│   └── _layout.tsx       # Root navigation layout
├── components/           # Reusable UI components
├── constants/            # Design tokens, themes, colors
├── context/              # React Context providers (Contacts, Subscribers)
├── hooks/                # Custom React hooks
├── services/             # API services & Axios client configuration
│   └── api.ts            # Base URL resolution and API endpoints
├── types/                # TypeScript interface definitions
└── utils/                # Helper utilities and formatters
```

---

## 🔗 API Integration

The app connects to the following REST API endpoints:

- **Contacts:**
  - `GET /contacts` – Retrieve all contact submissions
  - `GET /contacts/unread` – Retrieve unread submissions
  - `GET /contacts/read` – Retrieve read submissions
  - `PATCH /contacts/:id/read` – Mark inquiry as read
  - `PATCH /contacts/:id/replyed` – Mark inquiry as replied
  - `DELETE /contacts/:id` – Delete contact inquiry

- **Subscribers:**
  - `GET /subscribers` – Retrieve newsletter subscribers
  - `DELETE /subscribers/:id` – Delete subscriber
