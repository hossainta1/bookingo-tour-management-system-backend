import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { DivisionRoutes } from "../modules/division/division.route";
import { TourRoutes } from "../modules/tour/tour.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },

  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/division",
    route: DivisionRoutes,
  },

   {
        path: "/tour",
        route: TourRoutes
    }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
