# Amazon Product Recommendations

A stylish product recommendation page that displays product affiliate links in an Amazon-style layout, with server-side rendering and Redis database storage via Vercel KV.

## Features

- Beautiful product display grid with Amazon-style cards
- Search functionality to filter products by title
- Full API for managing product recommendations
- Persistent database storage using Vercel KV (Redis)
- Automatic data seeding from products.json
- Secure API key authentication
- Responsive design
- Elegant background and typography

## Technology Stack

- **Frontend**: Next.js with server-side rendering
- **Database**: Vercel KV (Redis) for serverless data storage
- **Styling**: CSS-in-JS with inline styles
- **Deployment**: Vercel
- **Images**: Next.js Image component for optimization

## Deployment

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd amazon-app
   npm install
   ```
3. Create a `.env.local` file with your API key and Redis configuration:
   ```
   # API Authentication
   API_KEY=your_secret_api_key
   
   # Vercel KV (Redis) Configuration - Use EXACTLY these variable names
   KV_REST_API_URL=your_upstash_url
   KV_REST_API_TOKEN=your_upstash_token
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the Vercel KV integration to your project in the Vercel dashboard:
   - Go to your project in Vercel
   - Click on "Storage" tab
   - Find "KV" (Redis) and click "Connect"
   - Follow the prompts to set up a new database
4. Add the `API_KEY` environment variable in the Vercel dashboard
5. Deploy!

## Database Setup

This project uses Vercel KV (powered by Upstash Redis) for data storage:

1. The database is automatically created when you add the Vercel KV integration
2. Environment variables are automatically injected by Vercel
3. Initial product data is seeded from the `data/products.json` file
4. Data persistence across deployments is handled automatically

### Important Database Notes

- **Environment Variable Names**: The application specifically expects `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables. Using different names (like UPSTASH_REDIS_*) will cause connection issues.
- **Client Configuration**: The app uses `@upstash/redis` client which automatically handles JSON serialization with the Vercel KV setup.
- **Data Seeding**: On first run with an empty database, the system automatically populates Redis with data from `data/products.json`.
- **Troubleshooting**: If you see 401 errors or "[object Object]" parsing errors, check that:
  1. Your environment variables are named exactly as specified above
  2. The Vercel KV integration is properly connected
  3. You're not manually JSON.stringify'ing data before storing in Redis (the client handles this)

## Using the API

### API Endpoints

- `GET /api/products` - Get all products (no authentication required)
- `GET /api/products?id=123` - Get a specific product by ID
- `GET /api/products?title=keyword` - Search products by title
- `POST /api/products` - Add a new product (requires API key)
- `DELETE /api/products` - Delete one or more products by ID (requires API key)

### Authentication

All write operations require an API key provided in the headers:

```
x-api-key: your_api_key_here
```

### Adding a Product

To add a product, send a POST request to `/api/products` with:

```json
{
  "title": "Product Title",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Product description",
  "productUrl": "https://amazon.com/your-affiliate-link"
}
```

Example using curl:

```bash
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{"title":"Example Product","productUrl":"https://amazon.com/affiliate-link"}'
```

Note:
- Only `title` and `productUrl` are required
- If `imageUrl` is not provided, a placeholder image will be used
- If `description` is not provided, it will be empty

### Deleting Products

To delete products, send a DELETE request to `/api/products` with:

```json
{
  "ids": ["123", "456"]
}
```

Example using curl:

```bash
curl -X DELETE https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key_here" \
  -d '{"ids":["1744742800424", "1744742847730"]}'
```

## Security

- API key is stored in environment variables
- API key is required for any write operations
- Same-origin requests bypass API key validation
- Read operations (GET) don't require authentication for public display

## Data Persistence

- Product data is stored in Vercel KV Redis database
- The database automatically seeds from `data/products.json` if empty
- Changes made via the API are persisted across deployments
- Vercel KV handles backups and reliability
