$(document).ready(function () {
    document.getElementById("alertLogin").style.visibility = 'hidden'
})

$('#btn_login').click(function () {
    var email = $('#email').val()
    var password = $('#password').val()

    login(email, password)
})


function login(email, password) {

    document.getElementById("btn_login").disabled = true;
    document.getElementById("btn_login").innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Loading...`
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.replace('index.html')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("btn_login").disabled = false
            document.getElementById("btn_login").innerHTML = `Login`
            document.getElementById("alertLogin").style.visibility = 'visible'
            document.getElementById("alertLoginText").innerHTML = errorMessage
            return this

        });
}