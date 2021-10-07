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
        <div className="flex flex-row justify-between">
          <h2 className="flex-none text-2xl p-4">
            <Link href="/">
              <a>Obsido</a>
            </Link>
          </h2>
          {pageTitle && (
            <div className="">
              <p className="text-2xl text-white bg-green-900 rounded-l-md p-2 my-2">
                {pageTitle}
              </p>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
