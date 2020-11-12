import { useTranslation } from 'react-i18next'
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import {
  MinusSquare as MinusSquareIcon
} from '@zeit-ui/react-icons'
import Button from '@/components/Button'
import TxButton from '@/components/TxButton'
import { Modal, useModal, useToasts, Spacer } from '@zeit-ui/react'
import { encryptObj } from '@phala/runtime/utils'
import { toApi } from '@phala/runtime/models'
import { observer } from 'mobx-react'
import { useStore } from '@/store'
import { CONTRACT_TUNA_LEDGER } from '../utils/VaultStore'

const CONTRACT_PASSWORD_MANAGER = 6

const EraseModal = observer(({ id, symbol, bindings, setVisible }) => {
  const { account, appRuntime } = useStore()
  const { ecdhChannel } = appRuntime
  const [isBusy, setIsBusy] = useState(false)
  const [, setToast] = useToasts()
  const [command, setCommand] = useState('')
  const [disabled, setDisabled] = useState(false)

  const { t } = useTranslation()

  useEffect(() => {
    setDisabled(true)
    ;(async () => {
      const obj = {
        Erase: { id }
      }
      const cipher = await encryptObj(ecdhChannel, obj)
      const apiCipher = toApi(cipher)
      setCommand(JSON.stringify({ Cipher: apiCipher }))
      setDisabled(false)
    })()
  }, [id])

  const onStart = useCallback(() => {
    setIsBusy(true)
  }, [setIsBusy])

  const onFailed = useCallback(e => {
    setIsBusy(false)
    e && console.warn(e)
    setToast({
      text: t('Failed to submit.'),
      type: 'error'
    })
  }, [t, setIsBusy])

  const onSuccess = useCallback(() => {
    setToast({
      text: t('Successfully erased, the credentials will disappear soon.')
    })
    onClose()
  }, [t, onClose])

  const onClose = useCallback(() => {
    if (isBusy) { return }

    setVisible(false)
  }, [isBusy])

  const doSend = useCallback(() => {
    if (isBusy) { return }
  }, [isBusy])

  return <Modal {...bindings} disableBackdropClick>
    <Modal.Title>{t('Confirm')}</Modal.Title>
    <Modal.Subtitle>{t('do you want to erase the tunatuna?')}</Modal.Subtitle>
    <Spacer y={1} />
    <TxButton
      accountId={account.address || ''}
      onClick={doSend}
      params={[CONTRACT_TUNA_LEDGER, command]}
      tx='phalaModule.pushCommand'
      withSpinner
      onStart={onStart}
      onFailed={onFailed}
      onSuccess={onSuccess}
      disabled={disabled}
    >
      {t('Submit')}
    </TxButton>
    <Modal.Action onClick={onClose}>{t('Cancel')}</Modal.Action>
  </Modal>
})

const EraseButton = ({ id }) => {
  const modal = useModal()
  const { t } = useTranslation()

  return <>
    <EraseModal id={id} {...modal} />
    <Button
      type="remove"
      icon={MinusSquareIcon}
      name={t('Erase')}
      onClick={() => modal.setVisible(true)}
    />
  </>
}

export default EraseButton