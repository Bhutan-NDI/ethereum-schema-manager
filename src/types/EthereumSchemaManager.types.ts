export interface SchemaManagerConfig {
  contractAddress: string
  rpcUrl: string
  privateKey: string
}

// Custom error classes
export class SchemaRegistryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'SchemaRegistryError'
  }
}

export class ContractError extends SchemaRegistryError {
  constructor(
    message: string,
    public revertReason?: string,
    originalError?: Error,
  ) {
    super(message, 'CONTRACT_ERROR', originalError)
    this.name = 'ContractError'
  }
}

export class NetworkError extends SchemaRegistryError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', originalError)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends SchemaRegistryError {
  constructor(message: string, originalError?: Error) {
    super(message, 'VALIDATION_ERROR', originalError)
    this.name = 'ValidationError'
  }
}
