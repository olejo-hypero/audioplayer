const audioFn = () => {
  const playlistArray = [
    {
      image: '1.jpg',
      name: 'ЯрмаК - Чёрное золото',
      artist: 'ЯрмаК',
      src: 'ЯрмаК-Чёрное-золото-kissvk.com.mp3',
    },
    {
      image: '2.jpg',
      name: 'Тони Раут - 300 спартанцев',
      artist: 'Тони Раут',
      src: 'Тони-Раут-300-спартанцев-kissvk.com.mp3',
    },
    {
      image: '3.jpg',
      name: 'Jim Yosef & Roy Knox - Sun Goes Down',
      artist: 'Jim Yosef & Roy Knox',
      src: 'Jim Yosef & Roy Knox - Sun Goes Down.mp3',
    },
    {
      image: '4.jpg',
      name: 'Listen To Your Heart-kissvk.com',
      artist: 'Roxette',
      src: 'Roxette-Listen To Your Heart-kissvk.com.mp3',
    },
  ];
  const audio = document.querySelector('.audioplayer'),
    image = audio.querySelector('.audioplayer__image'),
    name = audio.querySelector('.audioplayer__song-name'),
    artist = audio.querySelector('.audioplayer__song-artist'),
    mainAudio = audio.querySelector('#main-audiotrack'),
    playButton = audio.querySelector('[data-audio-type="play-pause"]'),
    currentTimeEl = audio.querySelector('.progressbar__current-time'),
    totalTimeEl = audio.querySelector('.progressbar__total-time'),
    progressRange = audio.querySelector('[data-audio-type="timeline"]'),
    volumeRange = audio.querySelector('[data-audio-type="volume"]'),
    showPlayList = audio.querySelector('[data-audio-type="show-playlist"]'),
    volumeBtn = audio.querySelector('.volume-icon'),
    playlist = audio.querySelector('.audioplayer__playlist'),
    playlistBtn = audio.querySelector('.audioplayer__playlist-btn-close');

  let trackIndex = 0;
  let trackVolume = 1;
  let volumeSwitcher = 'on';

  // Генерация рандомных значений animation-duration для анимации эквалайзера
  const randomDurationVisualisator = () => {
    const lines = document.querySelectorAll('.audioplayer-equalizer__line');
    lines.forEach((line) => {
      const randomDuration = Math.random() * (0.8 - 0.2) + 0.2;
      line.style.animationName = 'equalizer';
      line.style.animationIterationCount = 'infinite';
      line.style.animationDirection = 'alternate';
      line.style.animationDuration = `${randomDuration}s`;
    });
  };
  randomDurationVisualisator();

  // Генерация рандомных значений rotate для анимации плеера
  // const randomRotateAnimation = () => {
  //   const audioplayer = document.querySelector('.audioplayer');
  //   const isPaused = mainAudio.paused;
  //   if (!isPaused) {
  //     interval = setInterval(() => {
  //       let randomX = Math.random() * (5 - -5) + -5;
  //       let randomY = Math.random() * (5 - -5) + -5;
  //       let cssStyle = `perspective(1000px) rotateX(${randomX}deg) rotateY(${randomY}deg) scale3d(1, 1, 1)`;
  //       audioplayer.style.transform = cssStyle;
  //       if (mainAudio.paused) clearInterval(interval);
  //     }, 400);
  //   }
  // };

  // Отключаем звук
  const disableVolume = () => {
    if (!volumeBtn.classList.contains('volume-disabled')) {
      volumeBtn.classList.add('volume-disabled');
      mainAudio.muted = true;
      localStorage.setItem('volume_on_off', 'off');
      volumeBtn
        .querySelector('svg use')
        .setAttribute('xlink:href', '#volume-disable-icon');
    } else {
      volumeBtn.classList.remove('volume-disabled');
      mainAudio.muted = false;
      localStorage.setItem('volume_on_off', 'on');
      volumeBtn
        .querySelector('svg use')
        .setAttribute('xlink:href', '#volume-icon');
    }
  };
  volumeBtn.addEventListener('click', disableVolume);

  const getLocalStorage = () => {
    const id = localStorage.getItem('current_song_id');
    const volume = localStorage.getItem('volume');
    const volumeOnOff = localStorage.getItem('volume_on_off');
    console.log(volumeOnOff);
    // Текущий id песни
    trackIndex = id ? +id : 0;
    // Текущая громкость
    trackVolume = volume ? volume : 1;
    mainAudio.volume = trackVolume;
    volumeRange.setAttribute('value', Math.round(trackVolume * 100));
    volumeRange.value = trackVolume * 100;

    // Включен/выключен звук
    volumeSwitcher = volumeOnOff ? volumeOnOff : 'on';
    console.log(volumeSwitcher);
    if (volumeSwitcher == 'on') {
      mainAudio.muted = false;
      volumeBtn
        .querySelector('svg use')
        .setAttribute('xlink:href', '#volume-icon');
    } else {
      volumeBtn.classList.add('volume-disabled');
      mainAudio.muted = true;
      volumeBtn
        .querySelector('svg use')
        .setAttribute('xlink:href', '#volume-disable-icon');
    }
  };

  const setTrackPosition = () => {
    const pos = mainAudio.duration * (progressRange.value / 100);
    if (!isNaN(pos)) {
      mainAudio.currentTime = pos;
    }
  };
  progressRange.addEventListener('input', setTrackPosition);

  const setVolume = (volume) => {
    const volumeValue = volume / 100;
    mainAudio.volume = volumeValue;
    localStorage.setItem('volume', volumeValue);
  };
  volumeRange.addEventListener('input', (e) => {
    const self = e.currentTarget;
    setVolume.call(self, self.value);
  });

  showPlayList.addEventListener('click', () => {
    playlist.classList.toggle('audioplayer__playlist--active');
  });

  const generatePlayListHTML = () => {
    playlistArray.forEach((track, index) => {
      const trackHTML = `
      <div class="music-track" data-music-track="${index}">
        <div class="music-track__image-wrapper">
          <div class="music-track__playpause-btn">
            <svg>
              <use
                xmlns:xlink="http://www.w3.org/1999/xlink"
                xlink:href="#play-icon"
              ></use>
            </svg>
          </div>
          <img src="../images/${track.image}" alt="" class="music-track__image" />
        </div>
        <div class="music-track__title">${track.name}</div>
        <div class="music-track__artist">${track.artist}</div>
        <div class="music-track__time">
          <div id="audio-current-time-${index}" class="music-track__time-current"></div>
          <span class="music-track__time-line"></span>
          <div id="audio-duration-time-${index}" class="music-track__time-duration"></div>
        </div>
        <audio id="music-track-audio-${index}" preload="metadata" src="../songs/${playlistArray[index].src}" class="music-track__audio"></audio>
      </div>`;
      playlist.insertAdjacentHTML('beforeend', trackHTML);

      const audioDurationTag = document.querySelector(
        `#audio-duration-time-${index}`
      );
      const audioCurrentTag = document.querySelector(
        `#audio-current-time-${index}`
      );
      const audioTag = document.querySelector(`#music-track-audio-${index}`);
      audioCurrentTag.innerText = '0:00';

      mainAudio.addEventListener('loadeddata', (e) => {
        const durationTime = audioTag.duration; // Длительность аудио в секундах
        const minutes = Math.floor(durationTime / 60);
        const seconds = Math.floor(durationTime % 60);
        audioDurationTag.innerText = `${minutes}:${seconds}`;
      });
    });
  };
  generatePlayListHTML();

  const clickedByAudioPlaylist = (e) => {
    const self = e.currentTarget;
    // if (self.classList.contains('playing')) return;
    const musicId = +self.dataset.musicTrack;
    const playingTrack = document.querySelector('.music-track--playing');
    trackIndex = musicId;
    localStorage.setItem('current_song_id', musicId);
    if (self === playingTrack && !mainAudio.paused) {
      stopMusic();
    } else {
      loadMusic(musicId);
      playMusic();
    }
    playMusicFromPlayList();
  };

  const playMusicFromPlayList = () => {
    const musicPlayList = document.querySelectorAll('.music-track');
    musicPlayList.forEach((music) => {
      const musicBtn = music.querySelector('.music-track__playpause-btn');
      const timeDurationEl = music.querySelector('.music-track__time-current');
      if (music.classList.contains('music-track--playing')) {
        music.classList.remove('music-track--playing');
        musicBtn
          .querySelector('svg use')
          .setAttribute('xlink:href', '#play-icon');
        timeDurationEl.classList.remove('music-track__time-current--animated');
        timeDurationEl.innerText = '0:00';
      }

      if (music.dataset.musicTrack == trackIndex && !mainAudio.paused) {
        music.classList.add('music-track--playing');
        musicBtn
          .querySelector('svg use')
          .setAttribute('xlink:href', '#pause-icon');
        timeDurationEl.classList.add('music-track__time-current--animated');
        timeDurationEl.innerText = 'играет';
      } else if (music.dataset.musicTrack == trackIndex && mainAudio.paused) {
        music.classList.add('music-track--playing');
        timeDurationEl.classList.add('music-track__time-current--animated');
        timeDurationEl.innerText = 'на паузе';
      }

      music.addEventListener('click', clickedByAudioPlaylist);
    });
  };

  playlistBtn.addEventListener('click', () => {
    playlist.classList.toggle('audioplayer__playlist--active');
  });

  mainAudio.addEventListener('loadedmetadata', (e) => {
    const durationTime = mainAudio.duration; // Длительность аудио в секундах
    let minutes = Math.floor(durationTime / 60);
    let seconds = Math.floor(durationTime % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    currentTimeEl.innerText = '0:00';
    totalTimeEl.innerText = `${minutes}:${seconds}`;

    progressRange.value = 0;

    mainAudio.addEventListener('timeupdate', (e) => {
      const currentTime = e.target.currentTime;
      const trackPosition = mainAudio.currentTime * (100 / mainAudio.duration);
      progressRange.value = trackPosition;
      // Обновление текущего времени
      let currentMin = Math.floor(currentTime / 60);
      let currentSec = Math.floor(currentTime % 60);
      currentSec = currentSec < 10 ? '0' + currentSec : currentSec;
      currentTimeEl.innerText = `${currentMin}:${currentSec}`;
    });
  });

  // Загрузка информации о аудио
  const loadMusic = (index) => {
    image.src = `../images/${playlistArray[index].image}`;
    name.innerText = playlistArray[index].name;
    artist.innerText = playlistArray[index].artist;
    mainAudio.src = `../songs/${playlistArray[index].src}`;
    mainAudio.load();
  };

  window.addEventListener('load', () => {
    getLocalStorage();
    loadMusic(trackIndex);
    playMusicFromPlayList();
  });

  // Запуск аудио
  const playMusic = () => {
    const svguse = playButton.querySelector('svg use');
    if (svguse && svguse.hasAttribute('xlink:href')) {
      svguse.setAttribute('xlink:href', '#pause-icon');
    }
    audio.classList.add('played');
    mainAudio.play();
  };

  // Стоп аудио
  const stopMusic = () => {
    const svguse = playButton.querySelector('svg use');
    if (svguse && svguse.hasAttribute('xlink:href')) {
      svguse.setAttribute('xlink:href', '#play-icon');
    }
    audio.classList.remove('played');
    mainAudio.pause();
  };

  // Загрузка и запуск аудио
  const loadPlayMusic = () => {
    if (mainAudio.paused) {
      loadMusic(trackIndex);
    } else {
      loadMusic(trackIndex);
      playMusic();
    }
  };

  audio.addEventListener('click', (e) => {
    const target = e.target;
    // Если клик не по кнопке с дата атрибутом data-audio-type, то выходим
    if (!target.closest('[data-audio-type]')) return;

    // Клик по кнопке с дата атрибутом data-audio-type="play-pause"
    if (
      target.closest('[data-audio-type]').dataset.audioType === 'play-pause'
    ) {
      const isPlaying = audio.classList.contains('played');
      isPlaying ? stopMusic() : playMusic();
      playMusicFromPlayList();
    }

    // Клик по кнопке с дата атрибутом data-audio-type="play-prev"
    if (target.closest('[data-audio-type]').dataset.audioType === 'play-prev') {
      trackIndex -= 1;
      if (trackIndex < 0) {
        trackIndex = playlistArray.length - 1;
      }
      localStorage.setItem('current_song_id', trackIndex);
      loadPlayMusic();
      playMusicFromPlayList();
      randomDurationVisualisator();
    }

    // Клик по кнопке с дата атрибутом data-audio-type="play-next"
    if (target.closest('[data-audio-type]').dataset.audioType === 'play-next') {
      trackIndex += 1;
      if (trackIndex > playlistArray.length - 1) {
        trackIndex = 0;
      }
      localStorage.setItem('current_song_id', trackIndex);
      loadPlayMusic();
      playMusicFromPlayList();
      randomDurationVisualisator();
    }

    // Клик по кнопке с дата атрибутом data-audio-type="timeline"
    // if (target.closest('[data-audio-type]').dataset.audioType === 'timeline') {
    //   const progressbarWidth = e.target.closest(
    //     '.progressbar__control'
    //   ).clientWidth;
    //   const offsetX = e.offsetX;
    //   const durationTime = mainAudio.duration;
    //   mainAudio.currentTime = (offsetX / progressbarWidth) * durationTime;
    // }

    if (
      target.closest('[data-audio-type]').dataset.audioType === 'type-playing'
    ) {
      const typePlayingElement = target.closest('.audio-controls__control');
      const typePlaying = typePlayingElement.dataset.audioRepeat;
      if (typePlaying === 'default') {
        typePlayingElement.dataset.audioRepeat = 'repeat';
        typePlayingElement
          .querySelector('svg use')
          .setAttribute('xlink:href', '#repeat2-icon');
      }
      if (typePlaying === 'repeat') {
        typePlayingElement.dataset.audioRepeat = 'shuffle';
        typePlayingElement
          .querySelector('svg use')
          .setAttribute('xlink:href', '#repeat3-icon');
      }
      if (typePlaying === 'shuffle') {
        typePlayingElement.dataset.audioRepeat = 'default';
        typePlayingElement
          .querySelector('svg use')
          .setAttribute('xlink:href', '#repeat-icon');
      }
    }
  });

  const playOfTypeRepeat = () => {
    const typePlayingEl = document.querySelector(
      '[data-audio-type="type-playing"]'
    );
    const typePlayingValue = typePlayingEl.dataset.audioRepeat;
    if (typePlayingValue === 'default') {
      trackIndex += 1;
      if (trackIndex > playlistArray.length - 1) {
        trackIndex = 0;
      }
      localStorage.setItem('current_song_id', trackIndex);
      loadMusic(trackIndex);
      playMusic();
    }
    if (typePlayingValue === 'repeat') {
      mainAudio.currentTime = 0;
      playMusic();
    }
    if (typePlayingValue === 'shuffle') {
      let randomIndex = Math.floor(Math.random() * playlistArray.length);
      do {
        randomIndex = Math.floor(Math.random() * playlistArray.length);
      } while (randomIndex == trackIndex);
      trackIndex = randomIndex;
      localStorage.setItem('current_song_id', trackIndex);
      loadMusic(trackIndex);
      playMusic();
    }
  };

  // Событие завершения аудио
  mainAudio.addEventListener('ended', () => {
    playOfTypeRepeat();
  });
};

audioFn();

// VanillaTilt.init(document.querySelectorAll('.audioplayer'), {
//   max: 5,
//   speed: 1400,
//   // glare: true,
//   transition: true,
//   easing: 'cubic-bezier(.03,.98,.52,.99)',
// });
