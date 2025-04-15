import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { readProducts } from './api/products'; // Import the data fetching function

// Remove Geist font imports if not used elsewhere, or keep if needed
// import { Geist, Geist_Mono } from "next/font/google";
// const geistSans = Geist(...);
// const geistMono = Geist_Mono(...);

// This function runs on the server for every request
export async function getServerSideProps(context) {
  // Determine the base URL dynamically - NO LONGER NEEDED FOR FETCH
  // const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  // const host = context.req.headers.host;
  // const baseUrl = `${protocol}://${host}`;

  let products = [];
  let error = null;

  try {
    // Fetch products DIRECTLY by calling the imported function
    // const res = await fetch(`${baseUrl}/api/products`); // REMOVED FETCH CALL
    // if (!res.ok) {
    //   const errorBody = await res.text();
    //   console.error(`API fetch error (${res.status}): ${errorBody}`);
    //   throw new Error(`Failed to fetch products, status: ${res.status}`);
    // }
    // products = await res.json(); // REMOVED JSON PARSING
    
    products = await readProducts(); // CALL DIRECTLY
  } catch (e) {
    console.error("getServerSideProps Error:", e);
    // Pass error state to the page component
    error = e.message || "An unexpected error occurred while fetching products.";
  }

  // Pass data to the page via props
  return {
    props: {
      products,
      error, // Pass error to the component
    },
  };
}

// The main page component
export default function Home({ products, error }) {
  // Add state for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return true; // Show all if no search query
    
    return product.title.toLowerCase().includes(query);
  });

  return (
    <div style={styles.container}>
      <Head>
        <title>My Recommended Products</title>
        <meta name="description" content="My favorite recommended products from Amazon" />
        {/* Favicon setup with only PNG icon */}
        <link rel="icon" type="image/png" href="/vecteezy_3d-best-product-icon_18868634.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/vecteezy_3d-best-product-icon_18868634.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/vecteezy_3d-best-product-icon_18868634.png" />
        {/* Add Google Fonts - Add Dancing Script for cursive heading, keep Playfair and Lato */}
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        {/* Font Awesome for social media icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Add style tag for hover effects */}
        <style jsx global>{`
          .social-icon:hover {
            color: #0066C0 !important;
            transform: scale(1.1);
          }
          .product-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(15, 17, 17, 0.2);
            border-color: rgba(221, 221, 221, 0.9);
          }
          .amazon-button:hover {
            background-color: #f7ca00 !important;
            transform: translateY(-1px);
            box-shadow: 0 3px 7px rgba(0, 0, 0, 0.15) !important;
          }
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
          }
        `}</style>
      </Head>

      <main style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.heading}>My Recommended Products</h1>
          
          {/* Social Media Icons */}
          <div style={styles.socialContainer}>
            <a 
              href="https://instagram.com/your_username" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              aria-label="Follow on Instagram"
            >
              <i className="fa-brands fa-instagram social-icon" style={styles.socialIcon}></i>
            </a>
            <a 
              href="https://twitter.com/your_username" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              aria-label="Follow on Twitter"
            >
              <i className="fa-brands fa-twitter social-icon" style={styles.socialIcon}></i>
            </a>
            <a 
              href="https://tiktok.com/@your_username" 
              target="_blank" 
              rel="noopener noreferrer"
              style={styles.socialLink}
              aria-label="Follow on TikTok"
            >
              <i className="fa-brands fa-tiktok social-icon" style={styles.socialIcon}></i>
            </a>
          </div>
        </div>

        {/* Search bar */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={styles.clearButton}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>
              Error loading products: {error}
            </p>
          </div>
        )}

        <div style={styles.productListContainer}>
          {filteredProducts.length === 0 && !error && (
            <p style={styles.emptyText}>
              {searchQuery 
                ? `No products found matching "${searchQuery}"`
                : "No products available yet."}
            </p>
          )}
          
          {filteredProducts.map((product) => (
            <div key={product.id} style={styles.productCard} className="product-card">
              <div style={styles.imageContainer}>
                <Image 
                  src={product.imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'} 
                  alt={product.title} 
                  width={180} 
                  height={180}
                  style={styles.productImage}
                  unoptimized // For external URLs
                />
              </div>
              
              <div style={styles.productInfo}>
                <h2 style={styles.productTitle}>{product.title}</h2>
                {product.description && (
                  <p style={styles.productDescription}>{product.description}</p>
                )}
                
                <a 
                  href={product.productUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.amazonButton}
                  className="amazon-button"
                >
                  View on Amazon
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} My Recommended Products</p>
      </footer>
    </div>
  );
}

// Amazon-styled theme with more authentic Amazon look
const styles = {
  container: {
    backgroundImage: 'url("https://i.pinimg.com/736x/5c/e0/ff/5ce0ff510f52e9f7fe03688359b96da7.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: '#EAEDED', // Fallback color if image fails to load
    minHeight: '100vh',
    fontFamily: 'Lato, Arial, sans-serif', 
    color: '#0F1111',
  },
  main: {
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '0 20px 40px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.65)', // More transparent white background (changed from 0.85)
    backdropFilter: 'blur(3px)', // Reduced blur effect (changed from 5px)
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
  header: {
    padding: '25px 0 20px',
    borderBottom: '1px solid rgba(221, 221, 221, 0.3)',
    marginBottom: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontSize: '48px',
    fontWeight: '500',
    color: '#333', // Restore original color
    margin: '0 0 15px 0',
    fontFamily: 'Dancing Script, cursive',
    letterSpacing: '0.5px',
    textShadow: '1px 1px 3px rgba(255, 255, 255, 0.9)',
  },
  socialContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px', // Space between icons
    marginTop: '10px',
  },
  socialLink: {
    color: '#333',
    transition: 'color 0.3s ease, transform 0.2s ease',
    display: 'inline-block',
  },
  socialIcon: {
    fontSize: '22px',
    color: '#555', // Restore original color
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '24px',
    maxWidth: '600px', // Limit search bar width
    margin: '0 auto 24px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 40px 10px 16px',
    fontSize: '15px',
    border: '1px solid rgba(213, 217, 217, 0.5)',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) inset',
    outline: 'none',
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '16px',
    color: '#888',
    cursor: 'pointer',
    outline: 'none',
    padding: '4px 8px',
  },
  productListContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 3px 10px rgba(15, 17, 17, 0.15)', // Restore original shadow
    padding: '18px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid rgba(221, 221, 221, 0.8)', // Restore original border
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
    height: '180px',
  },
  productImage: {
    objectFit: 'contain',
    maxHeight: '180px',
    width: 'auto',
  },
  productInfo: {
    padding: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1, // Allow this section to grow
  },
  productTitle: {
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '24px',
    marginBottom: '8px',
    color: '#0066C0', // Restore Amazon's link blue
    // For multi-line truncation
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    height: '48px', // 2 lines at 24px line height
  },
  productDescription: {
    fontSize: '14px',
    color: '#565959', // Amazon's secondary text color
    marginBottom: '16px',
    // For multi-line truncation
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    flexGrow: 1, // Allow description to grow and push button to bottom
  },
  amazonButton: {
    backgroundColor: '#FFD814', // Restore Amazon's yellow button
    border: '1px solid #FCD200',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#0F1111', // Restore original color
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    boxShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
    marginTop: 'auto', // Push to bottom of flex container
    alignSelf: 'flex-start', // Align to left
    transition: 'transform 0.1s ease, box-shadow 0.1s ease',
  },
  emptyText: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#565959',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid #D00',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    maxWidth: '600px',
    margin: '0 auto 20px',
  },
  errorText: {
    color: '#D00',
    margin: 0,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'rgba(183, 156, 157, 0.9)', // Soft pink/mauve from the background image
    color: '#FFF',
    textAlign: 'center',
    padding: '15px',
    marginTop: '20px',
    borderRadius: '8px',
    maxWidth: '1500px',
    margin: '20px auto 0',
  },
  footerText: {
    fontSize: '14px',
    margin: 0,
  },
};
