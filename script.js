/* =====================================================
           INITIAL PAGE LOAD
        ===================================================== */

window.onload = function () {

    const loggedIn =
        localStorage.getItem("edumateLoggedIn");

    const account =
        localStorage.getItem("edumateAccount");


    if (
        loggedIn === "true" &&
        account
    ) {

        showDashboard();

    }
    else {

        showLogin();

    }

};



/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    document.getElementById("loginForm").style.display =
        "block";

    document.getElementById("signupForm").style.display =
        "none";

    clearMessages();

}



/* =====================================================
   SHOW SIGNUP
===================================================== */

function showSignup() {

    document.getElementById("loginForm").style.display =
        "none";

    document.getElementById("signupForm").style.display =
        "block";

    clearMessages();

}



/* =====================================================
   CLEAR AUTH MESSAGES
===================================================== */

function clearMessages() {

    document.getElementById("loginMessage").textContent =
        "";

    document.getElementById("signupMessage").textContent =
        "";

}



/* =====================================================
   SIGN UP
===================================================== */

function signup() {

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById(
            "signupConfirmPassword"
        ).value;


    const message =
        document.getElementById("signupMessage");


    message.className =
        "auth-message error-message";


    /* Empty fields */

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        message.textContent =
            "Please fill in all the fields.";

        return;

    }


    /* Email validation */

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        message.textContent =
            "Please enter a valid email address.";

        return;

    }


    /* Password length */

    if (password.length < 6) {

        message.textContent =
            "Password must contain at least 6 characters.";

        return;

    }


    /* Password confirmation */

    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;

    }


    /* Check existing account */

    const existingAccount =
        localStorage.getItem("edumateAccount");


    if (existingAccount) {

        const account =
            JSON.parse(existingAccount);


        if (
            account.email.toLowerCase() ===
            email.toLowerCase()
        ) {

            message.textContent =
                "An account with this email already exists.";

            return;

        }

    }


    /*
        Store the account for this course-project prototype.
        The login will later verify these exact values.
    */

    const account = {

        name: name,

        email: email,

        password: password

    };


    localStorage.setItem(
        "edumateAccount",
        JSON.stringify(account)
    );


    message.className =
        "auth-message success-message";


    message.textContent =
        "Account created successfully!";


    /*
        Move to login after a short delay.
    */

    setTimeout(
        function () {

            document.getElementById("loginEmail").value =
                email;

            document.getElementById("loginPassword").value =
                "";

            showLogin();


            document.getElementById("loginMessage").className =
                "auth-message success-message";


            document.getElementById("loginMessage").textContent =
                "Account created. Please login.";

        },
        900
    );

}



/* =====================================================
   LOGIN
===================================================== */

function login() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const message =
        document.getElementById("loginMessage");


    message.className =
        "auth-message error-message";


    if (
        email === "" ||
        password === ""
    ) {

        message.textContent =
            "Please enter your email and password.";

        return;

    }


    const savedAccount =
        localStorage.getItem("edumateAccount");


    /*
        No account has been created yet.
    */

    if (!savedAccount) {

        message.textContent =
            "No account found. Please sign up first.";

        return;

    }


    const account =
        JSON.parse(savedAccount);


    /*
        EXACT credential check
    */

    if (
        email.toLowerCase() !==
        account.email.toLowerCase()
    ) {

        message.textContent =
            "Incorrect email or password.";

        return;

    }


    if (
        password !== account.password
    ) {

        message.textContent =
            "Incorrect email or password.";

        return;

    }


    /*
        Successful login
    */

    localStorage.setItem(
        "edumateLoggedIn",
        "true"
    );


    localStorage.setItem(
        "edumateUser",
        account.name
    );


    showDashboard();

}



/* =====================================================
   SHOW DASHBOARD
===================================================== */

function showDashboard() {

    document.getElementById("authPage").style.display =
        "none";

    document.getElementById("dashboard").style.display =
        "block";

}



/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "edumateLoggedIn"
    );


    document.getElementById("dashboard").style.display =
        "none";

    document.getElementById("authPage").style.display =
        "flex";


    document.getElementById("loginEmail").value =
        "";

    document.getElementById("loginPassword").value =
        "";


    showLogin();

}



/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" &&
            document.getElementById("authPage").style.display !== "none"
        ) {

            const loginVisible =
                document.getElementById("loginForm").style.display !== "none";


            if (loginVisible) {

                login();

            }
            else {

                signup();

            }

        }

    }
);

