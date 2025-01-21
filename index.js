// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.
// at some point you'll eventually let AI code for you.

const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2');
const ExcelJS = require('exceljs')

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'attendify',
  database: 'Attendify3',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// Authentication Middleware
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.post('/', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials!' });
    }

    req.session.loggedIn = true;
    req.session.user = { username: results[0].username, full_name: results[0].full_name, role: results[0].role};
    res.json({
      success: true, 
      redirect: results[0].role === 'teacher' ? '/teacher' : 
                results[0].role === 'admin' ? '/admin' : '/guard'
    });
    
  });
});

// Teacher Dashboard
app.get('/teacher', ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== 'teacher') {
    return res.status(403).send('Access denied.');
  }
  res.sendFile(path.join(__dirname, 'public', 'teacher.html'));
});

app.get('/teacher/classes', ensureAuthenticated, (req, res) => {
  if (!req.session.loggedIn || req.session.user.role !== 'teacher') {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }

  const username = req.session.user.username;

  // Step 1: Get the teacher ID based on the username
  const getTeacherIdQuery = 'SELECT id FROM users WHERE username = ? AND role = "teacher"';
  
  db.query(getTeacherIdQuery, [username], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: 'Teacher not found' });
    }

    const teacherId = results[0].id;

    // Step 2: Get all classes of the teacher
    const getClassesQuery = `
      SELECT c.subject_name, c.grade_section, c.day, c.start_time, c.end_time
      FROM classes c
      WHERE c.teacher_id = ?
      ORDER BY c.day, c.start_time
    `;

    db.query(getClassesQuery, [teacherId], (err, classes) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      // Create a data structure to represent the week
      const week = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: []
      };

      classes.forEach(cls => {
        const { subject_name, grade_section, day, start_time, end_time } = cls;

        // Push the class into the correct day
        week[day].push({
          subject_name,
          grade_section,
          start_time,
          end_time
        });
      });

      console.log(week);
      res.json({ success: true, week });
    });
  });
});

app.get('/dynamic-monitoring', ensureAuthenticated, (req, res) => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day name, e.g., 'Friday'
  const time = "12:01:00"; // Update as needed
  // const time = now.toTimeString().split(' ')[0]; // Get time in HH:MM:SS format
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });; // Get date in YYYY-MM-DD format
  console.log(`dynamic monitoring: ${now}, ${day}, ${date}, ${time}`)
  // const day = "Friday"; // Update as needed

  // const date = "2024-10-25"; // Update as needed
  const teacher = req.session.user.username; // Dynamically get the logged-in teacher's username

  const SQL1 = `
    SELECT * FROM classes
    WHERE teacher_id = (SELECT id FROM users WHERE username = ?)
    AND day = ?
    AND start_time <= ?
    AND end_time >= ?;
  `;

  db.query(SQL1, [teacher, day, time, time], (err, classData) => {
    if (err) {
        console.error(`Error: ${err}`);
        return res.status(500).send("Error retrieving class data");
    }

    if (classData.length === 0) {
        return res.status(404).send("No classes found for the given parameters");
    }

    // Now, fetch the students based on the same conditions
    const SQL2 = `
        SELECT u.id AS student_id, u.full_name, a.status, a.time_in, c.grade_section
        FROM attendance a
        JOIN classes c ON a.class_id = c.id
        JOIN users u ON a.student_id = u.id
        WHERE c.teacher_id = (SELECT id FROM users WHERE username = ?)
        AND c.day = ?
        AND c.start_time <= ?
        AND c.end_time >= ?
        AND a.attendance_date = ?;
    `;

    db.query(SQL2, [teacher, day, time, time, date], (err, studentsData) => {
        if (err) {
            console.error(`Error: ${err}`);
            return res.status(500).send("Error retrieving students data");
        }

        if (studentsData.length === 0) {
            return res.status(404).send("No student attendance records found for the given class");
        }

        res.json({
            class: classData,
            students: studentsData
        });
    });
  });
});

app.get('/get-attendance', ensureAuthenticated, (req, res) => {
  // Ensure user is authenticated
  if (!req.session || !req.session.user || req.session.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Unauthorized access' });
  }

  const teacher = req.session.user.username; // Dynamic teacher username
  const month = req.query.month || new Date().getMonth() //
  + 1; // Default: current month
  const year = req.query.year || new Date().getFullYear(); // Default: current year
  console.log(`get monthly attendance: ${month}, ${year}`)

  // Query to get class IDs for the specified teacher
  const getClassIdsQuery = `
      SELECT id FROM classes
      WHERE teacher_id = (SELECT id FROM users WHERE username = ?);
  `;

  db.query(getClassIdsQuery, [teacher], (err, result) => {
      if (err) {
          console.error("Error retrieving class IDs: ", err);
          return res.status(500).json({ error: 'Error retrieving class data' });
      }

      if (!result || result.length === 0) {
          console.log("No classes found for this teacher.");
          return res.json({ students: [] }); // No classes
      }

      const classIds = result.map(c => c.id);
      console.log("Class IDs:", classIds);

      // Query to fetch attendance for the teacher's classes
      const attendanceQuery = `
          SELECT u.full_name, a.attendance_date, a.status
          FROM attendance_archive a
          JOIN users u ON a.student_id = u.id
          WHERE MONTH(a.attendance_date) = ? 
          AND YEAR(a.attendance_date) = ? 
          AND a.class_id IN (?);
      `;

      db.query(attendanceQuery, [month, year, classIds], (error, results) => {
          if (error) {
              console.error("Database query failed: ", error);
              return res.status(500).json({ error: 'Database query failed' });
          }

          console.log("Attendance results:", results);

          // Process results by student name
          const students = {};
          results.forEach(row => {
              if (!students[row.full_name]) {
                  students[row.full_name] = { full_name: row.full_name, attendance: {} };
              }
              const day = new Date(row.attendance_date).getDate();
              students[row.full_name].attendance[day] = row.status;
          });

          res.json({ students: Object.values(students) });
      });
  });
});

app.post('/update-status', ensureAuthenticated, (req, res) => {
  const { student_id, status, class_id } = req.body;

  // Assume db is your database connection
  db.query('SELECT * FROM attendance WHERE student_id = ? AND class_id = ?', [student_id, class_id], (error, results) => {
      if (error) {
          return res.status(500).json({ message: 'Database error', error });
      }

      if (results.length > 0) {
          // If the record exists, update the status
          db.query('UPDATE attendance SET status = ? WHERE student_id = ? AND class_id = ?', [status, student_id, class_id], (updateError) => {
              if (updateError) {
                  return res.status(500).json({ message: 'Error updating status', error: updateError });
              }
              res.json({ message: 'Status updated successfully' });
          });
      } else {
          // If no record exists, create a new one
          const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
          db.query('INSERT INTO attendance (student_id, status, class_id, attendance_date) VALUES (?, ?, ?, ?)', 
              [student_id, status, class_id, currentDate], (insertError) => {
                  if (insertError) {
                      return res.status(500).json({ message: 'Error inserting status', error: insertError });
                  }
                  res.json({ message: 'Status created successfully' });
              });
      }
  });
});

app.get('/listInchargedClass', ensureAuthenticated, (req, res) => {
  const username = req.session.user.username;

  db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      const teacherId = results[0].id;

      db.query(
          'SELECT DISTINCT subject_name FROM classes WHERE teacher_id = ?',
          [teacherId],
          (err, classes) => {
              if (err) {
                  return res.status(500).json({ error: 'Database error' });
              }

              res.json(classes);
          }
      );
  });
});

app.get('/prefill-attendance', (req, res) => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day name, e.g., 'Friday'
  const time = now.toTimeString().split(' ')[0]; // Get time in HH:MM:SS format
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });; // Get date in YYYY-MM-DD format 
  console.log(`prefill attendance: ${now}, ${day}, ${date}, ${time}`)
  // const day = "Friday";  // Hardcoded for testing purposes
  // const time = "07:00:00"; // Hardcoded time for testing
  // const date = "2024-10-25"; // Hardcoded date for testing

  const prefillSQL = `
      INSERT INTO attendance (student_id, class_id, attendance_date, time_in, status)
      SELECT u.id, c.id, '${date}', '${time}', 'absent'
      FROM users u
      JOIN classes c ON u.grade_section = c.grade_section
      WHERE u.role = 'student' AND c.day = '${day}'
      ON DUPLICATE KEY UPDATE attendance.status = 'absent';
  `;

  db.query(prefillSQL, (err, result) => {
      if (err) {
          console.error(`Error prefilling attendance: ${err}`);
          res.status(500).send('Error prefilling attendance');
      } else {
          res.json({ message: 'Attendance prefilling done', affectedRows: result.affectedRows });
      }
  });
});

app.get('/archive-attendance', (req, res) => {
    const archiveQuery = `
        INSERT INTO attendance_archive (id, student_id, class_id, attendance_date, status, time_in, time_out)
        SELECT id, student_id, class_id, attendance_date, status, time_in, time_out
        FROM attendance
        WHERE status IN ('present', 'absent', 'excused', 'cutting', 'late') -- Ensure valid statuses
    `;

    const truncateQuery = 'TRUNCATE TABLE attendance';

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Transaction error: ' + err.message });
        }

        // Archive attendance
        db.query(archiveQuery, (error, results) => {
            if (error) {
                return db.rollback(() => {
                    return res.status(500).json({ error: 'Archiving failed: ' + error.message });
                });
            }

            // Truncate attendance
            db.query(truncateQuery, (error) => {
                if (error) {
                    return db.rollback(() => {
                        return res.status(500).json({ error: 'Truncating failed: ' + error.message });
                    });
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            return res.status(500).json({ error: 'Transaction commit failed: ' + err.message });
                        });
                    }

                    res.status(200).json({ message: 'Attendance archived and table truncated successfully.' });
                });
            });
        });
    });
});

app.get('/export/:subject/:teacher', ensureAuthenticated, async (req, res) => {
  // Get the subject and teacher's username from the path parameters
  const subject = decodeURIComponent(req.params.subject); // Decode the subject
  const teacherUsername = decodeURIComponent(req.params.teacher); // Decode the teacher username

  // Update the query to include both the subject and teacher's username
  const query = `
      SELECT 
          u.full_name AS student_name,
          u.grade_section AS student_grade_section,
          DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS attendance_date,
          a.status,
          (SELECT full_name FROM users WHERE id = c.teacher_id) AS teacher_name,
          (SELECT username FROM users WHERE id = c.teacher_id) AS teacher_username, -- Get the teacher's username
          c.start_time AS class_start_time -- Add class start time
      FROM 
          users u
      JOIN 
          attendance_archive a ON u.id = a.student_id
      JOIN 
          classes c ON a.class_id = c.id
      WHERE 
          u.role = 'student' 
          AND c.subject_name LIKE ? 
          AND (SELECT username FROM users WHERE id = c.teacher_id) = ?
      ORDER BY 
          a.attendance_date, u.grade_section, u.full_name
  `;

  // Execute the query with both subject and teacher's username parameters
  db.query(query, [`%${subject}%`, teacherUsername], async (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Database query failed' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'No attendance records found for the specified subject and teacher.' });
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Attendance');

      // Add the subject title in large font "Segoe UI Semibold"
      const subjectTitleRow = worksheet.addRow([subject]);
      subjectTitleRow.font = { name: 'Segoe UI Semibold', size: 24, bold: true }; // Use Segoe UI Semibold for the title
      worksheet.mergeCells(`A1:E1`); // Merge cells for the title

      // Add the teacher's name below the subject without font styles or prefix
      const teacherName = results[0].teacher_name; // Assuming the teacher is the same for all rows
      const teacherRow = worksheet.addRow([teacherName]);
      worksheet.mergeCells(`A2:E2`); // Merge cells for the teacher's name

      // Add a blank row for spacing
      worksheet.addRow([]);

      // Add column headers in "Segoe UI Semibold"
      worksheet.addRow(['Student Name', 'Grade Section', 'Attendance Date', 'Class Start Time', 'Status']); // Add headers row
      const headerRow = worksheet.getRow(4); // Get the row where headers are
      headerRow.font = { name: 'Segoe UI Semibold', bold: true }; // Use Segoe UI Semibold for the headers

      // Set column widths
      worksheet.getColumn(1).width = 30; // Student Name
      worksheet.getColumn(2).width = 15; // Grade Section
      worksheet.getColumn(3).width = 20; // Attendance Date
      worksheet.getColumn(4).width = 20; // Class Start Time
      worksheet.getColumn(5).width = 15; // Status

      // Add rows to the worksheet with spacing between different dates and grade sections
      let lastDate = null;
      let lastGradeSection = null;

      results.forEach((row) => {
          // Check if the date or grade section has changed
          if (lastDate !== row.attendance_date || lastGradeSection !== row.student_grade_section) {
              // Add a blank row to separate dates or grade sections
              worksheet.addRow([]);
              lastDate = row.attendance_date;
              lastGradeSection = row.student_grade_section;
          }

          // Add the current row to the worksheet
          const addedRow = worksheet.addRow([
              row.student_name,
              row.student_grade_section,
              row.attendance_date,
              row.class_start_time, // Add class start time
              row.status.toString(),
          ]);

          // Define pastel colors for the status
          let fillColor;
          switch (row.status) {
              case 'present':
                  fillColor = 'C6EFCE'; // Light green
                  break;
              case 'absent':
                  fillColor = 'F2F2F2'; // Light gray
                  break;
              case 'late':
                  fillColor = 'FFEB9C'; // Light yellow
                  break;
              case 'cutting':
                  fillColor = 'FFC7CE'; // Light red
                  break;
              case 'excused':
                  fillColor = 'BDD7EE'; // Light blue
                  break;
              default:
                  fillColor = 'FFFFFF'; // Default white
                  break;
          }

          // Apply the fill to the entire row
          addedRow.eachCell((cell) => {
              cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: fillColor },
              };
          });

          // Align the status cell to the left
          const statusCell = addedRow.getCell(5); // Use the column index (1-based)
          statusCell.alignment = { vertical: 'middle', horizontal: 'left' };
      });

      // Add a blank row for gap before the watermark
      worksheet.addRow([]);

      // Add a watermark in the last row
      const watermarkText = 'Attendify, © Copyright 2024 Rodriguez N., Ros H., Peñas J., Esperida D., Guido R., Oropesa V. Caudilla, A. All Rights Reserved';
      const watermarkRow = worksheet.addRow([watermarkText]);

      // Style the watermark row
      watermarkRow.font = {
          name: 'Segoe UI',
          size: 9,
          color: { argb: '808080' }, // Light gray color (#808080)
      };
      worksheet.mergeCells(`A${watermarkRow.number}:E${watermarkRow.number}`); // Merge the cells across the full width
      watermarkRow.alignment = { horizontal: 'left', vertical: 'middle' }; // Left align the text

      // Set response headers to download the file
      res.setHeader('Content-Disposition', `attachment; filename=${subject}_${teacherUsername}_attendance.xlsx`);
      await workbook.xlsx.write(res);
      res.end();
  });
});


// Guard Dashboard
app.get('/guard', ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== 'guard') {
    return res.status(403).send('Access denied.');
  }
  res.sendFile(path.join(__dirname, 'public', 'guard.html'));
});

app.get('/mark-attendance', (req, res) => {
  const { student_rfid } = { "student_rfid": "RFID006" }; // Simulated RFID scan
  const current_time = "7:33:00"; // Simulated scan time
  const current_date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

  // Step 1: Fetch student's classes for the current day
  const checkClassesSQL = `
      SELECT c.id AS class_id, c.start_time, c.end_time
      FROM classes c
      JOIN users u ON u.grade_section = c.grade_section
      WHERE u.rfid = ? AND c.day = DAYNAME(?)
      ORDER BY c.start_time;
  `;

  db.query(checkClassesSQL, [student_rfid, current_date], (err, classes) => {
      if (err) return res.status(500).send("Error retrieving class information");
      if (classes.length === 0) return res.status(404).send("No classes found for the student.");

      // Helper function to get attendance status
      const getAttendanceStatus = (class_start, class_end, current) => {
          const start = timeToSeconds(class_start);
          const end = timeToSeconds(class_end);
          const currentTime = timeToSeconds(current);
          const lateThreshold = start + 900; // 15-minute grace period

          if (currentTime < start) return 'present';
          if (currentTime < lateThreshold) return 'present'; // Early arrival
          if (currentTime <= end) return 'late'; // Late arrival
          return 'absent'; // Missed class
      };

      // Step 2: Iterate through student's classes and update attendance
      const updates = classes.map(({ class_id, start_time, end_time }) => {
          const attendanceStatus = getAttendanceStatus(start_time, end_time, current_time);

          const updateSQL = `
              UPDATE attendance 
              SET status = ?, time_in = ?
              WHERE student_id = (SELECT id FROM users WHERE rfid = ?)
              AND class_id = ? AND attendance_date = ?;
          `;
          return new Promise((resolve, reject) => {
              db.query(updateSQL, [attendanceStatus, current_time, student_rfid, class_id, current_date], (err) => {
                  if (err) return reject(`Error updating attendance for class ${class_id}: ${err}`);
                  resolve(`Attendance updated for class ${class_id}: ${attendanceStatus}`);
              });
          });
      });

      // Wait
      Promise.all(updates)
          .then(results => res.json({ message: "Attendance marking process completed" }))
          .catch(err => res.status(500).send(err));
  });
});

// Helper function to convert time (HH:MM:SS) to seconds from midnight
function timeToSeconds(time) {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return (hours * 3600) + (minutes * 60) + seconds;
}

// Admin Dashboard
app.get('/admin', ensureAuthenticated, (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Fetch User Info
app.get('/api/user', ensureAuthenticated, (req, res) => {
  res.json(req.session.user);
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
