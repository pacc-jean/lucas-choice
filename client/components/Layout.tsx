import { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

type Props = {
  children: ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'Luca’s Choice' }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="An online shop for all things ladies' wear." />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="text-center py-4 border-t text-sm text-gray-500">
          © {new Date().getFullYear()} Luca’s Choice. All rights reserved.
        </footer>
      </div>
    </>
  );
}
