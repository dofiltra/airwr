/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Doextractor, TaskStatus } from 'dprx-types'
import { FC, useEffect, useState } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { Loading } from 'components/Containers/Loader'
import { getRewriterStatusText } from 'helpers/rewriter'
import { io } from 'socket.io-client'
import { useLocalize } from '@borodutch-labs/localize-react'
import { useParams } from 'react-router-dom'
import useTranslateQueue from 'hooks/useTranslateQueue'

type TResultPage = {
  //
}

function getBackgroundColorByStatus(status: number) {
  switch (status) {
    case TaskStatus.InProgress:
      return 'alert-info'
    case TaskStatus.Completed:
      return 'alert-success'
  }

  return ''
}

const ResultPage: FC<TResultPage> = () => {
  const { id = '' } = useParams()
  const { translate } = useLocalize()
  const { queueCount = 0, queueChars = 0 } = useTranslateQueue()
  const [data, setData] = useState({} as Doextractor)

  useEffect(() => {
    fetch(`${HOST_API}/api/socketio/exec`).finally(() => {
      const socket = io(HOST_API!.toString(), {
        autoConnect: true,
        reconnection: true,
      })

      socket.on('connect', () => {
        socket.emit('join', { roomId: `extractor_${id}` })
      })

      socket.on('update', (data: any) => {
        data && setData(data)
      })
    })
  }, [id])

  if (!Object.keys(data?.results || {})?.length) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('Loading')}</div>
        <Loading />
      </div>
    )
  }

  const isCompleted = data.status === TaskStatus.Completed

  return (
    <>
      <div className="min-h-full w-full card">
        <main>
          <div className="max-w-7xl">
            <div className="px-4 sm:px-0">
              <div className="mt-4 md:mb-0 w-full text-center">
                <div>
                  {translate('Queue', { count: queueCount })}
                  {queueCount > 100 &&
                    translate('QueueCharsCount', { chars: queueChars })}
                </div>
              </div>

              <div className="mb-1 md:mb-0 w-full p-1">
                <div
                  className={'alert ' + getBackgroundColorByStatus(data.status)}
                >
                  <div className="flex-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="w-6 h-6 mx-2 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                    <label className="w-full">
                      {translate('TaskStatus')}:{' '}
                      {translate(
                        getRewriterStatusText(data.status)
                      ).toLowerCase()}{' '}
                      {!isCompleted && (
                        <button className="btn btn-ghost btn-sm btn-circle Loading"></button>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <div className="mb-1 md:mb-0 w-full p-2 ">
                  <label>{translate('Original text')}</label>
                  <div className="editor-wrapper h-96 overflow-auto w-full border-4 border-dashed border-gray-200 rounded-lg p-3">
                    <div id="orig"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default ResultPage