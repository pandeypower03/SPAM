
# Spam Identifier App

A comprehensive contact management and spam identification system that allows users to manage personal contacts while contributing to a global spam detection database.

## Features

### 🔐 Authentication System
- **User Registration**: Secure account creation with email verification
- **OTP Verification**: Email-based OTP verification for account activation
- **User Login**: Secure authentication for registered users
- **Profile Management**: Store and manage user information

### 📱 Personal Contact Management
- **Add Contacts**: Create personal contact entries with name and phone number
- **Contact Privacy**: Each user can only view their own contact list
- **Flexible Contacts**: Add any phone number (registered or unregistered)

### 🌐 Global Database & Spam Detection
- **Global Phone Directory**: Comprehensive database of all phone numbers
- **Spam Reporting**: Mark any phone number as spam
- **Spam Likelihood**: Automated calculation based on user reports
- **Community Protection**: Collective spam identification system

### 🔍 Advanced Search
- **Name Search**: Find contacts by full or partial name matching
- **Phone Search**: Look up phone numbers with multiple associated names
- **Smart Results**: Prioritized results (exact matches first, then partial)
- **Privacy Controls**: Email visibility based on mutual contact relationships

## User Data Structure

### Registration Fields
- **Name** (Required)
- **Phone Number** (Required)
- **Email Address** (Required)
- **Password** (Required)
- **City** (Optional)
- **Country** (Optional)

### Contact Information
- **Name** (Required)
- **Phone Number** (Required)

## System Architecture

### Database Components

#### Users Table
- User credentials and profile information
- Email verification status
- Account creation and last login timestamps

#### Personal Contacts Table
- User-specific contact lists
- Relationship mapping between users and their contacts
- Privacy isolation per user

#### Global Database
- Consolidated phone number directory
- Multiple name associations per phone number
- Spam likelihood scores
- Reporting history and statistics

## Authentication Flow

1. **Registration**
   - User provides required information
   - System sends OTP to provided email
   - User verifies account with OTP
   - Account activated for login

2. **Login**
   - Email/phone and password authentication
   - Session management
   - Access to personal dashboard

3. **Email Verification**
   - OTP generation and sending
   - Time-limited verification codes
   - Account activation upon successful verification

## Search Functionality

### Name Search
- **Priority 1**: Names starting with search query
- **Priority 2**: Names containing search query
- Results include: Name, Phone Number, Spam Likelihood

### Phone Search
- Single phone number lookup
- Multiple associated names display
- Complete contact information
- Spam likelihood information

### Privacy Rules
- **Email Visibility**: Only shown if:
  - Searched person is a registered user
  - Searching user is in the person's contact list
  - Both conditions must be met

## Spam Detection System

### Spam Reporting
- Any user can mark any phone number as spam
- No restrictions on number registration status
- Contributing to community safety

### Spam Likelihood Calculation
```
Spam Likelihood = (Number of Spam Reports / Total Registered Users) × 100
```

### Global Protection
- Real-time spam score updates
- Community-driven spam identification
- Visible spam indicators in search results

## Security Features

- **Password Encryption**: Secure password hashing
- **Email Verification**: Mandatory account verification
- **Session Management**: Secure user sessions
- **Data Privacy**: User contact isolation
- **Input Validation**: Comprehensive data validation

## API Endpoints Overview
## Authentication

POST /api/users/ - User registration (signup)
POST /api/users/login - User login
POST /api/users/sendotp - Send OTP to email
POST /api/users/verifyotp - Verify OTP for account activation

## Contacts Management

POST /api/users/addcontact - Add new personal contact (requires auth)
GET /api/users/getcontacts - Get user's personal contacts (requires auth)
DELETE /api/users/deletecontact/:contactId - Delete personal contact (requires auth)

## Global Database & Search

GET /api/users/global - Get global database/search results (requires auth)

## Spam Management

POST /api/users/markspam - Mark phone number as spam (requires auth)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash

# Configure database, email service, and other settings
```

4. Start the application
```bash
npm run dev
```

## Environment Variables

```env
JWT_SECRET='8y23!qjd*!2afl_fh7t9#+nsn+5%=iq4ql8u#gud+c14ub@9ff'
PORT=5000
JWT_EXPIRES_IN=1h
DATABASE_URL=#database_url
DATABASE_HOST=postgres.railway.internal
EMAIL_USER=#enter your email
EMAIL_PASS=#enter app password
```

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Email Service**: Nodemailer
- **Documentation**: Swagger/OpenAPI

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This application prioritizes user privacy and community safety. All spam reports are anonymous and used solely for community protection purposes.