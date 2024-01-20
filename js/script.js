let currentSong = new Audio();
let songs;
let currFolder;
async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
  




    let songul = document.querySelector(".songlist").getElementsByTagName('ul')[0]
    songul.innerHTML = " "
    for (const song of songs) {
        songul.innerHTML += `<li><img class="invert" src="img/music.svg" alt="music icons">
    <div class="songinfo">
        <div>${song ? song.replaceAll("%20", " ").replace("%26", " ") : ''}</div>
        <div>Kunal</div>
    </div>
    <div class="playnow">
        <span>Play now</span>
        <img class="invert" src="img/playbutton.svg" alt="libplay">
    </div>
</li>`;
    }
    Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            const songName =e.querySelector(".songinfo").firstElementChild.innerHTML;
            Playaudio(songName);
        })
    });


    return songs;
}

// Rest of your code remains unchanged...
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function Playaudio(track , pause = false){
    currentSong.src = decodeURIComponent(`/${currFolder}/`+track)
    if(!pause){
    currentSong.play();
    play.src = "img/pausebutton.svg"
    }
    document.querySelector(".songinfom").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
}



async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            console.log(folder)
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                    <img src="img/play.svg" alt="play">
                </div>
                <img src="/songs/${folder}/cover.jpeg" alt="card">
                <h2>${response.title}
                    <p style="padding-top: 3px;
                    font-weight: 100;
                    font-size: 15px;
                    opacity: 0.8;">${response.description}</p>
                </h2>
            </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
           Playaudio(songs[0])

        })
    })
}

async function main() {
    songs = await getsongs("songs");
    Playaudio(songs[0] , true)

    play.addEventListener("click", (event) =>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "img/pausebutton.svg"
        }
        else{
            currentSong.pause();
            play.src = "img/playbutton.svg"
        }
        event.stopPropagation()
        
    })
    displayAlbums();

    currentSong.addEventListener("timeupdate" , ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (parseInt(currentSong.currentTime)/ parseInt(currentSong.duration))*100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click" , e =>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
        
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-130%";
    })

    //previous button 

previous.addEventListener("click", (event) => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index -1 ) >= -1) {
        Playaudio(songs[index - 1]);
    }
    else{
        index = index +1
        Playaudio(songs[index])
    }
    // Stop event propagation to prevent interference with seekbar
    event.stopPropagation();
});

    //next button
    next.addEventListener("click", (event) => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index +1 ) > length) {
            Playaudio(songs[index + 1]);
        }
        else{
            index = index +1
            Playaudio(songs[index])
        }
        // Stop event propagation to prevent interference with seekbar
        event.stopPropagation();
    });

    //change volume
        document.getElementsByTagName("input")[0].addEventListener("change", (e)=>{
            currentSong.volume = parseInt(e.target.value)/100
        })

        document.querySelector(".volume>img").addEventListener("click" , (e)=>{
            if(e.target.src.includes('volume.svg')){
                e.target.src = e.target.src.replace("volume.svg","mute.svg")
                currentSong.volume = 0.00 ;
                document.getElementsByTagName("input")[0].value = 0;
            }
            else{
                e.target.src = e.target.src.replace("mute.svg" , "volume.svg")
                currentSong.volume = 0.10;
                document.getElementsByTagName("input")[0].value = 10;
            }
        })

        //load playlist on click event

}
main()
