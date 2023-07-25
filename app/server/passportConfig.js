const connection = require('./db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  // Student Local Strategy
  passport.use(
    'student',
    new localStrategy(
      {
        usernameField: 'TUPCID',
        passwordField: 'PASSWORD',
      },
      (username, password, done) => {
        const query = 'SELECT * FROM student_accounts WHERE TUPCID = ?';
        connection.query(query, [username], (err, result) => {
          if (err) {
            return done(err); // Pass the error to done callback
          }
          if (result.length === 0) {
            return done(null, false);
          }
          const user = result[0];
          bcrypt.compare(password, user.PASSWORD, (err, response) => {
            if (err) {
              return done(err); // Pass the error to done callback
            }
            if (response === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  // Faculty Local Strategy
  passport.use(
    'faculty',
    new localStrategy(
      {
        usernameField: 'TUPCID',
        passwordField: 'PASSWORD',
      },
      (username, password, done) => {
        const query = 'SELECT * FROM faculty_accounts WHERE TUPCID = ?';
        connection.query(query, [username], (err, result) => {
          if (err) {
            return done(err); // Pass the error to done callback
          }
          if (result.length === 0) {
            return done(null, false);
          }
          const user = result[0];
          bcrypt.compare(password, user.PASSWORD, (err, response) => {
            if (err) {
              return done(err); // Pass the error to done callback
            }
            if (response === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  // Admin Local Strategy
  passport.use(
    'admin',
    new localStrategy(
      {
        usernameField: 'TUPCID',
        passwordField: 'PASSWORD',
      },
      (username, password, done) => {
        const query = 'SELECT * FROM admin_accounts WHERE TUPCID = ?';
        connection.query(query, [username], (err, result) => {
          if (err) {
            return done(err); // Pass the error to done callback
          }
          if (result.length === 0) {
            return done(null, false);
          }
          const user = result[0];
          bcrypt.compare(password, user.PASSWORD, (err, response) => {
            if (err) {
              return done(err); // Pass the error to done callback
            }
            if (response === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, { accountType: user.accountType, TUPCID: user.TUPCID });
  });

  passport.deserializeUser((userData, done) => {
    const { accountType, TUPCID } = userData;

    let table;
    switch (accountType) {
      case 'student':
        table = 'student_accounts';
        break;
      case 'faculty':
        table = 'faculty_accounts';
        break;
      case 'admin':
        table = 'admin_accounts';
        break;
      default:
        return done(new Error('Invalid account type'));
    }

    const query = `SELECT TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS FROM ${table} WHERE TUPCID = ?`;
    connection.query(query, [TUPCID], (err, result) => {
      if (err) {
        return done(err); // Pass the error to done callback
      }
      if (!result || result.length === 0) {
        return done(new Error('Failed to deserialize user'));
      }
      const user = {
        accountType,
        TUPCID: result[0].TUPCID,
        SURNAME: result[0].SURNAME,
        FIRSTNAME: result[0].FIRSTNAME,
        GSFEACC: result[0].GSFEACC,
        COURSE: result[0].COURSE,
        YEAR: result[0].YEAR,
        STATUS: result[0].STATUS,
      };
      done(null, user);
    });
  });
};
