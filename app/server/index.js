const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connection = require('./db');
const bcryptjs = require('bcryptjs');
const uuid = require('uuid'); // Import the uuid library for generating unique codes
const nodemailer = require('nodemailer'); // Import nodemailer for sending emails


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: false }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser('mySecretKey'));
app.use(passport.initialize());
app.use(passport.session());
require('./passportConfig')(passport);

// Check if the TUPCID already exists in the database for both students and faculty
const checkTUPCIDExists = async (TUPCID, table) => {
  try {
    const query = `SELECT TUPCID FROM ${table} WHERE TUPCID = ?`;
    const [rows] = await connection.query(query, [TUPCID]);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};


// FOR STUDENT REGISTRATION
app.post('/studreg', (req, res) => {
  const {
    TUPCID,
    SURNAME,
    FIRSTNAME,
    GSFEACC,
    COURSE,
    YEAR,
    STATUS,
    PASSWORD,
  } = req.body;

  // Check if the TUPCID already exists in the student_accounts table
  checkTUPCIDExists(TUPCID, 'student_accounts')
    .then((exists) => {
      if (exists) {
        return res.status(409).send({ message: 'TUPCID already exists. Student registration failed.' });
      }

      // TUPCID does not exist, proceed with student registration
      if (STATUS === 'REGULAR' || STATUS === 'IRREGULAR') {
        // Hash the password before storing it in the database
        bcryptjs.hash(PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          const query = `INSERT INTO student_accounts (TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, PASSWORD) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
          connection.query(
            query,
            [TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, hashedPassword], // Use hashedPassword here
            (err, result) => {
              if (err) {
                console.error('Error executing the INSERT query:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Student registered successfully' });
            }
          );
        });
      } else {
        return res.status(400).send({ message: 'Invalid STATUS value' });
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});

// FOR PROFESSOR REGISTRATION
app.post('/facultyreg', (req, res) => {
  const {
    TUPCID,
    SURNAME,
    FIRSTNAME,
    MIDDLENAME,
    GSFEACC,
    SUBJECTDEPT,
    PASSWORD,
  } = req.body;

  // Check if the TUPCID already exists in the faculty_accounts table
  checkTUPCIDExists(TUPCID, 'faculty_accounts')
    .then((exists) => {
      if (exists) {
        return res.status(409).send({ message: 'TUPCID already exists. Faculty registration failed.' });
      }

      // TUPCID does not exist, proceed with faculty registration
      bcryptjs.hash(PASSWORD, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).send({ message: 'Server error' });
        }

        const query = `INSERT INTO faculty_accounts (TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, PASSWORD) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        connection.query(
          query,
          [TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, hashedPassword],
          (err, result) => {
            if (err) {
              console.error('Error executing the INSERT query:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Faculty registered successfully' });
          }
        );
      });
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});

// DELETE STUDENT DATA
app.delete('/students/:TUPCID', (req, res) => {
  const { TUPCID } = req.params;
  const query = 'DELETE FROM student_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting student data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Student not found' });
    }
    return res.status(200).send({ message: 'Student deleted successfully' });
  });
});

// DELETE FACULTY DATA
app.delete('/faculty/:TUPCID', (req, res) => {
  const { TUPCID } = req.params;
  const query = 'DELETE FROM faculty_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting faculty data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Faculty not found' });
    }
    return res.status(200).send({ message: 'Faculty deleted successfully' });
  });
});

// DELETE ADMIN ACCOUNT
app.delete('/admin/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const query = 'DELETE FROM admin_accounts WHERE TUPCID = ?';
  connection.query(query, [TUPCID], (err, result) => {
    if (err) {
      console.error('Error deleting admin data:', err);
      return res.status(500).send({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Admin not found' });
    }
    return res.status(200).send({ message: 'Admin deleted successfully' });
  });
});


// GET STUDENT DATA
app.get('/students', (req, res) => {
  const query = 'SELECT TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS, PASSWORD FROM student_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// GET FACULTY DATA
app.get('/faculty', (req, res) => {
  const query = 'SELECT TUPCID, SURNAME, FIRSTNAME, MIDDLENAME, GSFEACC, SUBJECTDEPT, PASSWORD FROM faculty_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching faculty data:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// GET ADMIN ACCOUNTS
app.get('/admin', (req, res) => {
  const query = 'SELECT TUPCID, ADMINNAME, EMAIL, PASSWORD FROM admin_accounts';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching admin accounts:', err);
      return res.status(500).send({ message: 'Database error' });
    }
    return res.status(200).send(result);
  });
});

// UPDATE STUDENT DATA
app.put('/student/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the student_accounts table
  checkTUPCIDExists(TUPCID, 'student_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Student not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE student_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating student data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Student updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE student_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating student data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Student updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});



// UPDATE FACULTY DATA
app.put('/faculty/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the faculty_accounts table
  checkTUPCIDExists(TUPCID, 'faculty_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Faculty not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE faculty_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating faculty data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'Faculty updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE faculty_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating faculty data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'Faculty updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});


// UPDATE ADMIN DATA
app.put('/admin/:TUPCID', (req, res) => {
  const TUPCID = req.params.TUPCID;
  const updatedData = req.body;

  // Check if the TUPCID exists in the admin_accounts table
  checkTUPCIDExists(TUPCID, 'admin_accounts')
    .then((exists) => {
      if (!exists) {
        return res.status(404).send({ message: 'Faculty not found' });
      }

      // Hash the password before updating (if provided)
      if (updatedData.PASSWORD) {
        bcryptjs.hash(updatedData.PASSWORD, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: 'Server error' });
          }

          // Remove the password from updatedData since we don't want to update it separately
          const { PASSWORD, ...dataToUpdate } = updatedData;

          const fieldsToUpdate = Object.keys(dataToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');

          const query = `UPDATE admin_accounts
                         SET ${fieldsToUpdate}, PASSWORD = ?
                         WHERE TUPCID = ?`;

          connection.query(
            query,
            [...Object.values(dataToUpdate), hashedPassword, TUPCID],
            (err, result) => {
              if (err) {
                console.error('Error updating admin data:', err);
                return res.status(500).send({ message: 'Database error' });
              }
              return res.status(200).send({ message: 'admin updated successfully' });
            }
          );
        });
      } else {
        // If the PASSWORD field is not being updated, send the data to the server without hashing
        const fieldsToUpdate = Object.keys(updatedData)
          .filter((key) => key !== 'TUPCID') // Exclude TUPCID from the fields to update
          .map((key) => `${key} = ?`)
          .join(', ');

        const query = `UPDATE admin_accounts
                       SET ${fieldsToUpdate}
                       WHERE TUPCID = ?`;

        connection.query(
          query,
          [...Object.values(updatedData).filter((val) => val !== updatedData.PASSWORD), TUPCID],
          (err, result) => {
            if (err) {
              console.error('Error updating admin data:', err);
              return res.status(500).send({ message: 'Database error' });
            }
            return res.status(200).send({ message: 'admin updated successfully' });
          }
        );
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});


// LOGIN
app.post('/login', (req, res) => {
  const { TUPCID, PASSWORD } = req.body;
  let accountType = '';

  checkLogin('student_accounts', TUPCID, PASSWORD, 'student')
    .then((result) => {
      if (result.accountType) {
        accountType = result.accountType;
      } else {
        return checkLogin('faculty_accounts', TUPCID, PASSWORD, 'faculty');
      }
    })
    .then((result) => {
      if (result.accountType) {
        accountType = result.accountType;
      } else {
        // Account not found in any of the tables
        return res.status(404).send({ message: 'Account does not exist' });
      }
    })
    .then(() => {
      return res.status(200).send({ accountType });
    })
    .catch((err) => {
      console.error('Error checking login in the database:', err);
      return res.status(500).send({ message: 'Database error' });
    });
});


app.post('/adminlogin', (req, res) => {
  const { adminName } = req.body;

  // Check if the adminName exists in the admin_accounts table
  const query = 'SELECT * FROM admin_accounts WHERE ADMINNAME = ?';
  connection.query(query, [adminName], (err, result) => {
    if (err) {
      console.error('Error fetching admin account:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    if (result.length === 0) {
      // AdminName not found in the database
      return res.status(404).send({ isAuthenticated: false });
    }

    // AdminName found, admin is authenticated
    // In a production scenario, you may want to generate a secure token here and use it to authenticate the user
    return res.status(200).send({ isAuthenticated: true, adminName: result[0].ADMINNAME });
  });
});



//passwordreset



// Send email to GSFE Account
const sendEmailToGSFEAccount = (GSFEACC, code) => {
  // Replace these placeholders with your actual email service credentials and settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'eos2022to2023@gmail.com',
      pass: 'ujfshqykrtepqlau',
    },
  });

  const mailOptions = {
    from: 'eos2022to2023@gmail.com',
    to: GSFEACC,
    subject: 'Forgot Password Code',
    text: `Your unique code for password reset is: ${code}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Generate unique code, store it in the database, and send it to the registered GSFE account via email
const generateAndSendCode = async (TUPCID, GSFEACC) => {
  try {
    // Generate unique code using UUID library
    const code = uuid.v4();

    // Store the code in the database along with TUPCID and GSFEACC
    const query = 'INSERT INTO passwordreset_accounts (TUPCID, GSFEACC, code) VALUES (?, ?, ?)';
    await connection.query(query, [TUPCID, GSFEACC, code]);

    // Send the code to the registered GSFE account via email
    sendEmailToGSFEAccount(GSFEACC, code);
  } catch (err) {
    console.error('Error generating and sending code:', err);
  }
};

// FORGOT PASSWORD
app.post('/forgotpassword', async (req, res) => {
  const { TUPCID, GSFEACC } = req.body;

  // Helper function to check if the TUPCID exists in the specified table
  const checkTUPCIDExists = async (TUPCID, table) => {
    try {
      const query = `SELECT TUPCID FROM ${table} WHERE TUPCID = ?`;
      const [rows] = await connection.query(query, [TUPCID]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  };

  // Helper function to generate unique code, store it in the database, and send it to the provided GSFEACC
  const generateAndSendCode = async (TUPCID, GSFEACC) => {
    try {
      // Generate unique code using UUID library
      const code = uuid.v4();

      // Store the code in the database along with TUPCID and GSFEACC
      const query = 'INSERT INTO passwordreset_accounts (TUPCID, GSFEACC, code) VALUES (?, ?, ?)';
      await connection.query(query, [TUPCID, GSFEACC, code]);

      // Send the code to the registered GSFE account via email
      sendEmailToGSFEAccount(GSFEACC, code);

      // Send the response back to the client
      return res.status(200).send({ message: 'Code sent to GSFE Account' });
    } catch (err) {
      console.error('Error generating and sending code:', err);
      return res.status(500).send({ message: 'Failed to generate and send code' });
    }
  };

  // Check if the TUPCID exists in the student_accounts table
  checkTUPCIDExists(TUPCID, 'student_accounts')
    .then((existsInStudents) => {
      if (!existsInStudents) {
        // If not found in student_accounts, check in faculty_accounts
        return checkTUPCIDExists(TUPCID, 'faculty_accounts');
      } else {
        return true; // TUPCID exists in student_accounts
      }
    })
    .then((existsInFaculty) => {
      if (!existsInFaculty) {
        return res.status(404).send({ message: 'TUPCID does not exist' });
      } else {
        // TUPCID exists, generate unique code, store it in the database, and send it to the GSFE account
        return generateAndSendCode(TUPCID, GSFEACC);
      }
    })
    .catch((err) => {
      console.error('Error checking TUPCID in the database:', err);
      return res.status(500).send({ message: 'Failed to check TUPCID in the database' });
    });
});




//for server
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
