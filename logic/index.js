const database = firebase.database()
var currentUser = {}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user
        const dbRef = database.ref();
        dbRef.child("users").child(currentUser.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                $("#profileNav").text(`Halo, ${snapshot.val().name}`)
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    } else {
        window.location.replace('login.html')
    }
});


$('#btn_logout').click(function () {
    firebase.auth().signOut().then(() => {
        console.log('Logout berhasil')
        window.location.replace('login.html')
    }).catch((error) => {
        // An error happened.
    });
})