/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import { HOST_API } from 'helpers/api'
import { useLocalize } from '@borodutch-labs/localize-react'

export const DocumentationApi: FC = () => {
  const { translate } = useLocalize()

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="table w-full text-center ">
          <thead className="">
            <tr>
              <th>{translate('ApiName')}</th>
              <th>{translate('ApiDescription')}</th>
              <th>{translate('ApiExample')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <AdditionalInfo text={'Add '} />
              </th>
              <td>-</td>
              <td>
                <ModalBtn
                  title={'Fetch'}
                  content={
                    <textarea className="w-full h-96">{addFetch}</textarea>
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
                        <small>{'"your_token"'}</small>
                      </p>
                      <p className="pb-2">
                        <b>TargetLang*</b>
                        : enum (number)
                        <br />
                        <small>EN = 0, RU = 1</small>
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
                                  text: 'see fetch example',
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
                          Auto = 0
                          {/* ,News = 1, Crypto = 2, Finance = 3, Medicine
                          = 4 */}
                        </small>
                      </p>
                      <p className="pb-2">
                        <b>Power</b>
                        : enum (number)
                        <br />
                        <small> Light = 0</small>
                      </p>
                    </div>
                  }
                />
                <ModalBtn
                  title={'Response'}
                  content={
                    <p className="h-96 whitespace-pre-wrap overflow-auto text-left">
                      {addResponse}
                    </p>
                  }
                />
              </td>
            </tr>
            <tr>
              <th>Get</th>
              <td>-</td>
              <td>...</td>
            </tr>
            <tr />
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

const AdditionalInfo = ({ text = '', body = '', position = 'center' }: any) => {
  return (
    <>
      {text}{' '}
      <div className={`dropdown dropdown-${position}`}>
        <div tabIndex={0} className="btn btn-circle btn-ghost btn-xs text-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline w-5 h-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div
          tabIndex={0}
          className="shadow card compact dropdown-content bg-base-100 rounded-box w-64"
        >
          <div className="card-body">
            <p>{body}</p>
          </div>
        </div>
      </div>
    </>
  )
}

const token = '{your_token}'
const addFetchBody = JSON.stringify(
  {
    token,
    targetLang: 1, // 0 - en, 1 - ru
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
  6
)
const addFetch = `fetch("${HOST_API}/api/rewriteText/create", {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: "POST",
  mode: 'cors',
  body: JSON.stringify(${addFetchBody}),
})`
const addResponse = JSON.stringify(
  {
    result: 'asd',
  },
  null,
  2
)
