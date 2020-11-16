let dbPromised = idb.open("premier-league", 1, function(upgradeDb) {
    let clubsObjectStore = upgradeDb.createObjectStore("clubs", {
        keyPath: "id",
    });
    clubsObjectStore.createIndex("name", "name", { unique: false });
});

function saveClub(id) {
    dbPromised
        .then(function(db) {
            let item = getClub(id);
            item.then(function(team) {
                let tx = db.transaction("clubs", "readwrite");
                let store = tx.objectStore("clubs");

                store.put(team);

                return tx.complete;
            });
        })
        .then(function() {
            let favorite = document.getElementById("favorite-team-" + id);
            favorite.innerHTML = `
				<a class="btn-floating halfway-fab waves-effect waves-light color-btn saved" onclick="unSaveClub(${id})">
					<i class="material-icons">star</i>
				</a>
			`;

            M.toast({
                html: "Added to favorite"
            });
        })
        .catch(function(error) {
            console.log(error);
            M.toast({
                html: "Failed add to favorites"
            });
        });
}

function unSaveClub(id) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction("clubs", "readwrite");
            let store = tx.objectStore("clubs");
            store.delete(id);
            return tx.complete;
        })
        .then(function() {
            let favorite = document.getElementById("favorite-team-" + id);
            favorite.innerHTML = `
				<a class="btn-floating halfway-fab waves-effect waves-light color-btn saved" onclick="saveClub(${id})">
					<i class="material-icons">star_border</i>
				</a>
			`;

            M.toast({
                html: "Removed from favorites"
            });
        })
        .catch(function(error) {
            console.log(error);
            M.toast({
                html: "Failed remove from favorites"
            });
        });
}

function checkFavoriteTeam(id) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction("clubs", "readonly");
            let store = tx.objectStore("clubs");

            return store.get(id);
        })
        .then(function(val) {
            if (val != null && val.id === id) {
                if (val.id === id) {
                    let favorite = document.getElementById(
                        "favorite-team-" + id
                    );
                    favorite.innerHTML = `
						<a class="btn-floating halfway-fab waves-effect waves-light color-btn saved" onclick="unSaveClub(${id})">
							<i class="material-icons">star</i>
						</a>
					`;
                }
            }
        });
}

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                let tx = db.transaction("clubs", "readonly");
                let store = tx.objectStore("clubs");
                return store.getAll();
            })
            .then(function(clubs) {
                resolve(clubs);
            });
    });
}

function getFavoritesTeam() {
    getAll().then(function(data) {
        let clubs = "";
        if (data.length !== 0) {
            data.forEach((club) => {
                clubs += `
					<div class="col s12 m6 l4">
                        <div class="card">
                        <input type="checkbox" name="">
                        <div class="toggle"><i class="material-icons">info</i></div>
							<div class="card-image logo-flag">
                                <img src="${club.crestUrl}" alt="Badge ${club.name}" />
                                <h3 class="card-title blue-dark-1 truncate center-align">${club.name}</h3>
							</div>
                            <div class="card-content center-align">
                                <p>${club.venue}</p>
								<a href="${club.website}" class="link">View Website<i class="material-icons">trending_flat</i></a>
                                <a class="btn-floating halfway-fab waves-effect waves-light color-btn saved" onclick="removeFaviriteTeam(${club.id})">
									<i class="material-icons">star</i>
								</a>
                            </div>
                            <div class="card-content1">
                            <table class="highlight">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td style="font-weight: bold;">Name</td>
                                        <td>${club.name}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: bold;">Short Name</td>
                                        <td>${club.shortName}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: bold;">Founded</td>
                                        <td>${club.founded}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: bold;">Official Website</td>
                                        <td>${club.website}</td>
                                    </tr>
                                    <tr>
                                        <td style="font-weight: bold;">Address</td>
                                        <td>${club.address}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
						</div>
					</div>
				`;
            });
        } else {
            clubs += `<div class="col s12 center-align">No data</div>`;
        }

        document.querySelector("#favorites-clubs").innerHTML = clubs;
    });
}

function removeFaviriteTeam(id) {
    dbPromised
        .then(function(db) {
            let tx = db.transaction("clubs", "readwrite");
            let store = tx.objectStore("clubs");
            store.delete(id);
            return tx.complete;
        })
        .then(function() {
            M.toast({
                html: "Removed from favorites"
            });
            getFavoritesTeam();
        })
        .catch(function(error) {
            console.log(error);
            M.toast({
                html: "Failed remove from favorites"
            });
        });
}