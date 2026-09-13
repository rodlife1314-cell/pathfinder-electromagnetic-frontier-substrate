import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Pathfinder: Frontier Substrate',
  description: 'Sovereign evidence architecture for mapping structural dependencies, RAPIDS scores, crystal bridges, and transaction-state gates across frontier technology universes.',
  openGraph: {
    title: 'Pathfinder: Frontier Substrate',
    description: 'Sovereign evidence architecture for mapping structural dependencies, RAPIDS scores, crystal bridges, and transaction-state gates across frontier technology universes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pathfinder: Frontier Substrate',
    description: 'Sovereign evidence architecture for mapping structural dependencies, RAPIDS scores, crystal bridges, and transaction-state gates across frontier technology universes.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
