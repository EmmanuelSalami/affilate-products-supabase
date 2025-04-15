# Amazon Product Recommendations

A stylish product recommendation page that displays product affiliate links in an Amazon-style layout.

## Features

- Beautiful product display grid with Amazon-style cards
- Search functionality to filter products by title
- API endpoint to add new products
- Secure API key authentication
- Responsive design
- Elegant background and typography

## Deployment

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd amazon-app
   npm install
   ```
3. Create a `.env.local` file with your API key:
   ```
   API_KEY=your_secret_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

### Deploying to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the `API_KEY` environment variable in the Vercel dashboard
4. Deploy!

## Using the API

### API Endpoints

- `GET /api/products` - Get all products (no authentication required)
- `POST /api/products` - Add a new product (requires API key)

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

## Security

- API key is stored in environment variables
- API key is required for any write operations
- Read operations (GET) don't require authentication for public display
