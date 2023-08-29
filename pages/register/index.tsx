import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  Button,
  Checkbox,
  Dot,
  Grid,
  Input,
  Image,
  Loading,
  Note,
  Page,
  Spacer,
  Text,
} from '@geist-ui/core'
import { UserCheck } from '@geist-ui/icons'
import { CheckboxEvent } from '@geist-ui/core/esm/checkbox'
import { ChangeEvent, useState } from 'react'

import { accountSvc } from '../../service/account'
import { client } from '../../service/client'
import getStripe from '../../components/stripe'

const Register: NextPage = props => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [wantUpdates, setWantUpdates] = useState(true)
  const [registrationError, setRegistrationError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const register = async () => {
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setRegistrationError('')

    let foundErr = false

    if (email === '') {
      setEmailError('required')
      foundErr = true
    }

    if (password === '') {
      setPasswordError('required')
      foundErr = true
    }

    if (confirmPassword === '') {
      setConfirmPasswordError('required')
      foundErr = true
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('does not match password')
      foundErr = true
    }

    if (password?.length < 8) {
      setPasswordError('password must be at least 8 characters')
      foundErr = true
    }

    let checkPassword = password
    // remove all empty spaces to check its not a password of all white spaces
    checkPassword.replace(/ /g, '')
    if (checkPassword?.length == 0) {
      setPasswordError('password cannot contain only spaces')
      foundErr = true
    }

    if (!foundErr) {
      try {
        await accountSvc.register(password, email, wantUpdates)
        const checkoutSession = await client.checkout(email)
        // redirect to checkout
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
          sessionId: checkoutSession.session_id,
        })
        // in the success case this wont be reached
        console.warn(error.message)
      } catch (e: any) {
        console.log(e)
        setRegistrationError(e.error)
      }
    }
    setSubmitted(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      register()
    }
  }

  return (
    <div>
      <Head>
        <title>register | nlogin</title>
        <meta name="description" content="register for nlogin" />
      </Head>
      <Page width="800px" pt={0}>
        <Grid.Container justify="center" className="center" gap={1}>
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
            <Text>Get started by registering an account.</Text>
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
                  <Dot type="warning">
                    <Text color="whitesmoke" small>
                      {emailError}
                    </Text>
                  </Dot>
                </Grid>
              )}
            </Input>
          </Grid>
          <Grid xs={24} justify="center">
            <Note type="warning" label={false}>
              <>
                Pick a password that is memorable but difficult to guess.
                <p>This password cannot be recovered if you forget it.</p>
              </>
            </Note>
          </Grid>
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
                    <Text small>{passwordError}</Text>
                  </Dot>
                </Grid>
              )}
            </Input.Password>
          </Grid>
          <Grid xs={24} justify="center">
            <Input.Password
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.currentTarget.value)
              }
              onKeyDown={onKeyDown}
              enterKeyHint="done"
              width="300px"
              className="render-icon">
              Confirm Password
              {confirmPasswordError !== '' && (
                <Grid xs={24} justify="center">
                  <Dot type="warning">
                    <Text small>{confirmPasswordError}</Text>
                  </Dot>
                </Grid>
              )}
            </Input.Password>
          </Grid>
          <Spacer />
          <Grid xs={24} justify="center">
            <Checkbox
              checked={true}
              onChange={(e: CheckboxEvent) => setWantUpdates(e.target.checked)}
              type="success">
              Get email updates about new features
            </Checkbox>
          </Grid>
          <Spacer />
          <Grid xs={24} justify="center">
            {submitted ? (
              <Loading>Generating keys, this will take a moment</Loading>
            ) : (
              <Button
                icon={<UserCheck />}
                type="success"
                width="300px"
                onClick={async () => {
                  setSubmitted(true)
                  register()
                }}>
                Continue to Payment
              </Button>
            )}
          </Grid>
          <Spacer />
          <Grid xs={24} justify="center">
            <Text small style={{ textAlign: 'center' }} margin={1}>
              By proceeding you agree to the{' '}
              <NextLink href="/legal/terms" style={{ cursor: 'pointer' }}>
                <a>terms and conditions</a>
              </NextLink>{' '}
              and the{' '}
              <NextLink href="/legal/privacy" style={{ cursor: 'pointer' }}>
                <a>privacy policy</a>
              </NextLink>
              .
            </Text>
          </Grid>
          <Spacer />
          {registrationError !== '' && (
            <Grid xs={24} justify="center">
              <Note type="error" label="error" filled>
                {registrationError}
              </Note>
            </Grid>
          )}
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Register
