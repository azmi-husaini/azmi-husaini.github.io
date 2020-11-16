document.addEventListener("DOMContentLoaded", function() {
    let elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);

    loadNav();

    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    function loadNav() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status !== 200) return;
                // Memuat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
                    elm.innerHTML = xhttp.responseText;
                });

                // Daftarkan event listener untuk setiap tautan menu
                document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
                    elm.addEventListener("click", (event) => {
                        // Tutup Sidenav
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Muat konten halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });

                });
            }
        };
        xhttp.open("GET", "layout/nav.html", true);
        xhttp.send();
    }

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                let content = document.querySelector("#body-content");

                if (page == "clubs") {
                    getClubs();
                } else if (page == "standings") {
                    getStandings();
                } else if (page == "favorites") {
                    getFavoritesTeam();
                }

                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML =
                        "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        xhttp.open(`GET`, `pages/${page}.html`, true);
        xhttp.send();
    }
});