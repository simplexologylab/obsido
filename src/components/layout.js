import Head from "next/head";
import Link from "next/link";

export default function Layout({ children, headTitle, pageTitle }) {
  return (
    <div>
      <Head>
        <title>{headTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col w-auto">
        <div className="flex flex-row">
          <h2 className="flex-none text-2xl p-4">
            <Link href="/">
              <a>Obsido</a>
            </Link>
          </h2>
          {pageTitle && (
            <div className="flex-grow p-4 gap-4">
              {pageTitle}
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
