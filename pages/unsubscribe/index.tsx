import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Button, Dot, Grid, Image, Input, Page, Spacer, Text } from '@geist-ui/core'
import { Unlock } from '@geist-ui/icons'
import { ChangeEvent, useState } from 'react'

import router from 'next/router'
import { client } from '../../service/client'

const Unsubscribe: NextPage = props => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const unsubscribe = async () => {
    setSubmitted(true)
    setEmailError('')

    let foundErr = false

    if (email === '') {
      setEmailError('required')
      foundErr = true
    }

    if (!foundErr) {
      try {
        await client.unsubscribeFromUpdates(email)
        router.replace('/')
      } catch (e: any) {
        console.log(e)
      }
    }
    setSubmitted(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      unsubscribe()
    }
  }

  return (
    <div>
      <Head>
        <title>unsubscribe | nlogin</title>
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
            <Text>Unsubscribe from email updates.</Text>
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
            <Button
              icon={<Unlock />}
              type="success"
              width="200px"
              onClick={async () => {
                setSubmitted(true)
                unsubscribe()
              }}>
              Unsubscribe
            </Button>
          </Grid>
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Unsubscribe
