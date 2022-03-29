/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AiSite } from 'dprx-types'
import { AiSiteApi } from 'helpers/api'
import { SignInButtons } from '@dofiltra/tailwind'
import { smiles } from '@dofiltra/tailwind'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import useAiSites from 'hooks/useAiSites'

enum SiteTab {
  Add = 'Add',
  List = 'List',
  Stats = 'Stats',
}

export default () => {
  const { translate } = useLocalize()
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  if (!token) {
    return (
      <div className="min-h-full">
        <div className="w-full ">
          <h1 className="text-center mb-5">Auth required</h1>
          <div className="text-center mb-5 justify-center flex">
            <SignInButtons signInText={translate('sign in')} />
          </div>
        </div>
      </div>
    )
  }

  const [selectedTab, setSelectedTab] = useState(SiteTab.Add)
  const [newSites, setNewSites] = useState<string[]>([])
  const { aiSites } = useAiSites(token)

  return (
    <>
      <div className="w-full min-h-full">
        <h1 className="mb-5 py-4 text-5xl text-center font-bold">
          {translate('Sites')}
          <img src={smileSrc} className="inline px-4" />
        </h1>
        <div className="text-center mb-5 justify-center flex"></div>
        <div className="mb-1 w-full p-2">
          <div className="tabs">
            {Object.values(SiteTab).map((tab) => (
              <div
                className={`tab tab-lifted ${
                  tab === selectedTab ? 'tab-active' : ''
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {translate(tab)}
              </div>
            ))}
          </div>
        </div>

        {selectedTab === SiteTab.Add && (
          <div className="mb-1 w-full p-2">
            <textarea
              className="textarea textarea-info w-full"
              rows={10}
              placeholder={`https://site1.com\nhttps://site2.com\nhttps://site3.com`}
              onChange={(e) =>
                setNewSites(
                  e.target.value
                    .split('\n')
                    .filter((site) => {
                      try {
                        return !!new URL(site)
                      } catch (error: any) {
                        return false
                      }
                    })
                    .map((site) => new URL(site).origin)
                )
              }
            ></textarea>

            <button
              className="btn btn-primary btn-success w-full"
              onClick={() => {
                void AiSiteApi.add(
                  newSites.map((host) => ({ token, host }))
                ).then(({ result, error }) => {
                  error && alert(error)
                  !error && alert(`Added: ${result?.length || 0}`)
                })
              }}
            >
              {translate('Add sites')}
            </button>
          </div>
        )}

        {selectedTab === SiteTab.List && (
          <div className="mb-1 w-full p-2">{JSON.stringify(aiSites)}</div>
        )}

        {selectedTab === SiteTab.Stats && (
          <div className="mb-1 w-full p-2">TODO!</div>
        )}
      </div>
    </>
  )
}
