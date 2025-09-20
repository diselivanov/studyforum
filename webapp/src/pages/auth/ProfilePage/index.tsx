import { getAvatarUrl } from '@studyforum/shared/src/cloudinary'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import css from './index.module.scss'

// Иконки для визуального улучшения
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.32 8.82 8.59L6.62 10.79Z"/>
  </svg>
)

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="currentColor"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z" fill="currentColor"/>
  </svg>
)

const EducationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" fill="currentColor"/>
  </svg>
)

const GroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
  </svg>
)

export const ProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Профиль',
})(({ me }) => {
  return (
    <div className={css.container}>
      <Segment title="">
        <div className={css.profile}>
          <div className={css.avatarSection}>
            <img 
              className={css.avatar} 
              alt="Фото профиля" 
              src={getAvatarUrl(me.avatar, 'small')} 
            />
            <h1 className={css.name}>{me.name}</h1>
            {me.description && (
              <div className={css.description}>
                <p>{me.description}</p>
              </div>
            )}
          </div>
          
          <div className={css.infoGrid}>
            <div className={css.infoItem}>
              <div className={css.icon}>
                <PhoneIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Телефон</span>
                <span className={css.value}>{me.phone || 'Не указан'}</span>
              </div>
            </div>

            <div className={css.infoItem}>
              <div className={css.icon}>
                <EmailIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Почта</span>
                <span className={css.value}>{me.email || 'Не указан'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <CalendarIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Дата рождения</span>
                <span className={css.value}>{me.age || 'Не указана'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <EducationIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Форма обучения</span>
                <span className={css.value}>{me.form || 'Не указана'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <EducationIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Факультет</span>
                <span className={css.value}>{me.faculty || 'Не указан'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <EducationIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Направление</span>
                <span className={css.value}>{me.direction || 'Не указано'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <GroupIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Группа</span>
                <span className={css.value}>{me.group || 'Не указана'}</span>
              </div>
            </div>
            
            <div className={css.infoItem}>
              <div className={css.icon}>
                <EducationIcon />
              </div>
              <div className={css.infoContent}>
                <span className={css.label}>Курс</span>
                <span className={css.value}>{me.year || 'Не указан'}</span>
              </div>
            </div>
          </div>
        </div>
      </Segment>
    </div>
  )
})