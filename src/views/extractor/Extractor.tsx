/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DateTime } from 'luxon'
import { Doextractor, RewriteMode, SocketEvent, TaskStatus } from 'dprx-types'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { ExtractorApi, HOST_API } from 'helpers/api'
import { Link } from 'react-router-dom'
import { LoadingContainer } from 'components/Containers/Loader'
import { PageH1, QueueContainer } from 'components/Containers/PageContainers'
import { ToneMode } from 'components/Select/Tone'
import { io } from 'socket.io-client'
import { useContext, useEffect, useState } from 'preact/hooks'
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
  const [queue, setQueue] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, {
          roomId: `EXTR-${token}`,
        })
        socket.emit(SocketEvent.SendQueue, { })
      })

      socket.on(SocketEvent.SendQueue, (queue: any) => {
        setQueue(queue)
      })
    })
  }, [token])

  if (!isVisibleContent && !AppStore.extractorTasks?.length) {
    return <LoadingContainer />
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <PageH1 title={translate('ExtractorTitle')} />

          <div className="w-full card p-4">
            <QueueContainer {...queue} />
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
                      {translate('Remove similar heading', {
                        percent: (coefRemoveHeading * 100).toFixed(0),
                      })}
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
                      {translate('Remove similar content blocks', {
                        percent: (coefRemoveContent * 100).toFixed(0),
                      })}
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

          <div className="mb-1 w-full p-2 hidden">
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
                            duplicateOpts: {
                              coefRemoveHeading,
                              coefRemoveContent,
                            },
                            videosOpts: {},
                            typographOpts: {
                              removeSelectors: [],
                              removeAttrs: {
                                'a[href]': ['href', 'onload'],
                              },
                              replaceTags: {
                                a: 'span',
                              },
                            },
                            rewriteOpts: {
                              selectors: enableRewrite ? ['p'] : [],
                              power,
                              expand,
                              tone,
                            },
                            translateOpts: {
                              // selectors: ['p'],
                              // lang: LangCode.English,
                            },
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
                      <Link
                        to={`/extractor/result/${task._id}`}
                        // target={'_blank'}
                      >
                        {task._id}
                      </Link>
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
