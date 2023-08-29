import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { Page, Text } from '@geist-ui/core'

const Terms: NextPage = props => {
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
          <h3>TERMS AND CONDITIONS</h3>
          <p>
            Welcome to nLogin (&#39;Service&#39;). These Terms and Conditions
            (&#39;Terms&#39;) govern your access to and use of the Service, provided by
            nlogin.me (&#39;we,&#39; &#39;us,&#39; or &#39;our&#39;). Please read these
            Terms carefully before using the Service.
          </p>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If
            you do not agree with these Terms, you may not use the Service.
          </p>
          <p>1. Eligibility</p>
          <p>
            To use the Service, you must be at least 18 years old, have the consent of a
            parent or legal guardian, and be a resident of North America. By using the
            Service, you represent that you meet these requirements.
          </p>
          <p>2. Service Description</p>
          <p>
            Our Service provides password management and single-use email creation. Users
            can store, manage, and generate passwords, as well as create disposable email
            addresses for use with various online accounts. However, we cannot guarantee
            the successful delivery of all emails forwarded through our service. We are
            not responsible for email delivery and acknowledge that some email delivery
            may fail.
          </p>
          <p>3. Account Creation and Security</p>
          <p>
            You are responsible for maintaining the confidentiality of your account
            credentials, including your password. You agree to notify us immediately of
            any unauthorized use of your account.
          </p>
          <p>4. License</p>
          <p>
            Subject to your compliance with these Terms, we grant you a limited,
            non-exclusive, non-transferable license to access and use the Service for your
            personal, non-commercial use.
          </p>
          <p>5. User Conduct</p>
          <p>You agree not to use the Service to:</p>
          <p>a. Violate any laws, regulations, or third-party rights;</p>
          <p>
            b. Transmit any harmful or malicious software or engage in any fraudulent
            activity;
          </p>
          <p>c. Attempt to gain unauthorized access to the Service or its systems;</p>
          <p>d. Share your account credentials with others;</p>
          <p>e. Use the Service for any illegal or unauthorized purpose.</p>
          <p>6. Intellectual Property</p>
          <p>
            All content, including but not limited to text, graphics, logos, and software,
            within the Service is the property of nlogin.me or its licensors and is
            protected by copyright and other intellectual property laws.
          </p>
          <p>7. Third-Party Websites</p>
          <p>
            The Service may contain links to third-party websites or services that are not
            owned or controlled by us. We are not responsible for the content, privacy
            practices, or functionality of such websites or services.
          </p>
          <p>8. Termination</p>
          <p>
            We may terminate or suspend your access to the Service at any time, without
            prior notice, for any reason, including but not limited to violation of these
            Terms.
          </p>
          <p>9. Disclaimer of Warranties</p>
          <p>
            The Service is provided on an &#39;as is&#39; basis without warranties of any
            kind, either express or implied, including but not limited to warranties of
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            10. Limitation of Liability In no event shall nlogin be liable for any direct,
            indirect, incidental, special, consequential, or exemplary damages, including
            but not limited to damages for loss of profits, goodwill, or data, resulting
            from your use of the Service.
          </p>
          <p>11. Indemnification</p>
          <p>
            You agree to indemnify, defend, and hold harmless nlogin, its officers,
            directors, employees, and agents from any claims, losses, damages,
            liabilities, or expenses, including reasonable attorney&#39;s fees, arising
            from your use of the Service or violation of these Terms.
          </p>
          <p>
            12. Governing Law These Terms shall be governed by the laws of Canada, without
            regard to its conflict of law provisions. Any disputes arising out of or in
            connection with these Terms or the Service shall be subject to the exclusive
            jurisdiction of the courts of Canada.
          </p>
          <p>13. Changes to Terms</p>
          <p>
            We reserve the right to update or modify these Terms at any time without prior
            notice. Your continued use of the Service constitutes acceptance of the
            revised Terms.
          </p>
          <p>14. Contact Information</p>
          <p>
            If you have any questions or concerns about these Terms or the Service, please
            contact us at contact@nlogin.me.
          </p>
          <p>Effective Date: April 26, 2023</p>
        </div>
      </Page>
    </div>
  )
}

export default Terms
