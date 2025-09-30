import { getAvatarUrl } from '@studyforum/shared/src/cloudinary'
import { useMe } from '../../lib/ctx'
import { Link } from 'react-router-dom'
import { getEditProfileRoute, getProfileRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'
import { useState, useRef, useEffect } from 'react'
import css from './index.module.scss'
import { Icon } from '../Icon'

export const ProfileButton = () => {
  const me = useMe()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (menuRef.current && !menuRef) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={css.profileContainer} ref={menuRef}>
      {me ? (
        <>
          <div className={css.buttons}>
            <Link to={getProfileRoute()} className={css.profileButton}>
              <img className={css.avatar} alt="Фото профиля" src={getAvatarUrl(me.avatar, 'small')} />
              <span>{me.name}</span>
            </Link>

            <button className={css.moreButton} onClick={toggleMenu}>
              <Icon name={'more'} size={18} />
            </button>
          </div>

          {isMenuOpen && (
            <div className={css.dropdownMenu}>
              <Link to={getEditProfileRoute()} className={css.menuItem} onClick={() => setIsMenuOpen(false)}>
                <Icon name={'settings'} size={16} />
                <div>Настройки</div>
              </Link>

              <Link to={getSignOutRoute()} className={css.menuItem} onClick={() => setIsMenuOpen(false)}>
                <Icon name={'signout'} size={16} />
                <div>Выйти</div>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className={css.links}>
          <Link className={css.link} to={getSignUpRoute()}>
            Создать аккаунт
          </Link>
          <Link className={css.link} to={getSignInRoute()}>
            Войти
          </Link>
        </div>
      )}
    </div>
  )
}
