const connection = require('./db');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
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

  passport.serializeUser((user, done) => {
    done(null, user.TUPCID);
  });

  passport.deserializeUser((TUPCID, done) => {
    const query = 'SELECT TUPCID, SURNAME, FIRSTNAME, GSFEACC, COURSE, YEAR, STATUS FROM student_accounts WHERE TUPCID = ?';
    connection.query(query, [TUPCID], (err, result) => {
      if (err) {
        return done(err); // Pass the error to done callback
      }
      if (!result || result.length === 0) {
        return done(new Error('Failed to deserialize user'));
      }
      const user = {
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
