# Attendify
Online attendance tracking system | Build 14

![image](https://github.com/user-attachments/assets/230d74c1-06d4-40a6-9402-c91e194d3382)


### What you need
- mysql 8.4
- vscode
- node.js
- dependencies
  
### Dependencies used as of jan 21 2025
```
{
  "dependencies": {
    "chokidar": "^4.0.1",
    "exceljs": "^4.4.0",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "mysql2": "^3.11.4",
    "nodemon": "^3.1.7"
  }
}
```
nodemon is optinal but i highly recommend

### Database Information
attendify3.sql
tables:
- attendance -> displays current attendance of student of the day.
- attendance-archive -> archives past student attendance, used for recording attendance
- classes -> lists of subjects, the grade-section, schedule, and the incharged teacher, this is used to track what class is ongoing for that teacher
- users -> lists of registered teachers, guards, and users [⚠ i wasn't using hashes to protect the passwords therefore they are visible!! this can be changed though but depends if they need it]
use `describe [table]` to show its parts, just use chatgpt it can explain the database schema better than me.

### Current Limitations
✖ some codes are purposely hardcoded especially time and date for testing, please consider checking the code before running, you might run into unexpected situtations, chatgpt has added console.logs everywhere so regularly check the console!

✖ automated texts not yet implemented

✖ scanning with chokidar temporarily removed for debugging, use `/mark-attendance` route to simulate scanning!

✖ registering teachers, users, guards work in progress

✖ auto archive of attendance not yet implemented (supposedly `attendify` table gets archived every midnight, and is transferred to `attendify-archive` table) but you can simulate this by using `/archive-attendance` then `/prefill-attendance` afterwards

✖ automated texts not yet implemented

✖ ui not final

✖ documentation/how to/tutorial page not yet implemented

### What it can do
✔ working log in system, you cannot sign up directly there. **so just view the password on mysql command line client: ->** `select * from users`

✔ added a cool clock widget i found for teachers

✔ dynamically show on going classes for teachers as well as lists of students

✔ ability to flag students as present, absent, late, excused, or cutting

✔ scanning of RFIDS gets logged to the `attendance` table, however the ability to scan was temporarily removed, you may use `/mark-attendance` to simulate scanning

✔ monthly attendance table shows past attendance of students to the subject for the current month (slight bugs may occur), it uses `attendance-archive` table

✔ ability to export student attendance per subject (powered by excel.js)

✔ weekly schedule for teachers

---

was taking too long to work on this laptop is heavily damaged :(
