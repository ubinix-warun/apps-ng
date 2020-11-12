import { types, flow } from 'mobx-state-tree'
import { createPersistStore } from '@/store/store'

export const CONTRACT_TUNA_LEDGER = 6;

const anyType = types.custom({
  isTargetType: () => true,
  getValidationMessage: () => '',
  fromSnapshot: val => val,
  toSnapshot: val => val
})

export const createVaultStore = (defaultValue = {}, options = {}) => {
  const VaultStore = types
    .model('VaultStore', {
      tunas: types.array(anyType),
      error: types.maybeNull(anyType)
    })
    .views(self => ({
      get runtimeEndpointUrl () {
        return self.appSettings.phalaTeeApiUrl
      },
      get appSettings () {
        return defaultValue.appSettings
      },
      get appAccount () {
        return defaultValue.appAccount
      },
      get appRuntime () {
        return defaultValue.appRuntime
      },
      get accountId () {
        return self.appAccount.address
      },
    }))
    .actions(self => ({
      updateTunas: flow(function* () { // updateLogins
        const res = yield self.appRuntime.query(
          CONTRACT_TUNA_LEDGER,
          'QueryAll'
        )
        self.tunas = (res?.QueryAll?.tunas || []).reverse()
      })
    }))

  //return VaultStore.create(defaultValue)
  return createPersistStore('vault', VaultStore, defaultValue)
}