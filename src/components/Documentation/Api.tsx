/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'preact/compat'
import { HOST_API, headers } from 'helpers/api'
import { LangCodes } from 'components/Select/Lang'
import { SignInButtons } from 'components/Buttons/SignIn'
import { useContext } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'

export const DocumentationApi: FC = () => {
  const { translate } = useLocalize()
  const { user } = useContext(AuthContext)
  const token = user?.uid || '{your_token}'

  return (
    <div className="">
      <div className="overflow-x-auto">
        <p className="py-3">
          <b>{translate('Your token')}</b>: {user?.uid || <SignInButtons />}
        </p>
        {/* <hr className="border-b-2" /> */}
        <table className="table w-full text-center ">
          <thead className="">
            <tr className="border-2">
              <th>{translate('ApiName')}</th>
              <th>{translate('ApiRequest')}</th>
              <th>{translate('ApiResponse')}</th>
            </tr>
            {/* <tr>
              <th></th>
              <th></th>
              <th></th>
            </tr> */}
          </thead>
          <tbody>
            <tr className="border-b-2">
              <th>
                Add
                <br /> Rewrite
              </th>
              <td>
                <ModalBtn
                  title={'Request'}
                  content={
                    <textarea className="w-full h-96 text-sm">
                      {add.request({ token })}
                    </textarea>
                  }
                />
                <ModalBtn
                  title={'Types'}
                  content={
                    <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                      <p className="pb-2">
                        <b>Token*</b>
                        : string
                        <br />
                        <small>{token}</small>
                      </p>
                      <p className="pb-2">
                        <b>TargetLang*</b>
                        : enum (string)
                        <br />
                        <small>{LangCodes.map((l) => l.code).join(', ')}</small>
                      </p>
                      <p className="pb-3">
                        <b>Blocks*</b>
                        : array of objects
                        <br />
                        <small>
                          {JSON.stringify(
                            [
                              {
                                type: 'header|paragraph|list|table|image',
                                data: {
                                  text: 'see request example',
                                },
                              },
                            ],
                            null,
                            2
                          )}
                        </small>
                      </p>
                      <p className="pb-2">
                        <b>Dataset</b>: enum (number)
                        <br />
                        <small>
                          Auto = 0, News = 1
                          {/*, Crypto = 2, Finance = 3, Medicine
                          = 4 */}
                        </small>
                      </p>
                      <p className="pb-2">
                        <b>Power</b>
                        : enum (number)
                        <br />
                        <small> Auto = 0, Light = 1</small>
                      </p>
                    </div>
                  }
                />
              </td>
              <td>
                <ModalBtn
                  title={'Response'}
                  content={
                    <p className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                      {add.response}
                    </p>
                  }
                />
                <ModalBtn
                  title={'Types'}
                  content={
                    <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                      <p className="pb-2">
                        <b>Result</b>: object
                        <br />
                        <small>"_id" - id of result item</small>
                      </p>
                      <p className="pb-2">
                        <b>Error</b>
                        : Object|null
                        <br />
                        <small>error info</small>
                      </p>
                    </div>
                  }
                />
              </td>
            </tr>

            <tr className="border-b-2">
              <th>
                Get <br />
                Rewrite
              </th>
              <td>
                <ModalBtn
                  title={'Request'}
                  content={
                    <textarea className="w-full h-96 text-sm">
                      {get.request({ token })}
                    </textarea>
                  }
                />
                <ModalBtn
                  title={'Types'}
                  content={
                    <div className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                      <p className="pb-2">
                        <p className="pb-2">
                          <b>Id*</b>
                          : string
                          <br />
                          <small>"{_id}"</small>
                        </p>
                        <b>Token*</b>
                        : string
                        <br />
                        <small>{token}</small>
                      </p>
                    </div>
                  }
                />
              </td>
              <td>
                <ModalBtn
                  title={'Response'}
                  content={
                    <p className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                      {get.response({ token })}
                    </p>
                  }
                />
                <ModalBtn
                  title={'Types'}
                  content={
                    <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                      <p className="pb-4">
                        <b>item</b>: Object
                        <br />
                        <small>"_id" - result id</small>
                        <br />
                        <small>
                          "status" - NotStarted = 0, InProgress = 3, Completed =
                          9
                        </small>
                        <br />
                        <small>"blocks" - array of objects</small>
                        <br />
                        <small className="p-4">
                          "type" - "original <b>type</b> from request"
                        </small>
                        <br />
                        <small className="p-4">
                          "data" - {'{'} ...original <b>data</b> from request
                          {' }'}
                        </small>
                        <br />
                        <small className="p-4">
                          "rewriteDataSuggestions" - [<b>array</b> with rewrite
                          data suggestions]
                        </small>
                      </p>
                      <p className="pb-2">
                        <b>error</b>
                        : Object|null
                        <br />
                        {/* <small>error info</small> */}
                      </p>
                    </div>
                  }
                />
              </td>
            </tr>

            <tr className="border-b-2">
              <th>
                Get <br />
                Balance
              </th>
              <td>
                <ModalBtn
                  title={'Request'}
                  content={
                    <textarea className="w-full h-96 text-sm">
                      {balance.request({ token })}
                    </textarea>
                  }
                />
              </td>
              <td>
                <ModalBtn
                  title={'Response'}
                  content={
                    <p className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                      {balance.response()}
                    </p>
                  }
                />
              </td>
            </tr>

            <tr className="border-b-2">
              <th>
                Get <br />
                Stats
              </th>
              <td>
                <ModalBtn
                  title={'Request'}
                  content={
                    <textarea className="w-full h-96 text-sm">
                      {stats.request({ token })}
                    </textarea>
                  }
                />
              </td>
              <td>
                <ModalBtn
                  title={'Response'}
                  content={
                    <p className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                      {stats.response()}
                    </p>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ModalBtn = ({
  id = Math.random(),
  title = '',
  cls = '',
  content,
}: any) => {
  return (
    <div className={`p-2 ${cls}`}>
      <label htmlFor={id} className="btn btn-primary btn-sm modal-button">
        {title}
      </label>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal w-full">
        <div className="modal-box overflow-auto whitespace-pre-wrap ">
          {content}
          <div className="modal-action">
            <label htmlFor={id} className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const _id = '619e2b6d18f0e61f6701c016'
const textOriginal =
  'Свою долю в импорте в Казахстан значительно увеличила Россия. Если в прошлом году РФ занимала долю 40% от общего объема импорта мебели в РК, то в этом году эта цифра выросла до 45%. В январе-сентябре 2021 года соседняя страна заработала $118,7 млн на продаже мебели Казахстану (+55% в сравнении с аналогичным периодом). Другие крупные экспортеры мебельной продукции также преумножили свои поставки: Турция (+23%), Китай (+32%).'

const textRewrite =
  'Среди стран-импортеров из Казахстана значительная доля приходится на Россию. По сравнению с предыдущим годом, в этом году на долю России пришлось 45% от общего объема импорта мебели в Казахстан. Рост продаж мебели в Казахстан на 20% +55% по сравнению с аналогичным периодом прошлого года принес соседней стране $118,7 млн в январе-сентябре 2021 года. Турция (+23%) и Китай (+32%) также были в числе ведущих экспортеров мебели.'

const add = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${HOST_API}/api/rewriteText/add", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: "POST",
    mode: "cors",
    body: JSON.stringify(${JSON.stringify(
      {
        token,
        targetLang: LangCodes[0].code,
        dataset: 0,
        power: 0,
        blocks: [
          {
            type: 'header',
            data: {
              text: 'Dofiltra H2',
              level: 2,
            },
          },
          {
            type: 'paragraph',
            data: {
              text: 'Hello, dear friend!',
            },
          },
          {
            type: 'header',
            data: {
              text: 'Subtitle H3',
              level: 3,
            },
          },
          {
            type: 'list',
            data: {
              style: 'unordered',
              items: ['item 1', 'item 2', 'item 3'],
            },
          },
          {
            type: 'image',
            data: {
              file: {
                url: 'https://codex.so/public/app/img/external/codex2x.png',
              },
              caption: '',
            },
          },
        ],
      },
      null,
      8
    )}),
  })
  
  const { result, error } = await resp.json()
  `,

  response: JSON.stringify(
    {
      result: {
        _id,
      },
      error: null,
    },
    null,
    2
  ),
}

const get = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${HOST_API}/api/rewriteText/get?id=${_id}&token=${token}", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: 'GET',
    mode: "cors",
  })

  const { item, error } = await resp.json()
  `,

  response: ({ token }: any) =>
    JSON.stringify(
      {
        item: {
          _id,
          token,
          targetLang: 1,
          blocks: [
            {
              type: 'paragraph',
              data: {
                text: textOriginal,
              },
              rewriteDataSuggestions: [
                {
                  text: textRewrite,
                },
              ],
            },
          ],
          status: 9,
          dataset: 0,
          power: 0,
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
        },
      },
      null,
      2
    ),
}

const balance = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${HOST_API}/api/balance/get?token=${token}", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: 'GET',
    mode: "cors",
  })

  const { coins = 0 } = await resp.json()
  `,

  response: () =>
    JSON.stringify(
      {
        coins: 100,
      },
      null,
      2
    ),
}

const stats = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${HOST_API}/api/stats/getRewritedCharsCount?token=${token}", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: 'GET',
    mode: "cors",
  })

  const { history = {} } = await resp.json()
  `,

  response: () =>
    JSON.stringify(
      {
        history: {
          ['9.2022']: 1000,
          ['10.2022']: 800,
          ['11.2022']: 2000,
          ['12.2021']: 5000,
        },
      },
      null,
      2
    ),
}

// const AdditionalInfo = ({ text = '', body = '', position = 'center' }: any) => {
//   return (
//     <>
//       {text}{' '}
//       <div className={`dropdown dropdown-${position}`}>
//         <div tabIndex={0} className="btn btn-circle btn-ghost btn-xs text-info">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             className="inline w-5 h-5 stroke-current"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//         </div>
//         <div
//           tabIndex={0}
//           className="shadow card compact dropdown-content bg-base-100 rounded-box w-64"
//         >
//           <div className="card-body">
//             <p>{body}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
