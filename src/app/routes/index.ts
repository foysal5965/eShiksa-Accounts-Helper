import express from 'express'
import { userRouter } from '../modules/user/user.routes'
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { collegeRouter } from '../modules/college/college.routes';
import { billRouter } from '../modules/bill/bill.route';
const router = express.Router()
const moduleRoutes = [
    // ... routes
    {
        path: "/users",
        route: userRouter
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },{
        path:'/college',
        route:collegeRouter
    },
    {
        path:'/bill',
        route:billRouter
    }

]
moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;