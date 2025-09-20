import { pgr } from '../utils/pumpGetRoute'

export const getAllTopicsRoute = pgr(() => '/')

export const getSignUpRoute = pgr(() => '/sign-up')
export const getSignInRoute = pgr(() => '/sign-in')
export const getSignOutRoute = pgr(() => '/sign-out')

export const getProfileRoute = pgr(() => '/profile')
export const getEditProfileRoute = pgr(() => '/edit-profile')

export const getNewTopicRoute = pgr(() => '/topics/new')
export const getViewTopicRoute = pgr({ selectedTopic: true }, ({ selectedTopic }) => `/topics/${selectedTopic}`)
export const getEditTopicRoute = pgr({ selectedTopic: true }, ({ selectedTopic }) => `/topics/${selectedTopic}/edit`)
