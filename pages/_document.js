import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Prioritize the .ico file */}
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
