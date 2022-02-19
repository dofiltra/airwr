/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { AppState, ProxyItem, SocketEvent } from 'dprx-types'
import { FC } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { Socket, io } from 'socket.io-client'
import { useEffect, useState } from 'preact/hooks'
import _ from 'lodash'

export const OdmStatsPage: FC = () => {
  const [servers, setServers] = useState([] as any[])
  const [proxies, setProxies] = useState([] as any[])
  const [socket, setSocket] = useState(undefined as Socket | undefined)
  const [queue, setQueue] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const sock = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      sock.on(SocketEvent.Connect, () => {
        sock!.emit(SocketEvent.Join, { roomId: SocketEvent.OdmStats })
        sock!.emit(SocketEvent.SendQueue, {  })
      })

      sock.on(SocketEvent.SendQueue, (queue: any) => {
        setQueue(queue)
      })

      sock.on(SocketEvent.OdmStats, ({ socketsData, used }: any) => {
        setServers(
          _.uniqBy(
            _.orderBy(
              socketsData,
              ['roomId', 'freeThreadsCount'],
              ['asc', 'asc']
            ),
            'roomId'
          )
        )
        setProxies(_.uniq(used))
        // console.log(socketsData, used)
      })

      setSocket(sock)
    })
  }, [])

  const aibacks=servers
              ?.filter((socketData: any) =>
                socketData?.roomId?.toLowerCase().startsWith('aiback')
              )

  return (
    <>
      <div className=" w-full card p-5">
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <h2>TOTAL INFO</h2>

          <div className="w-full shadow stats mt-4 py-2" onClick={()=>{
            console.log('SendQueue');            
            socket?.emit(SocketEvent.SendQueue, {})
          }}>
            <div className="stat">
              <div className="stat-title">QUEUE</div>
              <div className="stat-value">{queue?.count}</div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>

            <div className="stat">
              <div className="stat-title">REWRITE</div>
              <div className="stat-value">{queue?.rewrite}</div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>

            <div className="stat">
              <div className="stat-title">TRANSLATE</div>
              <div className="stat-value">{queue?.translate}</div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>

            <div className="stat">
              <div className="stat-title">EXTRACTOR</div>
              <div className="stat-value">{queue?.extractor}</div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>
          </div>

          <div className="w-full shadow stats mt-4 py-2">
            <div className="stat">
              <div className="stat-title">THREADS</div>
              <div className="stat-value">
                {_.sum(
                  servers?.map((server) => server?.threads?.threadsCount || 0)
                )}
              </div>
              <div className={`stat-desc ${'text-success'}`}>
                Aibacks: {aibacks.length}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">PROXIES</div>
              <div className="stat-value">{proxies?.length || 0}</div>
              <div
                className={`stat-desc ${
                  proxies?.length > 0 ? 'text-success' : 'text-error'
                }`}
              ></div>
            </div>
            <div className="stat">
              <div className="stat-title">REWRITE</div>
              <div className="stat-value">
                {_.sum(servers?.map((server) => server?.wtn?.count || 0))}
              </div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>
            <div className="stat">
              <div className="stat-title">TRANSLATE</div>
              <div className="stat-value">
                {_.sum(servers?.map((server) => server?.dotransa?.count || 0))}
              </div>
              <div className={`stat-desc ${'text-success'}`}></div>
            </div>
          </div>

          <hr />
        </div>

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            {aibacks
              .map((socketData: any, index: number) => {
                const {
                  roomId: roomIds,
                  socketId,
                  idle = true,
                  app = {},
                  threads = {},
                  osInfo = {},
                  wtn = {},
                  dotransa = {},
                  rewriter = {},
                  translator = {},
                  extractor = {},
                } = socketData

                const { state: appState = AppState.Active, version = 0 } = {
                  ...app,
                }
                const {
                  os = {},
                  cpu = {},
                  mem = {},
                  drive = {},
                } = { ...osInfo }
                const { threadsCount = 0, freeThreadsCount = 0 } = {
                  ...threads,
                }
                const [roomId] = roomIds.split(';')

                return (
                  <>
                    <div className="p-4 mb-4">
                      <b
                        className={`p-4 w-full ${
                          idle ? 'text-success' : 'text-error'
                        }`}
                        onClick={() => {
                            const emitted = !!socket?.emit(
                              SocketEvent.AibackRefresh,
                              {
                                socketId,
                              }
                            )
                            alert(`Refresh '${roomId}': ${emitted}`)
                          }}
                      >
                        #{index + 1} {roomId} [v{version}]
                      </b>
                      <div className="w-full shadow stats mt-4 py-2">
                        <div className="stat">
                          <div className="stat-title">CPU</div>
                          <div className="stat-value">
                            {cpu?.usage?.toFixed(2)}%
                          </div>
                          <div
                            className={`stat-desc ${
                              cpu?.free > 10 ? 'text-success' : 'text-error'
                            }`}
                          >
                            Free: {cpu?.free?.toFixed(2)}% <br />
                            Core: {cpu?.count}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">RAM</div>
                          <div className="stat-value">
                            {mem?.usedMemPercentage?.toFixed(2)}%
                          </div>
                          <div
                            className={`stat-desc ${
                              mem?.freeMemPercentage > 10
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            Free: {mem?.freeMemPercentage?.toFixed(2)}%
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">DRIVE</div>
                          <div className="stat-value">
                            {drive?.usedPercentage}%
                          </div>
                          <div
                            className={`stat-desc ${
                              drive?.freePercentage > 10
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            Free: {drive?.freePercentage}%
                          </div>
                        </div>
                      </div>

                      <div className="w-full shadow stats mt-4 py-2">
                        <div className="stat">
                          <div className="stat-title">THREADS</div>
                          <div className="stat-value">{threadsCount}</div>
                          <div
                            className={`stat-desc ${
                              freeThreadsCount > 0
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            Free: {freeThreadsCount}
                          </div>
                        </div>
                        <div
                          className="stat"
                          onClick={() => {
                            console.log(
                              roomId,
                              wtn?.proxies
                                ?.map(
                                  (p: ProxyItem) =>
                                    `\n${p?.ip}:${p?.port} | [${p?.useCount}]`
                                )
                                .join('; ')
                            )
                          }}
                        >
                          <div className="stat-title">REWRITE</div>
                          <div className="stat-value">{wtn?.count}</div>
                          <div
                            className={`stat-desc ${
                              wtn?.count > 0 ? 'text-success' : 'text-error'
                            }`}
                          >
                            Containers: {rewriter?.containerBlocks}
                          </div>
                        </div>
                        <div
                          className="stat"
                          onClick={() => {
                            console.log(
                              roomId,
                              dotransa?.proxies
                                ?.map(
                                  (p: ProxyItem) =>
                                    `\n${p?.ip}:${p?.port} | [${p?.useCount}]`
                                )
                                .join('; ')
                            )
                          }}
                        >
                          <div className="stat-title">TRANSLATE</div>
                          <div className="stat-value">{dotransa?.count}</div>
                          <div
                            className={`stat-desc ${
                              dotransa?.count > 0
                                ? 'text-success'
                                : 'text-error'
                            }`}
                          >
                            Containers: {translator?.containerBlocks}
                          </div>
                        </div>
                      </div>

                      <div className="btn-group m-2 w-full justify-center ">
                        <button
                          className={'btn btn-warning'}
                          onClick={() => {
                            if (!confirm(`Restart '${roomId}'?`)) {
                              return
                            }

                            const emitted = !!socket?.emit(
                              SocketEvent.AibackRestartApp,
                              {
                                socketId,
                                roomId,
                              }
                            )
                            alert(`Restarting '${roomId}': ${emitted}`)
                          }}
                        >
                          Restart app
                        </button>

                        <button
                          className={'btn btn-warning'}
                          onClick={() => {
                            if (!confirm(`Reload proxies '${roomId}'?`)) {
                              return
                            }

                            const emitted = !!socket?.emit(
                              SocketEvent.AibackReloadProxies,
                              {
                                socketId,
                                roomId,
                              }
                            )
                            alert(`Reloading '${roomId}': ${emitted}`)
                          }}
                        >
                          Rotate Proxies
                        </button>
                      </div>

                      <div className="btn-group m-2 w-full justify-center ">
                        {Object.keys(AppState).map((stateKey) => {
                          return (
                            <>
                              <button
                                className={`btn ${
                                  appState.toLowerCase() ===
                                  stateKey.toLowerCase()
                                    ? 'btn-active btn-wide'
                                    : ''
                                }`}
                                onClick={() => {
                                  if (
                                    !confirm(`'${stateKey}' for '${roomId}'?`)
                                  ) {
                                    return
                                  }

                                  const emitted = !!socket?.emit(
                                    SocketEvent.AibackState,
                                    {
                                      socketId,
                                      state: stateKey,
                                    }
                                  )
                                  alert(
                                    `'${stateKey}' for '${roomId}' emitted: ${emitted}`
                                  )
                                }}
                              >
                                {stateKey}
                              </button>
                            </>
                          )
                        })}
                      </div>
                      <hr />
                    </div>
                  </>
                )
              })}
          </div>
        </div>

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label>Servers data</label>
          <pre className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 overflow-auto">
            {JSON.stringify(
              servers?.map((socketData: any) => ({
                ...socketData,
                wtn: {
                  ...socketData?.wtn,
                  proxies: socketData?.wtn?.proxies
                    ?.map(
                      (p: ProxyItem) => `${p?.ip}:${p?.port} | [${p?.useCount}]`
                    )
                    .join('; '),
                },
                dotransa: {
                  ...socketData?.dotransa,
                  proxies: socketData?.dotransa?.proxies
                    ?.map(
                      (p: ProxyItem) => `${p?.ip}:${p?.port} | [${p?.useCount}]`
                    )
                    .join('; '),
                },
                proxies: socketData?.proxies?.length,
              })),
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </>
  )
}
