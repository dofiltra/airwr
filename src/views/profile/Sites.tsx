/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AiSite } from 'dprx-types'
import { AiSiteApi } from 'helpers/api'
import { LiveinternetApi, SignInButtons } from '@dofiltra/tailwind'
import { smiles } from '@dofiltra/tailwind'
import { useContext, useEffect, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import _ from 'lodash'
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

  const { aiSites: aiSitesInit = [] } = useAiSites(token)
  const [aiSites, setAiSites] = useState<AiSite[]>([])
  const [selectedTab, setSelectedTab] = useState(SiteTab.Add)
  const [newSites, setNewSites] = useState<string[]>([])

  const [aiSitesStats, setAiSitesStats] = useState<{
    [domain: string]: { [key: string]: string }
  }>({})

  useEffect(() => {
    if (aiSitesInit?.length) {
      setAiSites(aiSitesInit)
      setSelectedTab(SiteTab.List)
    }
  }, [aiSitesInit])

  useEffect(() => {
    aiSites.forEach(async (site) => {
      const stats = await LiveinternetApi.getStats(site.host)
      setAiSitesStats((prev) => ({ ...prev, [site.host]: stats }))
    })
  }, [aiSites])

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

                  setAiSites((prev) => _.uniqBy([...prev, ...result], 'host'))
                })
              }}
            >
              {translate('Add sites')}
            </button>
          </div>
        )}

        {selectedTab === SiteTab.List && (
          <div className="mb-1 w-full p-2">
            <div className="w-full mb-4">
              {translate('Sites count', { count: aiSites.length })}
              <hr />
            </div>
            {aiSites.map((aiSite, index) => (
              <div className="flex">
                <div className="flex-1">
                  <small>{index + 1} </small>
                  <a href={aiSite.host} target="_blank">
                    {aiSite.host}
                  </a>
                </div>
                {/* <div className="flex-1 w-64"></div> */}
                <div
                  className="flex-none"
                  title={aiSite.host}
                  onClick={() => {
                    if (!confirm(`Remove ${aiSite.host}?`)) {
                      return
                    }
                    void AiSiteApi.remove(
                      aiSite as AiSite & { _id: string }
                    ).then(({ result, error }) => {
                      if (error) {
                        return alert(error)
                      }

                      alert(result)

                      setAiSites((prev) =>
                        _.uniqBy(
                          prev.filter((s) => s.host !== aiSite.host),
                          (s) => s.host
                        )
                      )
                    })
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-700 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === SiteTab.Stats && (
          <div className="w-full">
            <div className="flex m-4">
              <div className="flex-1 text-center">Host</div>
              <div className="flex-1 text-center">Day</div>
              <div className="flex-1 text-center">Week</div>
              <div className="flex-1 text-center">Month</div>
            </div>
            <hr className="" />

            {aiSites.map((aiSite, index) => {
              const {
                LI_error = '',
                LI_day_vis = '-',
                LI_month_vis = '-',
                LI_week_vis = '-',
              } = { ...aiSitesStats[aiSite.host] }
              return (
                <div className="flex p-2">
                  <div className="flex-1">
                    <small>{index + 1} </small>
                    <a href={aiSite.host} target="_blank">
                      {aiSite.host}
                    </a>
                  </div>
                  <div className="flex-1 text-center">{LI_day_vis}</div>
                  <div className="flex-1 text-center">{LI_week_vis}</div>
                  <div className="flex-1 text-center">{LI_month_vis}</div>
                </div>
              )
            })}
            <hr className=" p-2" />

            <div className="flex mt-4">
              <div className="flex-1 text-center">Total</div>
              <div className="flex-1 text-center">
                {Object.keys(aiSitesStats)
                  .map((key) => parseInt(aiSitesStats[key]?.LI_day_vis || '0'))
                  .reduce((prev, cur) => prev + cur, 0)}
              </div>
              <div className="flex-1 text-center">
                {Object.keys(aiSitesStats)
                  .map((key) => parseInt(aiSitesStats[key]?.LI_week_vis || '0'))
                  .reduce((prev, cur) => prev + cur, 0)}
              </div>
              <div className="flex-1 text-center">
                {Object.keys(aiSitesStats)
                  .map((key) =>
                    parseInt(aiSitesStats[key]?.LI_month_vis || '0')
                  )
                  .reduce((prev, cur) => prev + cur, 0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
