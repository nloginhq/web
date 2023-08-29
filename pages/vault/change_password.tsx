import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react'
import { mutate } from 'swr'
import {
  Button,
  Grid,
  Input,
  Loading,
  Modal,
  Note,
  Spacer,
  Text,
  useTheme,
} from '@geist-ui/core'

import { client, UnencryptedCredential } from '../../service/client'
import { ModalHooksBindings } from '@geist-ui/core/esm/use-modal'
import { accountSvc } from '../../service/account'

const ChangePassword = ({
  visible,
  setVisible,
  bindings,
}: {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  bindings: ModalHooksBindings
}) => {
  const theme = useTheme()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [unencryptedCredentials, setUnencryptedCredentials] = useState<
    UnencryptedCredential[]
  >([])
  const [submitted, setSubmitted] = useState(false)

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

  const migratePassword = async () => {
    setSubmitted(true)
    setError('')

    await delay(300) // this delay forces the loading to render
    if (newPassword !== confirmNewPassword) {
      setError('new password does not match confirmation')
      setSubmitted(false)
      return
    }

    try {
      await accountSvc.changePassword(currentPassword, newPassword)
    } catch (e: any) {
      console.log('failed to change password: ' + e)
      setSubmitted(false)
      setError(e.error)
      return
    }
    // clear the state to default
    setSubmitted(false)
    setVisible(false)
  }

  return (
    <Modal disableBackdropClick {...bindings}>
      <Modal.Title>Change Account Password</Modal.Title>
      <Modal.Content>
        <Grid.Container justify="center">
          <Text>Change the password used to access your nlogin vault.</Text>
        </Grid.Container>
        <Grid.Container justify="center">
          <Input.Password
            label="current password"
            placeholder="*********"
            width="100%"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setCurrentPassword(e.target.value)
            }
          />
          <Spacer h={0.5} />
          <Input.Password
            label="new password"
            placeholder="*********"
            width="100%"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
          <Spacer h={0.5} />
          <Input.Password
            label="confirm new password"
            placeholder="*********"
            width="100%"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmNewPassword(e.target.value)
            }
          />
        </Grid.Container>
        <Spacer h={0.5} />
        <Grid.Container justify="center">{submitted && <Loading />}</Grid.Container>
        <Spacer h={0.5} />
        <Grid.Container justify="center">
          {error !== '' && (
            <Grid xs={20} sm={20} justify="center" marginBottom={0.5}>
              <Note type="error" label="error" width="100%" filled>
                {error}
              </Note>
            </Grid>
          )}
        </Grid.Container>
      </Modal.Content>
      <Modal.Action
        passive
        onClick={() => {
          setVisible(false)
        }}
        disabled={submitted}>
        Cancel
      </Modal.Action>
      <Modal.Action
        onClick={migratePassword}
        disabled={submitted}
        style={{ backgroundColor: theme.palette.success }}>
        Submit
      </Modal.Action>
    </Modal>
  )
}

export default ChangePassword
