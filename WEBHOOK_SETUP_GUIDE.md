# Stripe Webhook Setup Guide

## The Problem

Your Stripe payment is successful, but orders aren't appearing in the dashboard because the webhook isn't creating orders in the database.

## Solution Steps

### 1. Set Up Stripe Webhook (Production)

1. **Go to Stripe Dashboard**

   - Visit https://dashboard.stripe.com/webhooks
   - Click "Add endpoint"

2. **Configure Webhook**

   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Events to send**: Select `checkout.session.completed`
   - Click "Add endpoint"

3. **Copy Webhook Secret**

   - After creating the webhook, click on it
   - Click "Reveal" next to the signing secret
   - Copy the secret (starts with `whsec_`)

4. **Add to Environment Variables**
   - Add `STRIPE_WEBHOOK_SECRET=whsec_your_secret_here` to your `.env` file

### 2. For Local Development (Using Stripe CLI)

1. **Install Stripe CLI**

   ```bash
   # Windows (using chocolatey)
   choco install stripe-cli

   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe**

   ```bash
   stripe login
   ```

3. **Forward Webhooks to Local Server**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the Webhook Secret**
   - The CLI will show a webhook secret like `whsec_xxx`
   - Add this to your `.env` file as `STRIPE_WEBHOOK_SECRET`

### 3. Test the Setup

1. **Create a Test Order**

   ```bash
   curl -X POST http://localhost:3000/api/test/create-order
   ```

2. **Check Dashboard**

   - Go to http://localhost:3000/dashboard
   - You should see the test order

3. **Test Real Payment**
   - Make a real purchase through Stripe
   - Check the console logs for webhook events
   - Verify the order appears in dashboard

### 4. Debug Webhook Issues

1. **Check Console Logs**

   - Look for webhook logs in your terminal
   - Should see: "🔔 Webhook received", "✅ Order created successfully"

2. **Check Database**

   ```bash
   curl http://localhost:3000/api/debug/orders
   ```

3. **Common Issues**
   - **Webhook secret missing**: Add `STRIPE_WEBHOOK_SECRET` to `.env`
   - **Wrong endpoint URL**: Make sure it's `/api/webhooks/stripe`
   - **Missing events**: Ensure `checkout.session.completed` is selected
   - **Local development**: Use Stripe CLI to forward webhooks

### 5. Environment Variables Checklist

Make sure these are in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=your_database_url
```

### 6. Test Order Creation

If you want to test the dashboard immediately without waiting for webhook setup:

```bash
# Create a test order
curl -X POST http://localhost:3000/api/test/create-order

# Check all orders
curl http://localhost:3000/api/debug/orders
```

## Next Steps

1. Set up the webhook using the steps above
2. Test with a real payment
3. Check the dashboard to see your orders
4. If still not working, check the console logs for detailed error messages

The enhanced webhook now has detailed logging to help you debug any issues!

////////////////////////////////

Perfect! Since you’re developing locally and have the Stripe CLI installed, you can use it to forward Stripe webhooks from Stripe’s servers to your local Next.js API route.

Here’s exactly what to do:

---

## **1. Start Your Local Next.js App**

Make sure your app is running on `http://localhost:3000`.

---

## **2. Login to Stripe CLI (if you haven’t already)**

```sh
stripe login
```

This will open a browser window to authenticate your CLI with your Stripe account.

---

## **3. Forward Webhooks to Your Local API**

Run this command in your terminal:

```sh
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

- This will create a public tunnel and forward Stripe events to your local endpoint.
- You’ll see output like:
  ```
  Ready! Your webhook signing secret is whsec_...
  ```

---

## **4. Copy the Webhook Secret**

- In the Stripe CLI output, look for a line like:
  ```
  Your webhook signing secret is whsec_XXXXXXXXXXXXXXXXXXXXXXXX
  ```
- Copy that secret.

---

## **5. Add the Secret to Your `.env` File**

Open your `.env` file and add/update this line:

```env
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```

Replace the value with the secret you copied.

---

## **6. Restart Your Next.js App**

After updating `.env`, restart your dev server so it picks up the new environment variable.

---

## **7. Test the Flow**

- Make a test payment or trigger a Stripe event.
- The webhook should be received by your local app and processed.

---

### **Summary Table**

| Step | Command/Action                                                  |
| ---- | --------------------------------------------------------------- |
| 1    | Start Next.js app (`npm run dev` or `yarn dev`)                 |
| 2    | `stripe login` (if not done)                                    |
| 3    | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| 4    | Copy `whsec_...` from CLI output                                |
| 5    | Add to `.env` as `STRIPE_WEBHOOK_SECRET=...`                    |
| 6    | Restart Next.js app                                             |
| 7    | Test payment/webhook                                            |

---

**That’s it!**  
You do NOT need a public URL for local development—Stripe CLI handles the tunneling for you.

Let me know if you hit any issues or want to test a specific event!
