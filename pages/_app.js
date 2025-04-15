import "@/styles/globals.css";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/vecteezy_3d-best-product-icon_18868634.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/vecteezy_3d-best-product-icon_18868634.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/vecteezy_3d-best-product-icon_18868634.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
