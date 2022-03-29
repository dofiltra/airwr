/* eslint-disable @typescript-eslint/no-explicit-any */
import { Language } from '@dofiltra/tailwind'
import { proxy } from 'valtio'
import PersistableStore from 'stores/persistence/PersistableStore'

class AppStore extends PersistableStore {
  language: Language = Language.en
  extractorTasks: any[] = []
}

export default proxy(new AppStore()).makePersistent()
