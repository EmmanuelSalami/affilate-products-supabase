import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Force favicon refresh by using a query parameter */}
        <link rel="icon" type="image/png" href="/vecteezy_3d-best-product-icon_18868634.png?v=1" />
        <link rel="shortcut icon" type="image/png" href="/vecteezy_3d-best-product-icon_18868634.png?v=1" />
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
