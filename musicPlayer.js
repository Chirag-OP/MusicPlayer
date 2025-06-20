let currentSong={
    url:"",
    txt:"",
    music:"",
}
function updateMetaData(url,txt){
    if("mediaSession" in navigator){
        navigator.mediaSession.metadata = new MediaMetadata({
            title: txt,
            artist: "Unknown Artist",
            album: "My Playlist",
            artwork: [
                { src: url, sizes: "512x512", type: "image/png" }
            ]
        });
    }
    navigator.mediaSession.setActionHandler("nexttrack", () => {
        autoPlayNext();
    })

    navigator.mediaSession.setActionHandler("previoustrack", () => {
        prevPlay();
    })
}
function togglePlayer(){
    let target=document.querySelector(".dropdown");
    target.addEventListener("click",function(){
        document.querySelector(".container").classList.toggle("expanded");
    })
}    
function seekBar(){
    let audio= document.querySelector("audio");
    let seekBar=document.querySelector(".seekBar");
    audio.addEventListener("timeupdate", () => {                                      // for automatic seekbarupdate with song
        if (audio.duration) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
        }
    });

    seekBar.addEventListener("input", () => {                                       // when user drags seekbar
        if (audio.duration) {
            audio.currentTime = (seekBar.value / 100) * audio.duration;
        }
    });
}                                                                                   // container->[main->[img, mainPlayer],player]
function playButton(){
    let target=document.querySelector(".playButton");
    let audio= document.querySelector("audio");
    let icon=document.querySelector(".playB");
        target.addEventListener("click",function(){       
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        })
        audio.addEventListener("play", () => {
        icon.innerHTML = "❚❚";
        icon.style.opacity = 0.4;
    });
        audio.addEventListener("pause", () => {
        icon.innerHTML = "▶";
        icon.style.opacity = 0.8;
    });
        audio.addEventListener("ended", () => {
        autoPlayNext();
    });
}

function changeMainPlayer(url,txt,music){
    
    let imgTarget=document.querySelector(".mainImg");
    let txtTarget=document.querySelector(".mainTxt");
    let musicTarget=document.querySelector("audio");

    currentSong.url=imgTarget.src;
    currentSong.txt=txtTarget.innerHTML;
    currentSong.music=musicTarget.src;

    imgTarget.src=url;
    txtTarget.innerHTML=txt;
    musicTarget.src=music;

    let seekBar = document.querySelector(".seekBar");
    seekBar.value = 0;
    updateMetaData(url,txt);
    musicTarget.play()
};

function creatingSongs(url,txt,music,addToStart=false){
    let target=document.querySelector(".player");
    let cont=document.createElement("div");
    let aud=document.createElement("audio");
    aud.className="newAudio";
    aud.src=music;
    cont.className="ind";

    let a=document.createElement("img");
    a.className="newImg";
    a.src=url;

    let b=document.createElement("p");
    b.className="tx";
    b.innerHTML=txt;

    cont.appendChild(a);
    cont.appendChild(b);
    cont.appendChild(aud);
    if (addToStart) {
        target.prepend(cont);                                                                   // For previous song
    } else {
        target.append(cont);                                                                    // For next song
    }

    cont.addEventListener("click",function(){
        changeMainPlayer(url,txt,music);
        this.remove();
        creatingSongs(currentSong.url,currentSong.txt,currentSong.music);
    })
}
function autoPlayNext(){
    let nextAudio=document.querySelector(".newAudio");
    let nextUrl=document.querySelector(".newImg");
    let nextTxt=document.querySelector(".tx");
    
    let current=document.querySelector(".ind");
    changeMainPlayer(nextUrl.src,nextTxt.innerHTML,nextAudio.src);
    current.remove();
    creatingSongs(currentSong.url,currentSong.txt,currentSong.music);

}
function nextButton(){
    document.getElementById("nextB").addEventListener("click", function(){
        autoPlayNext();
    })
}
function prevPlay(){
    let cont=document.querySelectorAll(".ind");
    let target=cont[cont.length-1];
    let prevAudio=target.querySelector(".newAudio");
    let prevUrl=target.querySelector(".newImg");
    let prevTxt=target.querySelector(".tx");

    changeMainPlayer(prevUrl.src,prevTxt.innerHTML,prevAudio.src);
    target.remove();
    creatingSongs(currentSong.url,currentSong.txt,currentSong.music,true);
}
function prevButton(){
    document.getElementById("prevB").addEventListener("click", function(){
        prevPlay();
    })
}
//sets initial metadata(placeholder used)
updateMetaData("assets/your-image.jpg", "Your Song Title");

//initialize player UI
togglePlayer();
playButton();
seekBar();

//adds songs to playlist(placeholder is used) 
creatingSongs("assets/your-image.jpg", "Your Song Title", "assets/your-audio.mp3");
creatingSongs("assets/your-image.jpg", "Your Song Title", "assets/your-audio.mp3");
creatingSongs("assets/your-image.jpg", "Your Song Title", "assets/your-audio.mp3");
creatingSongs("assets/your-image.jpg", "Your Song Title", "assets/your-audio.mp3");

//next and previous buttons
nextButton();
prevButton();