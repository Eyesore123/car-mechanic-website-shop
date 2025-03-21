// app/layout.server.tsx (Server Component)
export const metadata = {
    title: "PNP-Power Shop",
    description: "Well sell turbochargers and are custom-made components for cars.",
  };
  
  import RootLayout from './layout';
  
  export default function ServerLayout({ children }: { children: React.ReactNode }) {
    return <RootLayout>{children}</RootLayout>;
  }
  