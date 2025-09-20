import cn from 'classnames'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import css from './index.module.scss'

type ButtonColor = 'red' | 'green' | 'blue' | 'black' | 'transparent'
export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}
export const Button = ({
  children,
  loading = false,
  color = 'blue',
  type = 'submit',
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={cn({
        [css.button]: true,
        [css[`color-${color}`]]: true,
        [css.disabled]: disabled || loading,
        [css.loading]: loading,
      })}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      ) : (
        <span className={css.text}>{children}</span>
      )}
    </button>
  )
}

export const LinkButton = ({
  children,
  to,
  color = 'green',
}: {
  children: React.ReactNode
  to: string
  color?: ButtonColor
}) => {
  return (
    <Link className={cn({ [css.button]: true, [css[`color-${color}`]]: true })} to={to}>
      {children}
    </Link>
  )
}

export const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className={css.buttons}>{children}</div>
}
