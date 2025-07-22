import { Router } from "express";
import { DivisionControllers } from "./division.controller";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

export const DivisionRoutes = Router();

DivisionRoutes.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchema),
  DivisionControllers.createDivision
);
DivisionRoutes.get("/", DivisionControllers.getAllDivisions);
DivisionRoutes.get("/:slug", DivisionControllers.getSingleDivision);
DivisionRoutes.post(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  DivisionControllers.updateDivision
);
