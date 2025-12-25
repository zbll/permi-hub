export default {
  "validator.required": "{{field}}字段是必填项",
  "validator.type": "{{field}}字段必须是{{type}}类型",
  "validator.type.array": "{{field}}字段必须是数组",
  "validator.number.min": "{{field}}字段必须大于等于{{min}}",
  "validator.number.max": "{{field}}字段必须小于等于{{max}}",
  "validator.number.minMax":
    "{{field}}字段必须大于等于{{min}}且小于等于{{max}}",
  "validator.string.minLength": "{{field}}字段长度必须至少{{min}}个字符",
  "validator.string.maxLength": "{{field}}字段长度必须最多{{max}}个字符",
  "validator.string.minMaxLength":
    "{{field}}字段长度必须在{{min}}到{{max}}个字符之间",
  "token.invalid": "无效的令牌",
  "permission.invalid": "权限不足，需要{{permissions}}",
  "user.register.field.empty": "昵称、邮箱和密码必须是字符串",
  "user.login.error": "邮箱或密码错误",
  "user.register.email.exists": "邮箱已存在",
} as const;
