/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DateTime } from 'luxon'
import { Doextractor, RewriteMode, TaskStatus } from 'dprx-types'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { ExtractorApi } from 'helpers/api'
import { Loading } from 'components/Containers/Loader'
import { ToneMode } from 'components/Select/Tone'
import { smiles } from 'helpers/smiles'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AppStore from 'stores/AppStore'
import AuthContext from 'components/Auth/AuthContext'
import _ from 'lodash'

export default () => {
  const { translate } = useLocalize()
  const [groups, setGroups] = useState([] as string[][])

  const [enableCustomizeContent, setEnableCustomizeContent] = useState(false)
  const [limitContent, setLimitContent] = useState(50e3)
  const [coefShuffleBlocks, setCoefShuffleBlocks] = useState(0)
  const [coefRemoveHeading, setCoefRemoveHeading] = useState(0.8)
  const [coefRemoveContent, setCoefRemoveContent] = useState(0.7)

  const [enableRewrite, setEnableRewrite] = useState(false)
  const [expand, setExpand] = useState(
    ExpandMode[0].value as RewriteMode.Longer | RewriteMode.Shorter
  )
  const [tone, setTone] = useState(
    ToneMode[0].value as RewriteMode.Formal | RewriteMode.Casual
  )
  const [power, setPower] = useState(0.5)

  const [isVisibleContent, setVisibleContent] = useState(true)
  const [isOpenHistory, setIsOpenHistory] = useState(false)
  const { user } = useContext(AuthContext)
  const token = user?.uid || ''
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  if (!isVisibleContent && !AppStore.extractorTasks?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="text-center">
            <h1 className="mt-4 text-5xl font-bold">
              {translate('ExtractorTitle')}
              <img src={smileSrc} className="inline px-4" />
            </h1>
          </div>

          <div className="w-full card p-4">
            <div className="mb-1 w-full p-2 ">
              <label className="">{translate('EnterTextForExtractor')}</label>
              <textarea
                className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3"
                rows={10}
                value={groups.map((x) => x.join('\n')).join('\n\n')}
                placeholder={`${translate('EnterTextForExtractorPlaceholder')}`}
                onChange={(e) => {
                  const groups = e.target.value
                    .split('\n\n')
                    .map((x) => x.split('\n'))

                  setGroups(groups)
                }}
              ></textarea>
            </div>
          </div>

          <div className="mb-1 w-full p-2 ">
            <div className="w-full">
              <div className="p-2 card bordered">
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="">{translate('Customize content')}</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={(e) =>
                        setEnableCustomizeContent(e.target.checked)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
            {enableCustomizeContent && (
              <div className="mb-2 w-full border-2 border-dashed p-4">
                <div className="mb-1 w-full p-2 ">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {translate('Limit chars count')}
                      </span>
                    </label>
                    <input
                      className="input input-bordered"
                      type="number"
                      value={limitContent}
                      onChange={(e) =>
                        setLimitContent(parseInt(e.target.value, 10))
                      }
                    />
                  </div>
                </div>
                <div className="w-full p-1">
                  <div className="form-control">
                    <label className="text-white-700">
                      {translate('Shuffle blocks')} (
                      {(coefShuffleBlocks * 100).toFixed(0)}%)
                    </label>
                    <input
                      type="range"
                      className="range"
                      max={100}
                      value={coefShuffleBlocks * 100}
                      onChange={(e) =>
                        setCoefShuffleBlocks(
                          Math.min(parseFloat(e.target.value) / 100, 1)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="w-full p-1">
                  <div className="form-control">
                    <label className="text-white-700">
                      {translate('Remove similar heading')} (
                      {(coefRemoveHeading * 100).toFixed(0)}%)
                    </label>
                    <input
                      type="range"
                      className="range"
                      max={100}
                      value={coefRemoveHeading * 100}
                      onChange={(e) =>
                        setCoefRemoveHeading(
                          Math.min(parseFloat(e.target.value) / 100, 1)
                        )
                      }
                    />
                  </div>
                </div>
                <div className="w-full p-1">
                  <div className="form-control">
                    <label className="text-white-700">
                      {translate('Remove similar content blocks')} (
                      {(coefRemoveContent * 100).toFixed(0)}%)
                    </label>
                    <input
                      type="range"
                      className="range"
                      max={100}
                      value={coefRemoveContent * 100}
                      onChange={(e) =>
                        setCoefRemoveContent(
                          Math.min(parseFloat(e.target.value) / 100, 1)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-1 w-full p-2 ">
            <div className="w-full">
              <div className="p-2 card bordered">
                <div className="form-control">
                  <label className="cursor-pointer label">
                    <span className="">{translate('Enable rewrite')}</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      onChange={(e) => setEnableRewrite(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>
            {enableRewrite && (
              <div className="mb-2 w-full border-2 border-dashed p-4">
                <div className="mb-2 w-full p-1">
                  <label className="text-white-700">
                    {translate('SelectExpand')}
                  </label>
                  <ExpandBox
                    value={expand}
                    onChange={(val: any) => {
                      setExpand(val.target.value)
                    }}
                    className="select w-full select-bordered select-primary "
                  />
                </div>
                <div className="w-full mb-2 p-1">
                  <div className="form-control">
                    <label className="text-white-700">
                      {translate('SelectRewritePower')} (
                      {(power * 100).toFixed(0)}%)
                    </label>
                    <input
                      type="range"
                      max={100}
                      min={0}
                      value={power * 100}
                      onChange={(e) =>
                        setPower(parseInt(e.target.value, 10) / 100)
                      }
                      className={'range'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-auto space-x-3 my-6 flex items-center">
            <button
              onClick={() => {
                const add = async () => {
                  if (!groups?.length) {
                    return alert(
                      translate('Required groups (urls or keywords)')
                    )
                  }

                  setVisibleContent(false)
                  const { result = [], error } = await ExtractorApi.add(
                    groups
                      .map((x) => x.filter((x) => x.trim()))
                      .filter((x) => x.some((x) => x.trim().length))
                      .map(
                        (urlsOrKeys) =>
                          ({
                            token,
                            status: TaskStatus.NotStarted,
                            urlsOrKeys,
                            contentOpts: {
                              limitContent,
                              coefShuffleBlocks,
                            },
                            similarOpts: {
                              coefRemoveHeading,
                              coefRemoveContent,
                            },
                            videosOpts: {},
                            typographOpts: {
                              removeSelectors: {},
                              removeAttrs: {
                                'a[href]': ['href', 'onload'],
                              },
                              replaceTags: {
                                a: 'span',
                              },
                            },
                            rewriteOpts: {
                              power,
                              expand,
                              tone,
                            },
                            translateOpts: {},
                          } as Doextractor)
                      )
                  )
                  setVisibleContent(true)

                  if (!result?.length && !error) {
                    return alert(translate('TryAgainLater'))
                  }

                  if (error) {
                    alert(JSON.stringify(error || {}))
                  }

                  if (result?.length) {
                    const items = result.map((r: Doextractor) => ({
                      createdAt: new Date().toJSON(),
                      ...r,
                    }))

                    AppStore.extractorTasks.push(...items)
                    setGroups([])
                    setIsOpenHistory(true)
                  }
                }

                add()
              }}
              className="w-full btn btn-lg btn-success"
            >
              {translate('ButtonSend')}
            </button>
          </div>

          <div
            className={`collapse w-full border rounded-box border-base-300 collapse-arrow ${
              isOpenHistory ? 'collapse-open' : ''
            }`}
          >
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              {translate('History')}
            </div>
            <div className="collapse-content overflow-auto h-80">
              {_.orderBy(AppStore.extractorTasks, 'createdAt', 'desc')
                .filter((task) => {
                  const { days } = DateTime.fromJSDate(new Date()).diff(
                    DateTime.fromJSDate(new Date(task.createdAt)),
                    'days'
                  )

                  return days <= 7
                })
                .slice(0, 100)
                .map((task: any, i: number) => (
                  <>
                    <div className="w-full card p-4 border-t-2">
                      <span className="py-2">
                        #{i + 1} <small>| {task.createdAt} </small>
                      </span>
                      <a
                        href={`/extractor/result/${task._id}`}
                        target={'_blank'}
                      >
                        {task._id}
                      </a>
                      <small className="w-full p-2">
                        {task.urlsOrKeys?.map((urlOrKey: string) => (
                          <div>{urlOrKey}</div>
                        ))}
                      </small>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
