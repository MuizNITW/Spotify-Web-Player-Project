console.log(`Let's write javascript`);
// current song as a global variable
var currentSong = new Audio();
let songs = [];
let currFolder;

const playMusic = (track, pause = false) => {
    currentSong.src = `./songs/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "./SVGs/pauseSong.svg"
    }
    play.src = "./SVGs/pauseSong.svg"
    const textWrapper = document.querySelector(".text-wrapper");  // first remove the overflow
    textWrapper.classList.remove("overflow");
    textWrapper.style.animation = 'none';
    textWrapper.offsetHeight; // Trigger reflow
    textWrapper.style.animation = null;
    document.querySelector(".text-wrapper").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";

    function checkOverflow() {
        let container = document.querySelector(".songInfo");
        let textwrapper = document.querySelector(".text-wrapper");

        // compare the widths
        if (textwrapper.offsetWidth > container.offsetWidth) {
            textwrapper.classList.add("overflow");
        }
        else {
            textwrapper.classList.remove("overflow");
        }
    }
    checkOverflow()
}

function checkOverflow() {
    let container = document.querySelector(".songInfo");
    let textwrapper = document.querySelector("text-wrapper");
    let info = textwrapper.innerHTML;
    // compare the widths
    if (textwrapper.offsetWidth > container.offsetWidth) {
        textwrapper.classList.add(".overflow");
        textwrapper.innerHTML = "";
        document.querySelector(".overflow").innerHTML = info;
    }
    else {
        textwrapper.classList.remove(".overflow");
    }
}
function convertSeconds(totalSeconds) {

    totalSeconds = Math.round(totalSeconds)

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Add leading zero if seconds is less than 10
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // Add leading zero if minutes is less than 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`./songs/${folder}`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        let element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`${folder}/`)[1].trim()));
        }
    }

    console.log(songs);
    // specifically for tilawat playlist because js already sorted lexicographically 
    if (currFolder == "Tilawat") {
        songs.sort((a, b) => {
            let numA = parseInt(a.match(/\d+/));
            let numB = parseInt(b.match(/\d+/));

            return numA - numB
        })
    }
    // show all  the songs in the playlist   
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    let arr = Array.from(songs)
    for (const song of songs) {                                        // all songs added to the playlist
        let formattedSong = song.replaceAll("%20", " ");
        songUL.innerHTML = songUL.innerHTML + `<li> <img src="./SVGs/music.svg" alt="">
                             <div class="info">
                                 <div>${formattedSong}</div>
                                 <div>Muiz</div>
                             </div>
                             <div class="playNow">
                                 <span>Play Now </span>                   
                                 <img src="./SVGs/playPlaylistSong.svg" alt="play" class="invert" style="padding-left:2px;">
                             </div> </li>`;
    }

    //Attach an event listener to each song in the song list     // accessing element through song list 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    // // Attach an event listener to each song in playlist in the songs array{
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", () => {

    //     })
    // })

    let newPrev = previous.cloneNode(true);
    previous.replaceWith(newPrev);
    previous = newPrev;

    let newNext = next.cloneNode(true);
    next.replaceWith(newNext);
    next = newNext;

    let playlists = Array.from(songs);
    let cleanedSongs = songs.map(song => decodeURIComponent(song.trim()));
    previous.addEventListener("click", () => {
        console.log('Prev clicked');

        let currentFilename = decodeURIComponent(currentSong.src.split("/").slice(-1)[0].trim());

        let index = cleanedSongs.indexOf(currentFilename);

        if (index === -1) {
            console.error("⚠ Song not found in playlist!");
            return;
        }

        let prevIndex = index - 1 < 0 ? cleanedSongs.length - 1 : index - 1;
        playMusic(cleanedSongs[prevIndex]);
    });


    next.addEventListener("click", () => {                            // Event Listener to next
        console.log('Next clicked');

        let currentFilename = decodeURIComponent(currentSong.src.split("/").slice(-1)[0].trim());

        let index = cleanedSongs.indexOf(currentFilename);

        if (index === -1) {
            console.error("⚠ Song not found in playlist!");
            return;
        }

        let nextIndex = index + 1 >= cleanedSongs.length ? 0 : index + 1;
        playMusic(cleanedSongs[nextIndex]);
    })

    return songs
}




async function displayAlbums() {
    let a = await fetch(`./songs/`);      // fetching song folder
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    console.log(div);
    let anchors = div.getElementsByTagName("a");
    let folders = [];                                        // empty folders array stores the names of the folder
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        // I want to get the folder name itself
        let cardContainer = document.querySelector(".cardContainer")
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/").slice(-1)[0]);    // folder name 
            console.log(folder);
            // Get metadata of the folder
            let a = await fetch(`./songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + `<div class="card" data-folder="${folder}">
                        <div class="imgblock">
                            <img src="/songs/${folder}/cover.jpg" alt="${folder}">
                            <span><svg width="45" height="45" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg" class="invert playButton animated-play">
                                    <path d="M15 12.3301L9 16.6603L9 8L15 12.3301Z" fill="currentColor" />
                                    </svg>

                             </span>
                        </div>
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    // taking each song of the folder into songs array
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset);
            await getSongs(`${item.currentTarget.dataset.folder}`);
            playMusic(songs[0].replaceAll("%20", " "));
        })
    })


}

async function main() {
    // Display all the Albums on the page
    displayAlbums();

    // Attach an event Listener to play      // play is directly from the id
    // if audio is paused by an external headphone or a bluetooth speaker if(currentSong.paused) play.src = "/SVGs/pauseSong.svg";


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            if (!currentSong.src) {
                let first = document.querySelector(".songList").getElementsByTagName("li")[0].querySelector(".info").firstElementChild.innerHTML.trim();
                playMusic(first);

            }
            currentSong.play();
            play.src = "/SVGs/pauseSong.svg";
        } else {
            currentSong.pause();
            play.src = "/SVGs/playsong.svg"
        }
    })
    
    // Adding time update to the songTime through an event listener to current song
    currentSong.addEventListener("timeupdate", () => {
        if (document.querySelector(".songTime").innerHTML.endsWith(`NaN:NaN`)) document.querySelector(".songTime").innerHTML = `00:00 / 00:00`
        document.querySelector(".songTime").innerHTML = `${convertSeconds(currentSong.currentTime)} / ${convertSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to a seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        console.log(percent);
        document.querySelector(".circle").style.left = percent + "%";
        console.log(document.querySelector(".circle").style.left);
        currentSong.currentTime = (percent * (currentSong.duration)) / 100;
    })

    // Add an Event listener to a hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add event listener to cross
    document.querySelector(".cross").addEventListener("click", () => {
        console.log("You just pressed cross");
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event to volume button
    let val = document.querySelector(".range").getElementsByTagName("input")[0].value;
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("click", (e) => {
        console.log("Setting volume to ", e.target.value, "/100");
        currentSong.volume = parseFloat(e.target.value / 100);
        val = e.target.value
    })

    // Add event listener to mute the track

    console.log(val);
    volButton.addEventListener("click", () => {
        if (!currentSong.muted) {
            volButton.src = "/SVGs/muteVolume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            volButton.src = "SVGs/volume.svg";
            document.querySelector(".range").getElementsByTagName("input")[0].value = val;
            currentSong.volume = parseFloat(val / 100);
        }
        currentSong.muted = !currentSong.muted;
    })

    // Adding functionality to search bar
    function searchSongs() {
        let input = document.getElementById("searchBar").value.toLowerCase();
        console.log(input);
        let listItems = Array.from(document.querySelector(".songList").getElementsByTagName("li"))
        console.log(listItems);

        Array.from(listItems).forEach(item => {
            console.log(item);
            console.log(item.nodeName);
            console.log(item.innerText);
            let itemText = item.textContent.toLowerCase();
            item.style.display = itemText.includes(input) ? "" : "none"
        })
    }

    searchBar.addEventListener("keyup", searchSongs);

}
main();
