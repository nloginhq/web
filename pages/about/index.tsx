import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Grid, Image, Page, Text } from '@geist-ui/core'

const About: NextPage = props => {
  return (
    <div>
      <Head>
        <title>about | nlogin</title>
        <meta name="description" content="the nlogin.me whitepaper" />
      </Head>
      <Page width="800px" pt={0}>
        <NextLink href="/" style={{ cursor: 'pointer' }}>
          <Text h1>
            <a className="no-highlight">ηlogin</a>
          </Text>
        </NextLink>
        <div>
          <h1>
            The nlogin.me Password Manager: Secure Authentication and Data Encryption
            Mechanisms
          </h1>
          <Image
            src="/architecture.png"
            alt="nlogin architecture"
            draggable={false}
            mx={0}
            mt={1.5}
          />
          <h2>Overview</h2>
          <p>
            nlogin.me is a password manager that uses cryptographic mechanisms to ensure
            data privacy and security. The service also allows for easily creating
            single-use emails for each account. This overview aims to provide a technical
            perspective on how the system handles user data, focusing on key derivation,
            encryption, authentication, email forwarding, and secure key management.
          </p>

          <h2>Password-Based Key Derivation Function 2 (PBKDF2)</h2>
          <p>
            The PBKDF2 algorithm is employed for deriving a local encryption key from user
            credentials. This function is resistant to brute-force and pre-computation
            attacks due to its adjustable computational cost. SHA-512, a cryptographic
            hash function that produces a 512-bit hash, is used as a part of the PBKDF2
            algorithm. This deterministic function provides high entropy, ensuring that
            any minute change in input results in a significant alteration of the output
            hash.
          </p>

          <h2>Client-Side Local Key Management</h2>
          <p>
            In the nlogin.me system, two keys are primarily used: the Local Key and the
            Data Key. The Local Key is derived using PBKDF2, remains on the client-side,
            and is used for two primary purposes:
          </p>
          <ol>
            <li>
              Decrypting the Data Key, which is stored in an encrypted form on the server.
            </li>
            <li>Authenticating user sessions with the server.</li>
          </ol>
          <p>
            By keeping the Local Key on the client-side, nlogin.me ensures that even if an
            attacker compromises the server-side encrypted Data Key or user data, they
            cannot decrypt it without the Local Key.
          </p>

          <h2>Secure Hashing for Authentication</h2>
          <p>
            The Local Key is hashed, creating a unique hash that is nearly impossible to
            reverse-engineer. This hashed Local Key is sent to the server for user
            authentication, mitigating the risk of password exposure during transmission.
            On the server the hash of the Local Key is hashed again with a salt, which is
            a random, to authenticate the user. This double hashed key is stored on the
            server to authenticate the user during login.
          </p>

          <h2>Data Encryption and Decryption</h2>
          <p>
            The Data Key, encrypted with the Local Key, is stored on the server and used
            to encrypt and decrypt sensitive user data. When the user logs in, the
            encrypted Data Key is decrypted using the Local Key, which then facilitates
            the decryption of user data. The decrypted Data Key is never sent to the
            server.
          </p>

          <h2>Secure Password Change Procedure</h2>
          <p>
            During a password change event, a new Local Key is derived using the new
            password. The Data Key is re-encrypted using this new Local Key. The old and
            new hashed Local Keys, along with the newly encrypted Data Key, are sent to
            the server to update the user credentials.
          </p>

          <h2>Disposable Email Addresses for Enhanced Privacy</h2>
          <p>
            A unique feature of the nlogin.me system is its implementation of disposable
            email addresses. This feature allows users to create temporary, unique email
            addresses that forward messages to their main email account, adding an extra
            layer of privacy to their online activities.
          </p>
          <p>
            The concept of disposable email addresses comes with several benefits for user
            privacy:
          </p>
          <ol>
            <li>
              Anonymity: Disposable email addresses offer a level of anonymity by
              preventing the user&apos;s main email address from being exposed to online
              services. This can mitigate risks associated with sharing personal data,
              such as phishing attacks or data breaches. By using a disposable email
              address, the user&apos;s primary email is hidden from potential malicious
              actors.
            </li>
            <li>
              Spam Reduction: Many online services often resort to sending unsolicited
              emails or sharing user data with third parties for advertising purposes.
              With disposable email addresses, users can control or even halt these
              unwanted emails by simply deactivating the temporary email without affecting
              their main account.
            </li>
            <li>
              Improved Tracking and Management: Disposable email addresses can be uniquely
              assigned to different online services. This enables users to trace the
              source of received emails, making it easier to detect and handle any
              unauthorized sharing of their data. Furthermore, if a specific service
              suffers a data breach, users can immediately identify it and take
              appropriate measures, such as deactivating the compromised email.
            </li>
            <li>
              Secure Email Forwarding: While the disposable email addresses receive
              incoming messages, nlogin.me forwards these to the user&apos;s main email
              address. This is achieved without exposing the main email address to the
              original sender, preserving the user&apos;s privacy.
            </li>
          </ol>
          <p>
            The introduction of disposable email addresses in nlogin.me adds another
            dimension to the platform&apos;s privacy-preserving capabilities. When
            combined with the robust cryptographic procedures for data encryption and
            authentication, nlogin.me provides a comprehensive solution to online privacy
            and security.
          </p>

          <h2>Conclusion</h2>
          <p>
            The nlogin.me service employs a robust combination of cryptographic techniques
            to deliver a secure password management solution. The use of PBKDF2 for key
            derivation, secure hashing for authentication, and local key management
            guarantees the security of user data, both in transmission and at rest.
            Moreover, the additional privacy of disposable emails gives users more control
            over their privacy.
          </p>
        </div>
      </Page>
    </div>
  )
}

export default About
