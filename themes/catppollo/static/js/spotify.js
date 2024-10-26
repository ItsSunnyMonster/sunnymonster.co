const headerElement = document.querySelector(".spotify-container > h2");
const trackNameElement = document.querySelector(".song-link");
const trackNameContent = document.querySelector(".title-overflow");
const artistsElement = document.querySelector(".spotify-artists-container");
const svg = document.querySelector(".spotify-image-container > svg");
const cover = document.querySelector(".spotify-image-container > img");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const progressLabel = document.querySelector(".progress-label");
const durationLabel = document.querySelector(".duration-label");
const verticalContainer = document.querySelector(".spotify-vertical-container");

// function getFunctionsUrl() {
//   return "http://localhost:8888/.netlify/functions/__get_spotify_now_playing";
// }

function getDuration(ms) {
  let seconds = Math.floor(ms / 1000);

  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;

  if (minutes >= 60) {
    let hours = Math.floor(minutes / 60);
    let minutes = minutes & 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

let secondsInterval;
let refreshTimeout;
let progressMs = 0;

const refreshIntervalSeconds = 60;

async function main() {
  if (refreshTimeout) clearTimeout(refreshTimeout);

  let data = await fetch(getFunctionsUrl(), {
    method: "GET",
  }).then((response) => response.json());

  if (!data.isPlayingNow) {
    headerElement.innerText = "Last Played";
    progressContainer.style.display = "none";
    verticalContainer.classList.add("centered");
    clearInterval(secondsInterval);
  } else if (data.isPaused) {
    headerElement.innerText = "Currently Paused On";
    clearInterval(secondsInterval);
  } else {
    headerElement.innerText = "Currently Listening To";
  }
  trackNameContent.innerText = data.trackName;
  trackNameElement.classList.remove("disabled");
  trackNameElement.setAttribute("href", data.trackLink);
  trackNameElement.setAttribute("target", "_blank");

  while (artistsElement.firstChild)
    artistsElement.removeChild(artistsElement.lastChild);
  data.artists.forEach((artist, i) => {
    let wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    if (i != 0) {
      let comma = document.createElement("div");
      comma.innerHTML = ",";
      comma.style.marginRight = "5px";
      artistsElement.lastChild.appendChild(comma);
    }

    let linkElement = document.createElement("a");

    linkElement.innerText = artist.name;
    linkElement.setAttribute("href", artist.link);
    linkElement.setAttribute("target", "_blank");

    wrapper.appendChild(linkElement);

    artistsElement.appendChild(wrapper);
  });

  svg.style.opacity = 0;

  cover.setAttribute("src", data.albumCoverImg);
  cover.style.opacity = 1;

  if (data.isPlayingNow) {
    progressBar.style.setProperty(
      "--progress",
      `${(data.progressMs / data.durationMs) * 100}%`,
    );
    progressContainer.style.display = "flex";
    verticalContainer.classList.remove("centered");

    progressLabel.innerText = getDuration(data.progressMs);
    durationLabel.innerText = getDuration(data.durationMs);
  }

  if (secondsInterval) {
    clearInterval(secondsInterval);
  }

  if (!data.isPaused && data.isPlayingNow) {
    progressMs = data.progressMs;

    setTimeout(
      () => {
        let handler = () => {
          if (progressMs > data.durationMs) {
            clearInterval(secondsInterval);
            main().then();
          }

          progressBar.style.setProperty(
            "--progress",
            `${(progressMs / data.durationMs) * 100}%`,
          );
          progressLabel.innerText = getDuration(progressMs);

          progressMs += 1000;
        };
        handler();
        secondsInterval = setInterval(handler, 1000);
      },
      progressMs - Math.floor(progressMs / 1000) * 1000,
    );
  }

  refreshTimeout = setTimeout(
    () => main().then(),
    refreshIntervalSeconds * 1000,
  );
}

main().then();
