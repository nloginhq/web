import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { mutate } from 'swr'
import { Button, Grid, Loading, Modal, Spacer, Text, useTheme } from '@geist-ui/core'

import { client, UnencryptedCredential } from '../../service/client'
import { ModalHooksBindings } from '@geist-ui/core/esm/use-modal'

const Import = ({
  visible,
  setVisible,
  bindings,
}: {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  bindings: ModalHooksBindings
}) => {
  const theme = useTheme()
  const [fileNameDisplay, setFileNameDisplay] = useState('No file selected')
  const [unencryptedCredentials, setUnencryptedCredentials] = useState<
    UnencryptedCredential[]
  >([])
  const [submitted, setSubmitted] = useState(false)
  const [currentCredential, setCurrentCredential] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const isEmailValid = (email: string): boolean => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email)
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setFileNameDisplay(files[0].name)

      try {
        const fileText = await files[0].text()
        const parsedData = JSON.parse(fileText)

        const parsedCreds: UnencryptedCredential[] = parsedData.items.map((item: any) => {
          let email = item?.login?.username ?? ''
          if (!isEmailValid(email)) {
            email = '' // clear this so it can be imported
          }
          return {
            username: item?.login?.username ?? '',
            email: email,
            password: item?.login?.password ?? '',
            uri: item?.name ?? '',
          }
        })

        setUnencryptedCredentials(parsedCreds)
      } catch (error) {
        console.log(error)
        setFileNameDisplay('File must be unencrypted JSON')
      }
    } else {
      setFileNameDisplay('Please select 1 file')
    }
  }

  const importCredentials = async () => {
    setSubmitted(true)
    for (let i = 0; i < unencryptedCredentials.length; i++) {
      setCurrentCredential(i + 1)
      const cred = unencryptedCredentials[i]
      try {
        await client.addCredential(cred)
      } catch (e: any) {
        console.log('failed to import credential: ' + e)
        // TODO: display errors
      }
    }
    // once all requests are done, update the UI
    mutate('/credentials')
    // clear the state to default
    setCurrentCredential(0)
    setSubmitted(false)
    setFileNameDisplay('')
    setUnencryptedCredentials([])
    setVisible(false)
  }

  return (
    <Modal disableBackdropClick {...bindings}>
      <Modal.Title>Import Credentials</Modal.Title>
      <Modal.Content>
        <Grid.Container justify="center">
          <Text>{fileNameDisplay}</Text>
        </Grid.Container>
        <Grid.Container justify="center">
          <Button onClick={handleButtonClick}>Select File</Button>
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {submitted && (
            <>
              <Loading />
              <Text small>
                {currentCredential} of {unencryptedCredentials.length}
              </Text>
            </>
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
        onClick={importCredentials}
        disabled={submitted}
        style={{ backgroundColor: theme.palette.success }}>
        Upload
      </Modal.Action>
    </Modal>
  )
}

export default Import
