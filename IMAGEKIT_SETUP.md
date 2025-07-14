# ImageKit Setup for ACME Drinks

## Required Environment Variables

Add these to your `.env.local` file:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/youraccount
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
```

## Getting ImageKit Credentials

1. Sign up at [ImageKit.io](https://imagekit.io)
2. Create a new project
3. Go to Settings > API Keys
4. Copy your:
   - URL Endpoint
   - Public Key
   - Private Key

## Features Implemented

✅ **Admin Image Upload**

- Secure file upload to ImageKit from admin panel
- File validation (image types, size limits)
- Preview before upload
- Progress indication

✅ **Database Integration**

- ImageKit URLs stored in `Product.image` field
- Automatic product creation with uploaded images

✅ **Frontend Display**

- Images displayed on homepage product cards
- Images displayed on product detail pages
- Responsive image handling

✅ **Security**

- Admin-only access to upload functionality
- Server-side authentication checks
- Secure API endpoints

## How It Works

1. **Admin Uploads Image**: Admin selects image in `/admin` page
2. **ImageKit Upload**: File uploaded directly to ImageKit via API
3. **URL Storage**: Secure ImageKit URL stored in database
4. **Frontend Display**: Images displayed using stored URLs

## File Structure

```
├── lib/imagekit.ts                    # ImageKit configuration
├── app/api/admin/upload-image/        # Upload API endpoint
├── components/ImageUpload.tsx         # Upload component
└── components/AdminContent.tsx        # Updated admin form
```

## Testing

1. Set up your ImageKit credentials in `.env.local`
2. Start the development server: `npm run dev`
3. Go to `/admin` (admin role required)
4. Create a new product with an image
5. Check the homepage to see the uploaded image
