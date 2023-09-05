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
import { User, UserPlus } from '@geist-ui/icons'
import { CheckboxEvent } from '@geist-ui/core/esm/checkbox'
import { ChangeEvent, useState } from 'react'

import { accountSvc } from '../../service/account'
import { client } from '../../service/client'
import getStripe from '../../components/stripe'
import router from 'next/router'

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

  const register = async (premium: boolean) => {
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
        if (premium) {
          const checkoutSession = await client.checkout(email)
          // redirect to checkout
          const stripe = await getStripe()
          const { error } = await stripe!.redirectToCheckout({
            sessionId: checkoutSession.session_id,
          })
          // in the success case this wont be reached
          console.warn(error.message)
        } else {
          router.replace('/register/finish')
        }
      } catch (e: any) {
        console.log(e)
        setRegistrationError(e.error)
      }
    }
    setSubmitted(false)
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
          {submitted ? (
            <Grid xs={24} justify="center">
              <Loading>Generating keys, this will take a moment</Loading>
            </Grid>
          ) : (
            <Grid.Container xs={23} justify="center" gap={1}>
              <Grid sm={24} xs={24}>
                <Grid.Container justify="space-between" gap={1}>
                  <Grid
                    sm={12}
                    xs={24}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text margin={0}>✓ Store encrypted credentials</Text>
                    <Text margin={0}>✓ Import your existing passwords</Text>
                    <Text margin={0}>$0/month</Text>
                    <Spacer />
                    <Button
                      icon={<User />}
                      type="secondary"
                      width="300px"
                      onClick={async () => {
                        setSubmitted(true)
                        register(false)
                      }}>
                      Create Free Account
                    </Button>
                  </Grid>

                  <Grid
                    sm={12}
                    xs={24}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                    <Text margin={0}>✓ All features of free accounts</Text>
                    <Text margin={0}>✓ Email relays to your inbox</Text>
                    <Text margin={0}>$3/month</Text>
                    <Spacer />
                    <Button
                      icon={<UserPlus />}
                      type="success"
                      width="300px"
                      onClick={async () => {
                        setSubmitted(true)
                        register(true)
                      }}>
                      Create Premium Account
                    </Button>
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          )}
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
