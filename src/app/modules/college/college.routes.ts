import express from 'express'
import { collegeController } from './college.controller';
const router = express.Router();
router.post('/add-college', collegeController.insertIntoDb)

export const collegeRouter = router