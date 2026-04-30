import { NextFunction, Request, Response } from "express";

export const verifyCaptcha = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userInput = req.body.captcha; // Assuming it's passed as a query param
  const savedCaptcha = (req.session as any).captcha;
  console.log(` aa UserInput che ${userInput}`);
  console.log(` aa savedCaptcha che ${savedCaptcha}`);

  if (userInput && userInput === savedCaptcha) {
    // Clear the captcha so it can't be reused
    delete (req.session as any).captcha;
    next(); // Proceed to the signup handler
  } else {
    res.status(400).json({
      message: "Invalid Captcha. Please try again.",
    });
  }
};
