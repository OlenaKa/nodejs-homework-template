const HTTP_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}
const MAIL_REG_EX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const PHONE_REX_EX = /(\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/

const SUBSCRIPTION_REG_EX = /^(starter|pro|business)$/

const UPLOAD_DIR = 'tmp'

module.exports = {
  HTTP_CODE,
  MAIL_REG_EX,
  PHONE_REX_EX,
  SUBSCRIPTION_REG_EX,
  UPLOAD_DIR,
}
