/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-explicit-any */

// import { useState } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { SignInButtons } from 'components/Buttons/SignIn'
import { SignOutButton } from 'components/Buttons/SignOut'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import DefaultButton from 'components/Buttons/Button'
import Language from 'models/Language'
import React, { useContext } from 'preact/compat'
import useBalance from 'hooks/useBalance'

export default function Pay({}) {
  const { user } = useContext(AuthContext)
  const { translate } = useLocalize()
  const { coins = 0 } = useBalance(user?.uid || '')

  return (
    <>
      <div className="p-3  text-neutral-content rounded-box mb-2">
        <p className="md:block p-2">{translate('Balance', { coins })}</p>
        <div className="md:block p-2">
          <div className="form-control max-w-screen-sm">
            {/* <label className="label">
              <span className="label-text">{translate('BalanceUp')}</span>
            </label> */}
            <div className="relative">
              <input
                type="number"
                placeholder="10"
                className="w-full pr-16 input input-primary input-bordered"
              />
              <button className="absolute top-0 right-0 rounded-l-none btn btn-primary">
                {translate('BalanceUpButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
