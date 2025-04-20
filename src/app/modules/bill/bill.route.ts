import express from 'express'
import { billController } from './bill.controller';
const router = express.Router();


router.get('/', billController.bill)

export const billRouter = router