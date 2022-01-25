/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { SocketEvent } from 'dprx-types'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'preact/hooks'

export const OdmStatsPage: FC = () => {
  const [data, setData] = useState({} as any)
  const [proxies, setProxies] = useState({} as any)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on(SocketEvent.Connect, () => {
        socket.emit(SocketEvent.Join, { roomId: SocketEvent.OdmStats })
      })

      socket.on(SocketEvent.OdmStats, ({ socketsData, used }: any) => {
        setData(socketsData)
        setProxies(used)
        console.log(socketsData, used)
      })
    })
  }, [])

  return (
    <>
      <div className=" w-full card p-5">
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label>Sockets data</label>
          <pre className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        <div className="mb-1 md:mb-0 w-full p-2 ">
          <label>Proxies</label>
          <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
            {JSON.stringify(proxies, null, 2)}
          </div>
        </div>
      </div>
    </>
  )
}
