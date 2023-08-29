import { expect } from 'chai'
import { AssertionError } from 'assert'

import { cryptoSvc, GeneratePasswordOptions } from './crypto'

const { TextEncoder, TextDecoder } = require('text-encoding')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

describe('Crypto', () => {
  describe('test generatePassword()', () => {
    it('generates a password of specific length', async () => {
      let len = 8
      let opts = new GeneratePasswordOptions(len, true, true, true, true, 0, 0)

      let pass = await cryptoSvc.generatePassword(opts)
      expect(pass.length).to.equal(len)
    })

    it('generates a password with A-Z', async () => {
      let len = 8
      let azUpper = true
      let azLower = false
      let nums = false
      let specials = false
      let minNums = 0
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)
      for (var i = 0; i < pass.length; i++) {
        expect(opts.getCharacterSet()).to.contain(pass.charAt(i))
      }
    })

    it('generates a password with a-z', async () => {
      let len = 8
      let azUpper = false
      let azLower = true
      let nums = false
      let specials = false
      let minNums = 0
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)
      for (var i = 0; i < pass.length; i++) {
        expect(opts.getCharacterSet()).to.contain(pass.charAt(i))
      }
    })

    it('generates a password with nums', async () => {
      let len = 8
      let azUpper = false
      let azLower = false
      let nums = true
      let specials = false
      let minNums = 0
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)
      for (var i = 0; i < pass.length; i++) {
        expect(opts.getCharacterSet()).to.contain(pass.charAt(i))
      }
    })

    it('generates a password with specials', async () => {
      let len = 8
      let azUpper = false
      let azLower = false
      let nums = false
      let specials = true
      let minNums = 0
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)
      for (var i = 0; i < pass.length; i++) {
        expect(opts.getCharacterSet()).to.contain(pass.charAt(i))
      }
    })

    it('generates a password with min nums', async () => {
      let len = 8
      let azUpper = true
      let azLower = true
      let nums = true
      let specials = true
      let minNums = 3
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)

      let passNums = 0
      let numsCharSet = '0123456789'
      for (var i = 0; i < pass.length; i++) {
        if (numsCharSet.includes(pass.charAt(i))) {
          passNums++
        }
      }

      expect(passNums).to.be.above(minNums - 1) // greater than or equal to
    })

    it('generates a password with min special', async () => {
      let len = 8
      let azUpper = true
      let azLower = true
      let nums = true
      let specials = true
      let minNums = 0
      let minSpecial = 3
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)

      let passSpecials = 0
      let specialCharSet = '!@#$%^&*'
      for (var i = 0; i < pass.length; i++) {
        if (specialCharSet.includes(pass.charAt(i))) {
          passSpecials++
        }
      }

      expect(passSpecials).to.be.above(minSpecial - 1) // greater than or equal to
    })

    it('generates a password with min nums', async () => {
      let len = 8
      let azUpper = true
      let azLower = true
      let nums = true
      let specials = true
      let minNums = 3
      let minSpecial = 0
      let opts = new GeneratePasswordOptions(
        len,
        azUpper,
        azLower,
        nums,
        specials,
        minNums,
        minSpecial,
      )

      let pass = await cryptoSvc.generatePassword(opts)

      let passNums = 0
      let numsCharSet = '0123456789'
      for (var i = 0; i < pass.length; i++) {
        if (numsCharSet.includes(pass.charAt(i))) {
          passNums++
        }
      }

      expect(passNums).to.be.above(minNums - 1) // greater than or equal to
    })

    it('min nums and min special must be less than total length', async () => {
      let len = 8
      let azUpper = true
      let azLower = true
      let nums = true
      let specials = true
      let minNums = 5
      let minSpecial = 4

      try {
        let opts = new GeneratePasswordOptions(
          len,
          azUpper,
          azLower,
          nums,
          specials,
          minNums,
          minSpecial,
        )

        await cryptoSvc.generatePassword(opts)
      } catch (err: any) {
        expect(err.toString()).to.contain('length less than minimum numbers and specials')
        return
      }

      fail(
        'should not be able to generate password with more nums and specials than length',
      )
    })

    it('requires a character set', async () => {
      let len = 8
      let azUpper = false
      let azLower = false
      let nums = false
      let specials = false
      let minNums = 3
      let minSpecial = 0

      try {
        const gen = new GeneratePasswordOptions(
          len,
          azUpper,
          azLower,
          nums,
          specials,
          minNums,
          minSpecial,
        )

        gen.getCharacterSet()
      } catch (err: any) {
        expect(err.toString()).to.contain('password character set cannot be empty')
        return
      }

      fail('should not be able to generate password with no character set')
    })
  })
})
