import { Request } from "express";
import prisma from "../../shared/prisma";
import { College } from "@prisma/client";

const insertIntoDb = async( req: Request):Promise<College>=>{
    
    const result = await prisma.college.create({
        data:{
            collegeName: req?.collegeName,
            collegeAddress: req?.collegeAddress,
            cloudSpacePricePerUnit: req?.cloudSpacePricePerUnit

        }
    })
    return result
}
export const collegeService = {
    insertIntoDb
}