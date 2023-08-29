import type { NextPage } from 'next'
import router from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import {
  ButtonDropdown,
  Grid,
  Image,
  Input,
  Note,
  Page,
  Spinner,
  Text,
  useModal,
} from '@geist-ui/core'
import { Search, Settings } from '@geist-ui/icons'

import {
  ErrNoVaultAuth,
  client,
  UnencryptedCredential,
  StripeBillingPortalResponse,
} from '../../service/client'
import Credentials from './credentials'
import Add from './add'
import Import from './import'
import ChangePassword from './change_password'

const Vault: NextPage = () => {
  const [filter, setFilter] = useState('')
  const {
    visible: importVisible,
    setVisible: setImportVisible,
    bindings: importBindings,
  } = useModal()
  const {
    visible: changePassVisible,
    setVisible: setChangePassVisible,
    bindings: changePassBindings,
  } = useModal()

  const { data, error } = useSWR<UnencryptedCredential[], Error>(
    '/credentials',
    client.getDecryptedCredentials,
  )

  const { data: billingResp, error: billingPortalErr } = useSWR<
    StripeBillingPortalResponse,
    Error
  >('/billing', client.billingPortal)

  useEffect(() => {
    client.load().catch((err: any) => {
      if (err === ErrNoVaultAuth) {
        router.push('/login')
      } else {
        // TODO: display this
        console.log(err)
      }
    })
  }, [])

  return (
    <div>
      <Head>
        <title>vault | nlogin</title>
        <meta name="description" content="secure secret vault" />
      </Head>
      <Page width="800px" padding={0}>
        <Grid.Container justify="center">
          {data === undefined ? (
            <Grid xs={20} justify="center">
              <Spinner />
            </Grid>
          ) : (
            <>
              <Grid.Container justify="center">
                <Grid xs={20}>
                  <Image
                    src="/lock/lock-15.svg"
                    alt="nlogin lock"
                    draggable={false}
                    mx={0}
                    mt={0.6}
                  />
                  <NextLink href="/" style={{ cursor: 'pointer' }}>
                    <Text h3>
                      <a className="no-highlight">ηlogin</a>
                    </Text>
                  </NextLink>
                  <Grid.Container justify="flex-end">
                    <Grid mb={0.5}>
                      <ButtonDropdown>
                        <ButtonDropdown.Item main>
                          <Settings size={14} />
                          &nbsp;Settings
                        </ButtonDropdown.Item>
                        <ButtonDropdown.Item
                          onClick={() => {
                            setImportVisible(true)
                          }}>
                          Import
                        </ButtonDropdown.Item>
                        <ButtonDropdown.Item
                          onClick={() => {
                            setChangePassVisible(true)
                          }}>
                          Change Account Password
                        </ButtonDropdown.Item>
                        {billingResp !== undefined && (
                          <ButtonDropdown.Item>
                            <a
                              href={billingResp.billing_portal}
                              style={{ color: '#888' }}>
                              Manage Billing
                            </a>
                          </ButtonDropdown.Item>
                        )}
                      </ButtonDropdown>
                    </Grid>
                  </Grid.Container>
                </Grid>
                {error !== undefined && (
                  <Grid xs={20} sm={20} justify="center" marginBottom={0.5}>
                    <Note type="error" label="error" width="100%" filled>
                      {error.message}
                    </Note>
                  </Grid>
                )}
              </Grid.Container>
              <Grid xs={20} sm={20} justify="center">
                <Input
                  clearable
                  placeholder="search"
                  width="100%"
                  icon={<Search />}
                  onChange={e => {
                    setFilter(e.target.value)
                  }}
                />
              </Grid>
              <Grid xs={20} sm={20} justify="center">
                <Add />
                <Import
                  visible={importVisible}
                  setVisible={setImportVisible}
                  bindings={importBindings}
                />
                <ChangePassword
                  visible={changePassVisible}
                  setVisible={setChangePassVisible}
                  bindings={changePassBindings}
                />
              </Grid>
              <Credentials creds={data} filter={filter} />
            </>
          )}
        </Grid.Container>
      </Page>
    </div>
  )
}

export default Vault
