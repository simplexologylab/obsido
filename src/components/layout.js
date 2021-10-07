import Head from "next/head";
import Link from "next/link";

export default function Layout({ children, headTitle, pageTitle, backLink }) {
  return (
    <div>
      <Head>
        <title>{headTitle}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-row bg-black justify-center">
          <div className="text-white self-center p-2 m-2">
            {backLink && (
              <Link href={backLink}>
                <a>{`< Back`}</a>
              </Link>
            )}
          </div>
          <h2 className="flex-auto p-4 text-white text-2xl text-center">
            {pageTitle ? pageTitle : "Obsido"}
          </h2>
        </div>
        {children}
      </main>
    </div>
  );
}
