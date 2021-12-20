/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useContext } from 'react'
import { useEffect } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'

export default () => {
  const { translate } = useLocalize()
  const { user } = useContext(AuthContext)

  let socket: any

  useEffect(() => {
    // fetch('http://localhost:2989').finally(() => {
    socket = io('http://localhost:2989', {})

    // socket.onAny((event: any, args: any) => {
    //   console.log(`got ${event}`)
    // })

    socket.on('connect', () => {
      // socket.emit('hello', { from: 'airwr' })
    })

    socket.on('hello', (data: any) => {
      console.log('hello', data)
    })

    socket.on('a user connected', () => {
      console.log('a user connected')
    })

    socket.on('disconnect', () => {
      console.log('disconnect')
    })
    // })
  }, []) // Added [] as useEffect filter so it will be executed only once, when component is mounted

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero  bg-base-200">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('AboutTitle')}
                  </h1>

                  <button
                    className="btn btn-success"
                    onClick={() => {
                      socket.emit('hello', { from: 'airwr' })
                    }}
                  >
                    asd
                  </button>

                  {user && (
                    <p>
                      <Link to="/profile" className="btn">
                        {user?.displayName} | {user?.email}
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
