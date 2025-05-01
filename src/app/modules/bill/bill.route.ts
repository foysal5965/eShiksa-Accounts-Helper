import express from 'express'
import { billController } from './bill.controller';
const router = express.Router();


router.post('/create-bill', billController.bill)

export const billRouter = router