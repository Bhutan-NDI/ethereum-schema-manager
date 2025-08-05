import { describe, it, expect, beforeAll } from 'vitest'
import { ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

import { EthereumSchemaManager } from '../src/EthereumSchemaManager'
import {
  privateKey,
  rpcUrl,
  contractAddress,
  testSchemaSample,
} from './test.data'

const provider = new ethers.JsonRpcProvider(rpcUrl)
const wallet = new ethers.Wallet(privateKey, provider)
const schemaJSON = JSON.stringify(testSchemaSample)

let client: EthereumSchemaManager
let testSchemaId: string

describe('EthereumSchemaManager', () => {
  beforeAll(async () => {
    client = new EthereumSchemaManager(contractAddress, rpcUrl, privateKey)
    testSchemaId = uuidv4()
  })

  describe('Client Create Schema', () => {
    it('client should successfully create a new schema', async () => {
      const tx = await client.createSchema(testSchemaId, schemaJSON)
      expect(tx.hash).toBeDefined()
    })

    it('client should fail when trying to create a schema with the same id', async () => {
      await expect(
        client.createSchema(testSchemaId, schemaJSON),
      ).rejects.toThrow(/SCHEMA_EXISTS/)
    })
  })

  describe('Get Schema', () => {
    it('should retrieve the schema by id', async () => {
      const retrieved = await client.getSchema(wallet.address, testSchemaId)
      expect(retrieved).toBe(schemaJSON)
    })

    it('should return empty string for a non-existent schema', async () => {
      const unknownSchemaId = uuidv4()
      const retrieved = await client.getSchema(wallet.address, unknownSchemaId)
      expect(retrieved).toBe('')
    })
  })

  describe('Admin Create Schema', () => {
    const newSchemaId = uuidv4()
    const otherWallet = ethers.Wallet.createRandom().connect(provider)

    it('should allow admin to create schema for other addresses', async () => {
      const tx = await client.adminCreateSchema(
        otherWallet.address,
        newSchemaId,
        schemaJSON,
      )
      expect(tx.hash).toBeDefined()
    })

    it('should fail when trying to create a schema with the same id', async () => {
      await expect(
        client.adminCreateSchema(otherWallet.address, newSchemaId, schemaJSON),
      ).rejects.toThrow(/SCHEMA_EXISTS/)
    })
  })
})
