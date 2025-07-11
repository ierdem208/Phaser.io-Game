const LEVEL_CONFIG = {

  background: { key: 'background', path: 'assets/background.png'},
  
  enemies: {
    enemy1: { key: 'enemy1', path: 'assets/enemy1.png', speed: 300, bounce: 0, scale: 1.2 },
    enemy2: { key: 'enemy2', path: 'assets/enemy2.png', speed: 320, bounce: 0.2, scale: 1.1 },
    enemy3: { key: 'enemy3', path: 'assets/enemy3.png', speed: 280, bounce: 0.1, scale: 1.3 },
    enemy4: { key: 'enemy4', path: 'assets/enemy4.png', speed: 350, bounce: 0, scale: 1 },
    enemy5: { key: 'enemy5', path: 'assets/enemy5.png', speed: 270, bounce: 0.3, scale: 1.5 },
    shark: {
      key: 'shark',
      path: 'assets/shark/Walk.png',
      speed: 400,
      scale: 4,
      anim: 'shark-swim',
      flipX: true,
      isSpriteSheet: true,
      frameWidth: 48,
      frameHeight: 48
    },
    jellyfish: {
      key: 'jellyfish',
      path: 'assets/jeyyfish.png',
      speed: 250,
      scale: 0.16,
      float: true
    }
  },

    collectibles: {
    coin: { key: 'coin', path: 'assets/coin.png', scale: 0.5 },
    oyster: { key: 'oyster', path: 'assets/oyster.png', scale: 0.7 }
  },


  misc: {
    hero: { key: 'hero', path: 'assets/hero.png', scale: 1 },
    live: { key: 'live', path: 'assets/live.png', scale: 0.8 },
    liveEmpty: { key: 'live-empty', path: 'assets/live-empty.png', scale: 1 },
    seaweed: { key: 'seaweed', path: 'assets/seaweed1.png', scale: 1 },
    yosun: { key: 'yosun', path: 'assets/yosun.png' },
    bubble: { key: 'bubble', path: 'assets/bubbles.webp', scale: 0.2, speed: 300 }
  },

  ui: {
    buttons: {
      up: {
        key: 'btn-up',
        path: 'assets/topbtn.png',
        x: 160,
        y: window.innerHeight - 250,
        scale: window.innerWidth < 800 ? 0.6 : 1,
      },
      down: {
        key: 'btn-down',
        path: 'assets/bottombtn.png',
        x: 160,
        y: window.innerHeight - 90,
        scale: window.innerWidth < 800 ? 0.6 : 1,
      },
      left: {
        key: 'btn-left',
        path: 'assets/leftbtn.png',
        x: 75,
        y: window.innerHeight - 165,
        scale: window.innerWidth < 800 ? 0.6 : 1,
      },
      right: {
        key: 'btn-right',
        path: 'assets/rightbtn.png',
        x: 250,
        y: window.innerHeight - 170,
        scale: window.innerWidth < 800 ? 0.6 : 1, 
      },

      shoot: {
        key: 'btn-shoot',
        path: 'assets/shootbutton.png',
        x: window.innerWidth - 150,
        y: window.innerHeight - 170,
        scale: 0.4,
      },
        
    },

 
},

}