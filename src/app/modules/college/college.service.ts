import { Request } from "express";
import prisma from "../../shared/prisma";
import { College, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";

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
type ICollegeFilterRequest = {
    collegeName?: string | undefined;
    collegeAddress?: string | undefined;
    searchTerm?: string | undefined;
    id?: string | undefined
}
const getAllFromDB = async (params: ICollegeFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andCondions: Prisma.CollegeWhereInput[] = [];

    if (params.searchTerm) {
        andCondions.push({
            OR: ['collegeName', 'collegeAddress', 'id'].map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                    mode: 'insensitive'
                }
            }))
        })
    };



    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.CollegeWhereInput = { AND: andCondions }

    const result = await prisma.college.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.college.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};
export const collegeService = {
    insertIntoDb,
    getAllFromDB
}