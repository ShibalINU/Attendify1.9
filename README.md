# Attendify
Build 14

### Database Information
attendify3.sql
tables:
- attendance -> displays current attendance of student of the day.
- attendance-archive -> archives past student attendance, used for recording attendance
- classes -> lists of subjects, the grade-section, schedule, and the incharged teacher, this is used to track what class is ongoing for that teacher
- users -> lists of registered teachers, guards, and users [⚠ i wasn't using hashes to protect the passwords therefore they are visible!! this can be changed though but depends if they need it]
use `describe [table]` to show its parts, just use chatgpt it can explain the database schema better than me.

### Current Limitations
✖ automated texts not yet implemented
✖ scanning with chokidar temporarily removed for debugging, use `/mark-attendance` route to simulate scanning!
✖ registering teachers, users, guards work in progress
✖ auto archive of attendance not yet implemented (supposedly `attendify` table gets archived every midnight, and is transferred to `attendify-archive` table) but you can simulate this by using `/archive-attendance` then `/prefill-attendance` afterwards
✖ automated texts not yet implemented
✖ ui not final
✖ documentation/how to/tutorial page not yet implemented

### What it can do
✔ added a cool clock widget i found for teachers
✔ dynamically show on going classes for teachers as well as lists of students
✔ ability to flag students as present, absent, late, excused, or cutting
✔ scanning of RFIDS gets logged to the `attendance` table, however the ability to scan was temporarily removed, you may use `/mark-attendance` to simulate scanning
✔ monthly attendance table shows past attendance of students to the subject for the current month (slight bugs may occur), it uses `attendance-archive` table
✔ ability to export student attendance per subject (powered by excel.js)
