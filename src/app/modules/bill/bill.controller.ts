import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { billService } from "./bill.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const bill = catchAsync(async (req: Request, res: Response) => {

    const result = await billService.bill(req.body,res);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "College added successfuly!",
        data: result
    })
});

export const billController = {
    bill
}