export default {
  "validator.required": "The {{field}} field is required.",
  "validator.type": "The {{field}} field must be of type {{type}}.",
  "validator.type.array": "The {{field}} field must be an array.",
  "validator.number.min":
    "The {{field}} field must be greater than or equal to {{min}}.",
  "validator.number.max":
    "The {{field}} field must be less than or equal to {{max}}.",
  "validator.number.minMax":
    "The {{field}} field must be greater than or equal to {{min}} and less than or equal to {{max}}.",
  "validator.string.minLength":
    "The {{field}} field must be at least {{min}} characters long.",
  "validator.string.maxLength":
    "The {{field}} field must be at most {{max}} characters long.",
  "validator.string.minMaxLength":
    "The {{field}} field must be between {{min}} and {{max}} characters long.",
  "token.invalid": "Invalid token.",
  "user.register.field.empty": "Nickname, email, and password must be strings.",
  "user.login.error": "Email or password is incorrect.",
  "user.register.email.exists": "Email already exists.",
} as const;
