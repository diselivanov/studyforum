import { createElement } from 'react'
import { type IconBaseProps } from 'react-icons'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { IoCloseOutline } from 'react-icons/io5'
import { TiWarning } from 'react-icons/ti'
import { LuSearch } from 'react-icons/lu'
import { FaCheck } from 'react-icons/fa6'
import { BiSolidInfoCircle } from 'react-icons/bi'
import { TbUserScan } from 'react-icons/tb'
import { RiSettings3Line } from 'react-icons/ri'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from 'react-icons/fi'
import { IoAdd } from 'react-icons/io5'
import { SiAlwaysdata } from 'react-icons/si'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { GoSignOut } from 'react-icons/go'
import { RiMoreFill } from 'react-icons/ri'
import { TbCopy } from 'react-icons/tb'
import { HiOutlineViewGrid } from 'react-icons/hi'
import { AiFillLike } from 'react-icons/ai'
import { AiOutlineLike } from 'react-icons/ai'

const icons = {
  likeEmpty: AiOutlineLike,
  likeFilled: AiFillLike,
  delete: IoCloseOutline,
  error: TiWarning,
  search: LuSearch,
  success: FaCheck,
  info: BiSolidInfoCircle,
  stats: SiAlwaysdata,
  users: TbUserScan,
  settings: RiSettings3Line,
  arrowRight: FiChevronRight,
  arrowLeft: FiChevronLeft,
  arrowDown: FiChevronDown,
  arrowUp: FiChevronUp,
  edit: MdOutlineModeEditOutline,
  add: IoAdd,
  copy: TbCopy,
  more: RiMoreFill,
  topic: BiMessageSquareDetail,
  signout: GoSignOut,
  category: HiOutlineViewGrid,
}

export const Icon = ({ name, ...restProps }: { name: keyof typeof icons } & IconBaseProps) => {
  return createElement(icons[name], restProps)
}
