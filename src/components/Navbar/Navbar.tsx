/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DefaultButton,
  Language,
  SignInButtons,
  SignOutButton,
} from '@dofiltra/tailwind'
import { Link } from 'react-router-dom'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import React, { useContext } from 'preact/compat'

export default function Navbar({}) {
  const { user } = useContext(AuthContext)
  const { translate } = useLocalize()

  return (
    <div className="navbar shadow-lg bg-neutral text-neutral-content rounded-box mb-2">
      <div className="">
        <Link
          to="/"
          className="btn btn-ghost rounded-btn"
          onClick={() => {
            AppStore.lastBlocks = []
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          {/* <span className="hidden md:block">Rewriter</span> */}
        </Link>
      </div>
      <div className="px-1">
        <Link
          to="/translator"
          className="btn btn-ghost rounded-btn"
          onClick={() => {
            AppStore.lastBlocks = []
          }}
        >
          <svg
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          {/* <span className="hidden md:block">TRANSLATOR</span> */}
        </Link>
      </div>

      <div className="px-1">
        <Link
          to="/extractor"
          className="btn btn-ghost rounded-btn"
          onClick={() => {
            AppStore.lastBlocks = []
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-1 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          {/* <span className="hidden md:block">EXTRACTOR</span> */}
        </Link>
      </div>
      <div className="hidden md:block px-2">
        <a
          href="https://docs.google.com/document/d/1Le2TvSQM5jdchbd4RG6PhstB6O3zbokqtbPsjbzDxcI"
          target="_blank"
          className="btn btn-ghost rounded-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-pink-500 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span className="hidden md:block">FAQ</span>
        </a>
      </div>
      <div className="hidden md:block px-2">
        <Link to="/info/api" className="btn btn-ghost rounded-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-500 mx-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="hidden md:block">API</span>
        </Link>
      </div>
      <div className="hidden md:block flex-1 px-2 mx-2"></div>
      <div className="flex-none">
        <div className="flex justify-end md:justify-start flex-1 px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost rounded-btn">
                {AppStore.language}
              </div>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
              >
                {Object.values(Language).map((k) => (
                  <DefaultButton
                    key={k}
                    onClick={() => {
                      AppStore.language = k
                    }}
                    title={k.toUpperCase()}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end flex-1 px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost rounded-btn">
                {!user?.uid && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                )}
                {user?.uid && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </div>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
              >
                {user?.uid && (
                  <li className="">
                    <Link to="/profile">
                      {user?.displayName?.toUpperCase() ||
                        user?.email?.toUpperCase()}
                    </Link>
                  </li>
                )}
                {user?.uid && (
                  <li className="">
                    <Link to="/sites">{translate('Sites').toUpperCase()}</Link>
                  </li>
                )}
                {!user?.uid && (
                  <li className="pt-3">
                    <SignInButtons
                      signInText={translate('Sign in').toUpperCase()}
                    />
                  </li>
                )}
                {user?.uid && (
                  <li className="pt-3">
                    <SignOutButton
                      signOutText={translate('Sign out').toUpperCase()}
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
