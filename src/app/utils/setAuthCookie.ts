import { Response } from "express";


export interface IAuthCookie{
    accessToken?:string;
    refreshToken?:string;
}

export const setAuthCookie = (res:Response, cookieInfo:IAuthCookie) => {
    if(cookieInfo.accessToken){
        res.cookie("accessToken", cookieInfo.accessToken, {
            httpOnly: true,
            secure: false
        })
    }

    if(cookieInfo.refreshToken){
         res.cookie("refreshToken", cookieInfo.refreshToken, {
            httpOnly: true,
            secure: false
        })
    }
}