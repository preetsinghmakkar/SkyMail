# 📧 SkyMail - Newsletter Service Platform

A comprehensive platform for companies to create, manage, and send newsletters to their subscribers with built-in payment integration.

## ✨ Features

### 🔐 Authentication System
- Company registration with email verification
- OTP-based account activation (2-minute expiry)
- Secure login with email/password
- JWT access tokens (15-minute expiry)
- Refresh token system (7-day expiry)
- Token revocation on logout
- Protected routes with dependency injection
- Google OAuth ready

### 📊 Dashboard (🔄 Coming Next)
- Newsletter template designer
- Subscriber management
- Campaign scheduling
- Analytics & reporting

### 💳 Payment System (🔄 Coming Next)
- Razorpay integration
- Premium subscription tiers
- Usage limits & tracking
- Payment history

### 📬 Newsletter Features (🔄 Coming Next)
- HTML email editor
- Subscribe form generation
- Scheduled email sending
- Email delivery tracking

## 🛠️ Technology Stack

- **Backend:** FastAPI (Python 3.12+)
- **Database:** PostgreSQL
- **Cache:** Redis
- **Authentication:** JWT, Bcrypt, OTP
- **Payment:** Razorpay
- **Storage:** AWS S3
- **Task Queue:** Celery + RabbitMQ

## 📦 Installation

### Prerequisites
- Python 3.12+
- PostgreSQL 12+
- Redis 6+
- Docker (optional)

### Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env
# Update .env with your values

# 3. Start Redis
docker run -d -p 6379:6379 redis:latest

# 4. Setup database
alembic upgrade head

# 5. Run server
uvicorn app.main:app --reload
```
