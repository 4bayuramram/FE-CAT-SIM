// src/components/seo/SEO.jsx
//
// Komponen reusable untuk pasang <title>, meta description, dan Open
// Graph tags per halaman. Pakai di halaman PUBLIK saja (Home, Bantuan).
// Untuk halaman yang tidak boleh di-index (login, register, payment,
// dashboard, exam), pakai noIndex={true} -- lihat contoh di
// src/routes/AuthPage.jsx.
//
// Cara pakai:
//   <SEO
//     title="Judul Halaman"
//     description="Deskripsi singkat halaman, max ~160 karakter."
//     path="/home/bantuan"
//   />

import { Helmet } from "react-helmet-async";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "../../config/seo";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
}) {
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph (Facebook, WhatsApp, LinkedIn preview) */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
