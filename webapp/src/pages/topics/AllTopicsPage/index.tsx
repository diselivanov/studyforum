import React from 'react'
import { zGetTopicsTrpcInput } from '@studyforum/backend/src/router/topics/getTopics/input'
import InfiniteScroll from 'react-infinite-scroller'
import { Alert } from '../../../components/Alert'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { Topic } from '../../../components/Topic'
import { Select } from '../../../components/Select'
import css from './index.module.scss'

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
    { value: 'Шелепова Е.В.', label: 'Шелепова Е.В.' }
  ],
  'Физика': [
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
    { value: 'Агиевич И.А.', label: 'Агиевич И.А.' }
  ],
  'Социальные науки': [
    { value: 'Тимощук Н.А.', label: 'Тимощук Н.А.' },
    { value: 'Аристов А.В.', label: 'Аристов А.В.' },
    { value: 'Бакирова Д.М.', label: 'Бакирова Д.М.' },
    { value: 'Барсукова А.В.', label: 'Барсукова А.В.' },
    { value: 'Болотова О.В.', label: 'Болотova О.В.' },
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
    { value: 'Черных А.А.', label: 'Черных А.А.' }
  ],
  'Химия': [
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
    { value: 'Чеканова Е.С.', label: 'Чеканова Е.С.' }
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
    { value: 'Горизонтова А.В', label: 'Горизонтова А.В' }
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
    { value: 'Осипова Н.В.', label: 'Осипova Н.В.' },
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
    { value: 'Климченко К.П.', label: 'Климченко К.П.' }
  ]
}

export const AllTopicsPage = withPageWrapper({
  title: 'Study forum',
  isTitleExact: true,
})(() => {
  const form = useForm({
    initialValues: { 
      search: '', 
      discipline: '', 
      teacher: '' 
    },
    validationSchema: zGetTopicsTrpcInput.pick({ 
      search: true, 
      discipline: true, 
      teacher: true 
    }),
  })

  const [filters, setFilters] = React.useState({
    search: '',
    discipline: '',
    teacher: ''
  })

  // Дебаунс для поиска
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(form.formik.values)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [form.formik.values])

  const availableTeachers = form.formik.values.discipline 
    ? disciplineTeachersMap[form.formik.values.discipline as keyof typeof disciplineTeachersMap] || []
    : []

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getTopics.useInfiniteQuery(
      {
        search: filters.search,
        discipline: filters.discipline || undefined,
        teacher: filters.teacher || undefined,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
    )

  return (
    <Segment title={undefined}>
      {/* Форма фильтрации */}
      <div className={css.filters}>
        <input
          type="text"
          placeholder="Поиск по названию"
          value={form.formik.values.search}
          onChange={(e) => form.formik.setFieldValue('search', e.target.value)}
          className={css.searchInput}
        />
        
        <div className={css.selects}>
          <Select 
          name="discipline" 
          label="" 
          formik={form.formik}
          options={[
            { value: '', label: 'Все дисциплины' },
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
          label="" 
          formik={form.formik}
          options={[
            { value: '', label: 'Все преподаватели' },
            ...availableTeachers
          ]}
          disabled={!form.formik.values.discipline}
        />
        </div>
      </div>

      {/* Результаты */}
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data?.pages[0]?.topics.length ? (
        <Alert color="blue">Ничего не найдено</Alert>
      ) : (
        <InfiniteScroll
          threshold={250}
          loadMore={() => {
            if (!isFetchingNextPage && hasNextPage) {
              void fetchNextPage()
            }
          }}
          hasMore={hasNextPage}
          loader={
            <div className={css.more} key="loader">
              <Loader type="section" />
            </div>
          }
          getScrollParent={() => layoutContentElRef.current}
          useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
        >
          {data.pages
            .flatMap((page) => page.topics)
            .map((topic) => (
              <Topic key={topic.id} topic={topic} />
            ))}
        </InfiniteScroll>
      )}
    </Segment>
  )
})