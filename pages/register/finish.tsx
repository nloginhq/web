import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Grid, Image, Note, Page, Text } from '@geist-ui/core'
import { useState } from 'react'

const Finish: NextPage = props => {
  const [registrationError, setRegistrationError] = useState('')

  return (
    <div>
      <Head>
        <title>register | nlogin</title>
        <meta name="description" content="register for nlogin" />
      </Head>
      <Page width="800px" pt={0}>
        <Grid.Container justify="center" className="center" gap={1}>
          {registrationError === '' ? (
            <>
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
                <Note type="default" label={false}>
                  <>
                    Welcome to nlogin.
                    <p>
                      Check your inbox to validate your email and complete registration.
                    </p>
                  </>
                </Note>
              </Grid>
            </>
          ) : (
            <Grid xs={24} justify="center">
              <Note type="error" label="error" filled>
                {/* TODO: add support email to contact on failed registration */}
                {registrationError}
              </Note>
            </Grid>
          )}
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Finish
