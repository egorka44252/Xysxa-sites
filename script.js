// === КОНФИГУРАЦИЯ ===
const RAW_BASE = 'https://raw.githubusercontent.com/egorka44252/Xysxa-sites/main';
const GITHUB_API = 'https://api.github.com/repos/egorka44252/Xysxa-sites/contents';
const COVER_URL = RAW_BASE + '/img/logo.jpg';

// Список треков (будет загружен с GitHub)
let tracks = [];
let backgroundVideos = [];

// === ЭЛЕМЕНТЫ DOM ===
let audioPlayer, playBtn, prevBtn, nextBtn, progressBar, volumeSlider, muteBtn;
let playlistTracks, trackName, trackTime, currentTimeEl, totalTimeEl, coverImg;
let volumeValue, playIcon, pauseIcon, volumeIcon, muteIcon, musicPlayer;
let repeatBtn, themeBtn, bgVideo;

// === СОСТОЯНИЕ ===
let currentTrackIndex = 0;
let currentVideoIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 1;
let repeatMode = 'all'; // 'all', 'one', 'none'

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎵 Инициализация плеера...');
  initializeElements();
  initializeBackgroundVideo();
  showLoadingState();
  
  // Загружаем треки и видео с GitHub
  await Promise.all([
    loadTracksFromGitHub(),
    loadVideosFromGitHub()
  ]);
  
  if (tracks.length > 0) {
    renderPlaylist();
    loadTrack(0);
  } else {
    showErrorState();
  }
  
  attachEventListeners();
  updateRepeatButton();
  console.log('✅ Плеер готов!');
});

// Инициализация элементов
function initializeElements() {
  audioPlayer = document.getElementById('audio-player');
  playBtn = document.getElementById('play-btn');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');
  progressBar = document.getElementById('progress-bar');
  volumeSlider = document.getElementById('volume-slider');
  muteBtn = document.getElementById('mute-btn');
  playlistTracks = document.getElementById('playlist-tracks');
  trackName = document.getElementById('track-name');
  trackTime = document.getElementById('track-time');
  currentTimeEl = document.getElementById('current-time');
  totalTimeEl = document.getElementById('total-time');
  coverImg = document.getElementById('cover-img');
  volumeValue = document.getElementById('volume-value');
  playIcon = document.getElementById('play-icon');
  pauseIcon = document.getElementById('pause-icon');
  volumeIcon = document.getElementById('volume-icon');
  muteIcon = document.getElementById('mute-icon');
  musicPlayer = document.querySelector('.music-player');
  repeatBtn = document.getElementById('repeat-btn');
  themeBtn = document.getElementById('theme-btn');
  bgVideo = document.getElementById('bg-video');
}

// Показать состояние загрузки
function showLoadingState() {
  if (playlistTracks) {
    playlistTracks.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #fffbe6;">
        <div style="font-size: 2rem; margin-bottom: 15px;">
          <div class="loading-spinner">🎵</div>
        </div>
        <div style="font-size: 1.2rem;">Загрузка треков...</div>
      </div>
    `;
  }
}

// Показать ошибку
function showErrorState() {
  if (playlistTracks) {
    playlistTracks.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #ff6ec4;">
        <div style="font-size: 2rem; margin-bottom: 15px;">⚠️</div>
        <div style="font-size: 1.1rem;">Не удалось загрузить треки</div>
      </div>
    `;
  }
}

// === ЗАГРУЗКА ТРЕКОВ С GITHUB ===
async function loadTracksFromGitHub() {
  try {
    const response = await fetch(`${GITHUB_API}/music`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    
    const files = await response.json();
    const musicFiles = files.filter(f => 
      f.type === 'file' && /\.(mp3|wav|ogg)$/i.test(f.name)
    );
    
    tracks = musicFiles.map(f => ({
      title: decodeURIComponent(f.name).replace(/\.(mp3|wav|ogg)$/i, ''),
      file: f.name
    }));
    
    console.log(`✅ Загружено треков: ${tracks.length}`);
  } catch (error) {
    console.error('❌ Ошибка загрузки треков:', error);
    tracks = [];
  }
}

// === ЗАГРУЗКА ВИДЕО С GITHUB ===
async function loadVideosFromGitHub() {
  try {
    const response = await fetch(`${GITHUB_API}/video`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    
    const files = await response.json();
    const videoFiles = files.filter(f => 
      f.type === 'file' && /\.(mp4|webm)$/i.test(f.name)
    );
    
    backgroundVideos = videoFiles.map(f => ({
      name: f.name,
      url: RAW_BASE + '/video/' + encodeURIComponent(f.name)
    }));
    
    console.log(`✅ Загружено видео: ${backgroundVideos.length}`);
  } catch (error) {
    console.error('❌ Ошибка загрузки видео:', error);
    backgroundVideos = [{ name: 'bg.mp4', url: RAW_BASE + '/video/bg.mp4' }];
  }
}

// === ФОНОВОЕ ВИДЕО ===
function initializeBackgroundVideo() {
  if (bgVideo) {
    bgVideo.addEventListener('loadeddata', () => console.log('📹 Видео загружено'));
    bgVideo.play().catch(() => console.log('🔇 Автовоспроизведение заблокировано'));
  }
}

// Смена фонового видео
function changeBackgroundVideo() {
  if (!bgVideo || backgroundVideos.length === 0) return;
  
  currentVideoIndex = (currentVideoIndex + 1) % backgroundVideos.length;
  const newVideo = backgroundVideos[currentVideoIndex];
  
  console.log(`🎬 Смена фона: ${newVideo.name}`);
  
  bgVideo.style.transition = 'opacity 0.5s';
  bgVideo.style.opacity = '0';
  
  setTimeout(() => {
    bgVideo.src = newVideo.url;
    bgVideo.load();
    bgVideo.play().then(() => {
      bgVideo.style.opacity = '1';
    });
  }, 500);
}

// Получение иконки для трека
function getTrackIcon(index) {
  const icons = ['🎸', '🎹', '🎤', '🎧', '🎼', '🎺', '🎷', '🥁', '🎻', '🪕'];
  return icons[index % icons.length];
}

// === РЕНДЕР ПЛЕЙЛИСТА ===
function renderPlaylist() {
  if (!playlistTracks || tracks.length === 0) return;
  
  playlistTracks.innerHTML = '';
  
  tracks.forEach((track, index) => {
    const trackItem = document.createElement('div');
    trackItem.className = 'track-item';
    trackItem.dataset.index = index;
    
    if (index === currentTrackIndex) trackItem.classList.add('active');
    
    trackItem.style.animation = `trackFadeIn 0.5s ease ${index * 0.1}s backwards`;
    
    const icon = getTrackIcon(index);
    const playingIcon = index === currentTrackIndex && isPlaying ? 
      '<span class="playing-bars">📊</span>' : 
      `<span class="track-icon">${icon}</span>`;
    
    trackItem.innerHTML = `
      <div class="track-item-left">
        <div class="track-number">${index + 1}</div>
        <div class="track-icon-wrapper">${playingIcon}</div>
        <div class="track-details">
          <div class="track-title-small">${track.title}</div>
        </div>
      </div>
      <div class="track-play-icon">${index === currentTrackIndex && isPlaying ? '⏸️' : '▶️'}</div>
    `;
    
    trackItem.addEventListener('click', () => {
      loadTrack(index);
      setTimeout(() => playTrack(), 150);
    });
    
    playlistTracks.appendChild(trackItem);
  });
  
  console.log(`📋 Плейлист отрендерен: ${tracks.length} треков`);
}

// === ОБНОВЛЕНИЕ UI ПЛЕЙЛИСТА ===
function updatePlaylistUI() {
  if (!playlistTracks) return;
  
  const allItems = playlistTracks.querySelectorAll('.track-item');
  
  allItems.forEach((item, index) => {
    const playIcon = item.querySelector('.track-play-icon');
    const iconWrapper = item.querySelector('.track-icon-wrapper');
    
    if (index === currentTrackIndex) {
      item.classList.add('active');
      if (playIcon) playIcon.textContent = isPlaying ? '⏸️' : '▶️';
      if (iconWrapper && isPlaying) {
        iconWrapper.innerHTML = '<span class="playing-bars">📊</span>';
      } else if (iconWrapper) {
        iconWrapper.innerHTML = `<span class="track-icon">${getTrackIcon(index)}</span>`;
      }
    } else {
      item.classList.remove('active');
      if (playIcon) playIcon.textContent = '▶️';
      if (iconWrapper) {
        iconWrapper.innerHTML = `<span class="track-icon">${getTrackIcon(index)}</span>`;
      }
    }
  });
}

// === УПРАВЛЕНИЕ ПОВТОРОМ ===
function toggleRepeatMode() {
  const modes = ['all', 'one', 'none'];
  const currentIndex = modes.indexOf(repeatMode);
  repeatMode = modes[(currentIndex + 1) % modes.length];
  
  updateRepeatButton();
  console.log(`🔁 Режим повтора: ${repeatMode}`);
}

function updateRepeatButton() {
  if (!repeatBtn) return;
  
  const icons = {
    'all': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>',
    'one': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/><text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor" font-weight="bold">1</text></svg>',
    'none': '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" opacity="0.4"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>'
  };
  
  const titles = {
    'all': 'Повтор: Все треки',
    'one': 'Повтор: Один трек',
    'none': 'Повтор: Выключен'
  };
  
  repeatBtn.innerHTML = icons[repeatMode];
  repeatBtn.title = titles[repeatMode];
  
  if (repeatMode !== 'none') {
    repeatBtn.style.background = 'linear-gradient(135deg, rgba(255, 110, 196, 0.4), rgba(162, 89, 255, 0.4))';
    repeatBtn.style.borderColor = 'rgba(255, 110, 196, 0.6)';
  } else {
    repeatBtn.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))';
    repeatBtn.style.borderColor = 'rgba(255, 255, 255, 0.35)';
  }
}

// === ЗАГРУЗКА ТРЕКА ===
function loadTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  
  currentTrackIndex = index;
  const track = tracks[index];
  
  trackName.textContent = track.title;
  audioPlayer.src = RAW_BASE + '/music/' + encodeURIComponent(track.file);
  coverImg.src = COVER_URL;
  
  audioPlayer.load();
  progressBar.value = 0;
  updateProgressBackground();
  updatePlaylistUI();
  
  console.log(`📀 Загружен: ${track.title}`);
}

// === ВОСПРОИЗВЕДЕНИЕ / ПАУЗА ===
function togglePlay() {
  if (!audioPlayer.src) return;
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  audioPlayer.play().then(() => {
    isPlaying = true;
    updatePlayButton();
    updatePlaylistUI();
    if (musicPlayer) musicPlayer.classList.add('playing');
  }).catch(error => {
    console.error('Ошибка воспроизведения:', error);
    isPlaying = false;
    updatePlayButton();
  });
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  updatePlayButton();
  updatePlaylistUI();
  if (musicPlayer) musicPlayer.classList.remove('playing');
}

function updatePlayButton() {
  if (!playIcon || !pauseIcon) return;
  playIcon.style.display = isPlaying ? 'none' : 'block';
  pauseIcon.style.display = isPlaying ? 'block' : 'none';
}

// === НАВИГАЦИЯ ПО ТРЕКАМ ===
function previousTrack() {
  const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(newIndex);
  if (isPlaying) setTimeout(() => playTrack(), 150);
}

function nextTrack() {
  const newIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(newIndex);
  if (isPlaying) setTimeout(() => playTrack(), 150);
}

// === ФОРМАТИРОВАНИЕ ВРЕМЕНИ ===
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === Infinity || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// === ОБНОВЛЕНИЕ ВРЕМЕНИ ===
function updateTime() {
  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration;
  
  if (!isNaN(current) && isFinite(current)) {
    currentTimeEl.textContent = formatTime(current);
  }
  
  if (!isNaN(duration) && isFinite(duration)) {
    totalTimeEl.textContent = formatTime(duration);
    trackTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
    const percentage = (current / duration) * 100;
    progressBar.value = percentage;
    updateProgressBackground();
  }
}

// === ПРОГРЕСС БАР ===
function updateProgressBackground() {
  const value = progressBar.value || 0;
  progressBar.style.background = `linear-gradient(90deg, #ff6ec4 ${value}%, rgba(255,255,255,0.2) ${value}%)`;
}

function seekTrack() {
  const duration = audioPlayer.duration;
  if (!isNaN(duration) && isFinite(duration) && duration > 0) {
    audioPlayer.currentTime = (progressBar.value / 100) * duration;
  }
}

// === ГРОМКОСТЬ ===
function updateVolume() {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  updateVolumeIcon(volume);
  isMuted = volume === 0;
}

function updateVolumeIcon(volume) {
  if (!volumeIcon || !muteIcon) return;
  volumeIcon.style.display = (volume === 0 || isMuted) ? 'none' : 'block';
  muteIcon.style.display = (volume === 0 || isMuted) ? 'block' : 'none';
}

function toggleMute() {
  if (isMuted || audioPlayer.volume === 0) {
    const newVolume = previousVolume > 0 ? previousVolume : 1;
    audioPlayer.volume = newVolume;
    volumeSlider.value = newVolume * 100;
    isMuted = false;
  } else {
    previousVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    volumeSlider.value = 0;
    isMuted = true;
  }
  volumeValue.textContent = `${Math.round(volumeSlider.value)}%`;
  updateVolumeIcon(audioPlayer.volume);
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function attachEventListeners() {
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (prevBtn) prevBtn.addEventListener('click', previousTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeatMode);
  if (themeBtn) themeBtn.addEventListener('click', changeBackgroundVideo);
  
  if (progressBar) {
    progressBar.addEventListener('input', () => {
      seekTrack();
      updateProgressBackground();
    });
  }
  
  if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);
  
  if (audioPlayer) {
    audioPlayer.addEventListener('loadedmetadata', () => {
      const duration = audioPlayer.duration;
      if (!isNaN(duration) && isFinite(duration)) {
        totalTimeEl.textContent = formatTime(duration);
        currentTimeEl.textContent = '00:00';
        trackTime.textContent = `00:00 / ${formatTime(duration)}`;
      }
    });
    
    audioPlayer.addEventListener('timeupdate', updateTime);
    
    audioPlayer.addEventListener('ended', () => {
      console.log('✅ Трек завершен');
      if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        playTrack();
      } else if (repeatMode === 'all') {
        nextTrack();
      } else {
        isPlaying = false;
        updatePlayButton();
        updatePlaylistUI();
      }
    });
    
    audioPlayer.addEventListener('play', () => {
      isPlaying = true;
      updatePlayButton();
      updatePlaylistUI();
    });
    
    audioPlayer.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayButton();
      updatePlaylistUI();
    });
  }
  
  // Клавиатурные сокращения
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (audioPlayer.duration) {
          audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (audioPlayer.duration) {
          audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 5);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
        updateVolume();
        break;
      case 'ArrowDown':
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
        updateVolume();
        break;
      case 'KeyM':
        e.preventDefault();
        toggleMute();
        break;
      case 'KeyR':
        e.preventDefault();
        toggleRepeatMode();
        break;
      case 'KeyB':
        e.preventDefault();
        changeBackgroundVideo();
        break;
    }
  });
}

// === ИНИЦИАЛИЗАЦИЯ ГРОМКОСТИ ===
if (audioPlayer) {
  audioPlayer.volume = 1;
  volumeSlider.value = 100;
  volumeValue.textContent = '100%';
  updateVolumeIcon(1);
}

// Предотвращение автоматической прокрутки при нажатии пробела
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
  }
});
