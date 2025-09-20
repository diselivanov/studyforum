import type { TrpcRouterOutput } from '@studyforum/backend/src/router'
import { zUpdatePasswordTrpcInput } from '@studyforum/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileTrpcInput } from '@studyforum/backend/src/router/auth/updateProfile/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@studyforum/shared/src/zod'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { UploadToCloudinary } from '../../../components/UploadToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useContext()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: me.name,
      description: me.description,
      phone: me.phone,
      age: me.age,
      form: me.form,
      faculty: me.faculty,
      direction: me.direction,
      number: me.number,
      group: me.group,
      year: me.year,
      avatar: me.avatar,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updatedMe })
    },
    successMessage: 'Данные обновлены',
    resetOnSuccess: false,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Имя" name="name" formik={formik} />
        <Input label="Телефон" name="phone" formik={formik} />
        <Input label="Описание" name="description" formik={formik} />
        <Input label="Дата рождения" name="age" formik={formik} />
         <Input label="Курс" name="year" formik={formik} />
        <Input label="Форма обучения" name="form" formik={formik} />
        <Input label="Факультет" name="faculty" formik={formik} />
        <Input label="Направление" name="direction" formik={formik} />
        <Input label="Студ. билет" name="number" formik={formik} />
        <Input label="Группа" name="group" formik={formik} />
        <UploadToCloudinary label="Фото" name="avatar" type="avatar" preset="big" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Сохранить</Button>
      </FormItems>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')),
    onSubmit: async ({ newPassword, oldPassword }) => {
      await updatePassword.mutateAsync({ newPassword, oldPassword })
    },
    successMessage: 'Пароль обновлён',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Текущий пароль" name="oldPassword" type="password" formik={formik} />
        <Input label="Новый пароль" name="newPassword" type="password" formik={formik} />
        <Input label="Новый пароль ещё раз" name="newPasswordAgain" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Сохранить</Button>
      </FormItems>
    </form>
  )
}

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Edit Profile',
})(({ me }) => {
  return (
    <FormWrapper type="big">
      <Segment title="Личная информация">
        <General me={me} />
      </Segment>
      <Segment title="Изменить пароль">
        <Password />
      </Segment>
    </FormWrapper>
  )
})
