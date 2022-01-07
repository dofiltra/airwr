/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from 'react-router-dom'

export default function FooterSmall() {
  return (
    <>
      <footer className={' pb-6 py-5'}>
        <div className="container mx-auto px-4">
          <hr className="mb-6 border-b-1 border-gray-700" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4">
              <div className="text-sm font-semibold py-1">
                Copyright © {new Date().getFullYear()}{' '}
                <a
                  href="https://dofiltra.com"
                  className="hover:text-gray-400 text-sm font-semibold py-1"
                >
                  Dofiltra
                </a>
              </div>
            </div>
            <div className="w-full md:w-8/12 px-4">
              <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                <li className="bordered border-r-2 px-4">
                  <Link
                    to="/info/about"
                    className="hover:text-gray-400 text-sm font-semibold block py-1"
                  >
                    About
                  </Link>
                </li>
                <li className="bordered border-r-2 px-4">
                  <Link
                    to="/info/contacts"
                    className="hover:text-gray-400 text-sm font-semibold block py-1"
                  >
                    Contacts
                  </Link>
                </li>
                <li>
                  <a
                    href="https://t.me/dofiltra"
                    target="_blank"
                    className=" hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                  >
                    Telegram
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 inline-block mx-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
