const API_URL = "https://studentmanagementfc.onrender.com/api/students/";

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const search = document.getElementById("search");

let students = [];

async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        students = await response.json();
        displayStudents(students);
    } catch (error) {
        alert("Cannot connect to the server.");
    }
}

function displayStudents(data) {
    table.innerHTML = "";

    data.forEach(student => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td>
                <button class="edit" onclick="editStudent(${student.id})">
                    Edit
                </button>
                <button class="delete" onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        age: document.getElementById("age").value,
        phone: document.getElementById("phone").value.trim()
    };

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    });

    if (response.ok) {
        alert("Student added successfully!");
        form.reset();
        loadStudents();
    } else {
        const errorData = await response.json();

        let message = "Please correct the following errors:\n";

        for (const field in errorData) {
            message += `\n${field}: ${errorData[field]}`;
        }

        alert(message);
    }
});

async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Student deleted successfully!");
        loadStudents();
    }
}

async function editStudent(id) {
    const student = students.find(s => s.id === id);

    if (!student) {
        return;
    }

    const name = prompt("Enter student name:", student.name);
    const email = prompt("Enter email:", student.email);
    const course = prompt("Enter course:", student.course);
    const age = prompt("Enter age:", student.age);
    const phone = prompt("Enter phone:", student.phone);

    if (!name || !email || !course || !age || !phone) {
        return;
    }

    const updatedStudent = {
        name: name.trim(),
        email: email.trim(),
        course: course.trim(),
        age: age,
        phone: phone.trim()
    };

    const response = await fetch(`${API_URL}${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedStudent)
    });

    if (response.ok) {
        alert("Student updated successfully!");
        loadStudents();
    } else {
        const errorData = await response.json();

        let message = "Please correct the following errors:\n";

        for (const field in errorData) {
            message += `\n${field}: ${errorData[field]}`;
        }

        alert(message);
    }
}

search.addEventListener("input", function() {
    const keyword = search.value.toLowerCase();

    const filtered = students.filter(student =>
        student.name.toLowerCase().includes(keyword) ||
        student.email.toLowerCase().includes(keyword) ||
        student.course.toLowerCase().includes(keyword)
    );

    displayStudents(filtered);
});

loadStudents();