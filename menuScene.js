
class menuScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'menuScene'
    });
  }

  preload() {
    
    this.load.image('menuBg', LEVEL_CONFIG.background.path);
  }

  create() {
    
    const fadeOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 1)
    .setOrigin(0)
    .setDepth(1000);
  
  this.tweens.add({
    targets: fadeOverlay,
    alpha: 0,
    duration: 500,
    onComplete: () => {
      fadeOverlay.destroy();
    }
  });


    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'menuBg').setOrigin(0);

  
    this.title = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Underwater Escape', {
      fontFamily: 'Pixelify Sans',
      fontSize: this.scale.width < 800 ? '36px' : '64px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    
    this.startButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'START', {
      fontFamily: 'Pixelify Sans',
      fontSize: this.scale.width < 800 ? '28px' : '48px',
      backgroundColor: '#00aaff',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      color: '#ffffff'
    }).setOrigin(0.5).setInteractive();

    
    this.startButton.on('pointerover', () => {
      this.startButton.setStyle({ backgroundColor: '#0088cc' });
    });
    
    this.startButton.on('pointerout', () => {
      this.startButton.setStyle({ backgroundColor: '#00aaff' });
    });

    this.startButton.on('pointerdown', () => {
      const loadingOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
    .setOrigin(0)
    .setDepth(300);
  
  const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading...', {
    fontFamily: 'Pixelify Sans',
    fontSize: '32px',
    color: '#ffffff'
  }).setOrigin(0.5).setDepth(301);


  this.time.delayedCall(100, () => {
    this.scene.start('gameScene');
  });
    });

   
    this.scale.on('resize', this.resizeMenu, this);
  }

  resizeMenu() {
    if (this.bg) {
      this.bg.setSize(this.scale.width, this.scale.height);
    }
    
    if (this.title) {
      this.title.setPosition(this.scale.width / 2, this.scale.height / 2 - 100);
    }
    
    if (this.startButton) {
      this.startButton.setPosition(this.scale.width / 2, this.scale.height / 2 + 50);
    }
  }

  update() {
   
    if (this.bg) {
      this.bg.tilePositionX += 0.5;
    }
  }
}