import Head from "next/head";
import Link from "next/link";

import {
  ExternalLinkIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/outline";

export default function Layout({
  children,
  headTitle,
  pageTitle,
  backLink,
  kickOut,
}) {
  return (
    <div>
      <Head>
        <title>{headTitle}</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <main className="flex flex-col w-auto">
        <div className="flex flex-row justify-between">
          {backLink && (
            <Link href={backLink} passHref>
              <a className="p-4 self-center">
                <ChevronDoubleLeftIcon className="h-6 w-6" />
              </a>
            </Link>
          )}
          {pageTitle ? (
            <div className="self-center">
              <p className="text-lg md:text-2xl p-2 my-2">{pageTitle}</p>
            </div>
          ) : (
            <div className="p-2">
              <h2 className="text-xl md:text-2xl">Obsido</h2>
            </div>
          )}
          {kickOut && (
            <Link href={kickOut} passHref>
              <a className="p-4 self-center">
                <ExternalLinkIcon className="h-6 w-6" />
              </a>
            </Link>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
