import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Page, Text } from '@geist-ui/core'

const Privacy: NextPage = props => {
  return (
    <div>
      <Head>
        <title>terms | nlogin</title>
        <meta name="description" content="terms and conditions for nlogin" />
      </Head>
      <Page width="800px" pt={0}>
        <NextLink href="/" style={{ cursor: 'pointer' }}>
          <Text h1>
            <a className="no-highlight">ηlogin</a>
          </Text>
        </NextLink>
        <div>
          <p>Effective Date: April 26, 2023</p>
          <p>
            nlogin (&#39;we,&#39; &#39;us,&#39; or &#39;our&#39;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, and
            disclose your information when you access or use the nLogin Service
            (&#39;Service&#39;). By using the Service, you agree to the collection and use
            of information in accordance with this Privacy Policy.
          </p>

          <p>1. Information We Collect</p>

          <p>
            a. Personal Information
            <br />
            When you create an account, we may collect personally identifiable
            information, such as your name, email address, and location. We use this
            information to provide the Service and communicate with you.
          </p>

          <p>
            b. Usage Data
            <br />
            We may collect non-personally identifiable information about how you access
            and use the Service, such as your IP address, browser type, device type,
            operating system, and the pages you visit within the Service.
          </p>

          <p>
            c. Cookies
            <br />
            We use cookies and similar tracking technologies to enhance your user
            experience and analyze usage data. You can control cookies through your
            browser settings, but please note that disabling cookies may affect the
            functionality of the Service.
          </p>

          <p>2. How We Use Your Information</p>

          <p>We use the information we collect for various purposes, including to:</p>

          <p>
            a. Provide, maintain, and improve the Service;
            <br />
            b. Communicate with you, including responding to your inquiries and providing
            updates on the Service;
            <br />
            c. Personalize your user experience;
            <br />
            d. Monitor and analyze usage and trends;
            <br />
            e. Enhance the security and integrity of the Service;
            <br />
            f. Comply with legal obligations.
          </p>

          <p>3. Information Sharing and Disclosure</p>

          <p>We may share your information in the following circumstances:</p>

          <p>
            a. Service Providers: We may share your information with third-party service
            providers that perform services on our behalf, such as hosting, analytics, and
            customer support.
            <br />
            b. Legal Compliance: We may disclose your information if required to do so by
            law or in response to legal requests, such as a court order or subpoena.
            <br />
            c. Business Transfers: If we are involved in a merger, acquisition, or sale of
            assets, your information may be transferred as part of that transaction.
          </p>

          <p>4. Data Security</p>

          <p>
            We implement reasonable security measures to protect your information from
            unauthorized access, use, or disclosure. However, no method of transmission or
            storage is completely secure, and we cannot guarantee the absolute security of
            your information.
          </p>

          <p>5. Data Retention</p>

          <p>
            We will retain your information for as long as necessary to provide the
            Service, comply with legal obligations, resolve disputes, and enforce our
            agreements.
          </p>

          <p>6. International Data Transfers</p>

          <p>
            Your information may be transferred to and processed in countries other than
            the one in which you reside. By using the Service, you consent to the transfer
            of your information to countries outside your country of residence, which may
            have different data protection laws.
          </p>

          <p>7. Children&#39;s Privacy</p>

          <p>
            The Service is not intended for use by children under the age of 18. We do not
            knowingly collect personal information from children under 18. If we become
            aware that a child under 18 has provided us with personal information, we will
            take steps to delete that information.
          </p>

          <p>8. Your Rights</p>

          <p>
            You may have certain rights under applicable data protection laws, including
            the right to access, correct, or delete your personal information. To exercise
            these rights, please contact us using the contact information provided below.
          </p>

          <p>9. Changes to This Privacy Policy</p>

          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page. You are advised to
            review this Privacy Policy periodically for any changes. Your continued use of
            the Service after the changes are posted constitutes your acceptance of the
            updated Privacy Policy.
          </p>
          <p>10. Contact Us</p>
          <p>
            If you have any questions or concerns about this Privacy Policy, please
            contact us at:
          </p>
          <p>contact@nlogin.me</p>
        </div>
      </Page>
    </div>
  )
}

export default Privacy
