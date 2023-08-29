import type { NextPage } from 'next'
import Head from 'next/head'
import { Grid, Note, Page, Spinner } from '@geist-ui/core'
import { useEffect, useState } from 'react'

import { accountSvc } from '../../service/account'
import { useRouter } from 'next/router'

const Confirm: NextPage = props => {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    const code = router.query.code
    if (code === undefined || typeof code !== 'string') {
      setError('invalid confirmation code')
      return
    }
    confirm(code)
  }, [router.query])

  const confirm = async (code: string) => {
    try {
      await accountSvc.confirmEmail(code)
      router.push('/login')
    } catch (e: any) {
      console.log(e)
      setError(e.error)
    }
  }

  return (
    <div>
      <Head>
        <title>confirm | nlogin</title>
        <meta name="description" content="register for nlogin" />
      </Head>
      <Page width="800px" pt={0}>
        <Grid.Container justify="center" className="center" gap={1}>
          <Grid xs={24} justify="center">
            {error === '' ? (
              <Spinner />
            ) : (
              <Grid xs={24} justify="center">
                <Note type="error" label="error" filled>
                  {error}
                </Note>
              </Grid>
            )}
          </Grid>
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Confirm
