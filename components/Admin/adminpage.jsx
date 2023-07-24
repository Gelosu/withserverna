import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import bcryptjs from 'bcryptjs';

export default function AdminPage() {
  // Refs for password fields
  const newPasswordRef = useRef(null);
  const newAdminEmailRef = useRef(null);
  const newAdminNameRef = useRef(null);
  const newStudentPasswordRef = useRef(null);
  const newAdminPasswordRef = useRef(null);
  const newFacultyPasswordRef = useRef(null);

  // State variables
  const [selectedOption, setSelectedOption] = useState('student');
  const [studentData, setStudentData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [originalStudentData, setOriginalStudentData] = useState([]);
  const [originalFacultyData, setOriginalFacultyData] = useState([]);
  const [originalAdminData, setOriginalAdminData] = useState([]);
  const [isStudentEditing, setIsStudentEditing] = useState(false);
  const [isFacultyEditing, setIsFacultyEditing] = useState(false);
  const [isAdminEditing, setIsAdminEditing] = useState(false);

  // Event handlers
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  
  const handleEditClick = (dataType) => {
    setIsEditing(true);

    if (dataType === 'student') {
      setIsStudentEditing(true);
      setOriginalStudentData([...studentData]);
    } else if (dataType === 'faculty') {
      setIsFacultyEditing(true);
      setOriginalFacultyData([...facultyData]);
    } else if (dataType === 'admin') {
      setIsAdminEditing(true);
      setOriginalAdminData([...adminData]);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsStudentEditing(false);
    setIsFacultyEditing(false);
    setIsAdminEditing(false);
    setStudentData([...originalStudentData]);
    setFacultyData([...originalFacultyData]);
    setAdminData([...originalAdminData]);
  };


  // Update functions for student, faculty, and admin data
  // Function to update student data on the server
  const updateStudentDataOnServer = (TUPCID, updatedData) => {
    axios
      .put(`http://localhost:3001/student/${TUPCID}`, updatedData)
      .then((response) => {
        console.log(response.data);
        setIsEditing(false);
        setStudentData((prevData) =>
          prevData.map((student) =>
            student.TUPCID === TUPCID ? { ...student, ...updatedData } : student
          )
        );
      })
      .catch((error) => {
        console.error('Error updating student data:', error);
      });
  };
  

  const updateFacultyDataOnServer = (TUPCID, updatedData) => {
    axios
      .put(`http://localhost:3001/faculty/${TUPCID}`, updatedData)
      .then((response) => {
        console.log(response.data);
        setIsEditing(false);
        setFacultyData((prevData) =>
          prevData.map((faculty) =>
            faculty.TUPCID === TUPCID ? { ...faculty, ...updatedData } : faculty
          )
        );
      })
      .catch((error) => {
        console.error('Error updating faculty data:', error);
      });
  };

  
   
// Function to update admin data on the server
const updateAdminDataOnServer = (TUPCID, updatedData) => {
  axios
    .put(`http://localhost:3001/admin/${TUPCID}`, updatedData)
    .then((response) => {
      console.log(response.data);
      setIsEditing(false);
      setAdminData((prevData) =>
        prevData.map((admin) =>
          admin.TUPCID === TUPCID ? { ...admin, ...updatedData } : admin
        )
      );
    })
    .catch((error) => {
      console.error('Error updating admindata:', error);
    });
};



  
  const handleUpdateSubmit = (TUPCID, dataType) => {
    const dataToUpdate =
      dataType === 'student'
        ? studentData.find((student) => student.TUPCID === TUPCID)
        : dataType === 'faculty'
        ? facultyData.find((faculty) => faculty.TUPCID === TUPCID)
        : adminData.find((admin) => admin.TUPCID === TUPCID);

    const newPassword = newPasswordRef.current?.value;

    let updatedData = {
      ...dataToUpdate,
      PASSWORD: newPassword || dataToUpdate.PASSWORD,
    };

    if (dataType === 'student') {
      const newStudentPassword = newStudentPasswordRef.current?.value;
      if (newStudentPassword) {
        bcryptjs.hash(newStudentPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
          } else {
            updatedData.STATUS = dataToUpdate.STATUS;
            updatedData.PASSWORD = hashedPassword;
            updateStudentDataOnServer(TUPCID, updatedData);
            setIsEditing(false);
            setIsStudentEditing(false);
          }
        });
      } else {
        updateStudentDataOnServer(TUPCID, updatedData);
        setIsEditing(false);
        setIsStudentEditing(false);
      }
    } else if (dataType === 'faculty') {
      const newFacultyPassword = newFacultyPasswordRef.current?.value;
      if (newFacultyPassword) {
        bcryptjs.hash(newFacultyPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
          } else {
            updatedData.PASSWORD = hashedPassword;
            updateFacultyDataOnServer(TUPCID, updatedData);
            setIsEditing(false);
            setIsFacultyEditing(false);
          }
        });
      } else {
        updateFacultyDataOnServer(TUPCID, updatedData);
        setIsEditing(false);
        setIsFacultyEditing(false);
      }
    } else if (dataType === 'admin') {
      const newAdminPassword = newAdminPasswordRef.current?.value;
      if (newAdminPassword) {
        bcryptjs.hash(newAdminPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
          } else {
            updatedData.PASSWORD = hashedPassword;
            updatedData.ADMINNAME = dataToUpdate.ADMINNAME;
            updatedData.EMAIL = dataToUpdate.EMAIL;
            updateAdminDataOnServer(TUPCID, updatedData);
            setIsEditing(false);
            setIsAdminEditing(false);
          }
        });
      } else {
        // No need to hash password again, just update name and email
        updatedData.ADMINNAME = newAdminNameRef.current?.value;
        updatedData.EMAIL = newAdminEmailRef.current?.value;
        updateAdminDataOnServer(TUPCID, updatedData);
        setIsEditing(false);
        setIsAdminEditing(false);
      }
    }
  };
  

  const handleDelete = (TUPCID, dataType) => {
    let endpoint;
    switch (dataType) {
      case 'student':
        endpoint = 'students';
        break;
      case 'faculty':
        endpoint = 'faculty';
        break;
      case 'admin':
        endpoint = 'admin';
        break;
      default:
        break;
    }

    axios
      .delete(`http://localhost:3001/${endpoint}/${TUPCID}`)
      .then((response) => {
        console.log(response.data);
        // Fetch data again after deletion
        fetchData();
      })
      .catch((error) => {
        console.error('Error deleting data:', error);
      });
  };

  const fetchData = () => {
    switch (selectedOption) {
      case 'student':
        axios
          .get('http://localhost:3001/students')
          .then((response) => {
            setStudentData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching student data:', error);
          });
        break;
      case 'faculty':
        axios
          .get('http://localhost:3001/faculty')
          .then((response) => {
            setFacultyData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching faculty data:', error);
          });
        break;
      case 'admin':
        axios
          .get('http://localhost:3001/admin')
          .then((response) => {
            setAdminData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching admin data:', error);
          });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOption]);

  const filterData = (data, query) => {
    return data.filter((item) => {
      const fullName = `${item.SURNAME} ${item.FIRSTNAME}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
  };

  const handleSearch = () => {
    let filteredData;
    switch (selectedOption) {
      case 'student':
        filteredData = filterData(studentData, searchQuery);
        setStudentData(filteredData);
        break;
      case 'faculty':
        filteredData = filterData(facultyData, searchQuery);
        setFacultyData(filteredData);
        break;
      case 'admin':
        filteredData = filterData(adminData, searchQuery);
        setAdminData(filteredData);
        break;
      default:
        break;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchData();
  };

  const filteredStudentData = filterData(studentData, searchQuery);
  const filteredFacultyData = filterData(facultyData, searchQuery);
  const filteredAdminData = filterData(adminData, searchQuery);


  return (
    <div>
      <h1>ADMIN PAGE</h1>
      <a href="/login">LOGOUT</a>
      <div>
        <label htmlFor="databaseOption">Select Database:</label>
        <select
          id="databaseOption"
          value={selectedOption}
          onChange={handleOptionChange}
        >
          <option value="student">STUDENT DATABASE</option>
          <option value="faculty">FACULTY DATABASE</option>
          <option value="admin">ADMIN DATABASE</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name"
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleClearSearch}>Clear Search</button>
      </div>

      {selectedOption === 'student' && (
        <div>
          <table>
            {/* Table Header */}
            <thead>
              <tr>
                <th>TUPCID</th>
                <th>SURNAME</th>
                <th>FIRSTNAME</th>
                <th>GSFEACC</th>
                <th>COURSE</th>
                <th>YEAR</th>
                <th>STATUS</th>
                <th>PASSWORD</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredStudentData.map((student) => (
                <tr key={student.TUPCID}>
                  <td>{student.TUPCID}</td>
                  <td>{student.SURNAME}</td>
                  <td>{student.FIRSTNAME}</td>
                  <td>{student.GSFEACC}</td>
                  <td>{student.COURSE}</td>
                  <td>
                    {isEditing && isStudentEditing ? (
                      <input
                        type="text"
                        value={student.YEAR}
                        onChange={(e) =>
                          setStudentData((prevData) =>
                            prevData.map((prevStudent) =>
                              prevStudent.TUPCID === student.TUPCID
                                ? { ...prevStudent, YEAR: e.target.value }
                                : prevStudent
                            )
                          )
                        }
                      />
                    ) : (
                      student.YEAR
                    )}
                  </td>
                  <td>
                    {isEditing && isStudentEditing ? (
                      <input
                        type="text"
                        value={student.STATUS}
                        onChange={(e) =>
                          setStudentData((prevData) =>
                            prevData.map((prevStudent) =>
                              prevStudent.TUPCID === student.TUPCID
                                ? { ...prevStudent, STATUS: e.target.value }
                                : prevStudent
                            )
                          )
                        }
                      />
                    ) : (
                      student.STATUS
                    )}
                  </td>
                  <td>
                    {isEditing && isStudentEditing ? (
                      <input
                        type="password"
                        value={student.PASSWORD}
                        onChange={(e) =>
                          setStudentData((prevData) =>
                            prevData.map((prevStudent) =>
                              prevStudent.TUPCID === student.TUPCID
                                ? { ...prevStudent, PASSWORD: e.target.value }
                                : prevStudent
                            )
                          )
                        }
                      />
                    ) : (
                      student.PASSWORD
                    )}
                  </td>
                  <td>
                    {isStudentEditing ? (
                      <div>
                        <button onClick={() => handleUpdateSubmit(student.TUPCID, 'student')}>Update</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick('student')}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(student.TUPCID, 'student')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOption === 'faculty' && (
        <div>
          <table>
            {/* Table Header */}
            <thead>
              <tr>
                <th>TUPCID</th>
                <th>SURNAME</th>
                <th>FIRSTNAME</th>
                <th>MIDDLENAME</th>
                <th>GSFEACC</th>
                <th>SUBJECT DEPARTMENT</th>
                <th>PASSWORD</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredFacultyData.map((faculty) => (
                <tr key={faculty.TUPCID}>
                  <td>{faculty.TUPCID}</td>
                  <td>{faculty.SURNAME}</td>
                  <td>{faculty.FIRSTNAME}</td>
                  <td>{faculty.MIDDLENAME}</td>
                  <td>{faculty.GSFEACC}</td>
                  <td>
                    {isEditing && isFacultyEditing ? (
                      <input
                        type="text"
                        value={faculty.SUBJECTDEPT}
                        onChange={(e) =>
                          setFacultyData((prevData) =>
                            prevData.map((prevFaculty) =>
                              prevFaculty.TUPCID === faculty.TUPCID
                                ? { ...prevFaculty, SUBJECTDEPT: e.target.value }
                                : prevFaculty
                            )
                          )
                        }
                      />
                    ) : (
                      faculty.SUBJECTDEPT
                    )}
                  </td>
                  <td>
                    {isEditing && isFacultyEditing ? (
                      <input
                        type="password"
                        defaultValue={faculty.PASSWORD}
                        ref={newFacultyPasswordRef}
                      />
                    ) : (
                      faculty.PASSWORD
                    )}
                  </td>
                  <td>
                    {isFacultyEditing ? (
                      <div>
                        <button onClick={() => handleUpdateSubmit(faculty.TUPCID, 'faculty')}>Update</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick('faculty')}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(faculty.TUPCID, 'faculty')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOption === 'admin' && (
        <div>
          <table>
            {/* Table Header */}
            <thead>
              <tr>
                <th>TUPCID</th>
                <th>ADMINNAME</th>
                <th>EMAIL</th>
                <th>PASSWORD</th>
                <th>Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredAdminData.map((admin) => (
                <tr key={admin.TUPCID}>
                  <td>{admin.TUPCID}</td>
                  <td>
                    {isEditing && isAdminEditing ? (
                      <input
                        type="text"
                        value={admin.ADMINNAME}
                        onChange={(e) =>
                          setAdminData((prevData) =>
                            prevData.map((prevAdmin) =>
                              prevAdmin.TUPCID === admin.TUPCID
                                ? { ...prevAdmin, ADMINNAME: e.target.value }
                                : prevAdmin
                            )
                          )
                        }
                      />
                    ) : (
                      admin.ADMINNAME
                    )}
                  </td>
                  <td>
                    {isEditing && isAdminEditing ? (
                      <input
                        type="text"
                        value={admin.EMAIL}
                        onChange={(e) =>
                          setAdminData((prevData) =>
                            prevData.map((prevAdmin) =>
                              prevAdmin.TUPCID === admin.TUPCID
                                ? { ...prevAdmin, EMAIL: e.target.value }
                                : prevAdmin
                            )
                          )
                        }
                      />
                    ) : (
                      admin.EMAIL
                    )}
                  </td>
                  <td>
                    {isEditing && isAdminEditing ? (
                      <input
                        type="password"
                        defaultValue={admin.PASSWORD}
                        ref={newAdminPasswordRef}
                      />
                    ) : (
                      admin.PASSWORD
                    )}
                  </td>
                  <td>
                    {isAdminEditing ? (
                      <div>
                        <button onClick={() => handleUpdateSubmit(admin.TUPCID, 'admin')}>Update</button>
                        <button onClick={handleCancelClick}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => handleEditClick('admin')}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(admin.TUPCID, 'admin')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
