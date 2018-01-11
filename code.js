// GET ELEMENTS
var auth = firebase.auth();
var database = firebase.database();
var loginBtn = document.getElementById('loginBtn');
var uploadBtn = document.getElementById('uploadBtn');
var signOutBtn = document.getElementById('signOut');
var accountBtn = document.getElementById('accountBtn');
var createAccount = document.getElementById('createAccountBtn');
var loginDialog = document.querySelector('dialog');
var message = document.getElementById('message');
var createAccountDialog = document.getElementById('createAccountDialog');
var changeUser = document.getElementById('changeUser');
var changeUserInfoBtn = document.getElementById('changeUserInfoBtn');
var homeBtn = document.getElementById('headerLogo');



// LOGIN SEQUENCE
loginBtn.addEventListener('click', function() {
    loginDialog.showModal();
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';

    loginDialog.querySelector('.close').addEventListener('click', function() {
        loginDialog.close();
    });

    loginDialog.querySelector('.submitLogin').addEventListener('click', function() {
        var email = document.getElementById('emailInput').value;
        var password = document.getElementById('passwordInput').value;

        if(email != "" && password != ""){
            document.querySelector('.submitLogin').style.display = 'none';
            document.querySelector('.close').style.display = 'none';
            document.getElementById('loginSpinner').style.display = 'block';

            auth.signInWithEmailAndPassword(email, password).catch(
                function(error){
                    document.getElementById('loginError').innerText = error.message;

                    document.querySelector('.submitLogin').style.display = 'block';
                    document.querySelector('.close').style.display = 'block';
                    document.getElementById('loginSpinner').style.display = 'none';
                }
            )
        }
    });
})


// CREATE ACCOUNT SEQUENCE
createAccount.addEventListener('click', function(){
    createAccountDialog.showModal();

    createAccountDialog.querySelector('.closeCreateAccount').addEventListener('click', function() {
        createAccountDialog.close();
    });

    createAccountDialog.querySelector('.createAccountBtn').addEventListener('click', function(){
        var email = document.getElementById('createEmailInput').value;
        var password = document.getElementById('createPasswordInput').value;
        var confirm = document.getElementById('createPasswordConfirm').value;

        if(password == confirm) {
            if(email != "" && password != ""){
                document.querySelector('.createAccountBtn').style.display = 'none';
                document.querySelector('.closeCreateAccount').style.display = 'none';
                document.getElementById('createAccountSpinner').style.display = 'block';

                const promise = auth.createUserWithEmailAndPassword(email, password);

                promise.catch(e => document.getElementById('createError').innerText = e.message);

                createAccountDialog.close();


            }
        } else {
            document.getElementById('createError').innerText = "Passwords doesn't match";
        }


    });
})


// LOGIN AUTHENTICATION
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        loginDialog.close();
        showLoggedInBtnset();
        hideEverythingBut('message');
        console.log(user);

        if(user.displayName != null) {
            updateWelcomeMethod(user);
        } else {
            message.innerText = "";
            changeUser.style.display = 'block';
        }

    } else {
        // No user is signed in.
        message.innerText = "You're logged out";
    }
});


// LOGOUT SEQUENCE
signOutBtn.addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        showLoggedOutBtnset();
        hideEverythingBut('message');


    }).catch(function(error) {
        // An error happened.
        alert(error.message);

    });
})


// ACCOUNT
accountBtn.addEventListener('click', function(){
    hideEverythingBut('accountPage');
})


// CHANGE USER INFO
changeUserInfoBtn.addEventListener('click', function(){
    var firstName = document.getElementById('changeFirstName').value;
    var lastName = document.getElementById('changeLastName').value;
    var user = auth.currentUser;

    if(firstName != "" && lastName != "") {
        user.updateProfile({
            displayName: firstName + " " + lastName        
        }).catch(function(error) {
            console.log(error.message);
        });

        changeUser.style.display = 'none';
        updateWelcomeMethod(user);
    }
})


// GO HOME
homeBtn.addEventListener('click', function(){
    hideEverythingBut('message');
    console.log('Go home');
});


// UPLOAD PAGE
uploadBtn.addEventListener('click', function(){
    hideEverythingBut('uploadPage');
    console.log('upload track');
});


// EDIT ACCOUNT
document.getElementById('editAccountBtn').addEventListener('click', function(e){
    hideEverythingBut('editAccount');
    const user = auth.currentUser;
    var firstNameBtn = document.getElementById('firstNameSpanBtn');
    var lastNameBtn = document.getElementById('lastNameSpanBtn');
    var emailBtn = document.getElementById('emailSpanBtn');

    var buttons = [firstNameBtn, lastNameBtn, emailBtn];

    document.getElementById('firstNameSpan').innerText = getFirstName(user);
    document.getElementById('lastNameSpan').innerText = getLastName(user);
    document.getElementById('emailSpan').innerText = user.email;

    buttons.forEach(function(button){
        button.addEventListener('click', function(){
            changeDisplayAttribute(button.value);
            focusOnInput(button);
            document.getElementById(button.value + 'Btn').addEventListener('click', function(){
                let dispName = document.getElementById(button.value + 'Field').value + " " + getLastName(user);
                // console.log(dispName);
                // database.ref('users/' + user.uid).set({

                // })
            })
        });
    })

    /*firstNameBtn.addEventListener('click', function(){
        changeDisplayAttribute(firstNameBtn.value);
        focusOnInput(firstNameBtn);
    });

    lastNameBtn.addEventListener('click', function(){
        changeDisplayAttribute(lastNameBtn.value);
        focusOnInput(lastNameBtn);
    });

    emailBtn.addEventListener('click', function(){
        changeDisplayAttribute(emailBtn.value);
        focusOnInput(emailBtn);
    });*/


});


// HELP FUNCTIONS
function getUser(e){
    const user = e.data.user;

    if(user != null) {
        return user;
    }
}

function focusOnInput(input){
    var inputID = input.value + 'Field'

    document.getElementById(inputID).focus();
}

function changeDisplayAttribute(id) {
    if(document.getElementById(id).style.display == 'block') {
        document.getElementById(id).style.display = 'none';
    } else {
        document.getElementById(id).style.display = 'block';
    }
}

function updateWelcomeMethod(user){
    setTimeout(function(){
        message.innerText = "Welcome " + getFirstName(user) + "!";
    },1000);
}

function getFirstName(user) {
    var str = getUserDisplayName(user);
    var userFirstName = str.substring(0,str.indexOf(' '));

    return userFirstName;
}

function getLastName(user) {
    var str = getUserDisplayName(user);
    var userFirstName = str.substring(str.indexOf(' ')+1, str.length);

    return userFirstName;
}

function getUserDisplayName(user){
    if(user.displayName != undefined) {
        return user.displayName;
    } else {
        return "";
    }
}

function showLoggedOutBtnset(){
    signOutBtn.style.display = 'none';
    accountBtn.style.display = 'none';
    uploadBtn.style.display = 'none';
    loginBtn.style.display = 'block';
    createAccount.style.display = 'block';
}

function showLoggedInBtnset(){
    signOutBtn.style.display = 'block';
    accountBtn.style.display = 'block';
    uploadBtn.style.display = 'block';
    loginBtn.style.display = 'none';
    createAccount.style.display = 'none';
}

function clearLoginForm(){
    document.querySelector('.submitLogin').style.display = 'block';
    document.querySelector('.close').style.display = 'block';
    document.getElementById('loginSpinner').style.display = 'none';
}

function hideEverythingBut(block){
    document.getElementById('accountPage').style.display = 'none';
    document.getElementById('uploadPage').style.display = 'none';
    document.getElementById('editAccount').style.display = 'none';
    document.getElementById('createAccountDialog').style.display = 'none';
    document.getElementById('changeUser').style.display = 'none';
    showOrHideMessage('none');

    document.getElementById(block).style.display = 'block';
}

function showOrHideMessage(input){
    if(input == 'none'){
        message.style.display = 'none';
    } else {
        message.style.display = 'block';
    }
}