import { zCreateTopicTrpcInput } from '@studyforum/backend/src/router/topics/createTopic/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Textarea } from '../../../components/Textarea'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { FormWrapper } from '../../../components/FormWrapper'
import css from './index.module.scss'
import { Select } from '../../../components/Select'
import { useEffect, useState } from 'react'

type FormValues = typeof zCreateTopicTrpcInput._type

// Определяем соответствие предметов и преподавателей
const disciplineTeachersMap = {
  'Высшая математика': [
    { value: 'Давыдов А.А.', label: 'Давыдов А.А.' },
    { value: 'Ким-Тян Л.Р.', label: 'Ким-Тян Л.Р.' },
    { value: 'Авксентьева Н.Н.', label: 'Авксентьева Н.Н.' },
    { value: 'Адигамов А.Э.', label: 'Адигамов А.Э.' },
    { value: 'Акимова Е.А.', label: 'Акимова Е.А.' },
    { value: 'Алексенцев Ю.М.', label: 'Алексенцев Ю.М.' },
    { value: 'Аливердиева Э.И.', label: 'Аливердиева Э.И.' },
    { value: 'Аржаткина М.С.', label: 'Аржаткина М.С.' },
    { value: 'Беляков А.О.', label: 'Беляков А.О.' },
    { value: 'Бортаковский А.С.', label: 'Бортаковский А.С.' },
    { value: 'Бугаевская А.Н.', label: 'Бугаевская А.Н.' },
    { value: 'Булатова Р.Р.', label: 'Булатова Р.Р.' },
    { value: 'Горушкина Н.В.', label: 'Горушкина Н.В.' },
    { value: 'Думачев В.Н.', label: 'Думачев В.Н.' },
    { value: 'Завьялова Т.В.', label: 'Завьялова Т.В.' },
    { value: 'Казанцев А.В.', label: 'Казанцев А.В.' },
    { value: 'Коптев А.О.', label: 'Коптев А.О.' },
    { value: 'Левшина Г.Д.', label: 'Левшина Г.Д.' },
    { value: 'Максимова О.В.', label: 'Максимова О.В.' },
    { value: 'Недосекина И.С.', label: 'Недосекина И.С.' },
    { value: 'Ногинова Л.Ю.', label: 'Ногинова Л.Ю.' },
    { value: 'Осипов Д.В.', label: 'Осипов Д.В.' },
    { value: 'Печень А.Н.', label: 'Печень А.Н.' },
    { value: 'Платов А.С.', label: 'Платов А.С.' },
    { value: 'Плужникова Е.Л.', label: 'Плужникова Е.Л.' },
    { value: 'Родина Л.И.', label: 'Родина Л.И.' },
    { value: 'Ушаков В.К.', label: 'Ушаков В.К.' },
    { value: 'Шевелев В.В.', label: 'Шевелев В.В.' },
    { value: 'Шелепова Е.В.', label: 'Шелепова Е.В.' },
  ],
  Физика: [
    { value: 'Глазков В.Н.', label: 'Глазков В.Н.' },
    { value: 'Сафронов И.С.', label: 'Сафронов И.С.' },
    { value: 'Андрухова О.В.', label: 'Андрухова О.В.' },
    { value: 'Блохин Д.И.', label: 'Блохин Д.И.' },
    { value: 'Бондарева С.А.', label: 'Бондарева С.А.' },
    { value: 'Каевицер Е.В.', label: 'Каевицер Е.В.' },
    { value: 'Кобзарь А.Н.', label: 'Кобзарь А.Н.' },
    { value: 'Машковцева Л.С.', label: 'Машковцева Л.С.' },
    { value: 'Минаев В.И.', label: 'Минаев В.И.' },
    { value: 'Морозова Т.В.', label: 'Морозова Т.В.' },
    { value: 'Мудрецова Л.В.', label: 'Мудрецова Л.В.' },
    { value: 'Нестерова В.Г.', label: 'Нестерова В.Г.' },
    { value: 'Носков А.В.', label: 'Носков А.В.' },
    { value: 'Обвинцева Н.Ю.', label: 'Обвинцева Н.Ю.' },
    { value: 'Рычкова О.В.', label: 'Рычкова О.В.' },
    { value: 'Симонов Ю.В.', label: 'Симонов Ю.В.' },
    { value: 'Уварова И.Ф.', label: 'Уварова И.Ф.' },
    { value: 'Фазлижанова Д.И.', label: 'Фазлижанова Д.И.' },
    { value: 'Шинкин В.Н.', label: 'Шинкин В.Н.' },
    { value: 'Шелятев Д.А.', label: 'Шелятев Д.А.' },
    { value: 'Забенков И.В.', label: 'Забенков И.В.' },
    { value: 'Агиевич И.А.', label: 'Агиевич И.А.' },
  ],
  'Социальные науки': [
    { value: 'Тимощук Н.А.', label: 'Тимощук Н.А.' },
    { value: 'Аристов А.В.', label: 'Аристов А.В.' },
    { value: 'Бакирова Д.М.', label: 'Бакирова Д.М.' },
    { value: 'Барсукова А.В.', label: 'Барсукова А.В.' },
    { value: 'Болотова О.В.', label: 'Болотова О.В.' },
    { value: 'Булатов И.А.', label: 'Булатов И.А.' },
    { value: 'Демидова С.А.', label: 'Демидова С.А.' },
    { value: 'Зубарев И.Ю.', label: 'Зубарев И.Ю.' },
    { value: 'Караулина Т.Б.', label: 'Караулина Т.Б.' },
    { value: 'Каюмов А.Т.', label: 'Каюмов А.Т.' },
    { value: 'Максименко Е.П.', label: 'Максименко Е.П.' },
    { value: 'Мякинькова С.Н.', label: 'Мякинькова С.Н.' },
    { value: 'Науменко О.А.', label: 'Науменко О.А.' },
    { value: 'Пестяков С.А.', label: 'Пестяков С.А.' },
    { value: 'Подвойская Н.Л.', label: 'Подвойская Н.Л.' },
    { value: 'Родионовна Е.Ю.', label: 'Родионовна Е.Ю.' },
    { value: 'Саберов Р.А.', label: 'Саберов Р.А.' },
    { value: 'Урсул Т.А.', label: 'Урсул Т.А.' },
    { value: 'Хорват Д.А.', label: 'Хорват Д.А.' },
    { value: 'Челышев П.В.', label: 'Челышев П.В.' },
    { value: 'Черных А.А.', label: 'Черных А.А.' },
  ],
  Химия: [
    { value: 'Пестряк И.В.', label: 'Пестряк И.В.' },
    { value: 'Лобанова В.Г.', label: 'Лобанова В.Г.' },
    { value: 'Волков П.В.', label: 'Волков П.В.' },
    { value: 'Гордец Ю.А.', label: 'Гордец Ю.А.' },
    { value: 'Изместьев А.Н.', label: 'Изместьев А.Н.' },
    { value: 'Осипов Д.О.', label: 'Осипов Д.О.' },
    { value: 'Лезлва С.П.', label: 'Лезлва С.П.' },
    { value: 'Морозов В.В.', label: 'Морозов В.В.' },
    { value: 'Поливанская В.В.', label: 'Поливанская В.В.' },
    { value: 'Сименео А.А.', label: 'Сименео А.А.' },
    { value: 'Тер-Акопян М.Н.', label: 'Тер-Акопян М.Н.' },
    { value: 'Чеканова Е.С.', label: 'Чеканова Е.С.' },
  ],
  'Иностранные языки': [
    { value: 'Щавелева Е.Н.', label: 'Щавелева Е.Н.' },
    { value: 'Авдеева Ю.А.', label: 'Авдеева Ю.А.' },
    { value: 'Авсиевич П.Д.', label: 'Авсиевич П.Д.' },
    { value: 'Алещенко О.А.', label: 'Алещенко О.А.' },
    { value: 'Ананьева Е.П.', label: 'Ананьева Е.П.' },
    { value: 'Беляева Т.Н.', label: 'Беляева Т.Н.' },
    { value: 'Богатырёв А.А.', label: 'Богатырёв А.А.' },
    { value: 'Валле Чилина И.Д.', label: 'Валле Чилина И.Д.' },
    { value: 'Витогнова А.М.', label: 'Витогнова А.М.' },
    { value: 'Горизонтова А.В', label: 'Горизонтова А.В' },
  ],
  'Инфокоммуникационные технологии': [
    { value: 'Колистратов М.В.', label: 'Колистратов М.В.' },
    { value: 'Стучилин В.В.', label: 'Стучилин В.В.' },
    { value: 'Анисимова М.С.', label: 'Анисимова М.С.' },
    { value: 'Мокрова Н.В.', label: 'Мокрова Н.В.' },
    { value: 'Соколов С.М.', label: 'Соколов С.М.' },
    { value: 'Халкечев Р.К.', label: 'Халкечев Р.К.' },
    { value: 'Дудченко О.Л.', label: 'Дудченко О.Л.' },
    { value: 'Калашников Е.А.', label: 'Калашников Е.А.' },
    { value: 'Маркарян Л.В.', label: 'Маркарян Л.В.' },
    { value: 'Осипова Н.В.', label: 'Осипова Н.В.' },
    { value: 'Бахаров Л.Е.', label: 'Бахаров Л.Е.' },
    { value: 'Буянов С.И.', label: 'Буянов С.И.' },
    { value: 'Ваттана А.Б.', label: 'Ваттана А.Б.' },
    { value: 'Карпишук А.В.', label: 'Карпишук А.В.' },
    { value: 'Кузнецова К.А.', label: 'Кузнецова К.А.' },
    { value: 'Парфенова Е.В.', label: 'Парфенова Е.В.' },
    { value: 'Попова И.С.', label: 'Попова И.С.' },
    { value: 'Ядова Е.Н.', label: 'Ядова Е.Н.' },
    { value: 'Аристова П.С.', label: 'Аристова П.С.' },
    { value: 'Нафиков А.М.', label: 'Нафиков А.М.' },
    { value: 'Ефимов Д.А.', label: 'Ефимов Д.А.' },
    { value: 'Ким В.Р.', label: 'Ким В.Р.' },
    { value: 'Климченко К.П.', label: 'Климченко К.П.' },
  ],
}

export const NewTopicPage = withPageWrapper({
  authorizedOnly: true,
  title: 'New Topic',
})(() => {
  const createTopic = trpc.createTopic.useMutation()
  const [availableTeachers, setAvailableTeachers] = useState<{ value: string; label: string }[]>([])

  // Базовые начальные значения
  const initialValues: FormValues = {
    title: '',
    description: '',
    discipline: '',
    teacher: '',
    images: [],
  }

  const { formik, buttonProps, alertProps } = useForm({
    initialValues,
    validationSchema: zCreateTopicTrpcInput,
    onSubmit: async (values: FormValues) => {
      try {
        await createTopic.mutateAsync({
          title: values.title,
          description: values.description,
          discipline: values.discipline,
          teacher: values.teacher,
          images: values.images,
        })

        formik.resetForm()
      } catch (error) {
        console.error('Error creating topic:', error)
      }
    },
    successMessage: 'Topic created!',
    showValidationAlert: true,
  })

  // Обновляем список преподавателей при изменении предмета
  useEffect(() => {
    const discipline = formik.values.discipline
    if (discipline && disciplineTeachersMap[discipline as keyof typeof disciplineTeachersMap]) {
      setAvailableTeachers(disciplineTeachersMap[discipline as keyof typeof disciplineTeachersMap])

      // Сбрасываем выбранного преподавателя, если он не соответствует новому предмету
      if (
        !disciplineTeachersMap[discipline as keyof typeof disciplineTeachersMap].some(
          (teacher) => teacher.value === formik.values.teacher
        )
      ) {
        formik.setFieldValue('teacher', '')
      }
    } else {
      setAvailableTeachers([])
      formik.setFieldValue('teacher', '')
    }
  }, [formik.values.discipline])

  return (
    <FormWrapper type={'big'}>
      <div className={css.header}>
        <h2>Создание темы</h2>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="title" label="Название" formik={formik} />
          <Textarea name="description" label="Описание" formik={formik} />
          <Select
            name="discipline"
            label="Дисциплина"
            formik={formik}
            options={[
              { value: 'Высшая математика', label: 'Высшая математика' },
              { value: 'Физика', label: 'Физика' },
              { value: 'Социальные науки', label: 'Социальные науки' },
              { value: 'Химия', label: 'Химия' },
              { value: 'Иностранные языки', label: 'Иностранные языки' },
              { value: 'Инфокоммуникационные технологии', label: 'Инфокоммуникационные технологии' },
            ]}
          />
          <Select
            name="teacher"
            label="Преподаватель"
            formik={formik}
            options={availableTeachers}
            disabled={!formik.values.discipline}
          />

          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />

          <Alert {...alertProps} />
          <Button {...buttonProps} loading={createTopic.isLoading}>
            Создать тему
          </Button>
        </FormItems>
      </form>
    </FormWrapper>
  )
})
