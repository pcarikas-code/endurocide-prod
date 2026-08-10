import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Per-route SEO metadata ───────────────────────────────────────────────────
interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  bodyContent: string;
}

const BASE_URL = "https://endurocide.nz";

const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "endurocide® NZ | Antimicrobial Hospital Curtains",
    description: "Endurocide® NZ provides patented antimicrobial hospital curtains that kill pathogens on contact. Proven infection control for New Zealand healthcare.",
    canonical: `${BASE_URL}/`,
    bodyContent: `<h1>endurocide® NZ | Antimicrobial Hospital Curtains</h1><p>Endurocide® NZ provides patented antimicrobial hospital curtains that kill pathogens on contact. Proven infection control for New Zealand healthcare.</p>`,
  },
  "/products": {
    title: "Antimicrobial Hospital Curtains | Products | endurocide® NZ",
    description: "Browse the full range of endurocide® disposable antimicrobial and sporicidal hospital curtains. Proven effective against MRSA, C. difficile, and H1N1.",
    canonical: `${BASE_URL}/products`,
    bodyContent: `<h1>Antimicrobial Hospital Curtains</h1><p>Browse the full range of endurocide® disposable antimicrobial and sporicidal hospital curtains. Proven effective against MRSA, C. difficile, and H1N1.</p>`,
  },
  "/technology": {
    title: "Trap & Kill Technology | endurocide® NZ",
    description: "Learn how endurocide®'s patented Trap & Kill technology works to eliminate bacteria, fungi, and spores on contact and protect patients 24/7.",
    canonical: `${BASE_URL}/technology`,
    bodyContent: `<h1>Trap &amp; Kill Technology</h1><p>Learn how endurocide®'s patented Trap &amp; Kill technology works to eliminate bacteria, fungi, and spores on contact and protect patients 24/7.</p>`,
  },
  "/guides": {
    title: "Product Guides & Resources | endurocide® NZ",
    description: "Download endurocide® product guides, installation instructions, and technical data sheets for antimicrobial hospital curtains.",
    canonical: `${BASE_URL}/guides`,
    bodyContent: `<h1>Product Guides &amp; Resources</h1><p>Download endurocide® product guides, installation instructions, and technical data sheets for antimicrobial hospital curtains.</p>`,
  },
  "/studies": {
    title: "Clinical Studies & Test Reports | endurocide® NZ",
    description: "Independent clinical studies and laboratory test reports proving endurocide® curtains reduce bacterial load by over 98% in real hospital environments.",
    canonical: `${BASE_URL}/studies`,
    bodyContent: `<h1>Clinical Studies &amp; Test Reports</h1><p>Independent clinical studies and laboratory test reports proving endurocide® curtains reduce bacterial load by over 98% in real hospital environments.</p>`,
  },
  "/news": {
    title: "News & Insights | endurocide® NZ",
    description: "Latest news, research insights, and infection control updates from endurocide® New Zealand.",
    canonical: `${BASE_URL}/news`,
    bodyContent: `<h1>News &amp; Insights</h1><p>Latest news, research insights, and infection control updates from endurocide® New Zealand.</p>`,
  },
  "/about": {
    title: "About endurocide® New Zealand | Kenco Ltd",
    description: "endurocide® New Zealand is distributed by Kenco Ltd. Learn about our mission to reduce healthcare-associated infections across New Zealand.",
    canonical: `${BASE_URL}/about`,
    bodyContent: `<h1>About endurocide® New Zealand</h1><p>endurocide® New Zealand is distributed by Kenco Ltd. Learn about our mission to reduce healthcare-associated infections across New Zealand.</p>`,
  },
  "/contact": {
    title: "Contact endurocide® New Zealand | Request a Quote",
    description: "Get in touch with endurocide® New Zealand for quotes, samples, or technical inquiries. Call +64 21 029 66718 or email info@endurocide.nz.",
    canonical: `${BASE_URL}/contact`,
    bodyContent: `<h1>Contact endurocide® New Zealand</h1><p>Get in touch with endurocide® New Zealand for quotes, samples, or technical inquiries. Call +64 21 029 66718 or email info@endurocide.nz.</p>`,
  },
  "/monkeypox-infection-control": {
    title: "Monkeypox Infection Control | endurocide® NZ",
    description: "How endurocide® antimicrobial curtains help healthcare facilities manage monkeypox and other emerging infectious diseases through environmental hygiene.",
    canonical: `${BASE_URL}/monkeypox-infection-control`,
    bodyContent: `<h1>Monkeypox Infection Control</h1><p>How endurocide® antimicrobial curtains help healthcare facilities manage monkeypox and other emerging infectious diseases through environmental hygiene.</p>`,
  },
  "/thank-you": {
    title: "Thank You | endurocide® NZ",
    description: "Thank you for contacting endurocide® New Zealand. We will be in touch shortly.",
    canonical: `${BASE_URL}/thank-you`,
    bodyContent: `<h1>Thank You</h1><p>Thank you for contacting endurocide® New Zealand. We will be in touch shortly.</p>`,
  },
  // Article routes
  "/news/overlooked-vector-mitigating-hais": {
    title: "The Overlooked Vector: Mitigating HAIs with Advanced Privacy Curtains | endurocide® NZ",
    description: "Privacy curtains are often an overlooked high-touch surface. Traditional textile curtains can harbour dangerous pathogens including MRSA, VRE, and C. difficile within a week of laundering.",
    canonical: `${BASE_URL}/news/overlooked-vector-mitigating-hais`,
    bodyContent: `<h1>The Overlooked Vector: Mitigating HAIs with Advanced Privacy Curtains</h1><p>Privacy curtains are often an overlooked high-touch surface. Traditional textile curtains can harbour dangerous pathogens including MRSA, VRE, and C. difficile within a week of laundering.</p>`,
  },
  "/news/clinical-evidence-data-driven-approach": {
    title: "Clinical Evidence: A Data-Driven Approach to Curtain Hygiene | endurocide® NZ",
    description: "A study in Infection Prevention in Practice found bacterial load on curtains dropped from 32.6 to just 0.56 CFU/cm² after installing endurocide® antimicrobial curtains.",
    canonical: `${BASE_URL}/news/clinical-evidence-data-driven-approach`,
    bodyContent: `<h1>Clinical Evidence: A Data-Driven Approach to Curtain Hygiene</h1><p>A study in Infection Prevention in Practice found bacterial load on curtains dropped from 32.6 to just 0.56 CFU/cm² after installing endurocide® antimicrobial curtains.</p>`,
  },
  "/news/beyond-bacteria-importance-sporicidal-action": {
    title: "Beyond Bacteria: The Importance of Sporicidal Action | endurocide® NZ",
    description: "C. difficile spores can survive on surfaces for months. endurocide®'s patented sporicidal technology penetrates the spore's protective coats and causes lethal DNA damage.",
    canonical: `${BASE_URL}/news/beyond-bacteria-importance-sporicidal-action`,
    bodyContent: `<h1>Beyond Bacteria: The Importance of Sporicidal Action</h1><p>C. difficile spores can survive on surfaces for months. endurocide®'s patented sporicidal technology penetrates the spore's protective coats and causes lethal DNA damage.</p>`,
  },
  "/news/operational-efficiency-strategic-advantage": {
    title: "Operational Efficiency: A Strategic Advantage in Infection Control | endurocide® NZ",
    description: "endurocide® disposable antimicrobial curtains eliminate the need for laundering with a two-year active lifespan, reducing labour, utility, and inventory costs for healthcare facilities.",
    canonical: `${BASE_URL}/news/operational-efficiency-strategic-advantage`,
    bodyContent: `<h1>Operational Efficiency: A Strategic Advantage in Infection Control</h1><p>endurocide® disposable antimicrobial curtains eliminate the need for laundering with a two-year active lifespan, reducing labour, utility, and inventory costs for healthcare facilities.</p>`,
  },
  "/news/layered-defence-integrating-curtains": {
    title: "A Layered Defence: Integrating Curtains into Infection Control | endurocide® NZ",
    description: "endurocide® antimicrobial curtains provide a continuous, passive layer of defence, working 24/7 to kill pathogens deposited on their surface between scheduled cleanings.",
    canonical: `${BASE_URL}/news/layered-defence-integrating-curtains`,
    bodyContent: `<h1>A Layered Defence: Integrating Curtains into Infection Control</h1><p>endurocide® antimicrobial curtains provide a continuous, passive layer of defence, working 24/7 to kill pathogens deposited on their surface between scheduled cleanings.</p>`,
  },
  "/news/long-term-value-clinical-financial-case": {
    title: "Long-Term Value: The Clinical and Financial Case | endurocide® NZ",
    description: "A comprehensive analysis reveals a strong ROI for endurocide® curtains. Eliminating laundering costs and reducing HAIs delivers significant clinical and financial value.",
    canonical: `${BASE_URL}/news/long-term-value-clinical-financial-case`,
    bodyContent: `<h1>Long-Term Value: The Clinical and Financial Case</h1><p>A comprehensive analysis reveals a strong ROI for endurocide® curtains. Eliminating laundering costs and reducing HAIs delivers significant clinical and financial value.</p>`,
  },
};

/**
 * Inject per-route meta tags and unique fallback body content into the HTML
 * so every URL returns a distinct document (unique MD5 hash for crawlers).
 */
function injectRouteMeta(html: string, routePath: string): string {
  const meta = ROUTE_META[routePath] ?? ROUTE_META["/"];

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title}</title>`
  );

  // Replace or inject <meta name="description">
  if (/<meta\s+name="description"/.test(html)) {
    html = html.replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${meta.description}" />`
    );
  } else {
    html = html.replace("</head>", `<meta name="description" content="${meta.description}" />\n</head>`);
  }

  // Replace or inject <link rel="canonical">
  if (/<link\s+rel="canonical"/.test(html)) {
    html = html.replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${meta.canonical}" />`
    );
  } else {
    html = html.replace("</head>", `<link rel="canonical" href="${meta.canonical}" />\n</head>`);
  }

  // Replace OG tags
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/,   `$1${meta.title}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/,  `$1${meta.description}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/,  `$1${meta.canonical}$2`);
  html = html.replace(/(<meta\s+property="twitter:title"\s+content=")[^"]*(")/,   `$1${meta.title}$2`);
  html = html.replace(/(<meta\s+property="twitter:description"\s+content=")[^"]*(")/,  `$1${meta.description}$2`);
  html = html.replace(/(<meta\s+property="twitter:url"\s+content=")[^"]*(")/,  `$1${meta.canonical}$2`);

  // Inject unique route identifier as a hidden comment so the hash is unique
  html = html.replace("</head>", `<!-- route: ${routePath} -->\n</head>`);

  // Replace the static fallback body content inside #root with route-specific content
  html = html.replace(
    /(<div id="root">)[\s\S]*?(<script)/,
    `$1\n      <!-- Fallback content for non-JS crawlers -->\n      ${meta.bodyContent}\n    $2`
  );

  return html;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Add security headers
  app.use((_req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "upgrade-insecure-requests; default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;"
    );
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    fs.readFile(indexPath, "utf-8", (err, html) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }
      // Normalise path: strip trailing slash (except root) and query strings
      const routePath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
      const injected = injectRouteMeta(html, routePath);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(injected);
    });
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
