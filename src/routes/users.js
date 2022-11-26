import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
import UsersService from '../services/users.service.js'

const router = express.Router()
const service = new UsersService()

// WIP HOME
  // name (if !undefined name, else username)
  // suggestions (array of 0,1,2,3 recipes random)
  // last_added (array of 0,1,2,3 recipes)
  // planning (array of 0,1,2,3 recipes planning)
// WIP PLANNING
  // calcular la semana actual (dia inicial, dia actual, dia final)
  // recetas con esas fechas en PlanningModel
// WIP ALL get/post/patch/delete if logged


// endpoints

// WIP get all only for development
  // LATER a user can search users to follow
  // LATER a user can have recipes from others on their planning
router.get('/', async (req, res) => {
  try {
    const users = await service.get_users()

    res.status(200).json(users)
  } catch(err) {
    console.error(err)
  }
})


// WIP get if user info and TOKEN coincide
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await service.get_user_by_id(id)
    res.status(200).json(user)
  } catch (err) {
    log_error(err, req, res)
    error_handler(err, 404, req, res)  }
})


// create should send a confirmation mail
// the user can't create recipes until it is confirmed
// what happens if someone else wants that mail?

// when a user creates their account, they get logged in
// and receive a token
router.post('/new', async (req, res) => {
  try {
    const jwt = await service.create(req.body)

    res.status(201).json({
      message: "User created",
      token: jwt
    })
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// WIP update only for developtment (update all)
router.put('/updateAll', async (req, res) => {
  try {
    const users = await service.update_all(req.body)
    res.status(200).json(users)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// WIP patch if user info and TOKEN coincide
router.patch('/update/:id', async (req, res) => {
  const { id } = req.params

  try {
    const user = await service.update(id, req.body)
    res.status(200).json(user)
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


// delete should deactivate the users' account
// and delete it permanently after 30 days
// should have a Recover account
// WIP delete if user info and TOKEN coincide
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  try {
    await service.delete(id)
    res.status(200).json({ 'message': `User ${id} deleted` })
  } catch(err) {
    log_error(err, req, res)
    error_handler(err, 400, req, res)
  }
})


export default router