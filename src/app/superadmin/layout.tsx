import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable} antialiased min-h-screen bg-background text-on-surface font-body`}>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      {children}
    </div>
  );
}
