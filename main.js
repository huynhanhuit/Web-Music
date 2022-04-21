const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
 

  songs: [
    {
      name: 'Muộn rồi mà sao còn',
      singer: 'Sơn Tùng MTP',
      path: './assets/music/music1.mp3',
      image: './assets/img/img1.jpg'
    },
    {
      name: 'Ái nộ',
      singer: 'Masew, Khôi Vũ',
      path: './assets/music/music2.mp3',
      image: './assets/img/img2.jpg'
    },
    {
      name: 'Without me',
      singer: 'Halsey',
      path: './assets/music/music3.mp3',
      image: './assets/img/img3.jpg'
    },
    {
      name: 'Dont let me down',
      singer: 'The Chainsmokers',
      path: './assets/music/music4.mp3',
      image: './assets/img/img4.jpg'
    },
    {
      name: 'Symphony',
      singer: 'Symphony (feat. Zara Larsson)',
      path: './assets/music/music5.mp3',
      image: './assets/img/img5.jpg'
    },
    {
      name: '7 Rings',
      singer: 'Ariana Grande',
      path: './assets/music/music6.mp3',
      image: './assets/img/img6.jpg'
    },
    {
      name: 'Thank U, Next',
      singer: 'Ariana Grande',
      path: './assets/music/music7.mp3',
      image: './assets/img/img7.jpg'
    },
    {
      name: 'Side To Side',
      singer: 'Ariana Grande (feat. Nicki Minaj)',
      path: './assets/music/music8.mp3',
      image: './assets/img/img8.jpg'
    },
    {
      name: 'Timber',
      singer: 'Timber (feat. Ke$ha)',
      path: './assets/music/music9.mp3',
      image: './assets/img/img9.jpg'
    },
    {
      name: 'Roar',
      singer: 'Kate Perry',
      path: './assets/music/music10.mp3',
      image: './assets/img/img10.jpg'
    },
  ],
  setConfig: function(key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
    })
    playlist.innerHTML = htmls.join('')
  },
  
  defineProperty: function(){
    Object.defineProperty(this,'currentSong',{
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },

  handleEvents: function(){
    //Lưu biến this bên ngoài handleEvent là app vào trong để xử lí ở pause
      const _this = this 
      const cdWidth = cd.offsetWidth

      //Xử lí CD quay và dừng
      const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)' }
      ],{
        duration: 10000, ///10second
        iterations: Infinity
      })
      cdThumbAnimate.pause()
      
      


      //Xử lí phóng to thu nhỏ CD 
      document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const newcdWidth = cdWidth - scrollTop 

        
        cd.style.width = newcdWidth > 0 ? newcdWidth + 'px' : 0
        cd.style.opacity = newcdWidth/ cdWidth
      }


      //Xử lí khi click play
      playBtn.onclick = function(){
        if(_this.isPlaying){
            audio.pause()
        } else {
            audio.play()        
        }
      }
      
     
      //Khi song được play
      audio.onplay = function(){
        _this.isPlaying = true;
        player.classList.add('playing')
        cdThumbAnimate.play()
      }

       //Khi song được pause
       audio.onpause = function(){
        _this.isPlaying = false;
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }

      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function(){
        if(audio.duration){
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
       
        }
      }

      //Xử lí khi tua bài hát
      progress.oninput = function(e){
      
        const seekTime = e.target.value * audio.duration / 100
        audio.currentTime = seekTime
      }

      //Khi next bài hát
      nextBtn.onclick = function(){
        if(_this.isRandom)
        {
          _this.playRandomSong()
        }
        else
        {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      //Khi prev bài hát
      prevBtn.onclick = function(){
        if(_this.isRandom)
        {
          _this.playRandomSong()
        }
        else
        {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      //Xử lý bật/tắt khi Random bài hát
      randomBtn.onclick = function(e){
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom',_this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
        
      }

      //Xử lý lặp lại bài hát
      repeatBtn.onclick = function(e){
        _this.isRepeat =! _this.isRepeat
        _this.setConfig('isRepeat',_this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }
      
      //Xử lý next song khi audio ended
      audio.onended = function() {
        if(_this.isRepeat)
        {
          audio.play()
        }
        else{
          nextBtn.click()
        }
      }
      
      //Lắng nghe action click vào playlist
      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)') 
        
        if(songNode|| e.target.closest('.option'))
        {
          //Xử lý khi click vào bài hát
          if(songNode)
          {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            audio.play()
            _this.render()
          }
          
          //Xử lý khi click vào  song option
          if(e.target.closest('.option'))
          {

          }
          
        }
      }
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
    }, 300)
  },

  loadConfig: function(){
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
    // console.log(heading,cdThumb,audio)   
  },


  nextSong: function () {
    this.currentIndex++
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function () {
    this.currentIndex--
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  playRandomSong: function(){
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * app.songs.length)
    }
    while(newIndex  === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },


  start: function () {
    //Load cấu hình từ config vào app từ Localstorage
    this.loadConfig()

    //Định nghĩa các thuộc tính cho Object
    this.defineProperty()

    // Lắng nghe và xử lý các sự kiện(DOM EVENT)
    this.handleEvents()

    //Tải thông tin bài hát đầu tiên vào UI khi start ứng dụng
    this.loadCurrentSong();

    //Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button random và repeat
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)
  }

}

app.start()
