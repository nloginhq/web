import { useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Card, Page, Image, Text, Button, Grid, useTheme } from '@geist-ui/core'
import {
  Bookmark,
  Briefcase,
  Code,
  Github,
  Mail,
  Shield,
  Twitter,
  Unlock,
} from '@geist-ui/icons'
import { useSpring, animated } from 'react-spring'

export default function Home() {
  const theme = useTheme()

  const [email, setEmail] = useState('')
  const [buttonContent, setButtonContent] = useState<React.ReactNode>('get updates')

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 500 },
  })

  return (
    <div>
      <Head>
        <title>nlogin</title>
        <meta name="description" content="Synchronized password management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page width="1200px" pt={0}>
        <Page.Header>
          <Grid.Container justify="center" gap={3}>
            <Grid xs={20} sm={7} justify="center">
              <Image
                src="/lock/lock-30.svg"
                alt="nlogin lock"
                draggable={false}
                mx={0}
                mt={1.5}
              />
              <Text h1>ηlogin</Text>
            </Grid>
            <Grid xs={0} sm={3} />
            <Grid xs={20} sm={7} justify="center">
              <NextLink href="vault">
                <Button shadow type="success" icon={<Unlock />} width="100%" mt={1}>
                  Access My Vault
                </Button>
              </NextLink>
            </Grid>
          </Grid.Container>
        </Page.Header>

        <animated.div style={fadeIn}>
          <Grid.Container justify="center" gap={1}>
            <Grid xs={24} sm={24} justify="center">
              <Card type="secondary" width="100%">
                <Text h2 style={{ textAlign: 'center' }}>
                  Synchronized password management.
                </Text>
                <Image.Browser url="https://nlogin.me" invert>
                  <Image
                    width="100%"
                    height="300px"
                    src="/vault-screenshot.png"
                    alt="screenshot of nlogin vault"
                  />
                </Image.Browser>
              </Card>
            </Grid>
            <Grid.Container xs={24} my={0.25} justify="center">
              <Grid xs={24} sm={8} paddingRight={1} className="info-card">
                <Card type="secondary">
                  <Text h3 style={{ textAlign: 'center' }}>
                    Import your existing passwords from other tools
                  </Text>
                  <Grid.Container justify="center">
                    <Briefcase size={48} />
                  </Grid.Container>
                </Card>
              </Grid>
              <Grid xs={24} sm={7.8} className="info-card">
                <Card type="secondary">
                  <Text h3 style={{ textAlign: 'center' }}>
                    Audited, free, and open source code base.
                  </Text>
                  <Grid.Container justify="center">
                    <Code size={48} />
                  </Grid.Container>
                </Card>
              </Grid>
              <Grid xs={24} sm={8} paddingLeft={1} className="info-card">
                <Card type="secondary">
                  <Text h3 style={{ textAlign: 'center' }}>
                    Passwords never leave your device unencrypted
                  </Text>
                  <Grid.Container justify="center">
                    <Shield size={48} />
                  </Grid.Container>
                </Card>
              </Grid>
            </Grid.Container>
            <Grid xs={24} sm={24} justify="center">
              <a href="https://nlogin.substack.com/" className="no-highlight">
                <Bookmark size={38} />
              </a>
              <a href="https://github.com/nloginhq" className="no-highlight">
                <Github size={38} />
              </a>
              <a href="mailto:contact@nlogin.me" className="no-highlight">
                <Mail size={38} />
              </a>
            </Grid>
          </Grid.Container>
        </animated.div>
      </Page>
    </div>
  )
}
