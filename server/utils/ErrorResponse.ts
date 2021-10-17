class ErrorResponse extends Error {
  public statusCode: number | undefined

  constructor(message?: string | undefined, statusCode?: number | undefined) {
    super(message)
    this.statusCode = statusCode
  }
}

export default ErrorResponse