import { createRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import {
  getAllTopicsRoute,
  getNewTopicRoute,
} from '../../lib/routes'
import css from './index.module.scss'
import { ProfileButton } from '../ProfileButton'
import { Icon } from '../Icon'
import { FartButton } from '../FartButton'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  return (
    <div className={css.layout}>
      <div className={css.sidebar}>
        <div className={css.tab}>
          <Link className={css.link} to={getAllTopicsRoute()}>
            <Icon name={'category'} size={18}/>
            <div>Главная</div>
          </Link>
        </div>
        <div className={css.tab}>
          <Link className={css.link} to={getNewTopicRoute()}>
            <Icon name={'topic'} size={18}/>
            <div>Создать тему</div>
          </Link>
        </div>

        <ProfileButton/>
      </div>

      <div className={css.content} ref={layoutContentElRef}>
        <Outlet />
        <FartButton/>
      </div>
    </div>
  )
}
