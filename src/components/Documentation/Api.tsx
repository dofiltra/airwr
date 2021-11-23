/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react'
import { HOST_API } from 'helpers/api'
import { useLocalize } from '@borodutch-labs/localize-react'

export const DocumentationApi: FC = () => {
  const { translate } = useLocalize()

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="text-center">
            <tr>
              <th>{translate('ApiName')}</th>
              <th>{translate('ApiDescription')}</th>
              <th>{translate('ApiExample')}</th>
              <th>{translate('ApiResponse')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <AdditionalInfo text={'Add '} />
              </th>
              <td>...</td>
              <td>
                <div className="collapse w-96 border rounded-box border-base-300 collapse-arrow">
                  <input type="checkbox" />
                  <div className="collapse-title font-medium">Fetch</div>
                  <div className="collapse-content ">
                    <p className="whitespace-pre-wrap overflow-auto">
                      {addFetch}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <div className="collapse w-96 border rounded-box border-base-300 collapse-arrow">
                  <input type="checkbox" />
                  <div className="collapse-title font-medium">Response</div>
                  <div className="collapse-content ">
                    <p className="whitespace-pre-wrap overflow-auto">
                      {addResponse}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>Get</th>
              <td>...</td>
              <td>{`?id={id}&token={token}`}</td>
              {/* <td>Purple</td> */}
              <td>Purple</td>
            </tr>
            <tr />
          </tbody>
        </table>
      </div>
    </div>
  )
}

const AdditionalInfo = ({ text = '', body = '...', position = 'top' }: any) => {
  return (
    <div>
      {text}
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
          className="shadow card compact dropdown-content bg-base-100 rounded-box "
        >
          <div className="card-body">
            <p>{body}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const addFetch = `fetch("${HOST_API}/api/rewriteText/create", {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: "POST",
  body: JSON.stringify({
      targetLang: 1
  }),
})`
const addResponse = JSON.stringify(
  {
    result: 'asd',
  },
  null,
  2
)
