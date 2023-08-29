import { ErrNoVaultAuth } from './client'
import { cryptoSvc } from './crypto'

export interface RegistrationResponse {
  id: number
  email: string
  encryptedDataKey: string
  wantEmailUpdates: boolean
}

export interface LoginResponse {
  bearer: string
  expires: string
  encryptedDataKey: string
}

export class Account {
  localKey: CryptoKey | undefined // used for login and data key decryption
  dataKey: CryptoKey | undefined // used to encrypt and decrypt data
  auth = '' // the auth token, gets sent in a cookie also
  mainEmail = '' // the user's main email

  // register a new account by creating its local key and data key
  async register(password: string, email: string, wantEmailUpdates: boolean) {
    /*
            create the local main key which will remain client-side only
            this "local key" has two uses:
                - to decrypt the symmetic data encryption key which is stored encrypted on the server
                - it's hash is presented for authentication to create a session with the server
        */
    this.localKey = await cryptoSvc.derivePBKDFKey(password, email) // SHA-512 PBKDF2 key

    // hash the local key, this will be used like a password for authentication
    const b64LocalKey = await cryptoSvc.keyToBase64String(this.localKey)
    const hashedLocalKey = await cryptoSvc.hash(b64LocalKey, password)

    // create the data key which will be used to encrypt secrets
    const dataKey = await cryptoSvc.createSymmetricKey() // 64 crypto random bytes for encrypting secret data
    const b64DataKey = await cryptoSvc.keyToBase64String(dataKey)

    // encryptedDataKey will be stored on the server, it will be decrypted after login so that secrets can be read
    const encryptedDataKey = await cryptoSvc.aesEncrypt(this.localKey, b64DataKey)

    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/account', {
        method: 'POST',
        body: JSON.stringify({
          email,
          hashedLocalKey,
          encryptedDataKey,
          wantEmailUpdates,
        }),
      })

      if (!resp.ok) {
        throw await resp.json()
      }
      await resp.json()
    } catch (e: any) {
      console.log('failed to register: ' + e)
      throw e
    }
  }

  // login derives a private key from the presented information and authenticates the user
  async login(password: string, email: string) {
    this.localKey = await cryptoSvc.derivePBKDFKey(password, email) // SHA-512 PBKDF2 key
    const b64LocalKey = await cryptoSvc.keyToBase64String(this.localKey)
    const hashedLocalKey = await cryptoSvc.hash(b64LocalKey, password)

    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          hashedLocalKey,
        }),
      })

      if (!resp.ok) {
        throw await resp.json()
      }

      let session = (await resp.json()) as LoginResponse
      this.auth = session.bearer
      this.mainEmail = email
      let decrypted = await cryptoSvc.aesDecrypt(this.localKey, session.encryptedDataKey)
      this.dataKey = await cryptoSvc.base64StringToKey(decrypted)
    } catch (e: any) {
      console.log('failed to login: ' + e)
      throw e
    }
  }

  // change the password on the currently logged in account and re-encrypt the data key
  async changePassword(currentPassword: string, newPassword: string) {
    if (
      this.mainEmail === '' ||
      this.localKey === undefined ||
      this.dataKey === undefined
    ) {
      throw ErrNoVaultAuth
    }

    const b64LocalKey = await cryptoSvc.keyToBase64String(this.localKey)
    const oldHashedLocalKey = await cryptoSvc.hash(b64LocalKey, currentPassword)

    // create a new local key
    const newLocalKey = await cryptoSvc.derivePBKDFKey(newPassword, this.mainEmail) // SHA-512 PBKDF2 key
    const b64NewLocalKey = await cryptoSvc.keyToBase64String(newLocalKey)
    const newHashedLocalKey = await cryptoSvc.hash(b64NewLocalKey, newPassword)
    // re-encrypt the data key with the new password
    const b64DataKey = await cryptoSvc.keyToBase64String(this.dataKey)
    const encryptedDataKey = await cryptoSvc.aesEncrypt(newLocalKey, b64DataKey)

    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/account', {
        method: 'PUT',
        headers: new Headers({
          Authorization: 'Bearer ' + this.auth,
        }),
        body: JSON.stringify({
          email: this.mainEmail,
          oldHashedLocalKey,
          newHashedLocalKey,
          encryptedDataKey,
        }),
      })
      if (!resp.ok) {
        throw await resp.json()
      }
      await resp.json()
    } catch (e: any) {
      console.log('failed to register: ' + e)
      throw e
    }
    this.localKey = newLocalKey
  }

  async confirmEmail(code: string) {
    try {
      let resp = await fetch(process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/confirm', {
        method: 'POST',
        body: JSON.stringify({
          code,
        }),
      })
      if (!resp.ok) {
        throw await resp.json()
      }
    } catch (e: any) {
      console.log('failed to register: ' + e)
      throw e
    }
  }
}

export const accountSvc = new Account()
