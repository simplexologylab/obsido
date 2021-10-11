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
              <p className="font-primary text-xl md:text-2xl p-2 text-center">{pageTitle}</p>
            </div>
          ) : (
            <div className="p-2 self-center">
              <h2 className="font-primary text-3xl md:text-4xl">Obsido</h2>
            </div>
          )}
          {kickOut && (
            <a
              href={kickOut}
              target="_blank"
              className="p-4 self-center"
              rel="noreferrer"
            >
              <ExternalLinkIcon className="h-6 w-6" />
            </a>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
