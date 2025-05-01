import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { collegeService } from "./college.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await collegeService.insertIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "College added successfuly!",
        data: result
    })
});
const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['collegeName', 'searchTerm', "collegeAddress",'id']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await collegeService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "College data fetched!",
        meta: result.meta,
        data: result.data
    })
})
export const collegeController = {
    insertIntoDb,
    getAllFromDB
}