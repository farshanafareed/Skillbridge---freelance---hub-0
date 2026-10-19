// =====================================
// SKILLBRIDGE - WEBSITE JAVASCRIPT
// =====================================

const projectDetails = {
    landing: {
        title: "Design a Landing Page",
        category: "Web Development",
        skills: "HTML, CSS, JavaScript",
        budget: "₹2,000",
        description: "Create a modern, responsive landing page for a startup."
    },

    mobile: {
        title: "Mobile App Interface",
        category: "UI/UX Design",
        skills: "UI/UX, Figma",
        budget: "₹1,500",
        description: "Create a simple and user-friendly mobile application design."
    },

    data: {
        title: "Student Data Analysis",
        category: "Data Science",
        skills: "Python, Data Analysis",
        budget: "₹2,500",
        description: "Analyse sample student data and present useful insights using charts."
    }
};

const $ = (id) => document.getElementById(id);

let selectedProject = null;


// -------------------------------------
// LOCAL DEMONSTRATION STORAGE
// -------------------------------------

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem("skillbridge_users")) || [];
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("skillbridge_users", JSON.stringify(users));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem("skillbridge_current_user"));
    } catch (error) {
        return null;
    }
}

function getApplications() {
    try {
        return JSON.parse(localStorage.getItem("skillbridge_applications")) || [];
    } catch (error) {
        return [];
    }
}

function saveApplications(applications) {
    localStorage.setItem(
        "skillbridge_applications",
        JSON.stringify(applications)
    );
}


// -------------------------------------
// NAVIGATION
// -------------------------------------

function openSection(sectionId) {
    const section = $(sectionId);

    if (!section) {
        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showLogin() {
    openSection("login");
}

function showSignup() {
    openSection("signup");
}

function updateNavigation() {
    const user = getCurrentUser();

    $("loginNav").hidden = Boolean(user);
    $("getStartedBtn").hidden = Boolean(user);
    $("dashboardNav").hidden = !user;
    $("logoutBtn").hidden = !user;
}


// -------------------------------------
// REGISTRATION
// -------------------------------------

$("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim().toLowerCase();
    const password = $("signupPassword").value;

    if (!name || !email || password.length < 6) {
        $("signupMessage").textContent =
            "Please enter valid details and a password of at least 6 characters.";
        return;
    }

    const users = getUsers();

    const existingUser = users.find(function(user) {
        return user.email === email;
    });

    if (existingUser) {
        $("signupMessage").textContent =
            "An account with this email already exists. Please log in.";
        return;
    }

    // DEMO ONLY:
    // Passwords are stored locally and are NOT secure.
    // Never use this method for a real public website.
    users.push({
        name: name,
        email: email,
        password: password
    });

    saveUsers(users);

    localStorage.setItem(
        "skillbridge_current_user",
        JSON.stringify({
            name: name,
            email: email
        })
    );

    $("signupForm").reset();
    $("signupMessage").textContent = "Registration successful!";

    updateNavigation();
    renderDashboard();

    setTimeout(function() {
        openSection("dashboard");
    }, 300);
});


// -------------------------------------
// LOGIN
// -------------------------------------

$("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = $("loginEmail").value.trim().toLowerCase();
    const password = $("loginPassword").value;

    const users = getUsers();

    const user = users.find(function(item) {
        return item.email === email && item.password === password;
    });

    if (!user) {
        $("loginMessage").textContent =
            "Account not found or password is incorrect. Register first if you are new.";
        return;
    }

    localStorage.setItem(
        "skillbridge_current_user",
        JSON.stringify({
            name: user.name,
            email: user.email
        })
    );

    $("loginForm").reset();
    $("loginMessage").textContent = "Login successful!";

    updateNavigation();
    renderDashboard();

    setTimeout(function() {
        openSection("dashboard");
    }, 300);
});


// -------------------------------------
// LOGOUT
// -------------------------------------

$("logoutBtn").addEventListener("click", function() {
    localStorage.removeItem("skillbridge_current_user");

    updateNavigation();

    alert("You have logged out.");

    openSection("home");
});


// -------------------------------------
// SWITCH BETWEEN LOGIN AND SIGNUP
// -------------------------------------

$("goSignupBtn").addEventListener("click", showSignup);
$("goLoginBtn").addEventListener("click", showLogin);


// -------------------------------------
// PROJECT SEARCH
// -------------------------------------

function searchProjects() {
    const input = $("searchInput").value.trim().toLowerCase();

    const cards = document.querySelectorAll("#projectGrid .project-card");

    let found = 0;

    cards.forEach(function(card) {
        const matches = card.textContent.toLowerCase().includes(input);

        card.hidden = !matches;

        if (matches) {
            found++;
        }
    });

    $("noProjects").hidden = found !== 0;

    if (found === 0) {
        $("noProjects").textContent =
            "No matching projects found. Try another keyword.";
    }
}

$("searchBtn").addEventListener("click", searchProjects);

$("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        searchProjects();
    }
});

$("searchInput").addEventListener("input", function() {
    if ($("searchInput").value.trim() === "") {
        searchProjects();
    }
});


// -------------------------------------
// VIEW PROJECT DETAILS
// -------------------------------------

document.querySelectorAll("[data-project]").forEach(function(button) {
    button.addEventListener("click", function() {
        const projectId = button.dataset.project;
        const project = projectDetails[projectId];

        if (!project) {
            alert("Project details are unavailable.");
            return;
        }

        selectedProject = projectId;

        $("detailTitle").textContent = project.title;
        $("detailCategory").textContent = project.category;
        $("detailSkills").textContent = project.skills;
        $("detailBudget").textContent = project.budget;
        $("detailDescription").textContent = project.description;

        $("projectDetails").hidden = false;

        openSection("projectDetails");
    });
});

$("backProjectsBtn").addEventListener("click", function() {
    openSection("projects");
});


// -------------------------------------
// APPLY FOR A PROJECT
// -------------------------------------

$("applyBtn").addEventListener("click", function() {
    const user = getCurrentUser();

    if (!user) {
        alert("Please register or log in before applying for a project.");
        showLogin();
        return;
    }

    if (!selectedProject || !projectDetails[selectedProject]) {
        alert("Please select a project first.");
        return;
    }

    const applications = getApplications();

    const alreadyApplied = applications.some(function(application) {
        return (
            application.email === user.email &&
            application.projectId === selectedProject
        );
    });

    if (alreadyApplied) {
        alert("You have already applied for this project.");
        return;
    }

    applications.push({
        id: Date.now(),
        email: user.email,
        projectId: selectedProject,
        projectTitle: projectDetails[selectedProject].title,
        status: "Pending",
        appliedAt: new Date().toLocaleDateString()
    });

    saveApplications(applications);

    renderDashboard();

    alert("Application submitted successfully!");

    openSection("dashboard");
});


// -------------------------------------
// STUDENT DASHBOARD
// -------------------------------------

function renderDashboard() {
    const user = getCurrentUser();

    if (!user) {
        $("welcomeName").textContent = "Student";
        $("totalApplications").textContent = "0";
        $("pendingApplications").textContent = "0";
        $("acceptedApplications").textContent = "0";

        $("applicationList").textContent =
            "Please log in to view your applications.";

        return;
    }

    $("welcomeName").textContent = user.name;

    const applications = getApplications().filter(function(application) {
        return application.email === user.email;
    });

    const pending = applications.filter(function(application) {
        return application.status === "Pending";
    });

    const accepted = applications.filter(function(application) {
        return application.status === "Accepted";
    });

    $("totalApplications").textContent = applications.length;
    $("pendingApplications").textContent = pending.length;
    $("acceptedApplications").textContent = accepted.length;

    const list = $("applicationList");
    list.replaceChildren();

    if (applications.length === 0) {
        const message = document.createElement("p");

        message.textContent =
            "You haven't applied for any projects yet. Explore projects to get started.";

        list.appendChild(message);
        return;
    }

    applications.forEach(function(application) {
        const card = document.createElement("article");
        card.className = "project-card";

        const title = document.createElement("h3");
        title.textContent = application.projectTitle;

        const status = document.createElement("p");
        status.textContent = "Status: " + application.status;

        const date = document.createElement("p");
        date.textContent = "Applied on: " + application.appliedAt;

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(date);

        list.appendChild(card);
    });
}

$("browseProjectsBtn").addEventListener("click", function() {
    openSection("projects");
});


// -------------------------------------
// INITIALIZE WEBSITE
// -------------------------------------

function initializeWebsite() {
    updateNavigation();
    renderDashboard();

    // If an account is already logged in, refresh dashboard data.
    const user = getCurrentUser();

    if (user) {
        renderDashboard();
    }
}

initializeWebsite();