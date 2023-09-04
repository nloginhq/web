import { useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Card, Page, Image, Text, Button, Grid, useTheme } from '@geist-ui/core'
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Github,
  Filter,
  Mail,
  Shield,
  Twitter,
  Lock,
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
        <meta name="description" content="Single use email and password management" />
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
                  The password manager that keeps your email secret too
                </Text>
                <Grid.Container mt={1} gap={2} justify="center" height="100px">
                  <Grid xs={12} sm={8}>
                    <NextLink href="register">
                      <Button shadow type="secondary-light" width="100%">
                        Register
                      </Button>
                    </NextLink>
                  </Grid>
                  <Grid xs={12} sm={8} justify="flex-end">
                    <NextLink href="about">
                      <Button shadow width="100%">
                        Read the White Paper
                      </Button>
                    </NextLink>
                  </Grid>
                </Grid.Container>
                <Image.Browser url="https://nlogin.me" invert mt={0.5}>
                  <Image
                    width="100%"
                    height="300px"
                    src="/vault-screenshot.png"
                    alt="screenshot of nlogin vault"
                  />
                </Image.Browser>
              </Card>
            </Grid>
            <Grid xs={24} sm={24} justify="center">
              <Card type="secondary" width="100%">
                <Text h2 style={{ textAlign: 'center' }}>
                  Generate a unique email and password for every account
                </Text>
                <div className="diagram">
                  <div>
                    <div className="email-container" style={{ scale: '80%' }}>
                      <div className="creds-container">
                        <div className="icon-container email-icon">
                          <Mail />
                        </div>
                        <div className="icon-container password-icon">
                          <Lock />
                        </div>
                      </div>
                    </div>
                    <div className="email-container" style={{ scale: '80%' }}>
                      <div className="creds-container">
                        <div className="icon-container email-icon">
                          <Mail />
                        </div>
                        <div className="icon-container password-icon">
                          <Lock />
                        </div>
                      </div>
                    </div>
                    <div className="email-container" style={{ scale: '80%' }}>
                      <div className="creds-container">
                        <div className="icon-container email-icon">
                          <Mail />
                        </div>
                        <div className="icon-container password-icon">
                          <Lock />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="arrow-container">
                    <ArrowRight />
                  </div>
                  <div className="email-container">
                    <div className="icon-container email-icon">
                      <Mail />
                    </div>
                    <div className="label" style={{ marginTop: '10px' }}>
                      main
                    </div>
                    <div className="label">email</div>
                  </div>
                </div>
                <Text h3 style={{ textAlign: 'center' }}>
                  Emails are automatically forwarded from nlogin to your real email inbox
                </Text>
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
                    Stop spam emails and find the source
                  </Text>
                  <Grid.Container justify="center">
                    <Filter size={48} />
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
            <Grid.Container mt={0.25} xs={24} justify="center" gap={1}>
              <Grid xs={24}>
                <Card type="secondary" width={'100%'}>
                  <Grid.Container xs={24} justify="center" gap={1}>
                    <Grid
                      xs={24}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      <Text h2 margin={0}>
                        Pricing
                      </Text>
                    </Grid>
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
                          <Text h2 margin={0}>
                            Free
                          </Text>
                          <Text margin={0}>✓ Store encrypted credentials</Text>
                          <Text margin={0}>✓ Import your existing passwords</Text>
                        </Grid>

                        <Grid
                          sm={12}
                          xs={24}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}>
                          <Text h2 margin={0}>
                            $3.00 per month
                          </Text>
                          <Text margin={0}>✓ All features of free accounts</Text>
                          <Text margin={0}>✓ Email relays to your inbox</Text>
                        </Grid>
                      </Grid.Container>
                    </Grid>
                  </Grid.Container>
                </Card>
              </Grid>
            </Grid.Container>
            <Grid xs={24} sm={24} justify="center">
              <Card type="secondary" width="100%">
                <iframe
                  width="100%"
                  height="650"
                  src="https://www.youtube-nocookie.com/embed/evpyyedBUiQ?controls=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </Card>
            </Grid>
            <Grid xs={24} sm={24} justify="center">
              <a href="https://nlogin.substack.com/" className="no-highlight">
                <Bookmark size={38} />
              </a>
              <a href="https://twitter.com/nx_development" className="no-highlight">
                <Twitter size={38} />
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
