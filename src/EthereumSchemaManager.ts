import {
  Contract,
  ContractTransactionReceipt,
  JsonRpcProvider,
  Wallet,
} from 'ethers'
import abi from './abi/SchemaRegistry.json'

export class EthereumSchemaManager {
  private schemaRegistryContract: Contract

  constructor(
    schemaRegistryContractAddress: string,
    rpcUrl: string,
    signingKey: string,
  ) {
    const provider = new JsonRpcProvider(rpcUrl)
    const wallet = new Wallet(signingKey, provider)
    this.schemaRegistryContract = new Contract(
      schemaRegistryContractAddress,
      abi,
      wallet,
    )
  }

  async createSchema(
    schemaId: string,
    json: string,
  ): Promise<ContractTransactionReceipt> {
    try {
      const schemaTxn = await this.schemaRegistryContract.createSchema(
        schemaId,
        json,
      )
      const schemaTxnReceipt = await schemaTxn.wait()

      if (!schemaTxnReceipt) {
        throw new Error('Transaction dropped or not mined.')
      }

      if (schemaTxnReceipt.status !== 1) {
        throw new Error(
          `Transaction failed. Receipt status: ${schemaTxnReceipt.status}`,
        )
      }
      return schemaTxnReceipt
    } catch (error: any) {
      if (error.code === 'CALL_EXCEPTION') {
        throw new Error(
          `Smart contract call failed: ${error.reason ?? error.message}`,
        )
      }

      if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error occurred while sending the transaction.')
      }

      throw new Error(`createSchema failed: ${error.message}`)
    }
  }

  async adminCreateSchema(
    address: string,
    schemaId: string,
    json: string,
  ): Promise<ContractTransactionReceipt> {
    try {
      const schemaTxn = await this.schemaRegistryContract.adminCreateSchema(
        address,
        schemaId,
        json,
      )
      const schemaTxnReceipt = await schemaTxn.wait()
      if (!schemaTxnReceipt) {
        throw new Error('Transaction dropped or not mined.')
      }

      if (schemaTxnReceipt.status !== 1) {
        throw new Error(
          `Transaction failed. Receipt status: ${schemaTxnReceipt.status}`,
        )
      }
      return schemaTxnReceipt
    } catch (error: any) {
      if (error.code === 'CALL_EXCEPTION') {
        throw new Error(
          `Smart contract call failed: ${error.reason ?? error.message}`,
        )
      }

      if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error occurred while sending the transaction.')
      }

      throw new Error(`adminCreateSchema failed: ${error.message}`)
    }
  }

  async getSchema(address: string, schemaId: string): Promise<string> {
    try {
      const schema = await this.schemaRegistryContract.schemas(
        address,
        schemaId,
      )
      if (!schema) {
        throw new Error('Schema not found or returned invalid data.')
      }
      return schema
    } catch (error: any) {
      if (error.code === 'CALL_EXCEPTION') {
        throw new Error(
          `Smart contract read failed: ${error.reason ?? error.message}`,
        )
      }

      throw new Error(`getSchema failed: ${error.message}`)
    }
  }

  async getOwner(): Promise<string> {
    return await this.schemaRegistryContract.owner()
  }
}
