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
        await accountSvc.login(password, email, trustThisDevice)
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
