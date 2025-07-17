import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../middlewares/checkAuth";
import { Role } from "../modules/user/user.interface";
import passport from "passport";

const router = Router();
router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);
router.post("/logout", AuthControllers.logout);
router.post("/resetPassword", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);


//logged out user --> /booking --> redirected to /login --> successfull login --> redirected to /booking
//logged out user --> /login --> successfull login --> redirected to /home
// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get("/google", (req:Request, res:Response, next:NextFunction) => { //ei route a frontend theke hit korbe
    const redirect = req.query.redirect || '/';
    passport.authenticate("google", {scope: ["profile", "email"], state: redirect as string})(req,res);
});

//after successfull login this controller a back korbe
//url => api/v1/auth/google/callback?state="booking"

router.get("/google/callback", passport.authenticate("google", {failureRedirect:"/login"}), AuthControllers.googleCallbackController);
export const AuthRoutes = router;