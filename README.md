# SecureVault - Password Generator & Secure Vault

A modern, secure password manager built with Next.js, TypeScript, and MongoDB. Generate strong passwords and store them securely with client-side encryption.

## 🚀 Live Demo

[Live Demo URL will be added here]

## ✨ Features

### Must-Have Features ✅
- **Password Generator**: Customizable length, character types, exclude similar characters
- **Simple Authentication**: Email/password registration and login
- **Secure Vault**: Store title, username, password, URL, and notes
- **Client-Side Encryption**: All passwords encrypted before sending to server
- **Copy to Clipboard**: Auto-clear after 15 seconds
- **Search & Filter**: Real-time search across vault items

### Nice-to-Have Features 🎯
- **Dark Mode**: Toggle between light and dark themes
- **Tags/Folders**: Organize vault items with custom tags
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Password Strength Indicator**: Real-time feedback on password quality

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Encryption**: CryptoJS for client-side AES encryption
- **Authentication**: NextAuth.js with Credentials provider
- **Styling**: Tailwind CSS with dark mode support

## 🔐 Security Features

### Client-Side Encryption
- All passwords are encrypted using AES encryption before being sent to the server
- Server never stores plaintext passwords
- Encryption key is stored as environment variable
- Database only contains encrypted blobs

### Authentication Security
- Passwords hashed with bcryptjs (12 rounds)
- JWT sessions with secure cookies
- Input validation and sanitization
- Protection against common attacks (XSS, CSRF)

## 📋 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or cloud)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env.local
```

Update `.env.local` with your values:
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/password-vault

# NextAuth Configuration  
NEXTAUTH_SECRET=your-very-long-secure-secret-key-at-least-32-characters
NEXTAUTH_URL=http://localhost:3000

# Encryption Key (32+ characters)
ENCRYPTION_KEY=your-32-character-encryption-key-change-in-production
```

### 4. Start MongoDB
Make sure MongoDB is running locally or use a cloud service like MongoDB Atlas.

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── vault/        # Vault CRUD operations
│   ├── dashboard/        # Dashboard page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/            # React components
│   ├── Dashboard.tsx     # Main dashboard
│   ├── LoginForm.tsx     # Auth form
│   ├── PasswordGenerator.tsx
│   ├── VaultList.tsx     # Vault items display
│   └── VaultItemForm.tsx # Add/edit form
├── contexts/             # React contexts
│   └── ThemeContext.tsx  # Dark mode
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth config
│   ├── crypto.ts        # Encryption utilities
│   └── mongodb.ts       # DB connection
├── models/              # MongoDB models
│   ├── User.ts         # User schema
│   └── VaultItem.ts    # Vault item schema
└── types/              # TypeScript types
    └── next-auth.d.ts  # NextAuth types
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login (NextAuth)

### Vault Management
- `GET /api/vault` - Fetch user's vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

## 🔒 Crypto Implementation

**Library Used**: CryptoJS  
**Algorithm**: AES encryption

**Why CryptoJS?**
- Battle-tested library with wide adoption
- Simple API for AES encryption/decryption
- Good performance for client-side operations
- Supports various encryption algorithms

The crypto implementation includes:
- Secure password generation with customizable options
- Client-side AES encryption before data transmission
- Password strength analysis with detailed feedback
- Protection against similar-looking characters

## 🎥 Demo Video

[60-90 second screen recording showing: register → generate password → save to vault → search → edit → delete]

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Use `npm run build` and deploy `out/` folder
- **Railway**: Connect GitHub and add environment variables
- **Render**: Set build command to `npm run build`

## 🧪 Testing Authentication Flow

1. **Sign Up**: Create account with email/password
2. **Sign In**: Login with credentials
3. **Dashboard**: Access password generator and vault
4. **Generate**: Create strong password with options
5. **Save**: Store password with metadata
6. **Search**: Filter vault items
7. **Edit/Delete**: Manage existing items
8. **Copy**: Copy passwords with auto-clear

## 🔍 Database Verification

Check MongoDB to confirm passwords are encrypted:
```javascript
// In MongoDB shell or Compass
db.vaultitems.find({}, {encryptedPassword: 1, title: 1})
// Should show encrypted blobs, not plaintext passwords
```

## 📝 Development Notes

- TypeScript for type safety
- ESLint configuration for code quality
- Responsive design with Tailwind CSS
- Dark mode with system preference detection
- Accessibility considerations (ARIA labels, keyboard navigation)
- Error handling and loading states
- Input validation on both client and server

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**