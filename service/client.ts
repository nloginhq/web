import { accountSvc } from './account'
import { cryptoSvc } from './crypto'

export const ErrNoVaultAuth = 'not logged in'

export interface Email {
  email: string
  status: string
}

export interface UnencryptedCredential {
  id: number
  username: string
  email: string
  emailStatus: string // ignored in cred creation, read from API
  password: string
  uri: string
}

interface CreateCredentialRequest {
  encryptedName: string
  encryptedUsername: string
  email: string
  encryptedPassword: string
  encryptedUri: string
}

interface UpdateCredentialRequest {
  encryptedName: string
  encryptedUsername: string
  encryptedPassword: string
  encryptedUri: string
}

export interface Credential {
  id: number
  accountID: number
  encryptedName: string
  encryptedUsername: string
  email: string
  emailStatus: string
  encryptedPassword: string
  encryptedUri: string
}

interface StripeSessionResponse {
  session_id: string
}

export interface StripeBillingPortalResponse {
  billing_portal: string
}

export interface SessionChallengeRequest {
  accountID: number
  email: string
  signature: any
  publicKey: any
}

export class Client {
  // load gets encrypted credentials from the server and decrypts them using the local key
  async load() {
    if (accountSvc.dataKey === undefined) {
      throw ErrNoVaultAuth
    }
  }

  // generate and reserve a forwarding email address
  async generateEmail(): Promise<Email> {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/emails', {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
      })

      if (!resp.ok) {
        throw await resp.json()
      }

      return (await resp.json()) as Email
    } catch (e: any) {
      console.log('failed to generate email: ' + e)
      throw e
    }
  }

  // setEmailStatus changes email forwarding rules to active or inactive
  async setEmailStatus(email: string, status: string) {
    try {
      const req: Email = {
        email: email,
        status: status,
      }

      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/emails/status', {
        method: 'PUT',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
        body: JSON.stringify(req),
      })

      if (!resp.ok) {
        throw await resp.json()
      }
    } catch (e: any) {
      console.log('failed to set email status: ' + e)
      throw e
    }
  }

  // releaseEmail deletes a reserved email address that was previously generated
  async releaseEmail(email: string) {
    try {
      let resp = await fetch(
        process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/emails?email=' + email,
        {
          method: 'DELETE',
          headers: new Headers({
            Authorization: 'Bearer ' + accountSvc.auth,
          }),
        },
      )

      if (!resp.ok) {
        throw await resp.json()
      }
    } catch (e: any) {
      console.log('failed to release email: ' + e)
      throw e
    }
  }

  // addCredential persists the encrypted credential on the back-end
  async addCredential(cred: UnencryptedCredential): Promise<Credential> {
    if (accountSvc.dataKey === undefined) {
      throw ErrNoVaultAuth
    }

    // convert the credential to the request format by encrypting the sensitive info
    const encryptedUri = await cryptoSvc.aesEncrypt(accountSvc.dataKey, cred.uri)
    const encryptedUsername = await cryptoSvc.aesEncrypt(
      accountSvc.dataKey,
      cred.username,
    )
    const encryptedPassword = await cryptoSvc.aesEncrypt(
      accountSvc.dataKey,
      cred.password,
    )

    const req: CreateCredentialRequest = {
      encryptedName: encryptedUri,
      encryptedUsername: encryptedUsername,
      email: cred.email,
      encryptedPassword: encryptedPassword,
      encryptedUri: encryptedUri,
    }

    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/credentials', {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
        body: JSON.stringify(req),
      })

      if (!resp.ok) {
        throw await resp.json()
      }

      return (await resp.json()) as Credential
    } catch (e: any) {
      console.log('failed to save credential: ' + e)
      throw e
    }
  }

  // listCredentials gets the encrypted credentials for this account
  async listCredentials(): Promise<Credential[]> {
    if (accountSvc.dataKey === undefined) {
      throw ErrNoVaultAuth
    }

    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/credentials', {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
      })

      if (!resp.ok) {
        throw await resp.json()
      }

      return (await resp.json()) as Credential[]
    } catch (e: any) {
      console.log('failed to list credentials: ' + e)
      throw e
    }
  }

  // getDecryptedCredentials gets the credentials from the server for the authenticated account,
  // and decrypts their passwords using the local key before returning them
  async getDecryptedCredentials(): Promise<UnencryptedCredential[]> {
    if (accountSvc.dataKey === undefined) {
      throw ErrNoVaultAuth
    }
    let creds = await client.listCredentials()
    let decryptedCreds: UnencryptedCredential[] = []
    for (const cred of creds) {
      let username = cred.encryptedUsername
      let password = cred.encryptedPassword
      let uri = cred.encryptedUri
      try {
        username = await cryptoSvc.aesDecrypt(accountSvc.dataKey, cred.encryptedUsername)
        password = await cryptoSvc.aesDecrypt(accountSvc.dataKey, cred.encryptedPassword)
        uri = await cryptoSvc.aesDecrypt(accountSvc.dataKey, cred.encryptedUri)
      } catch (e) {
        // log the problem but continue
        console.log(e)
        // TODO: display this issue
      }
      decryptedCreds.push({
        id: cred.id,
        username,
        email: cred.email,
        emailStatus: cred.emailStatus,
        password,
        uri,
      })
    }
    return decryptedCreds
  }

  // updateCredential persists changes to an existing credential on the back-end
  async updateCredential(cred: UnencryptedCredential) {
    if (accountSvc.dataKey === undefined) {
      throw ErrNoVaultAuth
    }

    // convert the credential to the request format by encrypting the password
    const encryptedUri = await cryptoSvc.aesEncrypt(accountSvc.dataKey, cred.uri)
    const encryptedUsername = await cryptoSvc.aesEncrypt(
      accountSvc.dataKey,
      cred.username,
    )
    const encryptedPassword = await cryptoSvc.aesEncrypt(
      accountSvc.dataKey,
      cred.password,
    )

    const req: UpdateCredentialRequest = {
      encryptedName: encryptedUri,
      encryptedUsername: encryptedUsername,
      encryptedPassword: encryptedPassword,
      encryptedUri: encryptedUri,
    }

    try {
      const path = '/credentials/' + cred.id.toString()
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + path, {
        method: 'PUT',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
        body: JSON.stringify(req),
      })

      if (!resp.ok) {
        throw await resp.json()
      }
    } catch (e: any) {
      console.log('failed to update credential: ' + e)
      throw e
    }
  }

  // deleteCredential persists changes to an existing credential on the back-end
  async deleteCredential(cred: UnencryptedCredential) {
    if (accountSvc.auth === undefined) {
      throw ErrNoVaultAuth
    }

    try {
      const path = '/credentials/' + cred.id.toString()
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + path, {
        method: 'DELETE',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
      })

      if (!resp.ok) {
        throw await resp.json()
      }
    } catch (e: any) {
      console.log('failed to delete credential: ' + e)
      throw e
    }
  }

  // checkout redirects the user to the Stripe checkout page for their session
  async checkout(email: string): Promise<StripeSessionResponse> {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/checkout', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })

      if (!resp.ok) {
        throw await resp
      }
      let session: StripeSessionResponse = await resp.json()
      return session
    } catch (e: any) {
      console.log('failed to checkout: ' + e)
      throw e
    }
  }

  // billingPortal gets the link to the Stripe billing portal for the user
  async billingPortal(): Promise<StripeBillingPortalResponse> {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/billing', {
        method: 'GET',
        headers: new Headers({
          Authorization: 'Bearer ' + accountSvc.auth,
        }),
      })

      if (!resp.ok) {
        throw await resp
      }
      let billing: StripeBillingPortalResponse = await resp.json()
      return billing
    } catch (e: any) {
      console.log('failed to get billing portal: ' + e)
      throw e
    }
  }

  // unsubscribeFromUpdates removes an email to the 'updates' mailing list
  async unsubscribeFromUpdates(email: string) {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })

      if (!resp.ok) {
        throw await resp
      }
      await resp
    } catch (e: any) {
      console.log('failed to unsubscribe from updates: ' + e)
      throw e
    }
  }

  // createStorageKey creates a new encryption key to store the local key encrypted at rest
  async createStorageKey(challenge: string): Promise<string> {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/storageKey', {
        method: 'POST',
        body: JSON.stringify({
          challenge, // TODO: this is not implemented on the server yet
        }),
      })

      if (!resp.ok) {
        throw await resp
      }
      await resp
      return '' // TODO: return the storage key
    } catch (e: any) {
      console.log('failed to unsubscribe from updates: ' + e)
      throw e
    }
  }
}

export const client = new Client()
