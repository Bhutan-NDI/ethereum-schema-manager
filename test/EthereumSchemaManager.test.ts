import { describe, it, expect, beforeAll } from 'vitest'
import { ContractTransactionReceipt, ethers } from 'ethers'
import { v4 as uuidv4 } from 'uuid'

import { EthereumSchemaManager } from '../src/EthereumSchemaManager'
import {
  ethSchemaManagerAdminConfig,
  ethSchemaManagerClientConfig,
  testSchemaSample,
} from './test.data'
import {
  ContractError,
  ValidationError,
} from '../src/types/EthereumSchemaManager.types'

let schemaJSON: string
let provider: ethers.JsonRpcProvider
let wallet: ethers.Wallet

describe('Client Schema Management:', () => {
  let client: EthereumSchemaManager
  let testSchemaId: string
  beforeAll(async () => {
    schemaJSON = JSON.stringify(testSchemaSample)
    client = new EthereumSchemaManager(ethSchemaManagerClientConfig)
    testSchemaId = uuidv4()
    provider = new ethers.JsonRpcProvider(ethSchemaManagerClientConfig.rpcUrl)

    if (ethSchemaManagerClientConfig.privateKey) {
      wallet = new ethers.Wallet(
        ethSchemaManagerClientConfig.privateKey,
        provider,
      )
    }
  })
  it('client should successfully create a new schema', async () => {
    const tx = await client.createSchema(testSchemaId, schemaJSON)
    expectValidTransactionReceipt(tx, 1)
  })

  it('should throw ValidationError for invalid schema ID', async () => {
    await expect(client.createSchema('', schemaJSON)).rejects.toThrow(
      ValidationError,
    )
  })

  it('should throw ValidationError for invalid JSON', async () => {
    const newSchemaId = uuidv4()
    await expect(
      client.createSchema(newSchemaId, 'invalid-json'),
    ).rejects.toThrow(ValidationError)
  })

  it('should throw ContractError when schema already exists', async () => {
    await expect(client.createSchema(testSchemaId, schemaJSON)).rejects.toThrow(
      ContractError,
    )
  })

  it('should retrieve the schema by id', async () => {
    const retrieved = await client.getSchema(wallet.address, testSchemaId)
    expect(retrieved).toBe(schemaJSON)
  })

  it('should return null when schema does not exist', async () => {
    const newSchemaId = uuidv4()
    const result = await client.getSchema(wallet.address, newSchemaId)
    expect(result).toBeNull()
  })

  it('should throw ValidationError for invalid address', async () => {
    await expect(
      client.getSchema('invalid-address', testSchemaId),
    ).rejects.toThrow(ValidationError)
  })

  it('should throw ValidationError for empty schema ID', async () => {
    await expect(client.getSchema(wallet.address, '')).rejects.toThrow(
      ValidationError,
    )
  })

  it('should throw ContractError when not owner', async () => {
    const newSchemaId = uuidv4()
    await expect(
      client.adminCreateSchema(wallet.address, newSchemaId, schemaJSON),
    ).rejects.toThrow(ContractError)
  })
})

describe('Admin Schema Management:', () => {
  let admin: EthereumSchemaManager
  let testSchemaId: string
  const otherWallet = ethers.Wallet.createRandom().connect(provider)

  beforeAll(async () => {
    schemaJSON = JSON.stringify(testSchemaSample)
    admin = new EthereumSchemaManager(ethSchemaManagerAdminConfig)
    testSchemaId = uuidv4()
    provider = new ethers.JsonRpcProvider(ethSchemaManagerAdminConfig.rpcUrl)
    if (ethSchemaManagerAdminConfig.privateKey) {
      wallet = new ethers.Wallet(
        ethSchemaManagerAdminConfig.privateKey,
        provider,
      )
    }
  })

  it('should allow admin to create schema for other addresses', async () => {
    const tx = await admin.adminCreateSchema(
      otherWallet.address,
      testSchemaId,
      schemaJSON,
    )
    expectValidTransactionReceipt(tx, 1)
  })

  it('should allow admin to retrieve the schema by id for other address', async () => {
    const retrieved = await admin.getSchema(otherWallet.address, testSchemaId)
    expect(retrieved).toBe(schemaJSON)
  })

  it('should throw ContractError when schema already exists for the address', async () => {
    await expect(
      admin.adminCreateSchema(otherWallet.address, testSchemaId, schemaJSON),
    ).rejects.toThrow(ContractError)
  })

  it('should throw ValidationError for invalid target address', async () => {
    const newSchemaId = uuidv4()
    await expect(
      admin.adminCreateSchema('invalid-address', newSchemaId, schemaJSON),
    ).rejects.toThrow(ValidationError)
  })

  // it('should transfer ownership successfully', async () => {
  //     const newOwner = '0x4444444444444444444444444444444444444444';
  //     const result = await admin.transferOwnership(newOwner);

  //     expectValidTransactionReceipt(result, 1);
  //   });

  it('should throw ValidationError for invalid new owner address', async () => {
    await expect(admin.transferOwnership('invalid-address')).rejects.toThrow(
      ValidationError,
    )
  })

  it('should return contract owner address', async () => {
    const owner = await admin.getOwner()
    expect(owner).toBe(wallet.address)
  })
})

const expectValidTransactionReceipt = (
  receipt: ContractTransactionReceipt,
  expectedStatus: number = 1,
) => {
  // Core TransactionReceipt properties
  expect(receipt).toEqual(
    expect.objectContaining({
      hash: expect.any(String),
      blockNumber: expect.any(Number),
      blockHash: expect.any(String),
      gasUsed: expect.any(BigInt),
      gasPrice: expect.any(BigInt),
      status: expectedStatus,
    }),
  )
}
