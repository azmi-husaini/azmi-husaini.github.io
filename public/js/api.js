const base_url = "https://api.football-data.org/v2/";
const id_liga = 2021;
const api_token = "b71b7d072a06486582dba9419de1aaf6";
const standings_api = `${base_url}competitions/${id_liga}/standings`;
const clubs_api = `${base_url}competitions/${id_liga}/teams`;


function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);

        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

function fetchAPI(endpoint) {
    return fetch(endpoint, {
        headers: {
            "X-Auth-Token": api_token
        }
    });
}

function getClubs() {
    return new Promise(function(resolve, reject) {
        if ("caches" in window) {
            caches.match(clubs_api).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        setClubs(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(clubs_api)
            .then(status)
            .then(json)
            .then(function(data) {
                setClubs(data);
                resolve(data);
            })

        .catch(error);
    });
}

function setClubs(data) {
    let teams = "";
    data.teams.forEach((club) => {
        teams += `
			<div class="col s12 m6 l4">
                <div class="card">
                    <input type="checkbox" name="">
                    <div class="toggle"><i class="material-icons">info</i></div>
					<div class="card-image logo-flag">
                        <img src="${club.crestUrl}" alt="Badge ${club.name}"/>
                        <h3 class="card-title blue-dark-1 truncate center-align">${club.shortName}</h3>
                    </div>
					<div class="card-content center-align">
                        <p class="center-align">${club.venue}</p>
                        <a href="${club.website}" class="link">View Website<i class="material-icons">trending_flat</i></a>
                        <div id="favorite-team-${club.id}">
                            <a class="btn-floating halfway-fab waves-effect waves-light color-btn" onclick="saveClub(${club.id})"><i class="material-icons">star_border</i></a>
                        </div>
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
        checkFavoriteTeam(club.id);
    });

    document.querySelector("#clubs").innerHTML = teams;
    document.querySelector("#preload").innerHTML = "";
}


function getStandings() {
    return new Promise(function(resolve, reject) {
        if ("caches" in window) {
            caches.match(standings_api).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        setStandings(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(standings_api)
            .then(status)
            .then(json)
            .then(function(data) {
                setStandings(data);
                resolve(data);
            })

        .catch(error);
    });
}

function setStandings(data) {
    let standings = "";
    data.standings[0].table.forEach((standing) => {
        standings += `
			<tr>
				<td>${standing.position}</td>
				<td><img src="${standing.team.crestUrl}" class="badge" alt="Badge ${standing.team.name}" /></td>
				<td>${standing.team.name}</td>
				<td>${standing.playedGames}</td>
				<td>${standing.won}</td>
				<td>${standing.draw}</td>
				<td>${standing.lost}</td>
				<td>${standing.goalsFor}</td>
				<td>${standing.goalsAgainst}</td>
				<td>${standing.goalDifference}</td>
				<td>${standing.points}</td>
			</tr>
		`;
    });

    document.querySelector("#standings-table").classList.remove("hide");
    document.querySelector("#standings").innerHTML = standings;
    document.querySelector("#preload").innerHTML = "";
}

function getClub(id) {
    return new Promise(function(resolve, reject) {
        let request = new Request(base_url + "teams/" + id, {
            method: "GET",
            headers: new Headers({
                "X-Auth-Token": api_token
            }),
        });

        fetch(request)
            .then(status)
            .then(json)
            .then(function(data) {
                let tim = {
                    id: data.id,
                    name: data.name,
                    crestUrl: data.crestUrl,
                    shortName: data.shortName,
                    founded: data.founded,
                    address: data.address,
                    website: data.website,
                    venue: data.venue,
                };

                resolve(tim);
            });
    });
}