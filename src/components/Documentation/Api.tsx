/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'preact/compat'
import { HOST_API } from 'helpers/api'
import { LangCode, RewriteMode, TaskStatus, headers } from 'dprx-types'
import { LangCodes } from 'components/Select/Lang'
import { SignInButtons } from '@dofiltra/tailwind'
import { useContext } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'

const hostApi = `${HOST_API}`.replace('-stage', '')

export const DocumentationApi: FC = () => {
  const { translate } = useLocalize()
  const { user } = useContext(AuthContext)
  const token = user?.uid || '{your_token}'

  return (
    <div className="">
      <div className="grid grid-cols-1 gap-1">
        <div className="mb-1 w-full p-2 m-2">
          <p className="py-3">
            <b>{translate('Your token')}</b>:{' '}
            {user?.uid || <SignInButtons signInText={translate('sign in')} />}
          </p>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Base API
              <sup> [01.11.2021]</sup>
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                {/* <hr className="border-b-2" /> */}
                <table className="table w-full text-center ">
                  <thead className="">
                    <tr className="border-2">
                      <th>{translate('ApiName')}</th>
                      <th>{translate('ApiRequest')}</th>
                      <th>{translate('ApiResponse')}</th>
                    </tr>
                  </thead>
                  <tbody>
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
          </div>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Rewrite
              <sup> [10.11.2021]</sup>
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                {/* <hr className="border-b-2" /> */}
                <table className="table w-full text-center ">
                  <thead className="">
                    <tr className="border-2">
                      <th>{translate('ApiName')}</th>
                      <th>{translate('ApiRequest')}</th>
                      <th>{translate('ApiResponse')}</th>
                    </tr>
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
                              {addRewrite.request({ token })}
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
                                : string
                                <br />
                                <small>
                                  {LangCodes.map((l) => l.code).join(', ')}
                                </small>
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
                                <b>Dataset</b>: number
                                <br />
                                <small>
                                  Auto = 0, News = 1
                                  {/*, Crypto = 2, Finance = 3, Medicine
                          = 4 */}
                                </small>
                              </p>
                              <p className="pb-2">
                                <b>Power</b>
                                : number (double)
                                <br />
                                <small> 0.00...0.50...1.00</small>
                              </p>

                              <p className="pb-2">
                                <b>Expand</b>: string
                                <br />
                                <small>
                                  {RewriteMode.Longer}, {RewriteMode.Shorter}
                                </small>
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
                              {addRewrite.response}
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
                              {getRewrite.request({ token })}
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
                              {getRewrite.response({ token })}
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
                                  "status" - NotStarted = 0, InProgress = 3,
                                  Completed = 9
                                </small>
                                <br />
                                <small>"blocks" - array of objects</small>
                                <br />
                                <small className="p-4">
                                  "type" - "original <b>type</b> from request"
                                </small>
                                <br />
                                <small className="p-4">
                                  "data" - {'{'} ...original <b>data</b> from
                                  request
                                  {' }'}
                                </small>
                                <br />
                                <small className="p-4">
                                  "rewriteDataSuggestions" - [<b>array</b> with
                                  rewrite data suggestions]
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
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Translate
              <sup> [01.12.2022]</sup>
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                {/* <hr className="border-b-2" /> */}
                <table className="table w-full text-center ">
                  <thead className="">
                    <tr className="border-2">
                      <th>{translate('ApiName')}</th>
                      <th>{translate('ApiRequest')}</th>
                      <th>{translate('ApiResponse')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2">
                      <th>
                        Add
                        <br /> Translate
                      </th>
                      <td>
                        <ModalBtn
                          title={'Request'}
                          content={
                            <textarea className="w-full h-96 text-sm">
                              {addTranslate.request({ token })}
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
                                <b>Langs*</b>
                                : Array of string
                                <br />
                                <small>
                                  [
                                  {LangCodes.map((l) => `"${l.code}"`).join(
                                    ', '
                                  )}
                                  ]
                                </small>
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
                            </div>
                          }
                        />
                      </td>
                      <td>
                        <ModalBtn
                          title={'Response'}
                          content={
                            <p className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                              {addTranslate.response({ token })}
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
                        Translate
                      </th>
                      <td>
                        <ModalBtn
                          title={'Request'}
                          content={
                            <textarea className="w-full h-96 text-sm">
                              {getTranslate.request({ token })}
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
                                  <small>{_id}</small>
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
                              {getTranslate.response({ token })}
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
                                  "status" - NotStarted = 0, InProgress = 3,
                                  Completed = 9
                                </small>
                                <br />
                                <small>"blocks" - array of objects</small>
                                <br />
                                <small className="p-4">
                                  "type" - "original <b>type</b> from request"
                                </small>
                                <br />
                                <small className="p-4">
                                  "data" - {'{'} ...original <b>data</b> from
                                  request
                                  {' }'}
                                </small>
                                <br />
                                <small className="p-4">
                                  "results" - {'{ '}
                                  <b>Dictionary</b> 'lang'{' -> '}Object
                                  {' }'}
                                </small>
                              </p>
                              <p className="pb-2">
                                <b>error</b>
                                : Object|null
                                <br />
                              </p>
                            </div>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-1 w-full p-2 ">
          <div className="collapse w-full border rounded-box border-base-300 collapse-arrow">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium">
              Extract
              <sup> [01.02.2022]</sup>
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                {/* <hr className="border-b-2" /> */}
                <table className="table w-full text-center ">
                  <thead className="">
                    <tr className="border-2">
                      <th>{translate('ApiName')}</th>
                      <th>{translate('ApiRequest')}</th>
                      <th>{translate('ApiResponse')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b-2">
                      <th>
                        Add
                        <br /> Extracts <br />
                        (groups)
                      </th>
                      <td>
                        <ModalBtn
                          title={'Request'}
                          content={
                            <textarea className="w-full h-96 text-sm">
                              {addExtract.request({ token })}
                            </textarea>
                          }
                        />
                        <ModalBtn
                          title={'Types'}
                          content={
                            <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                              <p className="pb-2">
                                <b>token*</b>
                                : string
                                <br />
                                <small>{token}</small>
                              </p>
                              <p className="pb-2">
                                <b>urlsOrKeys*</b>
                                : Array of string
                                <br />
                                <small>Urls or Keywords</small>
                              </p>
                              <p className="pb-3">
                                <b>contentOpts</b>
                                : object
                                <br />
                                <small>Content settings</small>
                              </p>

                              <p className="pb-3">
                                <b>duplicateOpts</b>
                                : object
                                <br />
                                <small>Duplicate clean coefs</small>
                              </p>

                              <p className="pb-3">
                                <b>videosOpts</b>
                                : object
                                <br />
                                <small>Youtube videos on page</small>
                              </p>
                              <p className="pb-3">
                                <b>typographOpts</b>
                                : object
                                <br />
                                <small>Cleaning settings</small>
                              </p>
                              <p className="pb-3">
                                <b>rewriteOpts</b>
                                : object
                                <br />
                                <small>Rewrite settings</small>
                              </p>
                              <p className="pb-3">
                                <b>translateOpts</b>
                                : object
                                <br />
                                <small>Translate settings</small>
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
                              {addExtract.response({ token })}
                            </p>
                          }
                        />
                        <ModalBtn
                          title={'Types'}
                          content={
                            <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                              <p className="pb-2">
                                <b>Result</b>: array of objects
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
                        Extract
                      </th>
                      <td>
                        <ModalBtn
                          title={'Request'}
                          content={
                            <textarea className="w-full h-96 text-sm">
                              {getExtract.request({ token })}
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
                                  <small>{_id}</small>
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
                              {getExtract.response({ token })}
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
                                  "status" - NotStarted = 0, InProgress = 3,
                                  Completed = 9
                                </small>
                                <br />
                                <small>"blocks" - array of objects</small>
                                <br />
                                <small className="p-4">
                                  "type" - "original <b>type</b> from request"
                                </small>
                                <br />
                                <small className="p-4">
                                  "data" - {'{'} ...original <b>data</b> from
                                  request
                                  {' }'}
                                </small>
                                <br />
                                <small className="p-4">
                                  "results" - {'{ '}
                                  <b>Dictionary</b> 'lang'{' -> '}Object
                                  {' }'}
                                </small>
                              </p>
                              <p className="pb-2">
                                <b>error</b>
                                : Object|null
                                <br />
                              </p>
                            </div>
                          }
                        />
                      </td>
                    </tr>

                    <tr className="border-b-2">
                      <th>
                        Get Statuses <br />
                        Extract
                      </th>
                      <td>
                        <ModalBtn
                          title={'Request'}
                          content={
                            <textarea className="w-full h-96 text-sm">
                              {getStatusesExtract.request({ token })}
                            </textarea>
                          }
                        />
                        <ModalBtn
                          title={'Types'}
                          content={
                            <div className="h-96 whitespace-pre-wrap text-sm overflow-auto text-left">
                              <p className="pb-2">
                                <p className="pb-2">
                                  <b>Ids*</b>: Array of string
                                </p>
                                <b>Token*</b>: string
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
                              {getStatusesExtract.response({ token })}
                            </p>
                          }
                        />
                        <ModalBtn
                          title={'Types'}
                          content={
                            <div className="h-96 whitespace-pre-wrap overflow-auto text-left">
                              <p className="pb-4">
                                <b>result</b>: Object
                                <br />
                                <small>"_id" - result id (string)</small>
                                <br />
                                <small>
                                  "status" - NotStarted = 0, InProgress = 3,
                                  Completed = 9
                                </small>
                                <br />
                              </p>
                              <p className="pb-2">
                                <b>error</b>
                                : Object|null
                                <br />
                              </p>
                            </div>
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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

const balance = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/balance/get?token=${token}", {
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
  }: any) => `const resp = await fetch("${hostApi}/api/stats/getRewritedCharsCount?token=${token}", {
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
          ['9.2021']: 1000,
          ['10.2021']: 800,
          ['11.2021']: 2000,
          [`${new Date().getMonth() + 1}.${new Date().getFullYear()}`]: 5000,
        },
      },
      null,
      2
    ),
}

const addRewrite = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/rewriteText/add", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: "POST",
    mode: "cors",
    body: JSON.stringify(${JSON.stringify(
      {
        token,
        targetLang: LangCodes[0].code,
        dataset: 0,
        power: 0.25,
        expand: RewriteMode.Shorter,
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

const getRewrite = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/rewriteText/get?id=${_id}&token=${token}", {
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

const addTranslate = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/translate/add", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: "POST",
    mode: "cors",
    body: JSON.stringify(${JSON.stringify(
      {
        token,
        langs: [LangCode.Russian, LangCode.German, LangCode.Spanish],
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

  response: ({ token }: any) =>
    JSON.stringify(
      {
        result: {
          _id,
          token,
          status: 0,
          langs: [LangCode.Russian, LangCode.German, LangCode.Spanish],
          blocks: [
            {
              id: '61f594ade70cdb551d77ca1e',
              type: 'header',
              data: { text: 'Dofiltra H2', level: 2 },
            },
            {
              id: '61f594ade70cdb551d77ca1f',
              type: 'paragraph',
              data: { text: 'Hello dear friend' },
            },
            {
              id: '61f594ade70cdb551d77ca20',
              type: 'header',
              data: { text: 'Subtitle H3', level: 3 },
            },
            {
              id: '61f594ade70cdb551d77ca21',
              type: 'list',
              data: {
                style: 'unordered',
                items: ['item 1', 'item 2', 'item 3'],
              },
            },
            {
              id: '61f594ade70cdb551d77ca22',
              type: 'image',
              data: {
                file: {
                  url: 'https://codex.so/public/app/img/external/codex2x.png',
                },
                caption: '',
              },
            },
          ],
          charsCount: 52,
          tone: 'FORMAL',
        },
        error: null,
      },
      null,
      2
    ),
}

const getTranslate = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/translate/get?id=${_id}&token=${token}", {
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
          status: 9,
          langs: [LangCode.Russian, LangCode.German, LangCode.Spanish],
          blocks: [
            {
              id: '61f594ade70cdb551d77ca1f',
              type: 'paragraph',
              data: { text: 'Hello dear friend' },
              results: {
                RU: { text: 'Привет, дорогой друг' },
                DE: { text: 'Hallo lieber Freund' },
                ES: { text: 'Hola querida amiga' },
              },
            },
          ],
          charsCount: 15,
          tone: 'FORMAL',
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
        },
      },
      null,
      2
    ),
}

const addExtract = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/extractor/add", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: "POST",
    mode: "cors",
    body: JSON.stringify(${JSON.stringify(
      [
        {
          token,
          urlsOrKeys: [
            'https://lifehacker.ru/chto-meshaet-vybratsya-iz-bednosti/',
            'https://lifehacker.ru/insult/',
          ],
          contentOpts: {
            limitContent: 30e3,
            coefShuffleBlocks: 0.5,
          },
          duplicateOpts: {
            coefRemoveHeading: 0.8,
            coefRemoveContent: 0.7,
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
        },
      ],
      null,
      8
    )}),
  })
  
  const { result, error } = await resp.json()
  `,

  response: ({ token }: any) =>
    JSON.stringify(
      {
        result: [
          {
            _id,
            token,
          },
        ],
        error: null,
      },
      null,
      2
    ),
}

const getExtract = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/extractor/get?id=${_id}&token=${token}", {
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
          status: TaskStatus.Completed,
          urlsOrKeys: [
            'https://lifehacker.ru/chto-meshaet-vybratsya-iz-bednosti/',
            'https://lifehacker.ru/insult/',
          ],
          results: [
            {
              url: 'https://lifehacker.ru/chto-meshaet-vybratsya-iz-bednosti/',
              byline: 'Author Name 1',
              content: '... <h2>Parsed Heading</h2> ...',
              description: 'description',
              originalHtml: '<html>...full html...</html>',
              siteName: 'Sitename',
              title: 'Site title',
            },
            {
              url: 'https://lifehacker.ru/insult/',
              byline: 'Author Name 2',
              content: '... <h2>Parsed Heading</h2> ...',
              description: 'description',
              originalHtml: '<html>...full html...</html>',
              siteName: 'Sitename',
              title: 'Site title',
            },
          ],
          union: {
            byline: 'Author Name 1;Author Name 2',
            content: '... <h2>Heading</h2> <p>content</p> ...',
            description: 'description',
            title: 'Site title',
          },
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
        },
      },
      null,
      2
    ),
}

const getStatusesExtract = {
  request: ({
    token,
  }: any) => `const resp = await fetch("${hostApi}/api/extractor/getStatuses", {
    headers: ${JSON.stringify(headers, null, 8)},
    method: 'POST',
    mode: "cors",
    body: JSON.stringify({
        token: '${token}',
        ids: [
          '62233a65232b1c71fdde33e7',
          '62233a67232b1c71fdde33fb'
        ]
    })
  })

  const { result, error } = await resp.json()
  `,

  response: ({ token }: any) =>
    JSON.stringify(
      {
        result: [
          {
            _id: '62233a65232b1c71fdde33e7',
            status: 9,
          },
          {
            _id: '62233a67232b1c71fdde33fb',
            status: 9,
          },
        ],
        error: null,
      },
      null,
      2
    ),
}
