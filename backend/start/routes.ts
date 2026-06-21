/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.post('/signup', [controllers.NewAccount, 'store'])
router.post('/login', [controllers.AccessTokens, 'store'])
router.get('/me', [controllers.Profile, 'show']).use(middleware.auth())
