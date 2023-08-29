import { ChangeEvent, useState } from 'react'
import { useSWRConfig } from 'swr'
import {
  Button,
  Checkbox,
  Dot,
  Grid,
  Input,
  Modal,
  Note,
  Spacer,
  Tabs,
  Text,
  Tooltip,
  useModal,
  useTheme,
} from '@geist-ui/core'

import { client, UnencryptedCredential } from '../../service/client'
import { accountSvc } from '../../service/account'
import GeneratePassword from '../../components/generate-password'
import Copiable from '../../components/copiable'

const Add = () => {
  const theme = useTheme()
  const { mutate } = useSWRConfig()
  const { visible, setVisible, bindings } = useModal()
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [passwordTab, setPasswordTab] = useState('1')
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [inputPassword, setInputPassword] = useState('')
  const [warnURI, setWarnURI] = useState(false)
  const [uri, setURI] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [generatedEmail, setGeneratedEmail] = useState('')

  const changePasswordTab = (val: string) => setPasswordTab(val)

  const saveCredentials = async () => {
    setSubmitted(true)
    setWarnURI(false)
    if (uri === '') {
      setWarnURI(true)
      setSubmitted(false)
      return
    }
    // check password tab to see if generated or input
    let password = generatedPassword
    if (inputPassword !== '') {
      password = inputPassword
    }
    const cred: UnencryptedCredential = {
      id: 0, // not yet set
      username: username,
      email: email,
      emailStatus: 'active', // will be set by server
      password: password,
      uri: uri,
    }
    try {
      await client.addCredential(cred)
      mutate('/credentials')
      setVisible(false)
    } catch (e: any) {
      console.log('failed to add credential: ' + e)
      setError(e.error)
    }
    setSubmitted(false)
  }

  const closeHandler = async () => {
    client.releaseEmail(generatedEmail)
    setVisible(false)
  }

  const generateEmail = async () => {
    const generated = await client.generateEmail()
    setGeneratedEmail(generated.email) // need to store this separately in case the user sets the email to their main email
    setEmail(generated.email)
  }

  const updateInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    setInputPassword(input)
  }

  const updateURI = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    setURI(input)
  }

  const updateUsername = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    setUsername(input)
  }

  const openNewCredentials = async () => {
    await generateEmail()
    setVisible(true)
  }

  return (
    <>
      <Button shadow type="success" width="100%" onClick={openNewCredentials}>
        + New Login Credentials
      </Button>
      <Modal disableBackdropClick {...bindings}>
        <Modal.Title>New Credentials</Modal.Title>
        <Modal.Content>
          <Input
            label="website"
            placeholder="example.com"
            onChange={updateURI}
            width="100%">
            {warnURI && (
              <Dot type="warning">
                <Text small>website is required</Text>
              </Dot>
            )}
          </Input>
          <Spacer h={0.5} />
          <Input
            label="username"
            clearable={true}
            onChange={updateUsername}
            width="100%"
          />
          <Spacer h={0.5} />
          <Tooltip
            className="full-width-tool-tip"
            text={
              'This email address is used to keep your main email private.\n Emails will be automatically forwarded from this address to ' +
              accountSvc.mainEmail +
              '.'
            }
            type="dark">
            <Input
              label="email"
              readOnly
              value={email}
              iconRight={<Copiable val={email} />}
              iconClickable
              width="100%"
            />
          </Tooltip>
          <Checkbox
            checked={email === accountSvc.mainEmail}
            marginLeft={3.5}
            onClick={() =>
              email === accountSvc.mainEmail
                ? setEmail(generatedEmail)
                : setEmail(accountSvc.mainEmail)
            }>
            Use my main email
          </Checkbox>
          <Spacer h={0.5} />
          <Tabs value={passwordTab} onChange={changePasswordTab}>
            <Tabs.Item
              label="generate a password"
              value="1"
              onClick={() => setInputPassword('')}>
              <GeneratePassword setPassword={setGeneratedPassword} />
            </Tabs.Item>
            <Tabs.Item label="choose a password" value="2">
              <Input.Password
                label="password"
                placeholder="*********"
                width="100%"
                onChange={updateInputPassword}
              />
            </Tabs.Item>
          </Tabs>
          {error !== '' && (
            <Grid xs={24} justify="center">
              <Spacer h={0.5} />
              <Note type="error" label="error" filled>
                {error}
              </Note>
            </Grid>
          )}
        </Modal.Content>
        <Modal.Action passive onClick={closeHandler} disabled={submitted}>
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={saveCredentials}
          disabled={submitted}
          style={{ backgroundColor: theme.palette.success }}>
          Save
        </Modal.Action>
      </Modal>
    </>
  )
}

export default Add
