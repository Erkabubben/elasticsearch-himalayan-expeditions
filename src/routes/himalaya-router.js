/**
 * Routes for the Himalayan Expeditions application.
 *
 * @author Erik Lindholm <elimk06@student.lnu.se>
 * @author Mats Loock
 * @version 1.0.0
 */

import express from 'express'
import { HimalayaController } from '../controllers/himalaya-controller.js'

export const router = express.Router()

const controller = new HimalayaController()

// Map HTTP verbs and route paths to controller actions.
router.get('/', controller.index)
router.get('/peak', controller.peak)
