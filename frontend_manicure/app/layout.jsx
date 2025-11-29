import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Belanetic App",
  description: "Rede Social e Agendamento para Manicures",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={`${inter.className} bg-gray-50 dark:bg-black min-h-screen text-black dark:text-white`}>
        {children}
      </body>
    </html>
  );
}
