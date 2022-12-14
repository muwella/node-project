import express from 'express'
import { log_error, error_handler } from '../middlewares/error.handler.js'
// import PlanningService from '../services/planning.service.js'

const router = express.Router()
// const service = new PlanningService()

// endpoints
// WIP
	// planning (array of 0,1,2,3 recipes planning)
	// calcular la semana actual (dia inicial, dia actual, dia final)
	// recetas con esas fechas en PlanningModel

router.get('/', async (req, res) => {
  try {

  } catch(err) {
		log_error(err, req, res)
    error_handler(err, 404, req, res)
	}
})


router.get('/new', async (req, res) => {
  try {

  } catch(err) {
		log_error(err, req, res)
    error_handler(err, 404, req, res)
	}
})


router.get('/update/:id', async (req, res) => {
  try {

  } catch(err) {
		log_error(err, req, res)
    error_handler(err, 404, req, res)
	}
})


router.get('/delete/:id', async (req, res) => {
  try {

  } catch(err) {
		log_error(err, req, res)
    error_handler(err, 404, req, res)
	}
})

export default router