# SkyMail Test Data Guide

This guide provides comprehensive test data for testing the campaign and newsletter flows.

## Setup Requirements

1. **Create a test account** (if not already done)
2. **Get your JWT token** from the login response
3. **Use Postman or curl** to test the endpoints

---

## 1. TEST ACCOUNT SETUP

### Register Test Company
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testcompany",
    "email": "test@skymail.com",
    "password": "TestPassword123!",
    "company_name": "Test Company"
  }'
```

**Response Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "username": "testcompany",
  "email": "test@skymail.com",
  "company_name": "Test Company",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Save your:**
- `company_id` (from the `id` field)
- `access_token` (for all subsequent requests)

### Login to Get New Token
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testcompany",
    "password": "TestPassword123!"
  }'
```

---

## 2. CREATE TEST SUBSCRIBERS

Create 5 test subscribers for your campaigns:

```bash
# Subscriber 1
curl -X POST http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_email": "john.doe@example.com",
    "subscriber_name": "John Doe"
  }'

# Subscriber 2
curl -X POST http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_email": "jane.smith@example.com",
    "subscriber_name": "Jane Smith"
  }'

# Subscriber 3
curl -X POST http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_email": "alice.johnson@example.com",
    "subscriber_name": "Alice Johnson"
  }'

# Subscriber 4
curl -X POST http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_email": "bob.wilson@example.com",
    "subscriber_name": "Bob Wilson"
  }'

# Subscriber 5
curl -X POST http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscriber_email": "carol.brown@example.com",
    "subscriber_name": "Carol Brown"
  }'
```

---

## 3. CREATE TEST NEWSLETTER TEMPLATES

### Template 1: Welcome Email

```bash
curl -X POST http://localhost:8000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F 'name=Welcome Email' \
  -F 'subject=Welcome to {{company_name}}!' \
  -F 'html_content=<h1>Hello {{recipient_name}}</h1>
<p>Welcome to {{company_name}}!</p>
<p>We are excited to have you on board.</p>
<p>Visit us at {{website_url}}</p>' \
  -F 'text_content=Hello {{recipient_name}}, Welcome to {{company_name}}! Visit us at {{website_url}}' \
  -F 'constants=company_name,recipient_name,website_url'
```

**Response will include:**
```json
{
  "id": "template-id-1",
  "name": "Welcome Email",
  "subject": "Welcome to {{company_name}}!",
  "constants": ["company_name", "recipient_name", "website_url"]
}
```

### Template 2: Product Launch Announcement

```bash
curl -X POST http://localhost:8000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F 'name=Product Launch' \
  -F 'subject=🚀 Introducing {{product_name}} - Launch Day!' \
  -F 'html_content=<h1>Exciting News!</h1>
<p>Hi {{recipient_name}},</p>
<p>We are thrilled to announce the launch of <strong>{{product_name}}</strong>!</p>
<p><strong>Launch Date:</strong> {{launch_date}}</p>
<p><strong>Special Offer:</strong> {{discount_percent}}% off for early adopters!</p>
<p>Learn more: {{product_link}}</p>' \
  -F 'text_content=Hi {{recipient_name}}, We are launching {{product_name}} on {{launch_date}}. Get {{discount_percent}}% off with our early adopter offer!' \
  -F 'constants=recipient_name,product_name,launch_date,discount_percent,product_link'
```

### Template 3: Newsletter Update

```bash
curl -X POST http://localhost:8000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F 'name=Monthly Newsletter' \
  -F 'subject={{month}} Newsletter - {{news_title}}' \
  -F 'html_content=<h1>{{month}} Newsletter</h1>
<p>Hi {{recipient_name}},</p>
<h2>{{news_title}}</h2>
<p>{{news_content}}</p>
<p><strong>Featured Article:</strong> {{featured_article}}</p>
<p>Thanks for staying connected!</p>' \
  -F 'text_content={{month}} Newsletter for {{recipient_name}}: {{news_title}}. Featured: {{featured_article}}' \
  -F 'constants=month,recipient_name,news_title,news_content,featured_article'
```

---

## 4. CREATE CAMPAIGNS

### Campaign 1: Welcome Campaign

```bash
curl -X POST http://localhost:8000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "YOUR_TEMPLATE_ID_1",
    "name": "Welcome Campaign",
    "subject": "Welcome to Test Company!",
    "scheduled_for": "2026-01-27T14:00:00Z",
    "send_timezone": "America/New_York",
    "constants_values": {
      "company_name": "Test Company",
      "recipient_name": "Valued Customer",
      "website_url": "https://testcompany.com"
    }
  }'
```

### Campaign 2: Product Launch Campaign

```bash
curl -X POST http://localhost:8000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "YOUR_TEMPLATE_ID_2",
    "name": "Product Launch Campaign",
    "subject": "🚀 Introducing Amazing Product - Launch Day!",
    "scheduled_for": "2026-02-01T10:00:00Z",
    "send_timezone": "UTC",
    "constants_values": {
      "recipient_name": "Valued Customer",
      "product_name": "Amazing Product",
      "launch_date": "February 1, 2026",
      "discount_percent": "25",
      "product_link": "https://testcompany.com/product"
    }
  }'
```

### Campaign 3: Newsletter Campaign

```bash
curl -X POST http://localhost:8000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "YOUR_TEMPLATE_ID_3",
    "name": "January Newsletter",
    "subject": "January Newsletter - Year Off to a Strong Start",
    "scheduled_for": "2026-02-05T09:00:00Z",
    "send_timezone": "America/Los_Angeles",
    "constants_values": {
      "month": "January",
      "recipient_name": "Valued Customer",
      "news_title": "Year Off to a Strong Start",
      "news_content": "2026 is shaping up to be an incredible year for innovation and growth. Here are the highlights from January.",
      "featured_article": "The Future of Digital Marketing: Trends to Watch in 2026"
    }
  }'
```

---

## 5. RETRIEVE AND LIST DATA

### List All Templates
```bash
curl -X GET http://localhost:8000/api/templates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Template
```bash
curl -X GET "http://localhost:8000/api/templates/{template_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List All Campaigns
```bash
curl -X GET http://localhost:8000/api/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Campaign
```bash
curl -X GET "http://localhost:8000/api/campaigns/{campaign_id}" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### List All Subscribers
```bash
curl -X GET http://localhost:8000/api/subscribers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 6. TESTING WORKFLOW

### Frontend Testing Flow

1. **Login with test account**
   - Navigate to login page
   - Use `testcompany` / `TestPassword123!`

2. **Test Newsletter Template Creation**
   - Go to Templates/Create
   - Fill in template details
   - Add constants (e.g., `{{company_name}}`, `{{recipient_name}}`)
   - Click Create

3. **Test Campaign Creation (4-Step Wizard)**
   - Go to Campaigns/Create
   - **Step 1:** Select a template you created
   - **Step 2:** Fill in the dynamic form with constant values
   - **Step 3:** Enter campaign metadata (name, schedule, timezone)
   - **Step 4:** Review preview and submit

4. **Test Campaign Details View**
   - Click on a campaign to view details
   - Verify constants_values display correctly
   - Check preview rendering

5. **Test Campaign List**
   - View all campaigns
   - Verify status badges
   - Check sorting and filtering

---

## 7. IMPORTANT TEST SCENARIOS

### ✅ Test Case 1: Valid Campaign Creation
- Create template with constants: `{{name}}`, `{{email}}`, `{{code}}`
- Create campaign with matching constants_values
- Verify campaign is created successfully
- Verify preview renders correctly

### ✅ Test Case 2: Invalid Campaign - Missing Constants
- Try to create campaign without all required constants
- Should see validation error: "Missing required constants: name, email"
- Form blocks submission

### ✅ Test Case 3: Invalid Campaign - Extra Constants
- Try to submit campaign with extra constants not in template
- Should see validation error: "Extra constants provided: unknown_field"
- Form blocks submission

### ✅ Test Case 4: Empty Constant Values
- Try to submit campaign with empty string values
- Should see validation error: "All constants must have non-empty values"
- Form blocks submission

### ✅ Test Case 5: Template Preview Update
- Change constant values in Step 2
- Preview in Step 4 should update in real-time
- All {{variable}} replacements should work

### ✅ Test Case 6: Schedule Timezone Handling
- Create campaign with timezone "America/New_York"
- Verify scheduled_for is saved correctly
- Verify display shows correct timezone

---

## 8. DATABASE INSPECTION (Optional)

If you want to manually inspect the database:

```bash
# Connect to PostgreSQL
psql -U your_db_user -d your_db_name -h localhost

# View templates
SELECT id, name, subject, constants FROM newsletter_templates LIMIT 10;

# View campaigns
SELECT id, name, subject, status, constants_values FROM campaigns LIMIT 10;

# View subscribers
SELECT id, subscriber_email, subscriber_name, status FROM subscribers LIMIT 10;
```

---

## 9. POSTMAN COLLECTION ALTERNATIVE

You can also import this as a Postman collection. Create a file called `skymail-test.postman_collection.json` with the structure and import it into Postman for easier testing.

---

## Notes

- Replace `YOUR_TOKEN` with actual JWT token from login
- Replace `YOUR_TEMPLATE_ID_*` with actual template IDs from creation
- All timestamps should be in ISO 8601 format (UTC recommended)
- Subscriber emails must be unique per company
- Constants are case-sensitive and must match exactly

