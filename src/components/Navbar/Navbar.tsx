/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { SignInButtons } from 'components/Buttons/SignIn'
import { SignOutButton } from 'components/Buttons/SignOut'
import { useContext } from 'react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import DefaultButton from 'components/Buttons/Button'
import Language from 'models/Language'
import React from 'preact/compat'

export default function Navbar({}) {
  // const [navbarOpen, setNavbarOpen] = useState(false)
  const { user } = useContext(AuthContext)

  return (
    <>
      <div className="navbar shadow-lg bg-neutral text-neutral-content rounded-box mb-6">
        <div className="flex-1 px-2 mx-2">
          <Link to="/" className="text-lg font-bold">
            Dofiltra
          </Link>
        </div>
        <div className="flex-none">
          <div className="flex justify-end flex-1 px-2">
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
                      title={k}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                >
                  <li className="text-center pb-3">
                    <b>{user?.displayName?.toUpperCase()}</b>
                  </li>
                  {!user?.uid && (
                    <li>
                      <SignInButtons />
                    </li>
                  )}
                  {user?.uid && (
                    <li>
                      <SignOutButton />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
