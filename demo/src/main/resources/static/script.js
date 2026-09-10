// ==========================================
// SYNERGY DESK - MAIN JAVASCRIPT
// ==========================================

const API_URL = "/api/auth";
const USERS_API_URL = "/api/users";
const TASKS_API_URL = "/api/tasks";
const DASHBOARD_API_URL = "/api/dashboard/stats";

// ==========================================
// JWT AUTHENTICATION HELPER
// ==========================================

function getAuthToken() {
    return localStorage.getItem("authToken");
}

function getAuthHeaders() {

    const token = getAuthToken();

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }

    return headers;
}

// ==========================================
// AUTOMATIC JWT TOKEN FOR API REQUESTS
// ==========================================

const originalFetch = window.fetch;

window.fetch = async function (input, init = {}) {

    const url =
        typeof input === "string"
            ? input
            : input.url;

    const isBackendApi =
        url.includes("/api/");

    const isAuthApi =
        url.includes("/api/auth/");

    // Only add JWT to backend APIs
    // Login/Register remain public
    if (isBackendApi && !isAuthApi) {

        const token = getAuthToken();

        if (token) {

            const headers =
                new Headers(
                    init.headers || {}
                );

            headers.set(
                "Authorization",
                `Bearer ${token}`
            );

            init = {
                ...init,
                headers: headers
            };
        }
    }

    return originalFetch(
        input,
        init
    );
};


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const emailInput =
            document.getElementById("loginEmail");

        const passwordInput =
            document.getElementById("loginPassword");

        const message =
            document.getElementById("loginMessage");

        const email =
            emailInput ? emailInput.value.trim() : "";

        const password =
            passwordInput ? passwordInput.value : "";

        if (!email) {
            message.textContent =
                "Please enter your email.";
            message.style.color = "red";
            return;
        }

        if (!password) {
            message.textContent =
                "Please enter your password.";
            message.style.color = "red";
            return;
        }

        try {

            const response =
                await fetch(`${API_URL}/login`, {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

            const data =
                await response.text();

            if (response.ok) {

                try {

                    const user =
                        JSON.parse(data);

                    // Save complete login information
                    localStorage.setItem(
                        "loggedInUser",
                        JSON.stringify(user)
                    );

                    // Save JWT token separately
                    if (user.token) {
                        localStorage.setItem(
                            "authToken",
                            user.token
                        );
                    }

                    // Save role separately
                    if (user.role) {
                        localStorage.setItem(
                            "userRole",
                            user.role
                        );
                    }

                    message.textContent =
                        "Login successful!";

                    message.style.color =
                        "green";

                    setTimeout(function () {

                        window.location.href =
                            "dashboard.html";

                    }, 500);

                } catch (error) {

                    console.error(
                        "Login User Data Error:",
                        error
                    );

                    message.textContent =
                        "Login data error.";

                    message.style.color =
                        "red";
                }

            } else {

                message.textContent =
                    data ||
                    "Invalid email or password.";

                message.style.color =
                    "red";
            }

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            message.textContent =
                "Backend se connection nahi ho raha.";

            message.style.color =
                "red";
        }

    });

}


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const nameInput =
                document.getElementById(
                    "registerName"
                );

            const emailInput =
                document.getElementById(
                    "registerEmail"
                );

            const passwordInput =
                document.getElementById(
                    "registerPassword"
                );

            const roleInput =
                document.getElementById(
                    "registerRole"
                );

            const message =
                document.getElementById(
                    "registerMessage"
                );

            const name =
                nameInput
                    ? nameInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";

            const role =
                roleInput
                    ? roleInput.value
                    : "EMPLOYEE";


            if (!name) {

                message.textContent =
                    "Please enter your full name.";

                message.style.color =
                    "red";

                return;
            }


            if (!email) {

                message.textContent =
                    "Please enter your email.";

                message.style.color =
                    "red";

                return;
            }


            if (!password) {

                message.textContent =
                    "Please enter a password.";

                message.style.color =
                    "red";

                return;
            }


            if (password.length < 4) {

                message.textContent =
                    "Password must be at least 4 characters.";

                message.style.color =
                    "red";

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password,
                                role: role
                            })
                        }
                    );


                const data =
                    await response.text();


                if (response.ok) {

                    message.textContent =
                        "Registration successful!";

                    message.style.color =
                        "green";

                    registerForm.reset();

                } else {

                    message.textContent =
                        data ||
                        "Registration failed.";

                    message.style.color =
                        "red";
                }


            } catch (error) {

                console.error(
                    "Register Error:",
                    error
                );

                message.textContent =
                    "Backend se connection nahi ho raha.";

                message.style.color =
                    "red";
            }

        }
    );

}


// ==========================================
// SHOW REGISTER FORM
// ==========================================

const showRegister =
    document.getElementById("showRegister");

if (showRegister) {

    showRegister.addEventListener(
        "click",
        function () {

            if (registerForm) {

                registerForm.style.display =
                    "flex";
            }

            showRegister.style.display =
                "none";
        }
    );
}


// ==========================================
// USER / DASHBOARD AUTH
// ==========================================

const storedUser =
    localStorage.getItem("loggedInUser");

const userName =
    document.getElementById("userName");

const userRole =
    document.getElementById("userRole");

const userAvatar =
    document.getElementById("userAvatar");


if (userName && userRole && userAvatar) {

    if (!storedUser) {

        window.location.href =
            "index.html";

    } else {

        try {

            const user =
                JSON.parse(storedUser);

            userName.textContent =
                user.name || "Employee";

            userRole.textContent =
                user.role || "EMPLOYEE";

            const name =
                user.name || "User";

            userAvatar.textContent =
                name.charAt(0).toUpperCase();

        } catch (error) {

            console.error(
                "User data error:",
                error
            );

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "index.html";
        }
    }
}


// ==========================================
// HTML SECURITY
// ==========================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


// ==========================================
// INITIALS
// ==========================================

function getInitials(name) {

    if (!name) {
        return "U";
    }

    const words =
        name.trim().split(/\s+/);

    if (words.length === 1) {

        return words[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}


// ==========================================
// TEAM MEMBERS
// ==========================================

async function loadTeamMembers() {

    const teamList =
        document.getElementById("teamList");

    if (!teamList) {
        return;
    }

    try {

        const response =
            await fetch(USERS_API_URL);

        if (!response.ok) {

            throw new Error(
                "Users API failed: " +
                response.status
            );
        }

        const users =
            await response.json();

        teamList.innerHTML = "";

        if (
            !Array.isArray(users) ||
            users.length === 0
        ) {

            teamList.innerHTML =
                "<p>No employees found.</p>";

            updateEmployeeCount(0);

            return;
        }

        users.forEach(function (user) {

            const name =
                user.name || "Employee";

            const initials =
                getInitials(name);

            const teamMember =
                document.createElement("div");

            teamMember.className =
                "team-member";

            teamMember.innerHTML = `

                <div class="member-avatar">
                    ${escapeHtml(initials)}
                </div>

                <div>

                    <strong>
                        ${escapeHtml(name)}
                    </strong>

                    <small>
                        ${escapeHtml(
                            user.role ||
                            "EMPLOYEE"
                        )}
                    </small>

                </div>

                <span class="online"></span>
            `;

            teamList.appendChild(
                teamMember
            );
        });

        updateEmployeeCount(
            users.length
        );

    } catch (error) {

        console.error(
            "Team Members Error:",
            error
        );

        teamList.innerHTML =
            "<p>Employees load nahi ho rahe.</p>";
    }
}


// ==========================================
// EMPLOYEE COUNT
// ==========================================

function updateEmployeeCount(count) {

    const totalEmployees =
        document.getElementById(
            "totalEmployees"
        );

    if (totalEmployees) {

        totalEmployees.textContent =
            count;
    }
}


// ==========================================
// DASHBOARD STATS
// ==========================================

async function loadDashboardStats() {

    const activeTasksElement =
        document.getElementById(
            "activeTasks"
        );

    const completedTasksElement =
        document.getElementById(
            "completedTasks"
        );

    const totalEmployeesElement =
        document.getElementById(
            "totalEmployees"
        );


    if (
        !activeTasksElement &&
        !completedTasksElement &&
        !totalEmployeesElement
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                DASHBOARD_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Dashboard API failed: " +
                response.status
            );
        }


        const stats =
            await response.json();


        if (activeTasksElement) {

            activeTasksElement.textContent =
                stats.activeTasks ?? 0;
        }


        if (completedTasksElement) {

            completedTasksElement.textContent =
                stats.completedTasks ?? 0;
        }


        if (totalEmployeesElement) {

            totalEmployeesElement.textContent =
                stats.totalEmployees ?? 0;
        }


    } catch (error) {

        console.error(
            "Dashboard Stats Error:",
            error
        );
    }
}


// ==================================================
// DASHBOARD - RECENT TASKS
// ==================================================

async function loadRecentTasks() {

    const taskList =
        document.getElementById(
            "taskList"
        );

    if (!taskList) {
        return;
    }

    // Tasks page has its own loader
    if (
        document.getElementById(
            "taskSearch"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                TASKS_API_URL
            );

        if (!response.ok) {

            throw new Error(
                "Tasks API failed: " +
                response.status
            );
        }


        const tasks =
            await response.json();


        taskList.innerHTML = "";


        if (
            !Array.isArray(tasks) ||
            tasks.length === 0
        ) {

            taskList.innerHTML =
                "<p>No tasks found.</p>";

            return;
        }


        tasks.forEach(function (task) {

            const taskElement =
                document.createElement(
                    "div"
                );

            taskElement.className =
                "task";


            let statusClass =
                "pending";

            let statusText =
                "Pending";


            if (
                task.status ===
                "IN_PROGRESS"
            ) {

                statusClass =
                    "progress";

                statusText =
                    "In Progress";
            }


            if (
                task.status ===
                "COMPLETED"
            ) {

                statusClass =
                    "completed";

                statusText =
                    "Completed";
            }


            taskElement.innerHTML = `

                <div>

                    <strong>
                        ${escapeHtml(
                            task.title ||
                            "Untitled Task"
                        )}
                    </strong>

                    <p>
                        ${escapeHtml(
                            task.description ||
                            "No description"
                        )}
                    </p>

                </div>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

                <button
                    class="edit-task-btn"
                    data-id="${task.id}"
                    type="button">
                    ✏️
                </button>

                <button
                    class="delete-task-btn"
                    data-id="${task.id}"
                    type="button">
                    🗑️
                </button>
            `;


            taskList.appendChild(
                taskElement
            );
        });


    } catch (error) {

        console.error(
            "Recent Tasks Error:",
            error
        );

        taskList.innerHTML =
            "<p>Tasks load nahi ho rahe.</p>";
    }
}


// ==================================================
// DASHBOARD ADD TASK
// ==================================================

const dashboardTaskForm =
    document.getElementById(
        "taskForm"
    );

const taskFormContainer =
    document.getElementById(
        "taskFormContainer"
    );

const dashboardAddTaskButton =
    document.querySelector(
        ".card-header .primary-btn"
    );

const cancelTaskBtn =
    document.getElementById(
        "cancelTaskBtn"
    );

const dashboardTaskMessage =
    document.getElementById(
        "taskMessage"
    );


if (
    dashboardAddTaskButton &&
    taskFormContainer
) {

    dashboardAddTaskButton.addEventListener(
        "click",
        function () {

            taskFormContainer.style.display =
                "block";
        }
    );
}


if (cancelTaskBtn) {

    cancelTaskBtn.addEventListener(
        "click",
        function () {

            if (dashboardTaskForm) {

                dashboardTaskForm.reset();
            }

            if (taskFormContainer) {

                taskFormContainer.style.display =
                    "none";
            }

            if (dashboardTaskMessage) {

                dashboardTaskMessage.textContent =
                    "";
            }
        }
    );
}


if (
    dashboardTaskForm &&
    taskFormContainer
) {

    dashboardTaskForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const title =
                document
                    .getElementById(
                        "taskTitle"
                    )
                    .value
                    .trim();


            const description =
                document
                    .getElementById(
                        "taskDescription"
                    )
                    .value
                    .trim();


            const status =
                document
                    .getElementById(
                        "taskStatus"
                    )
                    .value;


            try {

                const response =
                    await fetch(
                        TASKS_API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                title: title,
                                description:
                                    description,
                                status: status
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Task create failed: " +
                        response.status
                    );
                }


                const savedTask =
                    await response.json();


                console.log(
                    "TASK SAVED:",
                    savedTask
                );


                if (dashboardTaskMessage) {

                    dashboardTaskMessage.textContent =
                        "Task added successfully!";

                    dashboardTaskMessage.style.color =
                        "green";
                }


                dashboardTaskForm.reset();


                await loadRecentTasks();

                await loadDashboardStats();


                setTimeout(function () {

                    taskFormContainer.style.display =
                        "none";


                    if (dashboardTaskMessage) {

                        dashboardTaskMessage.textContent =
                            "";
                    }

                }, 1000);


            } catch (error) {

                console.error(
                    "Add Task Error:",
                    error
                );


                if (dashboardTaskMessage) {

                    dashboardTaskMessage.textContent =
                        "Task add nahi ho raha.";

                    dashboardTaskMessage.style.color =
                        "red";
                }
            }
        }
    );
}


// ==================================================
// DASHBOARD DELETE TASK
// ==================================================

document.addEventListener(
    "click",
    async function (e) {

        const deleteButton =
            e.target.closest(
                ".delete-task-btn"
            );


        if (!deleteButton) {
            return;
        }


        const taskId =
            deleteButton.getAttribute(
                "data-id"
            );


        if (!taskId) {
            return;
        }


        const confirmDelete =
            confirm(
                "Kya aap is task ko delete karna chahte hain?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${TASKS_API_URL}/${taskId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Delete failed: " +
                    response.status
                );
            }


            alert(
                "Task deleted successfully!"
            );


            await loadRecentTasks();

            await loadDashboardStats();


        } catch (error) {

            console.error(
                "Delete Task Error:",
                error
            );


            alert(
                "Task delete nahi ho raha."
            );
        }
    }
);


// ==================================================
// DASHBOARD EDIT TASK
// ==================================================

document.addEventListener(
    "click",
    async function (e) {

        const editButton =
            e.target.closest(
                ".edit-task-btn"
            );


        if (!editButton) {
            return;
        }


        const taskId =
            editButton.getAttribute(
                "data-id"
            );


        if (!taskId) {
            return;
        }


        const modal =
            document.getElementById(
                "editTaskModal"
            );


        if (!modal) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${TASKS_API_URL}/${taskId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Task fetch failed"
                );
            }


            const task =
                await response.json();


            document.getElementById(
                "editTaskId"
            ).value =
                task.id;


            document.getElementById(
                "editTaskTitle"
            ).value =
                task.title || "";


            document.getElementById(
                "editTaskDescription"
            ).value =
                task.description || "";


            document.getElementById(
                "editTaskStatus"
            ).value =
                task.status || "PENDING";


            const message =
                document.getElementById(
                    "editTaskMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }


            modal.style.display =
                "flex";


        } catch (error) {

            console.error(
                "Edit Task Load Error:",
                error
            );


            alert(
                "Task details load nahi ho rahe."
            );
        }
    }
);


// ==================================================
// EDIT TASK FORM
// ==================================================

const dashboardEditTaskForm =
    document.getElementById(
        "editTaskForm"
    );


if (dashboardEditTaskForm) {

    dashboardEditTaskForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const taskId =
                document.getElementById(
                    "editTaskId"
                ).value;


            const title =
                document.getElementById(
                    "editTaskTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "editTaskDescription"
                ).value.trim();


            const status =
                document.getElementById(
                    "editTaskStatus"
                ).value;


            const message =
                document.getElementById(
                    "editTaskMessage"
                );


            const modal =
                document.getElementById(
                    "editTaskModal"
                );


            if (!taskId) {

                message.textContent =
                    "Task ID missing.";

                message.style.color =
                    "red";

                return;
            }


            if (!title) {

                message.textContent =
                    "Task title is required.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Updating...";

                message.style.color =
                    "black";


                const response =
                    await fetch(
                        `${TASKS_API_URL}/${taskId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                title: title,
                                description:
                                    description,
                                status: status
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Task update failed: " +
                        response.status
                    );
                }


                const updatedTask =
                    await response.json();


                console.log(
                    "TASK UPDATED:",
                    updatedTask
                );


                message.textContent =
                    "Task updated successfully!";

                message.style.color =
                    "green";


                await loadRecentTasks();

                await loadDashboardStats();


                setTimeout(function () {

                    if (modal) {

                        modal.style.display =
                            "none";
                    }

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Edit Task Error:",
                    error
                );


                message.textContent =
                    "Task update nahi ho raha.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==================================================
// CLOSE EDIT TASK MODAL
// ==================================================

const closeEditTask =
    document.getElementById(
        "closeEditTask"
    );


const closeEditTaskModal =
    document.getElementById(
        "closeEditTaskModal"
    );


if (closeEditTask) {

    closeEditTask.addEventListener(
        "click",
        function () {

            const modal =
                document.getElementById(
                    "editTaskModal"
                );

            if (modal) {

                modal.style.display =
                    "none";
            }
        }
    );
}


if (closeEditTaskModal) {

    closeEditTaskModal.addEventListener(
        "click",
        function () {

            const modal =
                document.getElementById(
                    "editTaskModal"
                );

            if (modal) {

                modal.style.display =
                    "none";
            }
        }
    );
}


const editTaskModalElement =
    document.getElementById(
        "editTaskModal"
    );


if (editTaskModalElement) {

    editTaskModalElement.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                editTaskModalElement
            ) {

                editTaskModalElement.style.display =
                    "none";
            }
        }
    );
}


// ==================================================
// EMPLOYEE MANAGEMENT
// ==================================================

const employeeList =
    document.getElementById(
        "employeeList"
    );

const employeeSearch =
    document.getElementById(
        "employeeSearch"
    );


// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    if (!employeeList) {
        return;
    }


    employeeList.innerHTML =
        "<p>Loading employees...</p>";


    try {

        const response =
            await fetch(
                USERS_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Employee fetch failed: " +
                response.status
            );
        }


        const employees =
            await response.json();


        displayEmployees(
            employees
        );


    } catch (error) {

        console.error(
            "Employee Load Error:",
            error
        );


        employeeList.innerHTML =
            "<p>Unable to load employees.</p>";
    }
}


// ==========================================
// DISPLAY EMPLOYEES
// ==========================================

function displayEmployees(employees) {

    if (!employeeList) {
        return;
    }


    if (
        !employees ||
        employees.length === 0
    ) {

        employeeList.innerHTML =
            "<p>No employees found.</p>";

        return;
    }


    employeeList.innerHTML =
        "";


    employees.forEach(function (employee) {

        const name =
            employee.name ||
            "Unknown";


        const email =
            employee.email ||
            "No email";


        const role =
            employee.role ||
            "EMPLOYEE";


        const avatar =
            name.charAt(0)
                .toUpperCase();


        const employeeElement =
            document.createElement(
                "div"
            );


        employeeElement.className =
            "employee-item";


        employeeElement.innerHTML = `

            <div class="employee-item-avatar">
                ${escapeHtml(avatar)}
            </div>

            <div class="employee-info">

                <strong>
                    ${escapeHtml(name)}
                </strong>

                <small>
                    ${escapeHtml(email)}
                </small>

            </div>

            <span class="employee-role">
                ${escapeHtml(role)}
            </span>

            <div class="employee-actions">

                <button
                    class="employee-edit-btn"
                    data-id="${employee.id}"
                    type="button">
                    ✏️
                </button>

                <button
                    class="employee-delete-btn"
                    data-id="${employee.id}"
                    type="button">
                    🗑️
                </button>

            </div>
        `;


        employeeList.appendChild(
            employeeElement
        );
    });
}


// ==========================================
// EMPLOYEE SEARCH
// ==========================================

if (employeeSearch) {

    employeeSearch.addEventListener(
        "input",
        async function () {

            const searchText =
                employeeSearch.value
                    .trim()
                    .toLowerCase();


            try {

                const response =
                    await fetch(
                        USERS_API_URL
                    );


                if (!response.ok) {

                    throw new Error(
                        "Employee search failed"
                    );
                }


                const employees =
                    await response.json();


                const filteredEmployees =
                    employees.filter(
                        function (employee) {

                            const name =
                                (
                                    employee.name ||
                                    ""
                                ).toLowerCase();


                            const email =
                                (
                                    employee.email ||
                                    ""
                                ).toLowerCase();


                            return (
                                name.includes(
                                    searchText
                                ) ||
                                email.includes(
                                    searchText
                                )
                            );
                        }
                    );


                displayEmployees(
                    filteredEmployees
                );


            } catch (error) {

                console.error(
                    "Employee Search Error:",
                    error
                );
            }
        }
    );
}


// ==========================================
// ADD EMPLOYEE MODAL
// ==========================================

const addEmployeeBtn =
    document.getElementById(
        "addEmployeeBtn"
    );

const employeeModal =
    document.getElementById(
        "employeeModal"
    );

const closeEmployeeModal =
    document.getElementById(
        "closeEmployeeModal"
    );

const employeeForm =
    document.getElementById(
        "employeeForm"
    );


if (
    addEmployeeBtn &&
    employeeModal
) {

    addEmployeeBtn.addEventListener(
        "click",
        function () {

            employeeModal.style.display =
                "flex";

            const message =
                document.getElementById(
                    "employeeMessage"
                );

            if (message) {

                message.textContent =
                    "";
            }
        }
    );
}


if (
    closeEmployeeModal &&
    employeeModal
) {

    closeEmployeeModal.addEventListener(
        "click",
        function () {

            employeeModal.style.display =
                "none";
        }
    );
}


if (employeeModal) {

    employeeModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                employeeModal
            ) {

                employeeModal.style.display =
                    "none";
            }
        }
    );
}


// ==========================================
// SAVE EMPLOYEE
// ==========================================

if (employeeForm) {

    employeeForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const name =
                document.getElementById(
                    "employeeName"
                ).value.trim();


            const email =
                document.getElementById(
                    "employeeEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "employeePassword"
                ).value;


            const role =
                document.getElementById(
                    "employeeRole"
                ).value;


            const message =
                document.getElementById(
                    "employeeMessage"
                );


            if (
                !name ||
                !email ||
                !password
            ) {

                message.textContent =
                    "Please fill all required fields.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Saving employee...";

                message.style.color =
                    "black";


                const response =
                    await fetch(
                        `${API_URL}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                password: password,
                                role: role
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        data.error ||
                        "Employee registration failed"
                    );
                }


                message.textContent =
                    "Employee added successfully!";

                message.style.color =
                    "green";


                employeeForm.reset();


                await loadEmployees();


                setTimeout(function () {

                    employeeModal.style.display =
                        "none";

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Add Employee Error:",
                    error
                );


                message.textContent =
                    error.message ||
                    "Employee add nahi ho raha.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==========================================
// DELETE EMPLOYEE
// ==========================================

document.addEventListener(
    "click",
    async function (e) {

        const deleteButton =
            e.target.closest(
                ".employee-delete-btn"
            );


        if (!deleteButton) {
            return;
        }


        const employeeId =
            deleteButton.getAttribute(
                "data-id"
            );


        if (!employeeId) {

            alert(
                "Employee ID nahi mila."
            );

            return;
        }


        const confirmDelete =
            confirm(
                "Kya aap is employee ko delete karna chahte hain?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${USERS_API_URL}/${employeeId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Employee delete failed: " +
                    response.status
                );
            }


            await loadEmployees();


            alert(
                "Employee deleted successfully!"
            );


        } catch (error) {

            console.error(
                "Delete Employee Error:",
                error
            );


            alert(
                "Employee delete nahi ho raha."
            );
        }
    }
);


// ==========================================
// EDIT EMPLOYEE
// ==========================================

const editEmployeeModal =
    document.getElementById(
        "editEmployeeModal"
    );

const closeEditEmployeeModal =
    document.getElementById(
        "closeEditEmployeeModal"
    );


document.addEventListener(
    "click",
    async function (e) {

        const editButton =
            e.target.closest(
                ".employee-edit-btn"
            );


        if (!editButton) {
            return;
        }


        const employeeId =
            editButton.getAttribute(
                "data-id"
            );


        if (!employeeId) {

            alert(
                "Employee ID nahi mila."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${USERS_API_URL}/${employeeId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Employee fetch failed: " +
                    response.status
                );
            }


            const employee =
                await response.json();


            document.getElementById(
                "editEmployeeId"
            ).value =
                employee.id;


            document.getElementById(
                "editEmployeeName"
            ).value =
                employee.name || "";


            document.getElementById(
                "editEmployeeEmail"
            ).value =
                employee.email || "";


            document.getElementById(
                "editEmployeeRole"
            ).value =
                employee.role ||
                "EMPLOYEE";


            const message =
                document.getElementById(
                    "editEmployeeMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }


            if (editEmployeeModal) {

                editEmployeeModal.style.display =
                    "flex";
            }


        } catch (error) {

            console.error(
                "Edit Employee Error:",
                error
            );


            alert(
                "Employee details load nahi ho rahe."
            );
        }
    }
);


// ==========================================
// CLOSE EDIT EMPLOYEE
// ==========================================

if (closeEditEmployeeModal) {

    closeEditEmployeeModal.addEventListener(
        "click",
        function () {

            if (editEmployeeModal) {

                editEmployeeModal.style.display =
                    "none";
            }
        }
    );
}


if (editEmployeeModal) {

    editEmployeeModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                editEmployeeModal
            ) {

                editEmployeeModal.style.display =
                    "none";
            }
        }
    );
}


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

const editEmployeeForm =
    document.getElementById(
        "editEmployeeForm"
    );


if (editEmployeeForm) {

    editEmployeeForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const employeeId =
                document.getElementById(
                    "editEmployeeId"
                ).value;


            const name =
                document.getElementById(
                    "editEmployeeName"
                ).value.trim();


            const email =
                document.getElementById(
                    "editEmployeeEmail"
                ).value.trim();


            const role =
                document.getElementById(
                    "editEmployeeRole"
                ).value;


            const message =
                document.getElementById(
                    "editEmployeeMessage"
                );


            if (!employeeId) {

                message.textContent =
                    "Employee ID missing.";

                message.style.color =
                    "red";

                return;
            }


            if (!name || !email) {

                message.textContent =
                    "Name and Email are required.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Updating employee...";

                message.style.color =
                    "black";


                const response =
                    await fetch(
                        `${USERS_API_URL}/${employeeId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                role: role
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Employee update failed: " +
                        response.status
                    );
                }


                const updatedEmployee =
                    await response.json();


                console.log(
                    "EMPLOYEE UPDATED:",
                    updatedEmployee
                );


                message.textContent =
                    "Employee updated successfully!";

                message.style.color =
                    "green";


                await loadEmployees();


                setTimeout(function () {

                    if (editEmployeeModal) {

                        editEmployeeModal.style.display =
                            "none";
                    }

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Update Employee Error:",
                    error
                );


                message.textContent =
                    "Employee update nahi ho raha.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==================================================
// TASKS PAGE
// ==================================================

const tasksPageList =
    document.getElementById(
        "taskList"
    );

const tasksPageSearch =
    document.getElementById(
        "taskSearch"
    );

const tasksPageStatusFilter =
    document.getElementById(
        "taskStatusFilter"
    );

const tasksPageAddButton =
    document.getElementById(
        "addTaskBtn"
    );

const tasksPageModal =
    document.getElementById(
        "taskModal"
    );

const tasksPageCloseModal =
    document.getElementById(
        "closeTaskModal"
    );

const tasksPageForm =
    document.getElementById(
        "taskForm"
    );

const tasksPageEditModal =
    document.getElementById(
        "editTaskModal"
    );

const tasksPageCloseEditModal =
    document.getElementById(
        "closeEditTaskModal"
    );

const tasksPageEditForm =
    document.getElementById(
        "editTaskForm"
    );


// ==========================================
// LOAD TASKS PAGE
// ==========================================

async function loadTasksPage() {

    if (!tasksPageList) {
        return;
    }


    tasksPageList.innerHTML =
        "<p>Loading tasks...</p>";


    try {

        const response =
            await fetch(
                TASKS_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Task fetch failed: " +
                response.status
            );
        }


        const tasks =
            await response.json();


        displayTasksPage(
            tasks
        );


    } catch (error) {

        console.error(
            "Task Load Error:",
            error
        );


        tasksPageList.innerHTML =
            "<p>Unable to load tasks.</p>";
    }
}


// ==========================================
// DISPLAY TASKS PAGE
// ==========================================

function displayTasksPage(tasks) {

    if (!tasksPageList) {
        return;
    }


    if (
        !Array.isArray(tasks) ||
        tasks.length === 0
    ) {

        tasksPageList.innerHTML =
            "<p>No tasks found.</p>";

        return;
    }


    tasksPageList.innerHTML =
        "";


    tasks.forEach(function (task) {

        const title =
            task.title ||
            "Untitled Task";


        const description =
            task.description ||
            "No description";


        const status =
            task.status ||
            "PENDING";


        let statusText =
            "Pending";


        if (status === "IN_PROGRESS") {

            statusText =
                "In Progress";
        }


        if (status === "COMPLETED") {

            statusText =
                "Completed";
        }


        const taskElement =
            document.createElement(
                "div"
            );


        taskElement.className =
            "task-item";


        taskElement.innerHTML = `

            <div class="task-info">

                <strong>
                    ${escapeHtml(title)}
                </strong>

                <small>
                    ${escapeHtml(description)}
                </small>

            </div>


            <span class="task-status">
                ${escapeHtml(statusText)}
            </span>


            <div class="task-actions">

                <button
                    class="task-edit-btn"
                    data-id="${task.id}"
                    type="button">
                    ✏️
                </button>

                <button
                    class="task-delete-btn"
                    data-id="${task.id}"
                    type="button">
                    🗑️
                </button>

            </div>
        `;


        tasksPageList.appendChild(
            taskElement
        );
    });
}


// ==========================================
// OPEN TASK MODAL
// ==========================================

if (
    tasksPageAddButton &&
    tasksPageModal
) {

    tasksPageAddButton.addEventListener(
        "click",
        function () {

            tasksPageModal.style.display =
                "flex";


            if (tasksPageForm) {

                tasksPageForm.reset();
            }


            const message =
                document.getElementById(
                    "taskMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }
        }
    );
}


// ==========================================
// CLOSE TASK MODAL
// ==========================================

if (
    tasksPageCloseModal &&
    tasksPageModal
) {

    tasksPageCloseModal.addEventListener(
        "click",
        function () {

            tasksPageModal.style.display =
                "none";
        }
    );
}


if (tasksPageModal) {

    tasksPageModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                tasksPageModal
            ) {

                tasksPageModal.style.display =
                    "none";
            }
        }
    );
}


// ==========================================
// SAVE TASK FROM TASKS PAGE
// ==========================================

if (tasksPageForm) {

    tasksPageForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const title =
                document.getElementById(
                    "taskTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "taskDescription"
                ).value.trim();


            const status =
                document.getElementById(
                    "taskStatus"
                ).value;


            const dueDateElement =
                document.getElementById(
                    "taskDueDate"
                );


            const dueDate =
                dueDateElement
                    ? dueDateElement.value
                    : "";


            const message =
                document.getElementById(
                    "taskMessage"
                );


            if (!title) {

                message.textContent =
                    "Task title is required.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Saving task...";

                message.style.color =
                    "black";


                const taskData = {

                    title: title,

                    description:
                        description,

                    status: status
                };


                // Due date tabhi bhejenge
                // jab backend me field available ho
                if (dueDate) {

                    taskData.dueDate =
                        dueDate;
                }


                const response =
                    await fetch(
                        TASKS_API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    taskData
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Task save failed: " +
                        response.status
                    );
                }


                const data =
                    await response.json();


                console.log(
                    "TASK CREATED:",
                    data
                );


                message.textContent =
                    "Task added successfully!";

                message.style.color =
                    "green";


                tasksPageForm.reset();


                await loadTasksPage();


                setTimeout(function () {

                    tasksPageModal.style.display =
                        "none";

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Add Task Error:",
                    error
                );


                message.textContent =
                    "Task add nahi ho raha.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==========================================
// TASK SEARCH + FILTER
// ==========================================

async function filterTasksPage() {

    if (!tasksPageList) {
        return;
    }


    try {

        const response =
            await fetch(
                TASKS_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Task filter failed"
            );
        }


        const tasks =
            await response.json();


        const searchText =
            tasksPageSearch
                ? tasksPageSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedStatus =
            tasksPageStatusFilter
                ? tasksPageStatusFilter.value
                : "ALL";


        const filteredTasks =
            tasks.filter(function (task) {

                const title =
                    (
                        task.title ||
                        ""
                    ).toLowerCase();


                const description =
                    (
                        task.description ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    title.includes(
                        searchText
                    ) ||
                    description.includes(
                        searchText
                    );


                const matchesStatus =
                    selectedStatus === "ALL" ||
                    (
                        task.status ||
                        "PENDING"
                    ) === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );
            });


        displayTasksPage(
            filteredTasks
        );


    } catch (error) {

        console.error(
            "Task Filter Error:",
            error
        );
    }
}


if (tasksPageSearch) {

    tasksPageSearch.addEventListener(
        "input",
        filterTasksPage
    );
}


if (tasksPageStatusFilter) {

    tasksPageStatusFilter.addEventListener(
        "change",
        filterTasksPage
    );
}


// ==========================================
// OPEN EDIT TASK PAGE MODAL
// ==========================================

document.addEventListener(
    "click",
    async function (e) {

        const editButton =
            e.target.closest(
                ".task-edit-btn"
            );


        if (!editButton) {
            return;
        }


        const taskId =
            editButton.getAttribute(
                "data-id"
            );


        if (!taskId) {

            alert(
                "Task ID nahi mila."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${TASKS_API_URL}/${taskId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Task fetch failed: " +
                    response.status
                );
            }


            const task =
                await response.json();


            document.getElementById(
                "editTaskId"
            ).value =
                task.id;


            document.getElementById(
                "editTaskTitle"
            ).value =
                task.title || "";


            document.getElementById(
                "editTaskDescription"
            ).value =
                task.description || "";


            document.getElementById(
                "editTaskStatus"
            ).value =
                task.status ||
                "PENDING";


            const editDueDate =
                document.getElementById(
                    "editTaskDueDate"
                );


            if (editDueDate) {

                editDueDate.value =
                    task.dueDate || "";
            }


            const message =
                document.getElementById(
                    "editTaskMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }


            if (tasksPageEditModal) {

                tasksPageEditModal.style.display =
                    "flex";
            }


        } catch (error) {

            console.error(
                "Edit Task Error:",
                error
            );


            alert(
                "Task details load nahi ho rahe."
            );
        }
    }
);


// ==========================================
// CLOSE TASKS PAGE EDIT MODAL
// ==========================================

if (tasksPageCloseEditModal) {

    tasksPageCloseEditModal.addEventListener(
        "click",
        function () {

            if (tasksPageEditModal) {

                tasksPageEditModal.style.display =
                    "none";
            }
        }
    );
}


if (tasksPageEditModal) {

    tasksPageEditModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                tasksPageEditModal
            ) {

                tasksPageEditModal.style.display =
                    "none";
            }
        }
    );
}


// ==========================================
// UPDATE TASK FROM TASKS PAGE
// ==========================================

if (tasksPageEditForm) {

    tasksPageEditForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const taskId =
                document.getElementById(
                    "editTaskId"
                ).value;


            const title =
                document.getElementById(
                    "editTaskTitle"
                ).value.trim();


            const description =
                document.getElementById(
                    "editTaskDescription"
                ).value.trim();


            const status =
                document.getElementById(
                    "editTaskStatus"
                ).value;


            const dueDateElement =
                document.getElementById(
                    "editTaskDueDate"
                );


            const dueDate =
                dueDateElement
                    ? dueDateElement.value
                    : "";


            const message =
                document.getElementById(
                    "editTaskMessage"
                );


            if (!taskId) {

                message.textContent =
                    "Task ID missing.";

                message.style.color =
                    "red";

                return;
            }


            if (!title) {

                message.textContent =
                    "Task title is required.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Updating task...";

                message.style.color =
                    "black";


                const taskData = {

                    title: title,

                    description:
                        description,

                    status: status
                };


                if (dueDate) {

                    taskData.dueDate =
                        dueDate;
                }


                const response =
                    await fetch(
                        `${TASKS_API_URL}/${taskId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    taskData
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Task update failed: " +
                        response.status
                    );
                }


                const updatedTask =
                    await response.json();


                console.log(
                    "TASK UPDATED:",
                    updatedTask
                );


                message.textContent =
                    "Task updated successfully!";

                message.style.color =
                    "green";


                await loadTasksPage();


                setTimeout(function () {

                    if (tasksPageEditModal) {

                        tasksPageEditModal.style.display =
                            "none";
                    }

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Update Task Error:",
                    error
                );


                message.textContent =
                    "Task update nahi ho raha.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==========================================
// DELETE TASK FROM TASKS PAGE
// ==========================================

document.addEventListener(
    "click",
    async function (e) {

        const deleteButton =
            e.target.closest(
                ".task-delete-btn"
            );


        if (!deleteButton) {
            return;
        }


        const taskId =
            deleteButton.getAttribute(
                "data-id"
            );


        if (!taskId) {

            alert(
                "Task ID nahi mila."
            );

            return;
        }


        const confirmDelete =
            confirm(
                "Kya aap is task ko delete karna chahte hain?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${TASKS_API_URL}/${taskId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Task delete failed: " +
                    response.status
                );
            }


            await loadTasksPage();


            alert(
                "Task deleted successfully!"
            );


        } catch (error) {

            console.error(
                "Delete Task Error:",
                error
            );


            alert(
                "Task delete nahi ho raha."
            );
        }
    }
);


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "index.html";
        }
    );
}


// ==========================================
// START DATA
// ==========================================

loadTeamMembers();

loadDashboardStats();

loadRecentTasks();


// Load full Tasks page only
if (tasksPageList) {

    loadTasksPage();
}


// Load Employees page only
if (employeeList) {

    loadEmployees();
}
// ==================================================
// ATTENDANCE MANAGEMENT
// ==================================================

const ATTENDANCE_API_URL =
    "/api/attendance";

const attendanceList =
    document.getElementById("attendanceList");

const attendanceSearch =
    document.getElementById("attendanceSearch");

const attendanceStatusFilter =
    document.getElementById("attendanceStatusFilter");

const attendanceDateFilter =
    document.getElementById("attendanceDateFilter");

const addAttendanceBtn =
    document.getElementById("addAttendanceBtn");

const attendanceModal =
    document.getElementById("attendanceModal");

const closeAttendanceModal =
    document.getElementById("closeAttendanceModal");

const cancelAttendanceBtn =
    document.getElementById("cancelAttendanceBtn");

const attendanceForm =
    document.getElementById("attendanceForm");

const editAttendanceModal =
    document.getElementById("editAttendanceModal");

const closeEditAttendanceModal =
    document.getElementById("closeEditAttendanceModal");

const cancelEditAttendanceBtn =
    document.getElementById("cancelEditAttendanceBtn");

const editAttendanceForm =
    document.getElementById("editAttendanceForm");


// ==================================================
// ATTENDANCE - LOAD EMPLOYEES INTO DROPDOWNS
// ==================================================

async function loadAttendanceEmployees() {

    const addEmployeeSelect =
        document.getElementById("attendanceEmployee");

    const editEmployeeSelect =
        document.getElementById(
            "editAttendanceEmployee"
        );

    if (
        !addEmployeeSelect &&
        !editEmployeeSelect
    ) {
        return;
    }

    try {

        const response =
            await fetch(USERS_API_URL);

        if (!response.ok) {

            throw new Error(
                "Employees fetch failed: " +
                response.status
            );
        }

        const employees =
            await response.json();


        if (addEmployeeSelect) {

            addEmployeeSelect.innerHTML =
                `<option value="">
                    Select Employee
                </option>`;

            employees.forEach(function (employee) {

                const option =
                    document.createElement("option");

                option.value =
                    employee.id;

                option.textContent =
                    employee.name ||
                    "Employee";

                addEmployeeSelect.appendChild(
                    option
                );
            });
        }


        if (editEmployeeSelect) {

            editEmployeeSelect.innerHTML =
                `<option value="">
                    Select Employee
                </option>`;

            employees.forEach(function (employee) {

                const option =
                    document.createElement("option");

                option.value =
                    employee.id;

                option.textContent =
                    employee.name ||
                    "Employee";

                editEmployeeSelect.appendChild(
                    option
                );
            });
        }

    } catch (error) {

        console.error(
            "Attendance Employees Error:",
            error
        );
    }
}


// ==================================================
// ATTENDANCE - LOAD RECORDS
// ==================================================

async function loadAttendance() {

    if (!attendanceList) {
        return;
    }

    attendanceList.innerHTML =
        `<div class="attendance-empty">
            Loading attendance...
        </div>`;


    try {

        const response =
            await fetch(
                ATTENDANCE_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Attendance fetch failed: " +
                response.status
            );
        }


        const attendance =
            await response.json();


        displayAttendance(
            attendance
        );

        updateAttendanceStats(
            attendance
        );


    } catch (error) {

        console.error(
            "Attendance Load Error:",
            error
        );


        attendanceList.innerHTML =
            `<div class="attendance-empty">
                Attendance records load nahi ho rahe.
            </div>`;
    }
}


// ==================================================
// DISPLAY ATTENDANCE
// ==================================================

function displayAttendance(records) {

    if (!attendanceList) {
        return;
    }


    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        attendanceList.innerHTML =
            `<div class="attendance-empty">
                No attendance records found.
            </div>`;

        return;
    }


    attendanceList.innerHTML = "";


    records.forEach(function (record) {

        const employeeName =
            record.employeeName ||
            "Unknown Employee";

        const date =
            record.date ||
            "-";

        const status =
            record.status ||
            "ABSENT";


        const initials =
            getInitials(employeeName);


        const statusClass =
            status === "PRESENT"
                ? "present"
                : "absent";


        const statusText =
            status === "PRESENT"
                ? "Present"
                : "Absent";


        const item =
            document.createElement("div");


        item.className =
            "attendance-item";


        item.innerHTML = `

            <div class="attendance-info">

                <div class="attendance-avatar">
                    ${escapeHtml(initials)}
                </div>

                <div class="attendance-details">

                    <strong>
                        ${escapeHtml(employeeName)}
                    </strong>

                    <span>
                        Employee ID:
                        ${escapeHtml(
                            String(
                                record.employeeId || "-"
                            )
                        )}
                    </span>

                </div>

            </div>


            <div class="attendance-date">
                📅 ${escapeHtml(date)}
            </div>


            <div class="attendance-status ${statusClass}">
                ${statusText}
            </div>


            <div class="attendance-actions">

                <button
                    type="button"
                    class="attendance-edit-btn"
                    data-id="${record.id}">
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="attendance-delete-btn"
                    data-id="${record.id}">
                    🗑️ Delete
                </button>

            </div>
        `;


        attendanceList.appendChild(item);
    });
}


// ==================================================
// ATTENDANCE - STATS
// ==================================================

function updateAttendanceStats(records) {

    const totalEmployees =
        document.getElementById(
            "attendanceTotalEmployees"
        );

    const presentElement =
        document.getElementById(
            "attendancePresent"
        );

    const absentElement =
        document.getElementById(
            "attendanceAbsent"
        );

    const percentageElement =
        document.getElementById(
            "attendancePercentage"
        );


    if (!Array.isArray(records)) {
        records = [];
    }


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayRecords =
        records.filter(function (record) {

            return record.date === today;
        });


    const present =
        todayRecords.filter(function (record) {

            return record.status === "PRESENT";

        }).length;


    const absent =
        todayRecords.filter(function (record) {

            return record.status === "ABSENT";

        }).length;


    const total =
        present + absent;


    const percentage =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    if (totalEmployees) {

        totalEmployees.textContent =
            total;
    }


    if (presentElement) {

        presentElement.textContent =
            present;
    }


    if (absentElement) {

        absentElement.textContent =
            absent;
    }


    if (percentageElement) {

        percentageElement.textContent =
            percentage + "%";
    }
}


// ==================================================
// OPEN ADD ATTENDANCE MODAL
// ==================================================

if (
    addAttendanceBtn &&
    attendanceModal
) {

    addAttendanceBtn.addEventListener(
        "click",
        async function () {

            attendanceModal.classList.add(
                "show"
            );


            if (attendanceForm) {

                attendanceForm.reset();
            }


            const dateInput =
                document.getElementById(
                    "attendanceDate"
                );


            if (dateInput) {

                dateInput.value =
                    new Date()
                        .toISOString()
                        .split("T")[0];
            }


            const message =
                document.getElementById(
                    "attendanceMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }


            await loadAttendanceEmployees();
        }
    );
}


// ==================================================
// CLOSE ADD ATTENDANCE MODAL
// ==================================================

if (
    closeAttendanceModal &&
    attendanceModal
) {

    closeAttendanceModal.addEventListener(
        "click",
        function () {

            attendanceModal.classList.remove(
                "show"
            );
        }
    );
}


if (
    cancelAttendanceBtn &&
    attendanceModal
) {

    cancelAttendanceBtn.addEventListener(
        "click",
        function () {

            attendanceModal.classList.remove(
                "show"
            );
        }
    );
}


if (attendanceModal) {

    attendanceModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                attendanceModal
            ) {

                attendanceModal.classList.remove(
                    "show"
                );
            }
        }
    );
}


// ==================================================
// SAVE ATTENDANCE
// ==================================================

if (attendanceForm) {

    attendanceForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const employeeSelect =
                document.getElementById(
                    "attendanceEmployee"
                );

            const dateInput =
                document.getElementById(
                    "attendanceDate"
                );

            const statusSelect =
                document.getElementById(
                    "attendanceStatus"
                );

            const message =
                document.getElementById(
                    "attendanceMessage"
                );


            const employeeId =
                employeeSelect
                    ? employeeSelect.value
                    : "";


            const employeeName =
                employeeSelect &&
                employeeSelect.selectedIndex >= 0
                    ? employeeSelect
                        .options[
                            employeeSelect.selectedIndex
                        ]
                        .textContent
                    : "";


            const date =
                dateInput
                    ? dateInput.value
                    : "";


            const status =
                statusSelect
                    ? statusSelect.value
                    : "";


            if (!employeeId) {

                message.textContent =
                    "Please select an employee.";

                message.style.color =
                    "red";

                return;
            }


            if (!date) {

                message.textContent =
                    "Please select a date.";

                message.style.color =
                    "red";

                return;
            }


            if (!status) {

                message.textContent =
                    "Please select attendance status.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Saving attendance...";

                message.style.color =
                    "black";


                const response =
                    await fetch(
                        ATTENDANCE_API_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                employeeId:
                                    Number(
                                        employeeId
                                    ),

                                employeeName:
                                    employeeName,

                                date:
                                    date,

                                status:
                                    status
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Attendance save failed: " +
                        response.status
                    );
                }


                const savedAttendance =
                    await response.json();


                console.log(
                    "ATTENDANCE SAVED:",
                    savedAttendance
                );


                message.textContent =
                    "Attendance marked successfully!";

                message.style.color =
                    "green";


                attendanceForm.reset();


                await loadAttendance();


                setTimeout(function () {

                    attendanceModal.classList.remove(
                        "show"
                    );

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Save Attendance Error:",
                    error
                );


                message.textContent =
                    "Attendance save nahi ho rahi.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==================================================
// EDIT ATTENDANCE
// ==================================================

document.addEventListener(
    "click",
    async function (e) {

        const editButton =
            e.target.closest(
                ".attendance-edit-btn"
            );


        if (!editButton) {
            return;
        }


        const attendanceId =
            editButton.getAttribute(
                "data-id"
            );


        if (!attendanceId) {

            alert(
                "Attendance ID nahi mila."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `${ATTENDANCE_API_URL}/${attendanceId}`
                );


            if (!response.ok) {

                throw new Error(
                    "Attendance fetch failed"
                );
            }


            const record =
                await response.json();


            const idInput =
                document.getElementById(
                    "editAttendanceId"
                );

            const employeeSelect =
                document.getElementById(
                    "editAttendanceEmployee"
                );

            const dateInput =
                document.getElementById(
                    "editAttendanceDate"
                );

            const statusSelect =
                document.getElementById(
                    "editAttendanceStatus"
                );


            if (idInput) {

                idInput.value =
                    record.id;
            }


            await loadAttendanceEmployees();


            if (employeeSelect) {

                employeeSelect.value =
                    record.employeeId || "";
            }


            if (dateInput) {

                dateInput.value =
                    record.date || "";
            }


            if (statusSelect) {

                statusSelect.value =
                    record.status || "";
            }


            const message =
                document.getElementById(
                    "editAttendanceMessage"
                );


            if (message) {

                message.textContent =
                    "";
            }


            if (editAttendanceModal) {

                editAttendanceModal.classList.add(
                    "show"
                );
            }


        } catch (error) {

            console.error(
                "Edit Attendance Error:",
                error
            );


            alert(
                "Attendance details load nahi ho rahe."
            );
        }
    }
);


// ==================================================
// CLOSE EDIT ATTENDANCE MODAL
// ==================================================

if (
    closeEditAttendanceModal &&
    editAttendanceModal
) {

    closeEditAttendanceModal.addEventListener(
        "click",
        function () {

            editAttendanceModal.classList.remove(
                "show"
            );
        }
    );
}


if (
    cancelEditAttendanceBtn &&
    editAttendanceModal
) {

    cancelEditAttendanceBtn.addEventListener(
        "click",
        function () {

            editAttendanceModal.classList.remove(
                "show"
            );
        }
    );
}


if (editAttendanceModal) {

    editAttendanceModal.addEventListener(
        "click",
        function (e) {

            if (
                e.target ===
                editAttendanceModal
            ) {

                editAttendanceModal.classList.remove(
                    "show"
                );
            }
        }
    );
}


// ==================================================
// UPDATE ATTENDANCE
// ==================================================

if (editAttendanceForm) {

    editAttendanceForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const id =
                document.getElementById(
                    "editAttendanceId"
                ).value;


            const employeeSelect =
                document.getElementById(
                    "editAttendanceEmployee"
                );

            const dateInput =
                document.getElementById(
                    "editAttendanceDate"
                );

            const statusSelect =
                document.getElementById(
                    "editAttendanceStatus"
                );


            const message =
                document.getElementById(
                    "editAttendanceMessage"
                );


            const employeeId =
                employeeSelect
                    ? employeeSelect.value
                    : "";


            const employeeName =
                employeeSelect &&
                employeeSelect.selectedIndex >= 0
                    ? employeeSelect
                        .options[
                            employeeSelect.selectedIndex
                        ]
                        .textContent
                    : "";


            const date =
                dateInput
                    ? dateInput.value
                    : "";


            const status =
                statusSelect
                    ? statusSelect.value
                    : "";


            if (!id) {

                message.textContent =
                    "Attendance ID missing.";

                message.style.color =
                    "red";

                return;
            }


            if (!employeeId) {

                message.textContent =
                    "Please select an employee.";

                message.style.color =
                    "red";

                return;
            }


            if (!date || !status) {

                message.textContent =
                    "Please fill all fields.";

                message.style.color =
                    "red";

                return;
            }


            try {

                message.textContent =
                    "Updating attendance...";

                message.style.color =
                    "black";


                const response =
                    await fetch(
                        `${ATTENDANCE_API_URL}/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                employeeId:
                                    Number(
                                        employeeId
                                    ),

                                employeeName:
                                    employeeName,

                                date:
                                    date,

                                status:
                                    status
                            })
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Attendance update failed: " +
                        response.status
                    );
                }


                const updatedAttendance =
                    await response.json();


                console.log(
                    "ATTENDANCE UPDATED:",
                    updatedAttendance
                );


                message.textContent =
                    "Attendance updated successfully!";

                message.style.color =
                    "green";


                await loadAttendance();


                setTimeout(function () {

                    editAttendanceModal.classList.remove(
                        "show"
                    );

                    message.textContent =
                        "";

                }, 800);


            } catch (error) {

                console.error(
                    "Update Attendance Error:",
                    error
                );


                message.textContent =
                    "Attendance update nahi ho rahi.";

                message.style.color =
                    "red";
            }
        }
    );
}


// ==================================================
// DELETE ATTENDANCE
// ==================================================

document.addEventListener(
    "click",
    async function (e) {

        const deleteButton =
            e.target.closest(
                ".attendance-delete-btn"
            );


        if (!deleteButton) {
            return;
        }


        const attendanceId =
            deleteButton.getAttribute(
                "data-id"
            );


        if (!attendanceId) {

            alert(
                "Attendance ID nahi mila."
            );

            return;
        }


        const confirmDelete =
            confirm(
                "Kya aap is attendance record ko delete karna chahte hain?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${ATTENDANCE_API_URL}/${attendanceId}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Attendance delete failed: " +
                    response.status
                );
            }


            await loadAttendance();


            alert(
                "Attendance deleted successfully!"
            );


        } catch (error) {

            console.error(
                "Delete Attendance Error:",
                error
            );


            alert(
                "Attendance delete nahi ho rahi."
            );
        }
    }
);


// ==================================================
// ATTENDANCE SEARCH + FILTER
// ==================================================

async function filterAttendance() {

    if (!attendanceList) {
        return;
    }


    try {

        const response =
            await fetch(
                ATTENDANCE_API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Attendance filter failed"
            );
        }


        const records =
            await response.json();


        const searchText =
            attendanceSearch
                ? attendanceSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedStatus =
            attendanceStatusFilter
                ? attendanceStatusFilter.value
                : "";


        const selectedDate =
            attendanceDateFilter
                ? attendanceDateFilter.value
                : "";


        const filteredRecords =
            records.filter(function (record) {

                const employeeName =
                    (
                        record.employeeName ||
                        ""
                    ).toLowerCase();


                const matchesSearch =
                    employeeName.includes(
                        searchText
                    );


                const matchesStatus =
                    !selectedStatus ||
                    record.status ===
                        selectedStatus;


                const matchesDate =
                    !selectedDate ||
                    record.date ===
                        selectedDate;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesDate
                );
            });


        displayAttendance(
            filteredRecords
        );


    } catch (error) {

        console.error(
            "Attendance Filter Error:",
            error
        );
    }
}


if (attendanceSearch) {

    attendanceSearch.addEventListener(
        "input",
        filterAttendance
    );
}


if (attendanceStatusFilter) {

    attendanceStatusFilter.addEventListener(
        "change",
        filterAttendance
    );
}


if (attendanceDateFilter) {

    attendanceDateFilter.addEventListener(
        "change",
        filterAttendance
    );
}


// ==================================================
// START ATTENDANCE PAGE
// ==================================================

if (attendanceList) {

    loadAttendance();

    loadAttendanceEmployees();
}
// ==================================================
// REPORTS MANAGEMENT
// ==================================================

const REPORTS_API_URL =
    "/api/reports/attendance";

const employeeReportList =
    document.getElementById("employeeReportList");

const reportSearch =
    document.getElementById("reportSearch");

const reportStatusFilter =
    document.getElementById("reportStatusFilter");

const reportDateFilter =
    document.getElementById("reportDateFilter");

const refreshReportsBtn =
    document.getElementById("refreshReportsBtn");


// ==================================================
// LOAD REPORTS
// ==================================================

async function loadReports() {

    if (!employeeReportList) {
        return;
    }

    employeeReportList.innerHTML =
        `<div class="report-empty">
            Loading reports...
        </div>`;

    try {

        const response =
            await fetch(REPORTS_API_URL);

        if (!response.ok) {

            throw new Error(
                "Reports fetch failed: " +
                response.status
            );
        }

        const report =
            await response.json();

        updateReportStatistics(report);

        displayEmployeeReport(
            report.records || []
        );

    } catch (error) {

        console.error(
            "Reports Load Error:",
            error
        );

        employeeReportList.innerHTML =
            `<div class="report-empty">
                Reports load nahi ho rahe.
            </div>`;
    }
}


// ==================================================
// UPDATE REPORT STATISTICS
// ==================================================

function updateReportStatistics(report) {

    const totalEmployees =
        document.getElementById(
            "reportTotalEmployees"
        );

    const totalAttendance =
        document.getElementById(
            "reportTotalAttendance"
        );

    const attendanceRate =
        document.getElementById(
            "reportAttendanceRate"
        );

    const present =
        document.getElementById(
            "reportPresent"
        );

    const absent =
        document.getElementById(
            "reportAbsent"
        );

    const presentPercentage =
        document.getElementById(
            "reportPresentPercentage"
        );

    const absentPercentage =
        document.getElementById(
            "reportAbsentPercentage"
        );


    const total =
        Number(report.totalAttendance || 0);

    const presentCount =
        Number(report.present || 0);

    const absentCount =
        Number(report.absent || 0);


    if (totalEmployees) {

        totalEmployees.textContent =
            report.totalEmployees || 0;
    }


    if (totalAttendance) {

        totalAttendance.textContent =
            total;
    }


    if (attendanceRate) {

        attendanceRate.textContent =
            (report.attendanceRate || 0) + "%";
    }


    if (present) {

        present.textContent =
            presentCount;
    }


    if (absent) {

        absent.textContent =
            absentCount;
    }


    const presentPercent =
        total > 0
            ? Math.round(
                (presentCount / total) * 100
            )
            : 0;


    const absentPercent =
        total > 0
            ? Math.round(
                (absentCount / total) * 100
            )
            : 0;


    if (presentPercentage) {

        presentPercentage.textContent =
            presentPercent + "%";
    }


    if (absentPercentage) {

        absentPercentage.textContent =
            absentPercent + "%";
    }
}


// ==================================================
// DISPLAY EMPLOYEE ATTENDANCE REPORT
// ==================================================

function displayEmployeeReport(records) {

    if (!employeeReportList) {
        return;
    }


    if (
        !Array.isArray(records) ||
        records.length === 0
    ) {

        employeeReportList.innerHTML =
            `<div class="report-empty">
                No attendance records found.
            </div>`;

        return;
    }


    const searchText =
        reportSearch
            ? reportSearch.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        reportStatusFilter
            ? reportStatusFilter.value
            : "";


    const selectedDate =
        reportDateFilter
            ? reportDateFilter.value
            : "";


    const filteredRecords =
        records.filter(function (record) {

            const employeeName =
                (
                    record.employeeName ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                employeeName.includes(
                    searchText
                );


            const matchesStatus =
                !selectedStatus ||
                record.status ===
                    selectedStatus;


            const matchesDate =
                !selectedDate ||
                record.date ===
                    selectedDate;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );
        });


    if (filteredRecords.length === 0) {

        employeeReportList.innerHTML =
            `<div class="report-empty">
                No matching records found.
            </div>`;

        return;
    }


    employeeReportList.innerHTML = "";


    filteredRecords.forEach(
        function (record) {

            const employeeName =
                record.employeeName ||
                "Unknown Employee";


            const status =
                record.status ||
                "ABSENT";


            const statusClass =
                status === "PRESENT"
                    ? "present"
                    : "absent";


            const statusText =
                status === "PRESENT"
                    ? "Present"
                    : "Absent";


            const item =
                document.createElement("div");


            item.className =
                "employee-report-item";


            item.innerHTML = `

                <div class="employee-report-info">

                    <div class="employee-report-avatar">
                        ${escapeHtml(
                            getInitials(
                                employeeName
                            )
                        )}
                    </div>

                    <div class="employee-report-details">

                        <strong>
                            ${escapeHtml(
                                employeeName
                            )}
                        </strong>

                        <span>
                            Employee ID:
                            ${escapeHtml(
                                String(
                                    record.employeeId ||
                                    "-"
                                )
                            )}
                        </span>

                    </div>

                </div>


                <div class="employee-report-date">
                    📅
                    ${escapeHtml(
                        record.date || "-"
                    )}
                </div>


                <div
                    class="employee-report-status ${statusClass}">
                    ${statusText}
                </div>


                <div>
                    Attendance ID:
                    ${escapeHtml(
                        String(
                            record.id || "-"
                        )
                    )}
                </div>

            `;


            employeeReportList.appendChild(
                item
            );
        }
    );
}


// ==================================================
// REPORT FILTERS
// ==================================================

function refreshReportData() {
    loadReports();
}


if (reportSearch) {

    reportSearch.addEventListener(
        "input",
        loadReports
    );
}


if (reportStatusFilter) {

    reportStatusFilter.addEventListener(
        "change",
        loadReports
    );
}


if (reportDateFilter) {

    reportDateFilter.addEventListener(
        "change",
        loadReports
    );
}


if (refreshReportsBtn) {

    refreshReportsBtn.addEventListener(
        "click",
        refreshReportData
    );
}


// ==================================================
// START REPORTS PAGE
// ==================================================

if (employeeReportList) {

    loadReports();
}
// ==================================================
// REPORTS - TASK SUMMARY
// ==================================================

async function loadReportTaskSummary() {

    const totalElement =
        document.getElementById("reportTasksTotal");

    const pendingElement =
        document.getElementById("reportTasksPending");

    const inProgressElement =
        document.getElementById("reportTasksInProgress");

    const completedElement =
        document.getElementById("reportTasksCompleted");


    if (
        !totalElement &&
        !pendingElement &&
        !inProgressElement &&
        !completedElement
    ) {
        return;
    }


    try {

        const response =
            await fetch(TASKS_API_URL);


        if (!response.ok) {

            throw new Error(
                "Tasks report fetch failed: " +
                response.status
            );
        }


        const tasks =
            await response.json();


        const total =
            Array.isArray(tasks)
                ? tasks.length
                : 0;


        const pending =
            Array.isArray(tasks)
                ? tasks.filter(function (task) {

                    return (
                        String(
                            task.status || ""
                        ).toUpperCase() ===
                        "PENDING"
                    );

                }).length
                : 0;


        const inProgress =
            Array.isArray(tasks)
                ? tasks.filter(function (task) {

                    return (
                        String(
                            task.status || ""
                        ).toUpperCase() ===
                        "IN_PROGRESS" ||
                        String(
                            task.status || ""
                        ).toUpperCase() ===
                        "IN PROGRESS"
                    );

                }).length
                : 0;


        const completed =
            Array.isArray(tasks)
                ? tasks.filter(function (task) {

                    return (
                        String(
                            task.status || ""
                        ).toUpperCase() ===
                        "COMPLETED"
                    );

                }).length
                : 0;


        if (totalElement) {
            totalElement.textContent = total;
        }

        if (pendingElement) {
            pendingElement.textContent = pending;
        }

        if (inProgressElement) {
            inProgressElement.textContent =
                inProgress;
        }

        if (completedElement) {
            completedElement.textContent =
                completed;
        }


        // Top Total Tasks card
        const reportTotalTasks =
            document.getElementById(
                "reportTotalTasks"
            );

        if (reportTotalTasks) {
            reportTotalTasks.textContent =
                total;
        }


    } catch (error) {

        console.error(
            "Report Task Summary Error:",
            error
        );
    }
}


// ==================================================
// START TASK REPORT
// ==================================================

if (employeeReportList) {

    loadReportTaskSummary();
}

