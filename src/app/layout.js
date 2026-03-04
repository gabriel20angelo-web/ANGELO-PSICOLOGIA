import './globals.css';

export const metadata = {
  title: 'Ângelo Psicologia — Psicologia Analítica & Prática Clínica',
  description:
    'Futuro psicólogo clínico de abordagem junguiana. Resumos, mapas mentais, análises culturais e formação para quem quer atender melhor.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
