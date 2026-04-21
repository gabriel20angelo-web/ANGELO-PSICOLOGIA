import './globals.css';
import WhatsAppButton from '@/components/WhatsAppButton';
import AmbientPsi from '@/components/ui/AmbientPsi';

export const metadata = {
  title: 'Ângelo Psicologia — Psicologia Analítica & Prática Clínica',
  description:
    'Futuro psicólogo clínico de abordagem junguiana. Resumos, mapas mentais, análises culturais e formação para quem quer atender melhor.',
  keywords: 'psicologia analítica, jung, mapas mentais, resumos, psicoterapia, formação clínica',
  openGraph: {
    title: 'Ângelo Psicologia — Psicologia Analítica & Prática Clínica',
    description: 'Resumos, mapas mentais e materiais de estudo com experiência clínica junguiana.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <AmbientPsi />
        <WhatsAppButton />
      </body>
    </html>
  );
}
