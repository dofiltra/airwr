/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { ProxyItem, SocketEvent } from 'dprx-types'
import { Socket, io } from 'socket.io-client'
import { useEffect, useState } from 'preact/hooks'
import _ from 'lodash'

export const OdmStatsPage: FC = () => {
  const [socketsData, setSocketsData] = useState([] as any[])
  const [proxies, setProxies] = useState([] as any[])
  const [socket, setSocket] = useState(undefined as Socket | undefined)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const sock = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      sock.on(SocketEvent.Connect, () => {
        sock!.emit(SocketEvent.Join, { roomId: SocketEvent.OdmStats })
      })

      sock.on(SocketEvent.OdmStats, ({ socketsData, used }: any) => {
        setSocketsData(
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

  return (
    <>
      <div className=" w-full card p-5">
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label>Sockets data</label>
          <pre className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 overflow-auto">
            {JSON.stringify(
              socketsData?.map((socketData: any) => ({
                ...socketData,
                wtnProxies: socketData?.wtnProxies
                  ?.map(
                    (p: ProxyItem) => `${p?.ip}:${p?.port} | [${p?.useCount}]`
                  )
                  .join('; '),
                dotransaProxies: socketData?.dotransaProxies
                  ?.map(
                    (p: ProxyItem) => `${p?.ip}:${p?.port} | [${p?.useCount}]`
                  )
                  .join('; '),
                proxies: socketData?.proxies?.length,
              })),
              null,
              2
            )}
          </pre>
        </div>

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            {socketsData
              ?.filter((socketData: any) =>
                socketData?.roomId?.toLowerCase().startsWith('aiback')
              )
              .map((socketData: any) => {
                const { roomId: roomIds, socketId } = socketData
                const [roomId] = roomIds.split(';')

                return (
                  <>
                    <div className="p-4 mb-4">
                      <b>{roomId}</b>
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
                        Restart
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
                        Reload Proxies
                      </button>
                      <hr />
                    </div>
                  </>
                )
              })}
          </div>
        </div>

        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label>Proxies ({proxies?.length || 0})</label>
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            {JSON.stringify(proxies, null, 2)}
          </div>
        </div>
      </div>
    </>
  )
}
