/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { EDITOR_JS_TOOLS } from 'components/Editorjs/constants'
import { ExpandBox, ExpandMode } from 'components/Select/Expand'
import { FC } from 'preact/compat'
import { HOST_API, detectLang } from 'helpers/api'
import { LangBox } from 'components/Select/Lang'
import { LangCode, headers } from 'dprx-types'
import { Loading } from 'components/Containers/Loader'
import { Navigate } from 'react-router-dom'
import { ToneMode } from 'components/Select/Tone'
import { smiles } from 'helpers/smiles'
import { useContext, useState } from 'preact/hooks'
import { useLocalize } from '@borodutch-labs/localize-react'
import AuthContext from 'components/Auth/AuthContext'
import EditorJS from '@editorjs/editorjs'

const editorId = 'holder_translate'

export default () => {
  const { translate } = useLocalize()
  const [linkResultId, setLinkResult] = useState('')
  const smileSrc = smiles.sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  if (linkResultId) {
    return <Navigate to={`/translator/result/${linkResultId}`} />
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl">
            <div className="hero">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('TranslatorTitle')}
                  </h1>
                  <p className="mb-5">{translate('TranslatorText')}</p>
                  <div className="text-center justify-center flex">
                    <img src={smileSrc} />
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
