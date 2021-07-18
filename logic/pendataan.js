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

var listDesaRef = firebase.database().ref('desa');
listDesaRef.on('value', (snapshot) => {
    var html = ""
    snapshot.forEach((item) => {
        html += `<div class="col-sm-4 mt-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.val().name}</h5>
                            <p class="card-text">Jumlah Penduduk : ${item.val().jumlahpenduduk}
                            </p>
                            <a href="#" class="btn btn-primary">Go somewhere</a>
                        </div>
                    </div>
                </div>`
    })

    document.getElementById('listDesa').innerHTML = html
});


$('#btn_logout').click(function () {
    firebase.auth().signOut().then(() => {
        console.log('Logout berhasil')
        window.location.replace('login.html')
    }).catch((error) => {
        // An error happened.
    });
})