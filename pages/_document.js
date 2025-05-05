import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prioritize the .ico file */}
       {/* Add Google Fonts - Add Dancing Script for cursive heading, keep Playfair and Lato */}
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />
        {/* Font Awesome for social media icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="shortcut icon" href="/vecteezy_3d-best-product-icon_18868634.ico" />
        <link rel="icon" type="image/vnd.microsoft.icon" href="/vecteezy_3d-best-product-icon_18868634.ico" />
        {/* Keep PNG as fallback/alternative */}
        <link rel="icon" type="image/png" sizes="32x32" href="/vecteezy_3d-best-product-icon_18868634.png?v=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/vecteezy_3d-best-product-icon_18868634.png?v=1" />
        <meta name="msapplication-TileImage" content="/vecteezy_3d-best-product-icon_18868634.png?v=1" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
