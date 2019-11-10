const loginPage = document.getElementById("loginPage");
const loginButton = document.getElementById("loginButton");
const name = document.getElementById("loginName");
const email = document.getElementById("loginEmail");

const infoPage = document.getElementById("infoPage");
const gotItButton = document.getElementById("gotItButton");

const backButton = document.getElementById("backButton");

var uiPagesClosed = false;


loginButton.addEventListener('click', () => {
    checkEmail(email.value);
});

gotItButton.addEventListener("click", (e) => {
    infoPage.classList.add('fade-out');
    e.preventDefault();
    sendForm(name.value, email.value);

    infoPage.addEventListener("animationend", () => {
        infoPage.classList.add("hidden");
    });

    uiPagesClosed = true;
});

function checkEmail(str) {
    if (str == "")
    {
        enterEmailPrompt();
    }

    else {
        loginPage.classList.add('hidden');
        infoPage.classList.remove("hidden");
    }
}

function enterEmailPrompt() {
    const errorMessage =  document.getElementById("errorMessage");
    const emailInput = document.getElementById("loginEmail");
    errorMessage.textContent = "Please enter an email address."

    // emailInput.classList.add("emailInputError");
    emailInput.className = "emailInputError";


}


backButton.addEventListener('click', () => {
    infoPage.classList.add("hidden");
    loginPage.classList.remove("hidden");
});


function sendForm(nameStr, emailStr) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        console.log(this.response);
      }
    };
    xhttp.open("POST", "https://coachau.com/users/register", true);
    xhttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    xhttp.send("name=" + nameStr + "&email=" + emailStr);
  }

