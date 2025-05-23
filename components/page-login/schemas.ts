import type { z } from 'zod' 

export function getRegisterValidation(z: z.ZodString) {
  return z.min(6, $t('密码必须包含数字和字母，6-20 位')).max(20, $t('密码必须包含数字和字母，6-20 位')).refine((val) => {
    return /[a-z]/i.test(val) && /\d/.test(val)
  }, {
    message: $t('密码必须包含数字和字母，6-20 位'),
  })
}

let $t: (key: string) => string
export function getFormSchemas(isRegister = false) {
  $t || ({ t: $t } = useI18n());

  return [
    {
      field: 'user_name',
      component: 'input',
      label: () => $t('邮箱'),
      componentProps: {
        placeholder: () => $t('请输入您的邮箱'),
      },
      rule: {
        trigger: 'change',
        validator(zod) {
          const z = zod.string()
          if (isRegister) {
            return z.min(1, $t('请输入您的邮箱')).email($t('请输入正确的邮箱'))
          }
          return z.min(1, $t('请输入您的邮箱'))
        },
      },
    },
    {
      field: 'password',
      component: 'input',
      label: () => $t('密码'),
      componentProps: {
        type: 'password',
        placeholder: () => isRegister ? $t('请设置您的密码') : $t('请输入您的密码'),
      },
      rule: {
        validator(zod) {
          const z = zod.string()
          if (isRegister) {
            return getRegisterValidation(zod.string().min(1, $t('请设置您的密码')))
          }
          return z.min(1, $t('请输入您的密码'))
        },
      },
    },
  ]
} 

export function getResetPasswordSchemas() {

  return [
    {
      field: 'newPassword',
      component: 'input',
      label: () => $t('新密码'),
      componentProps: {
        type: 'password',
        placeholder: () => $t('请输入您的新密码'),
      },
      rule: {
        validator(zod) {
          const z = zod.string()
          return getRegisterValidation(z.min(1, $t('请输入您的新密码')))
        },
      },
    },
    {
      field: 'confirmPassword',
      component: 'input',
      label: () => $t('确认密码'),
      componentProps: {
        type: 'password',
        placeholder: () => $t('请再次输入您的新密码'),
      },
      rule: {
        validator(zod, formModel) {
          const z = zod.string()
          return z
            .min(1, $t('请再次输入您的新密码'))
            .refine((val) => {
              return val === formModel.value.newPassword
            }, {
              message: $t('两次输入的密码不一致'),
            })
        },
      },
    },
  ]
}