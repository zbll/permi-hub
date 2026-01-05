export default {
  "validator.required": "The {{field}} field is required",
  "validator.type": "The {{field}} field must be of type {{type}}",
  "validator.type.array": "The {{field}} field must be an array",
  "validator.number.min":
    "The {{field}} field must be greater than or equal to {{min}}",
  "validator.number.max":
    "The {{field}} field must be less than or equal to {{max}}",
  "validator.number.minMax":
    "The {{field}} field must be greater than or equal to {{min}} and less than or equal to {{max}}",
  "validator.string.minLength":
    "The {{field}} field must be at least {{min}} characters long",
  "validator.string.maxLength":
    "The {{field}} field must be at most {{max}} characters long",
  "validator.string.minMaxLength":
    "The {{field}} field must be between {{min}} and {{max}} characters long",
  "token.invalid": "Invalid token",
  "token.ip.exception": "Address exception",
  "permission.invalid": "Insufficient permissions, Required: {{permissions}}",
  "user.register.field.empty": "Nickname, email, and password must be strings",
  "user.login.error": "Email or password is incorrect",
  "user.register.email.exists": "Email already exists",
  "user.register.mail.invalid": "Invalid email format",
  "user.register.mail.send.frequent":
    "Send email verification code too frequently",
  "user.register.mail.send.failed": "Failed to send email verification code",
  "user.register.code.invalid": "Email verification code is invalid",
  "user.register.code.find.failed": "Failed to find email verification code",
  "user.register.code.not.found": "Email verification code not found",
  "user.register.code.expired": "Email verification code expired",
  "log.view.field.id.empty": "Log ID is required",
  "log.view.error.not.exists": "Log not exists",
  "role.add.error.permission.not.exists": "Permission not exists",
  "role.add.error": "Add role failed",
  "role.get.error.not.exists": "Role not exists",
  "role.delete.error.not.exists": "Role not exists",
  "role.edit.error.permission.not.exists": "Permission not exists",
  "role.edit.error.permission.delete.error": "Delete permission failed",
  "role.edit.error.permission.create.error": "Create permission failed",
  "role.edit.error.not.exists": "Role not exists",
  "role.edit.error": "Edit role failed",
  "permission.get.error": "Get permission failed",
  "role.list.error": "Get role list failed",
  "template.mail.code.title": "Email Verification Code",
  "mail.code.subject": "Email Verification Code",
  "mail.code.content": "Your email verification code is {{code}}",
  "mail.sendCode.failed": "Failed to send email verification code",
} as const;
