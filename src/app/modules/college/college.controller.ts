import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { collegeService } from "./college.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await collegeService.insertIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "College added successfuly!",
        data: result
    })
});
export const collegeController = {
    insertIntoDb
}