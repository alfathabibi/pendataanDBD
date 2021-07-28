const database = firebase.database()
var currentUser = {}

$(document).ready(function () {
    document.getElementById('listDesa').innerHTML = `<div class="col-sm-4 mt-2">
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
      </div>
        </div>
    </div>
</div>`
})

function getParameter(parameterName) {
    let parameters = new URLSearchParams(window.location.search)
    return parameters.get(parameterName)
}

const listKecamatan = [
    "Belawa",
    "Bola",
    "Gilireng",
    "Keera",
    "Majauleng",
    "Maniangpajo",
    "Pammana",
    "Penrang",
    "Pitumpanua",
    "Sabangparu",
    "Sajoanging",
    "Takkalalla",
    "Tanasitolo",
    "Tempe",
]


//Select kecamatan
var optionHTML = `<option value="" selected>Pilih Kecamatan</option>`
listKecamatan.forEach((item) => {
    optionHTML = optionHTML + `<option value="${item}">${item}</option>`
})

document.getElementById('select_kecamatan').innerHTML = optionHTML
//Get Parameters
if (getParameter('detail')) {
    document.getElementById('daftarDesaContainter').hidden = true
    document.getElementById('detailDesaContainter').hidden = false

    let detailDesa, detailPendataan
    var jumlahPositif = 0
    var rumahDiperiksa = 0

    const desaRef = firebase.database().ref('desa');
    const pemeriksaanRef = firebase.database().ref('pendataan');

    desaRef.child(getParameter('detail')).on('value', function (snapshot) {
        detailDesa = snapshot.val()
        console.log(detailDesa)
        document.getElementById('nama_desa_detail').innerHTML = `${detailDesa.nama}`
        document.getElementById('nama_kecataman_detail').innerHTML = `Kecamatan ${detailDesa.kecamatan}`
        document.getElementById('jumlah_rumah_detail').innerHTML = `Jumlah Rumah : <span class="text-primary"> ${detailDesa.jumlahrumah} </span>`

        pemeriksaanRef.orderByChild("desaId").equalTo(getParameter("detail")).once('value', function (snapshot) {
            detailPendataan = snapshot
            detailPendataan.forEach((item) => {
                jumlahPositif += item.val().rumahPositif
                rumahDiperiksa += item.val().totalRumah
            })
            document.getElementById('total_dikunjungi').innerHTML = `Rumah yang dikunjungi : <span class="text-success"> ${rumahDiperiksa} </span>`
            document.getElementById('jumlah_positif_detail').innerHTML = `Jumlah Positif : <span class="text-danger"> ${jumlahPositif} </span>`

            const totalProgress = rumahDiperiksa / detailDesa.jumlahrumah * 100

            document.getElementById('progres_pendataan').style.width = `${totalProgress}%`
            document.getElementById('progres_pendataan').innerHTML = `${totalProgress}%`
        })
    })


}


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

var listDesaRef = firebase.database().ref('desa')
listDesaRef.on('value', (snapshot) => {
    var html = ""
    snapshot.forEach((item) => {
        html = `<div class="col-sm-4 mt-2">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${item.val().nama}</h5>
                            
                            <p class="card-text"> <span>Kecamatan : ${item.val().kecamatan} </span>
                            <br> <span class="text-success">Jumlah Rumah : ${item.val().jumlahrumah} </span>
                            </p>
                            <a href="pendataan-desa.html?detail=${item.val().desaId}" class="btn btn-primary">Detail</a>
                        </div>
                    </div>
                </div>` + html
    })

    document.getElementById('listDesa').innerHTML = html
});

$('#btn_tambah_desa').click(function () {

    document.getElementById("btn_tambah_desa").innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
    Loading...`

    const namaKecamatan = $('#select_kecamatan').val()
    const namaDesa = $('#nama_desa').val()
    const jumlahRumah = $('#jumlah_rumah').val()

    if (namaDesa == null || jumlahRumah == null || namaKecamatan === "") {
        document.getElementById("alertDesa").hidden = false
        document.getElementById("alertDesaText").innerHTML = 'Semua form wajib di isi'
        document.getElementById("btn_tambah_desa").innerHTML = 'tambah'
        return this
    }

    var DesaListRef = firebase.database().ref('desa');
    var newDesaRef = DesaListRef.push()
    newDesaRef.set({
        desaId: newDesaRef.key,
        kecamatan: namaKecamatan,
        nama: namaDesa,
        jumlahrumah: jumlahRumah,
    }, (error) => {
        if (!error) {
            document.getElementById("btn_tambah_desa").innerHTML = `Simpan`
            document.getElementById("form_desa").reset()
            $("#tambahDesaModal").modal('hide')
        }
    })
})


$('#btn_logout').click(function () {
    firebase.auth().signOut().then(() => {
        console.log('Logout berhasil')
        window.location.replace('login.html')
    }).catch((error) => {
        // An error happened.
    });
})