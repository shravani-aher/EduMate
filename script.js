// =====================================================
// EDUMATE
// COMPLETE JAVASCRIPT
// =====================================================


// =====================================================
// AUTHENTICATION ELEMENTS
// =====================================================

const authPage =
    document.getElementById("authPage");

const mainApp =
    document.getElementById("mainApp");

const loginSection =
    document.getElementById("loginSection");

const signupSection =
    document.getElementById("signupSection");

const loginForm =
    document.getElementById("loginForm");

const signupForm =
    document.getElementById("signupForm");

const showSignupBtn =
    document.getElementById("showSignupBtn");

const showLoginBtn =
    document.getElementById("showLoginBtn");

const authMessage =
    document.getElementById("authMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


// =====================================================
// CHECK LOGIN STATUS
// =====================================================

const loggedInUser =
    localStorage.getItem("edumateLoggedIn");


if (loggedInUser) {

    authPage.style.display = "none";

    mainApp.style.display = "block";

}


// =====================================================
// SHOW SIGN UP
// =====================================================

showSignupBtn.addEventListener(
    "click",
    function () {

        loginSection.style.display = "none";

        signupSection.style.display = "block";

        authMessage.textContent = "";

    }
);


// =====================================================
// SHOW LOGIN
// =====================================================

showLoginBtn.addEventListener(
    "click",
    function () {

        signupSection.style.display = "none";

        loginSection.style.display = "block";

        authMessage.textContent = "";

    }
);


// =====================================================
// SIGN UP
// =====================================================

signupForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("signupEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("signupPassword")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;



        // -------------------------------
        // PASSWORD MATCH
        // -------------------------------

        if (password !== confirmPassword) {

            authMessage.textContent =
                "❌ Passwords do not match.";

            authMessage.className =
                "auth-error";

            return;

        }



        // -------------------------------
        // PASSWORD LENGTH
        // -------------------------------

        if (password.length < 6) {

            authMessage.textContent =
                "❌ Password must contain at least 6 characters.";

            authMessage.className =
                "auth-error";

            return;

        }



        // -------------------------------
        // CHECK EXISTING USER
        // -------------------------------

        const existingUser =
            localStorage.getItem(
                "edumateUser_" + email
            );


        if (existingUser) {

            authMessage.textContent =
                "❌ An account with this email already exists.";

            authMessage.className =
                "auth-error";

            return;

        }



        // -------------------------------
        // CREATE USER
        // -------------------------------

        const user = {

            email: email,

            password: password

        };


        localStorage.setItem(

            "edumateUser_" + email,

            JSON.stringify(user)

        );



        // -------------------------------
        // SUCCESS
        // -------------------------------

        authMessage.textContent =
            "✅ Account created successfully!";

        authMessage.className =
            "auth-success";


        signupForm.reset();



        // -------------------------------
        // GO TO LOGIN
        // -------------------------------

        setTimeout(
            function () {

                signupSection.style.display =
                    "none";

                loginSection.style.display =
                    "block";

                document
                    .getElementById("loginEmail")
                    .value = email;

                authMessage.textContent = "";

            },
            1000
        );

    }
);



// =====================================================
// LOGIN
// =====================================================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("loginPassword")
                .value;



        // -------------------------------
        // FIND USER
        // -------------------------------

        const savedUser =
            localStorage.getItem(
                "edumateUser_" + email
            );


        if (!savedUser) {

            authMessage.textContent =
                "❌ No account found with this email. Please Sign Up first.";

            authMessage.className =
                "auth-error";

            return;

        }



        const user =
            JSON.parse(savedUser);



        // -------------------------------
        // CHECK PASSWORD
        // -------------------------------

        if (user.password !== password) {

            authMessage.textContent =
                "❌ Incorrect password.";

            authMessage.className =
                "auth-error";

            return;

        }



        // -------------------------------
        // LOGIN SUCCESS
        // -------------------------------

        localStorage.setItem(
            "edumateLoggedIn",
            email
        );


        authMessage.textContent =
            "✅ Login successful!";

        authMessage.className =
            "auth-success";



        setTimeout(
            function () {

                authPage.style.display =
                    "none";

                mainApp.style.display =
                    "block";

                loginForm.reset();

                authMessage.textContent =
                    "";

            },
            500
        );

    }
);



// =====================================================
// LOGOUT
// =====================================================

logoutBtn.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "edumateLoggedIn"
        );


        mainApp.style.display =
            "none";


        authPage.style.display =
            "flex";


        loginSection.style.display =
            "block";


        signupSection.style.display =
            "none";


        loginForm.reset();


        authMessage.textContent =
            "";

    }
);



// =====================================================
// COLLEGE PREDICTOR
// =====================================================

const predictorBtn =
    document.getElementById("predictorBtn");

const predictorForm =
    document.getElementById("predictorForm");

const predictBtn =
    document.getElementById("predictBtn");

const resultsDiv =
    document.getElementById("results");


// =====================================================
// OPEN PREDICTOR
// =====================================================

predictorBtn.addEventListener(
    "click",
    function () {

        predictorForm.style.display =
            "block";

        predictorBtn.style.display =
            "none";

    }
);



// =====================================================
// PREDICT COLLEGES
// =====================================================

predictBtn.addEventListener(
    "click",
    async function () {


        // -------------------------------
        // GET INPUTS
        // -------------------------------

        const percentile =
            parseFloat(
                document
                    .getElementById("percentile")
                    .value
            );


        const category =
            document
                .getElementById("category")
                .value;


        const gender =
            document
                .getElementById("gender")
                .value;


        const branch =
            document
                .getElementById("branch")
                .value;


        const homeUniversity =
            document
                .getElementById("homeUniversity")
                .value;


        const city =
            document
                .getElementById("location")
                .value;



        // -------------------------------
        // VALIDATE PERCENTILE
        // -------------------------------

        if (
            isNaN(percentile) ||
            percentile < 0 ||
            percentile > 100
        ) {

            resultsDiv.innerHTML = `

                <div class="error-message">

                    Please enter a valid
                    percentile between 0 and 100.

                </div>

            `;

            return;

        }



        // -------------------------------
        // LOADING
        // -------------------------------

        resultsDiv.innerHTML = `

            <div class="loading">

                🔍 Finding the best colleges for you...

            </div>

        `;



        // -------------------------------
        // REQUEST DATA
        // -------------------------------

        const studentData = {

            percentile: percentile,

            category: category,

            gender: gender,

            branch: branch,

            home_university: homeUniversity,

            city: city

        };



        try {


            // ---------------------------
            // SEND TO FASTAPI
            // ---------------------------

            const response =
                await fetch(
                    "http://127.0.0.1:8000/predict",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                studentData
                            )

                    }
                );



            // ---------------------------
            // CHECK RESPONSE
            // ---------------------------

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );

            }



            // ---------------------------
            // GET JSON
            // ---------------------------

            const data =
                await response.json();



            // ---------------------------
            // DISPLAY
            // ---------------------------

            displayResults(data);


        }

        catch (error) {

            console.error(error);


            resultsDiv.innerHTML = `

                <div class="error-message">

                    ❌ Unable to connect to
                    the EduMate predictor.

                    <br><br>

                    Make sure the FastAPI server
                    is running.

                </div>

            `;

        }

    }
);



// =====================================================
// DISPLAY COLLEGE RESULTS
// =====================================================

function displayResults(data) {


    resultsDiv.innerHTML = "";



    // -------------------------------
    // NO RESULTS
    // -------------------------------

    if (
        !data.colleges ||
        data.colleges.length === 0
    ) {

        resultsDiv.innerHTML = `

            <div class="error-message">

                No suitable colleges found
                for your preferences.

            </div>

        `;

        return;

    }



    // -------------------------------
    // HEADING
    // -------------------------------

    const heading =
        document.createElement("h3");


    heading.textContent =
        "🎓 Your College Recommendations";


    resultsDiv.appendChild(heading);



    // -------------------------------
    // CREATE CARDS
    // -------------------------------

    data.colleges.forEach(
        function (college) {


            const card =
                document.createElement("div");


            card.className =
                "college-result";



            // ---------------------------
            // COLLEGE NAME
            // ---------------------------

            const name =
                document.createElement("h4");


            name.textContent =
                college.college;



            // ---------------------------
            // CHANCE
            // ---------------------------

            const badge =
                document.createElement("span");


            badge.className =
                "chance-badge";


            const chance =
                college.category.toUpperCase();



            if (chance === "SAFE") {

                badge.classList.add("safe");

                badge.textContent =
                    "✓ SAFE";

            }

            else if (
                chance === "MODERATE"
            ) {

                badge.classList.add(
                    "moderate"
                );

                badge.textContent =
                    "◐ MODERATE";

            }

            else {

                badge.classList.add(
                    "difficult"
                );

                badge.textContent =
                    "⚡ AMBITIOUS";

            }



            // ---------------------------
            // CUTOFF
            // ---------------------------

            const cutoff =
                document.createElement("p");


            cutoff.innerHTML = `

                <strong>
                    Historical Cutoff:
                </strong>

                ${Number(
                college.latest_cutoff
            ).toFixed(2)}

            `;



            // ---------------------------
            // DIFFERENCE
            // ---------------------------

            const difference =
                document.createElement("p");


            const diff =
                Number(
                    college.difference
                ).toFixed(2);


            difference.innerHTML = `

                <strong>
                    Your Percentile Advantage:
                </strong>

                +${diff}

            `;



            // ---------------------------
            // ADD TO CARD
            // ---------------------------

            card.appendChild(badge);

            card.appendChild(name);

            card.appendChild(cutoff);

            card.appendChild(difference);


            resultsDiv.appendChild(card);

        }
    );

}



// =====================================================
// STUDY PLANNER
// =====================================================

const plannerBtn =
    document.getElementById("plannerBtn");

const plannerForm =
    document.getElementById("plannerForm");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");


// =====================================================
// OPEN PLANNER
// =====================================================

plannerBtn.addEventListener(
    "click",
    function () {

        plannerForm.style.display =
            "block";

        plannerBtn.style.display =
            "none";

    }
);



// =====================================================
// GET SAVED TASKS
// =====================================================

let tasks =
    JSON.parse(
        localStorage.getItem(
            "edumateTasks"
        )
    ) || [];


// =====================================================
// DISPLAY TASKS
// =====================================================

function displayTasks() {


    taskList.innerHTML = "";



    if (tasks.length === 0) {

        taskList.innerHTML = `

            <p class="empty-message">

                No study tasks added yet.

            </p>

        `;

        return;

    }



    tasks.forEach(
        function (task, index) {


            const taskCard =
                document.createElement("div");


            taskCard.className =
                "study-task";



            if (task.completed) {

                taskCard.classList.add(
                    "completed-task"
                );

            }



            taskCard.innerHTML = `

                <h4>
                    ${task.task}
                </h4>

                <p>
                    📅 ${task.date}
                </p>

                <p>
                    ⏱️ ${task.hours} hours
                </p>

                <p>
                    Priority:
                    <strong>
                        ${task.priority}
                    </strong>
                </p>

                <div class="task-buttons">

                    <button
                        class="complete-btn"
                        data-index="${index}"
                    >
                        ${task.completed
                    ? "Undo"
                    : "Complete"}
                    </button>

                    <button
                        class="delete-task-btn"
                        data-index="${index}"
                    >
                        Delete
                    </button>

                </div>

            `;


            taskList.appendChild(
                taskCard
            );

        }
    );

}



// =====================================================
// ADD TASK
// =====================================================

addTaskBtn.addEventListener(
    "click",
    function () {


        const task =
            document
                .getElementById("studyTask")
                .value
                .trim();


        const date =
            document
                .getElementById("studyDate")
                .value;


        const hours =
            document
                .getElementById("studyHours")
                .value;


        const priority =
            document
                .getElementById("priority")
                .value;



        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            task === "" ||
            date === "" ||
            hours === ""
        ) {

            alert(
                "Please fill in all study task details."
            );

            return;

        }



        // -------------------------------
        // CREATE TASK
        // -------------------------------

        const newTask = {

            task: task,

            date: date,

            hours: hours,

            priority: priority,

            completed: false

        };


        tasks.push(newTask);



        // -------------------------------
        // SAVE
        // -------------------------------

        localStorage.setItem(

            "edumateTasks",

            JSON.stringify(tasks)

        );



        // -------------------------------
        // CLEAR
        // -------------------------------

        document
            .getElementById("studyTask")
            .value = "";

        document
            .getElementById("studyDate")
            .value = "";

        document
            .getElementById("studyHours")
            .value = "";



        displayTasks();

    }
);



// =====================================================
// COMPLETE / DELETE TASKS
// =====================================================

taskList.addEventListener(
    "click",
    function (event) {


        const index =
            event.target.dataset.index;


        if (index === undefined) {

            return;

        }



        // -------------------------------
        // COMPLETE
        // -------------------------------

        if (
            event.target.classList.contains(
                "complete-btn"
            )
        ) {

            tasks[index].completed =
                !tasks[index].completed;

        }



        // -------------------------------
        // DELETE
        // -------------------------------

        if (
            event.target.classList.contains(
                "delete-task-btn"
            )
        ) {

            tasks.splice(
                index,
                1
            );

        }



        // -------------------------------
        // SAVE
        // -------------------------------

        localStorage.setItem(

            "edumateTasks",

            JSON.stringify(tasks)

        );


        displayTasks();

    }
);



// =====================================================
// ACADEMIC TRACKER
// =====================================================

const trackerBtn =
    document.getElementById("trackerBtn");

const trackerForm =
    document.getElementById("trackerForm");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const subjectList =
    document.getElementById("subjectList");

const performance =
    document.getElementById("performance");


// =====================================================
// OPEN TRACKER
// =====================================================

trackerBtn.addEventListener(
    "click",
    function () {

        trackerForm.style.display =
            "block";

        trackerBtn.style.display =
            "none";

    }
);



// =====================================================
// GET SAVED SUBJECTS
// =====================================================

let subjects =
    JSON.parse(
        localStorage.getItem(
            "edumateSubjects"
        )
    ) || [];



// =====================================================
// DISPLAY TRACKER
// =====================================================

function displaySubjects() {


    subjectList.innerHTML = "";



    // -------------------------------
    // NO SUBJECTS
    // -------------------------------

    if (subjects.length === 0) {

        performance.innerHTML = `

            <h3>
                Overall Performance
            </h3>

            <p>
                No subjects added yet.
            </p>

        `;

        return;

    }



    // -------------------------------
    // TOTALS
    // -------------------------------

    let obtainedTotal = 0;

    let maximumTotal = 0;



    subjects.forEach(
        function (subject) {

            obtainedTotal +=
                Number(
                    subject.obtained
                );

            maximumTotal +=
                Number(
                    subject.total
                );

        }
    );



    // -------------------------------
    // OVERALL %
    // -------------------------------

    const overallPercentage =
        (
            obtainedTotal /
            maximumTotal
        ) * 100;



    performance.innerHTML = `

        <h3>
            Overall Performance
        </h3>

        <p class="overall-percentage">

            ${overallPercentage.toFixed(2)}%

        </p>

        <p>

            ${obtainedTotal}
            /
            ${maximumTotal}
            marks

        </p>

    `;



    // -------------------------------
    // SUBJECT CARDS
    // -------------------------------

    subjects.forEach(
        function (subject, index) {


            const percentage =
                (
                    Number(subject.obtained) /
                    Number(subject.total)
                ) * 100;



            const subjectCard =
                document.createElement("div");


            subjectCard.className =
                "subject-result";



            subjectCard.innerHTML = `

                <h4>
                    ${subject.name}
                </h4>

                <p>

                    ${subject.obtained}
                    /
                    ${subject.total}

                    (${percentage.toFixed(1)}%)

                </p>

                <button
                    class="delete-subject-btn"
                    data-index="${index}"
                >
                    Delete
                </button>

            `;


            subjectList.appendChild(
                subjectCard
            );

        }
    );

}



// =====================================================
// ADD SUBJECT
// =====================================================

addSubjectBtn.addEventListener(
    "click",
    function () {


        const name =
            document
                .getElementById("subjectName")
                .value
                .trim();


        const obtained =
            document
                .getElementById("marksObtained")
                .value;


        const total =
            document
                .getElementById("totalMarks")
                .value;



        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            name === "" ||
            obtained === "" ||
            total === ""
        ) {

            alert(
                "Please enter all subject details."
            );

            return;

        }



        if (
            Number(obtained) < 0 ||
            Number(total) <= 0 ||
            Number(obtained) > Number(total)
        ) {

            alert(
                "Please enter valid marks."
            );

            return;

        }



        // -------------------------------
        // CREATE SUBJECT
        // -------------------------------

        const newSubject = {

            name: name,

            obtained: Number(obtained),

            total: Number(total)

        };


        subjects.push(
            newSubject
        );



        // -------------------------------
        // SAVE
        // -------------------------------

        localStorage.setItem(

            "edumateSubjects",

            JSON.stringify(subjects)

        );



        // -------------------------------
        // CLEAR
        // -------------------------------

        document
            .getElementById("subjectName")
            .value = "";

        document
            .getElementById("marksObtained")
            .value = "";

        document
            .getElementById("totalMarks")
            .value = "";



        displaySubjects();

    }
);



// =====================================================
// DELETE SUBJECT
// =====================================================

subjectList.addEventListener(
    "click",
    function (event) {


        if (
            !event.target.classList.contains(
                "delete-subject-btn"
            )
        ) {

            return;

        }



        const index =
            event.target.dataset.index;


        subjects.splice(
            index,
            1
        );



        localStorage.setItem(

            "edumateSubjects",

            JSON.stringify(subjects)

        );


        displaySubjects();

    }
);



// =====================================================
// INITIAL LOAD
// =====================================================

displayTasks();

displaySubjects();