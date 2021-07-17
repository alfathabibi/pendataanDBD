$(document).ready(function () {
    document.getElementById("alertRegister").style.visibility = 'hidden'
})

$('#btn_register').click(function () {
    var email = $('#email').val()
    var nama = $('#nama').val()
    var password = $('#password').val()
    var cpassword = $('#cpassword').val()

    if (!validateEmail(email)) {
        document.getElementById("alertRegister").style.visibility = 'visible'
        document.getElementById("alertRegisterText").innerHTML = 'Email tidak valid'
        return this
    }

    if (password.length < 6) {
        document.getElementById("alertRegister").style.visibility = 'visible'
        document.getElementById("alertRegisterText").innerHTML = 'Password harus lebih dari 6 Karakter'
        return this
    }

    if (password == '' || password != cpassword) {
        document.getElementById("alertRegister").style.visibility = 'visible'
        document.getElementById("alertRegisterText").innerHTML = 'Password tidak sesuai'
        return this
    }

    register(email, nama, password)
})


function register(email, name, password) {

    document.getElementById("btn_register").disabled = true;
    document.getElementById("btn_register").innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Loading...`
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            document.getElementById("btn_register").innerHTML = `Users berhasil dibuat`
            var user = userCredential.user

            writeUserData(user.uid, name, user.email)
            window.location.replace('login.html')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            document.getElementById("btn_register").disabled = false
            document.getElementById("btn_register").innerHTML = `Register`
            document.getElementById("alertRegister").style.visibility = 'visible'
            return this
        });
}

function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
        userId: userId,
        name: name,
        email: email
    });
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}