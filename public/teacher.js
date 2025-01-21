// teacher.js

// Fetches and displays teacher's details (username and role)
async function fetchUserDetails() {
    try {
        const res = await fetch('/api/user');
        const data = await res.json();
        
        document.getElementById('full_name').innerText = data.full_name || 'User32';
        document.getElementById('role').innerText = data.role || 'NaN';
    } catch (err) {
        console.error('Error fetching user details:', err);
    }
}

// Fetches and displays the teacher's class schedule
async function loadClasses() {
    try {
        const response = await fetch('/teacher/classes');
        const data = await response.json();
        
        if (data.success) {
            const scheduleTableBody = document.querySelector('#scheduleTable tbody');
            scheduleTableBody.innerHTML = ''; // Clear previous table content
            
            // Define days of the week
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            
            // Populate the schedule table
            days.forEach(day => {
                const classes = data.week[day] || []; // Get classes for the day, or an empty array if none
                
                if (classes.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${day}</td><td colspan="4">No classes</td>`;
                    scheduleTableBody.appendChild(row);
                } else {
                    classes.forEach(cls => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${day}</td>
                            <td>${cls.grade_section}</td>
                            <td>${cls.subject_name}</td>
                            <td>${cls.start_time}</td>
                            <td>${cls.end_time}</td>
                        `;
                        scheduleTableBody.appendChild(row);
                    });
                }
            });
        } else {
            alert(data.message || 'Unable to load classes.');
        }
    } catch (err) {
        console.error('Error fetching class schedule:', err);
    }
}

async function fetchOngoingClasses() {
    try {
        const response = await fetch('/dynamic-monitoring');
        const data = await response.json();

        if (data && data.class && data.class.length > 0) {
            const classData = data.class[0]; // Get the first ongoing class

            // Display subject and time info
            const classInfoDiv = document.getElementById('classInfo');
            classInfoDiv.innerHTML = `
                <h3>🔴 ${classData.subject_name}</h3>

            `;

            //                <small>${classData.start_time} - ${classData.end_time}</small> disregard for now

            // Clear the existing table body
            const tbody = document.querySelector("#ongoingTable tbody");
            tbody.innerHTML = "";

            // Group students by grade section
            const studentsByGrade = groupByGradeSection(data.students);

            // Iterate through each grade section and populate rows
            Object.keys(studentsByGrade).forEach(gradeSection => {
                // Add a row for the grade section
                const gradeRow = document.createElement('tr');
                gradeRow.classList.add('grade-section-row'); // Optional styling
                gradeRow.innerHTML = `
                    <td colspan="4"><strong>${gradeSection}</strong></td>
                `;
                tbody.appendChild(gradeRow);

                // Add rows for each student in this grade section
                studentsByGrade[gradeSection].forEach(student => {
                    const studentRow = document.createElement('tr');
                    studentRow.classList.add('student-row'); // Optional styling for interactivity

                    // Add the student data with a dropdown for the status
                    studentRow.innerHTML = `
                        <td>${student.full_name}</td>
                        <td>
                            <select class="status-dropdown" data-student-id="${student.id}">
                                <option value="present" ${student.status === 'present' ? 'selected' : ''}>Present</option>
                                <option value="absent" ${student.status === 'absent' ? 'selected' : ''}>Absent</option>
                                <option value="late" ${student.status === 'late' ? 'selected' : ''}>Late</option>
                                <option value="cutting" ${student.status === 'cutting' ? 'selected' : ''}>Cutting</option>
                                <option value="excused" ${student.status === 'excused' ? 'selected' : ''}>Excused</option>
                            </select>
                        </td>
                        <td>${student.time_in || ''}</td>
                        <td>${student.time_out || ''}</td>
                    `;
                    tbody.appendChild(studentRow);
                });
            });

            // Attach event listeners to the dropdowns
            attachDropdownListeners();
        } else {
            console.error('No class data found or data format is incorrect');
        }
    } catch (err) {
        console.error('Error fetching ongoing classes:', err);
    }
}

// Helper function to group students by grade section
function groupByGradeSection(students) {
    return students.reduce((grouped, student) => {
        const gradeSection = student.grade_section || "Unknown Section";
        if (!grouped[gradeSection]) {
            grouped[gradeSection] = [];
        }
        grouped[gradeSection].push(student);
        return grouped;
    }, {});
}

// Helper function to attach event listeners to dropdowns
function attachDropdownListeners() {
    const dropdowns = document.querySelectorAll('.status-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const studentId = dropdown.getAttribute('data-student-id');
            const newStatus = event.target.value;

            // Send the updated status to the server
            updateStudentStatus(studentId, newStatus);
        });
    });
}

// Function to fetch attendance data
async function fetchAttendance() {
    try {
        const response = await fetch(`/get-attendance`);
        if (!response.ok) throw new Error("Failed to fetch attendance data");

        const data = await response.json();

        // Generate and populate the table
        populateAttendanceTable(data);
    } catch (error) {
        console.error("Error fetching attendance data:", error);
    }
}

// Function to populate the attendance table
function populateAttendanceTable(data) {
    const attendanceHeader = document.getElementById("attendanceHeader");
    const attendanceBody = document.getElementById("attendanceBody");

    // Clear existing table headers and rows
    attendanceHeader.innerHTML = `<th>Student Name</th>`;
    attendanceBody.innerHTML = "";

    // Add day headers (1-31)
    for (let day = 1; day <= 31; day++) {
        const dayHeader = document.createElement("th");
        dayHeader.textContent = day;
        attendanceHeader.appendChild(dayHeader);
    }
    
    // Add rows for each student
    data.students.forEach(student => {
        const row = document.createElement("tr");

        // Student name cell
        const nameCell = document.createElement("td");
        nameCell.textContent = student.full_name;
        row.appendChild(nameCell);

        // Attendance cells for each day
        for (let day = 1; day <= 31; day++) {
            const cell = document.createElement("td");
            const status = student.attendance[day] || ""; // Blank if no attendance data
            colorCodeCell(cell, status);
            row.appendChild(cell);
        }

        attendanceBody.appendChild(row);
    });
}

// Function to color-code attendance cells
function colorCodeCell(cell, status) {
    const colors = {
        present: "#C6EFCE", // Light green
        absent: "#F2F2F2",  // Light gray
        late: "#FFEB9C",    // Light yellow
        cutting: "#FFC7CE", // Light red
        excused: "#BDD7EE"  // Light blue
    };
    cell.style.backgroundColor = colors[status] || "transparent"; // Default is transparent
    cell.textContent = ""; // Keep cells empty with only color coding
}

function updateStudentStatus(studentId, status, classId) {
    fetch('/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, status: status, class_id: classId }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log success message
        // Optionally, provide feedback to the user (e.g., a success toast or alert)
    })
    .catch(error => console.error("Error updating status: ", error));
}

document.addEventListener("DOMContentLoaded", async () => {
    let username; // Declare username at a higher scope to make it accessible across blocks

    try {
        // Fetch the logged-in user's details
        const res = await fetch('/api/user');
        if (!res.ok) {
            throw new Error('Failed to fetch user details');
        }
        const data = await res.json();
        username = encodeURIComponent(data.username); // Store the username for later use
    } catch (err) {
        console.error('Error fetching user details:', err);
        return; // Exit if we cannot fetch the user detailss
    }

    try {
        // Fetch the list of incharged classes
        const response = await fetch('/listInchargedClass');
        if (!response.ok) {
            throw new Error('Failed to fetch incharged classes');
        }
        const subjects = await response.json();

        // Reference to the subject list container
        const subjectList = document.getElementById('subjectList');

        // Add subjects as clickable links
        subjects.forEach(subject => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');

            // Subject name as the clickable text
            link.textContent = subject.subject_name;

            // Link to the export route with parameters
            link.href = `/export/${encodeURIComponent(subject.subject_name)}/${username}`;
            link.target = '_blank'; // Open in a new tab

            listItem.appendChild(link);
            subjectList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
});


// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    fetchUserDetails();
    loadClasses();
    fetchOngoingClasses();
    fetchAttendance();
});
