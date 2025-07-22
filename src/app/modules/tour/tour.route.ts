import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import {
    createTourTypeZodSchema,
    createTourZodSchema,
    updateTourZodSchema,
} from "./tour.validation";

const router = express.Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */
router.get("/tour-types", TourControllers.getAllTourTypes);

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourControllers.createTourType
);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourControllers.updateTourType
);

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.deleteTourType);

/* --------------------- TOUR ROUTES ---------------------- */
router.get("/", TourControllers.getAllTours);

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourZodSchema),
    TourControllers.createTour
);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourControllers.updateTour
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourControllers.deleteTour);


export const TourRoutes = router