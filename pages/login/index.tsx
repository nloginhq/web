import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  Button,
  Checkbox,
  Dot,
  Grid,
  Image,
  Input,
  Loading,
  Note,
  Page,
  Spacer,
  Text,
} from '@geist-ui/core'
import { Unlock } from '@geist-ui/icons'
import { CheckboxEvent } from '@geist-ui/core/esm/checkbox'
import { ChangeEvent, useEffect, useState } from 'react'
// import { AttestationConveyancePreference, AuthenticatorAttachment } from '@types/web'

import { accountSvc } from '../../service/account'
import router from 'next/router'
import getStripe from '../../components/stripe'
import { client } from '../../service/client'

const Login: NextPage = props => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [trustThisDevice, setTrustThisDevice] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [webAuthnSupported, setWebAuthnSupported] = useState(false)

  useEffect(() => {
    setWebAuthnSupported(
      typeof navigator !== 'undefined' && typeof navigator.credentials !== 'undefined',
    )
  }, [])

  const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
  }

  // Convert an ArrayBuffer to a Base64 string
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer)
    let byteString = ''
    for (let i = 0; i < byteArray.length; i++) {
      byteString += String.fromCharCode(byteArray[i])
    }
    return btoa(byteString)
  }

  // Convert a Base64 string to an ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const byteString = atob(base64)
    const byteArray = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i)
    }
    return byteArray.buffer
  }

  const signChallenge = async (uid: string, email: string, challenge: string) => {
    const keyID = localStorage.getItem('nlogin-key-id')
    if (keyID) {
      // if there should be a stored key, attempt to retrieve it
      try {
        const options: PublicKeyCredentialRequestOptions = {
          challenge: base64ToUint8Array(challenge),
          rpId: 'localhost', // TODO: change this to nlogin.me
          allowCredentials: [
            {
              type: 'public-key' as PublicKeyCredentialType,
              id: new Uint8Array(base64ToArrayBuffer(keyID)), // Convert the string back to Uint8Array
              transports: ['usb', 'ble', 'nfc', 'internal'] as AuthenticatorTransport[],
            },
          ],
          timeout: 60000,
        }

        const assertion = await navigator.credentials.get({ publicKey: options })
        console.log(assertion)
        return
      } catch (error) {
        console.error('login failed:', error)
      }
    }
    // if there is no stored key ID, create a new key
    try {
      const options = {
        challenge: base64ToUint8Array(challenge),
        rp: {
          name: 'nlogin.me',
          id: 'localhost', // TODO: change this to nlogin.me
        },
        user: {
          id: base64ToUint8Array(uid), // should be a unique value for every user
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [
          {
            type: 'public-key' as PublicKeyCredentialType,
            alg: -7, // This is for ES256 algorithm
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform' as AuthenticatorAttachment,
        },
        timeout: 60000,
        excludeCredentials: [],
        attestation: 'direct' as AttestationConveyancePreference,
      }

      const newCredential = (await navigator.credentials.create({
        publicKey: options,
      })) as PublicKeyCredential
      // store the credential's rawId in local storage for future use
      localStorage.setItem('nlogin-key-id', arrayBufferToBase64(newCredential.rawId))
      console.log(newCredential)
    } catch (error) {
      console.error('registration failed:', error)
    }
  }

  const login = async () => {
    setSubmitted(true)
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    let foundErr = false

    if (email === '') {
      setEmailError('required')
      foundErr = true
    }

    if (password === '') {
      setPasswordError('required')
      foundErr = true
    }

    if (!foundErr) {
      try {
        const challenge = await accountSvc.login(password, email, trustThisDevice)
        if (trustThisDevice) {
          await signChallenge('123', email, '123')
        }
        router.replace('/vault')
      } catch (e: any) {
        console.log(e)
        setLoginError(e.message)
        if (e.error !== undefined) {
          setLoginError(e.error)
          if (e.error === 'login failed: account has no active subscription') {
            // redirect to subscription page
            const checkoutSession = await client.checkout(email)
            // redirect to checkout
            const stripe = await getStripe()
            const { error } = await stripe!.redirectToCheckout({
              sessionId: checkoutSession.session_id,
            })
            // in the success case this wont be reached
            console.warn(error.message)
          }
        }
      }
    }
    setSubmitted(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <div>
      <Head>
        <title>unlock | nlogin</title>
        <meta name="description" content="unlock your nlogin account" />
      </Head>
      <Page width="800px" pt={0}>
        <Grid.Container className="center">
          <Grid xs={24} justify="center">
            <Image
              src="/lock/lock-30.svg"
              alt="nlogin lock"
              draggable={false}
              mx={0}
              mt={1.5}
            />
            <NextLink href="/" style={{ cursor: 'pointer' }}>
              <Text h1>
                <a className="no-highlight">ηlogin</a>
              </Text>
            </NextLink>
          </Grid>
          <Grid xs={24} justify="center">
            <Text>Login to decrypt your vault.</Text>
          </Grid>
          <Grid xs={24} justify="center">
            <Input
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.currentTarget.value)
              }
              onKeyDown={onKeyDown}
              enterKeyHint="done"
              width="300px">
              Email
              {emailError !== '' && (
                <Grid xs={24} justify="center">
                  <Dot type="warning" color="whitesmoke">
                    <Text small style={{ color: 'whitesmoke' }}>
                      {emailError}
                    </Text>
                  </Dot>
                </Grid>
              )}
            </Input>
          </Grid>
          <Spacer />
          <Grid xs={24} justify="center">
            <Input.Password
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.currentTarget.value)
              }
              onKeyDown={onKeyDown}
              enterKeyHint="done"
              width="300px"
              className="render-icon">
              Password
              {passwordError !== '' && (
                <Grid xs={24} justify="center">
                  <Dot type="warning">
                    <Text small style={{ color: 'whitesmoke' }}>
                      {passwordError}
                    </Text>
                  </Dot>
                </Grid>
              )}
            </Input.Password>
          </Grid>
          <Spacer />
          {webAuthnSupported && (
            <>
              <Grid xs={24} justify="center">
                <Checkbox
                  checked={false}
                  onChange={(e: CheckboxEvent) => setTrustThisDevice(e.target.checked)}
                  type="success">
                  Trust this device
                </Checkbox>
              </Grid>
              <Spacer />
            </>
          )}
          <Grid xs={24} justify="center">
            {submitted ? (
              <Loading>Generating keys, this will take a moment</Loading>
            ) : (
              <Button
                icon={<Unlock />}
                type="success"
                width="200px"
                onClick={async () => {
                  setSubmitted(true)
                  login()
                }}>
                Login
              </Button>
            )}
          </Grid>
          <Spacer />
          {loginError !== '' && (
            <Grid xs={24} justify="center">
              <Note type="error" label="error" filled>
                {loginError}
              </Note>
            </Grid>
          )}
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Login
