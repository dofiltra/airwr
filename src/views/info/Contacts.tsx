/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLocalize } from '@borodutch-labs/localize-react'

export default () => {
  const { translate } = useLocalize()
  const smileSrc = [
    'https://i.smiles2k.net/computer_smiles/type.gif',
    'http://www.kolobok.us/smiles/artists/vishenka/d_clock.gif',
    'http://www.kolobok.us/smiles/artists/mother_goose/MG_76.gif',
    'http://www.kolobok.us/smiles/artists/mother_goose/MG_216.gif',
    'http://www.kolobok.us/smiles/artists/phil/phil_24.gif',
    'http://www.kolobok.us/smiles/artists/big/LorDeR_ahgm.gif',
    'http://www.kolobok.us/smiles/artists/cherna/Cherna-kunst.gif',
    'http://www.kolobok.us/smiles/user/kattemad_03.gif',
    'http://www.kolobok.us/smiles/user/KidRock_06.gif',
    'http://www.kolobok.us/smiles/user/kuzya_02.gif',
    'http://www.kolobok.us/smiles/artists/fool/bath.gif',
  ].sort(() => (Math.random() > 0.5 ? 1 : -1))[0]

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="max-w-7xl ">
            <div className="hero  bg-base-200">
              <div className="text-center hero-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    {translate('ContactsTitle')}
                  </h1>
                  <p className="mb-5">{translate('ContactsText')}</p>
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
