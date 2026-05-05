import svgCaptcha from 'svg-captcha';
import { Request, Response } from 'express';

declare module "express-session" {
  interface SessionData {
    captcha?: string; 
  }
}

export const authCaptcha = async(req:Request,res:Response)=>{

  const refresh = req.query.refresh === 'true';

  if((req.session as any).captcha && (req.session as any).captchaImage && !refresh){
    res.type('svg');
    res.status(200).send((req.session as any).captchaImage);
    return;
  }
  
  const captcha = svgCaptcha.create({
    size: 4,
    noise: 2,
    color: true,
    background: '#f0f0f0'
  });
  (req.session as any).captcha = captcha.text;
  (req.session as any).captchaImage = captcha.data;

  res.type('svg');
  res.status(200).send(captcha.data);
}