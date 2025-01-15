import express from "express";
import { body } from 'express-validator';
import { createUserController } from "../controllers/authController.js";
import { loginController } from "../controllers/authController.js";
import { getuserController } from "../controllers/authController.js";
import fetchuser from '../middleware/fetchUser.js'
import { aadhaarOtpController } from "../controllers/authController.js";
import { verifyAadhaarOtpController  } from "../controllers/authController.js";
import { verifyPanCardController  } from "../controllers/authController.js";
import { voterIdVerification } from '../controllers/authController.js';
import { passportVerification } from '../controllers/authController.js';
import { creditReportCheckController } from '../controllers/authController.js';
import { gstVerifyController } from '../controllers/authController.js';
import { udyamAadhaarVerifyController } from '../controllers/authController.js';
import { panDetailedInfoGetController } from '../controllers/authController.js';
import { getVerificationCounts } from '../controllers/authController.js';
import { updateVerificationCount } from '../controllers/authController.js';
import { creditReportCheck } from '../controllers/authController.js';
import { getVerifiedUsers } from '../controllers/authController.js';
import { createBankController } from '../controllers/authController.js';
import { loginBankController } from '../controllers/authController.js';
import { getBank } from '../controllers/authController.js';
import { getAllBanks } from '../controllers/authController.js';
import { VerifyBankOTP } from '../controllers/authController.js';
import { sendBankEmail } from '../controllers/authController.js';
import { createNewBranch } from '../controllers/authController.js';
import { CreateBranchUser } from '../controllers/authController.js';

const router = express.Router()
router.post('/createUser',[
    body('fname', 'Enter a valid fname').isLength({ min: 3 }),
    body('Lname', 'Enter a valid Lname').isLength({ min: 3 }),
    body('Address', 'Enter a valid Address').isLength({ min: 3 }),
    body('PhoneNo', 'Enter a valid PhoneNo').isLength({ min: 10, max: 10 }).matches(/^[0-9]{10}$/),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
    body('City', 'Enter a City').isLength({ min: 3 }),

  ],createUserController

)
router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],loginController

)
router.get('/getuser',fetchuser,getuserController

)

router.post('/adhar', aadhaarOtpController);

router.post('/verifyAadhaarOtp', verifyAadhaarOtpController);

router.post('/verifyPanCard', verifyPanCardController);

router.post('/voter_verify', voterIdVerification);

router.post('/passport_verify', passportVerification);

router.post('/credit_report_checker', creditReportCheckController);

router.post('/credit_report', creditReportCheck);

router.post('/gst_verify', gstVerifyController);

router.post('/udyam_aadhaar_verify', udyamAadhaarVerifyController);

router.post('/pandetails_verify', panDetailedInfoGetController);

router.get('/verification-count', getVerificationCounts);

router.post('/update-verification-count', updateVerificationCount);

router.get('/verifiedUsers', getVerifiedUsers);

router.post('/bankuser', createBankController);

router.post('/banklogin', loginBankController);

router.get('/getbank',fetchuser, getBank);

router.get('/getallbank',fetchuser, getAllBanks);

router.post('/send_recovery_email', sendBankEmail);

router.post('/verify_otp', VerifyBankOTP);

router.post('/newbranch', createNewBranch);

router.post('/newBranchUser', CreateBranchUser);

export default router;