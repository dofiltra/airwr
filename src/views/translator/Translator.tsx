/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { HOST_API, detectLang } from 'helpers/api'
import { LangBox, LangCodes } from 'components/Select/Lang'
import { LangCode, headers } from 'dprx-types'
import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { smiles } from 'helpers/smiles'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'
import useTranslateQueue from 'hooks/useTranslateQueue'

const editorId = 'holder_translate'

export default () => {
  const { translate } = useLocalize()
  const [isVisibleContent, setVisibleContent] = useState(true)
  const [linkResultId, setLinkResult] = useState('')
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  if (linkResultId) {
    return <Navigate to={`/translator/result/${linkResultId}`} />
  }

  if (!isVisibleContent) {
    return (
      <div className="h-96">
        <div className="justify-center flex">{translate('loading')}</div>
        <Loading />
      </div>
    )
  }

  const { queueCount = 0, queueChars = 0 } = useTranslateQueue()
  const [langs, setLangs] = useState([] as LangCode[])
  const { user } = useContext(AuthContext)
  const token = user?.uid || ''

  const [api] = useState(
    () =>
      new EditorJS({
        holder: editorId,
        tools: EDITOR_JS_TOOLS,
        placeholder: translate('EnterTextForTranslatePlaceholder'),
        autofocus: true,
        inlineToolbar: false,
        hideToolbar: true,
        onChange: () => {
          //
        },
      })
  )

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="text-center">
            <h1 className="mt-4 text-5xl font-bold">
              {translate('TranslatorTitle')}
              <img src={smileSrc} className="inline px-4" />
            </h1>
          </div>

          <div className="w-full card p-4">
            <div className="mb-1 md:mb-0 w-full p-2 text-center">
              <div>
                {translate('Queue', { count: queueCount })}
                {queueCount > 100 &&
                  translate('QueueCharsCount', { chars: queueChars })}
              </div>
            </div>

            <div className="mb-1 md:mb-0 w-full p-2 ">
              <label className="">{translate('EnterTextForTranslate')}</label>
              <div className="editor-wrapper w-full border-4 border-dashed border-gray-200 rounded-lg p-3 min-h-16">
                <div id={editorId}></div>
              </div>
            </div>

            <div className="mb-1 md:mb-0 w-full p-2 ">
              <span className="text-gray-700">
                {translate('Select langs for Translate')}
              </span>
              <LangBox
                value={langs}
                onChange={(val: any) =>
                  setLangs(
                    Array.from(val.target.selectedOptions, (o: any) => o.value)
                  )
                }
                className="form-multiselect block w-full h-48 mt-1  border-2 border-dashed border-gray-100 "
                multiple
              />
            </div>

            <div className="flex-auto space-x-3 my-6 flex items-center">
              <button
                // disabled={!editorData?.blocks?.length}
                onClick={() => {
                  // addQueue({
                  //   api,
                  //   targetLang,
                  //   power,
                  //   setVisibleContent,
                  //   setLinkResult,
                  //   translate,
                  //   token,
                  //   expand,
                  //   tone,
                  // })
                }}
                className="w-full btn btn-success"
              >
                {translate('ButtonSend')}
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
