import express from "express";
import connectToMongo from "./db/db.js";
import ExcelJS from 'exceljs';
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/authRoutes.js";
import path from 'path';
import Adhar from "./models/AadhaarSchema.js";
import pan from "./models/PanSchema.js"
import GST from "./models/GSTSchema.js"
import CREDIT from "./models/CreditSchema.js"
import Start from "./models/StartEndDate.js"
import VOTER from "./models/VoterSchema.js"
import PanDetail from "./models/PanDetailSchema.js";
import Passport from "./models/PassportSchema.js"
import Udyam from "./models/UdyamSchema.js"
import BRANCH from "./models/BranchCreate.js"
import CREATEUSER from "./models/CreateUser.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';


// Resolve __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'auth-token', 'Token'], 
}));
app.use(express.json());

// Connect to MongoDB
connectToMongo();

// Routes for authentication and Aadhaar
app.use("/api/auth", router);      
app.use("/api/adhar", router);     
app.use('/api/pan', router);
app.use('/api/voter', router);
app.use('/api/passport', router);
app.use('/api/credit', router);
app.use('/api/gst', router);
app.use('/api/udyam', router);
app.use('/api/pandetail', router);
app.use('/api/count', router);
app.use('/api/branch', router);
app.use('/api/newUser', router);

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>');
});

app.get("/api/adhar/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await Adhar.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/adhar/delete/:aadharNumber', async (req, res) => {
  try {
    const { aadharNumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await Adhar.deleteOne({ aadharNumber });

    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});



//Pan


app.get("/api/pan/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await pan.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pan/delete/:pannumber', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await pan.deleteOne({ pannumber });
    console.log(typeof pannumber, pannumber);


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Voter

app.get("/api/voter/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await VOTER.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/voter/delete/:id_number', async (req, res) => {
  try {
    const { id_number } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await VOTER.deleteOne({ id_number });

    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});


//Udyam

app.get("/api/udyam/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await Udyam.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/udyam/delete/:udyam_aadhaar', async (req, res) => {
  try {
    const { udyam_aadhaar } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await Udyam.deleteOne({ udyam_aadhaar });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});


//Pan Detail

app.get("/api/pandetail/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await PanDetail.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/pandetail/delete/:id_number', async (req, res) => {
  try {
    const { id_number } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await PanDetail.deleteOne({ id_number });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Passport

app.get("/api/passport/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await Passport.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/passport/delete/:id_number', async (req, res) => {
  try {
    const { id_number } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await Passport.deleteOne({ id_number });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Credit

app.get("/api/credit/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await CREDIT.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/credit/delete/:document_id', async (req, res) => {
  try {
    const { pannumber } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await CREDIT.deleteOne({ document_id });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//GST

app.get("/api/gst/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await GST.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/gst/delete/:id_number', async (req, res) => {
  try {
    const { id_number } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await GST.deleteOne({ id_number });


    if (result.deletedCount === 1) {
      res.json({ message: "User deleted successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

//Branch

app.get("/api/branch/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await BRANCH.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your Express backend:
app.delete('/api/branch/delete/:branchName', async (req, res) => {
  try {
    const { branchName } = req.params;

    // Find and delete the user with the specified Aadhaar number
    const result = await BRANCH.deleteOne({ branchName });


    if (result.deletedCount === 1) {
      res.json({ message: "Branch deleted successfully." });
    } else {
      res.status(404).json({ message: "Branch not found." });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete Branch." });
  }
});


// Update branch details by branch name
app.put("/api/branch/:branchName", async (req, res) => {
  const { branchName } = req.params; // Get branch name from route parameters
  const { bankId, bankName, srNo, newBranchName } = req.body; // Extract fields from the request body

  try {
    // Find the branch and update its details
    const updatedBranch = await BRANCH.findOneAndUpdate(
      { branchName: branchName },
      {
        bankId: bankId,
        bankName: bankName,
        srNo: srNo,
        branchName: newBranchName || branchName // Allow updating branch name or keep the old one
      },
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updatedBranch) {
      return res.status(404).json({ message: "Branch not found." });
    }

    res.status(200).json({ message: "Branch updated successfully.", branch: updatedBranch });
  } catch (error) {
    console.error("Error updating branch:", error);
    res.status(500).json({ message: "Failed to update branch." });
  }
});


// Route to fetch users based on date range
app.get('/download-excel', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const data = await fetchFilteredData(startDate, endDate); // Fetch data based on the date range.

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Filtered Data');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
    ];

    worksheet.addRows(data);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="filtered-data.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send('Error generating Excel file');
  }
});

app.get("/api/branchUser/verified", async (req, res) => {
  try {
    // Fetch all documents in the "Adhar" collection
    const verifiedUsers = await CREATEUSER.find(); // Ensure 'Adhar' model is correctly referenced

    if (verifiedUsers.length === 0) {
      return res.status(404).json({ message: "No verified users found." });
    }

    res.status(200).json(verifiedUsers); // Send the list of verified users
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Failed to fetch verified users." });
  }
});

// In your routes or controller file
app.get('/api/newUser/nextUserId', async (req, res) => {
  try {
    const lastUser = await CREATEUSER.findOne().sort({ _id: -1 });
    let nextUserId = '100001_01';

    if (lastUser) {
      const [base, count] = lastUser.userId.split('_');
      const newCount = String(parseInt(count) + 1).padStart(2, '0');
      nextUserId = `${base}_${newCount}`;
    }

    res.status(200).json({ nextUserId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});
