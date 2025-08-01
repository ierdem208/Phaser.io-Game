class CreditsScene extends Phaser.Scene {
     constructor() {
        super({ key: 'creditsScene' });
    }

  preload() {
    // Only preload if it hasn't been preloaded already
    this.load.image('background', 'assets/background.png');
  }

 create() {
  // Background
  this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);

  const centerX = this.scale.width / 2;
  let currentY = 80; // Start high and go down line by line

  const addLine = (text, size = 24, color = '#eeeeee', spacing = 30) => {
    this.add.text(centerX, currentY, text, {
      fontFamily: 'Pixelify Sans',
      fontSize: `${size}px`,
      fill: color,
      align: 'center',
      wordWrap: { width: this.scale.width - 100 }
    }).setOrigin(0.5);
    currentY += spacing;
  };

  // Title
  addLine('🎮 GAME CREDITS', 40, '#ffffff', 50);

  // Development
  addLine('🛠 DEVELOPMENT');
  addLine('Game Developer & Designer: Irem ERDEM');
  addLine('Programming Support: Onder YILDIRIM');
  addLine('Art Direction: Irem ERDEM');
  addLine('Sound Effects: soundizm.com', 20);

  // Special Thanks
  addLine('🌟 SPECIAL THANKS', 30, '#ffffff', 40);
  addLine('Digilayf Studios – Innovating the Future of Gaming');
  addLine('🌐 digilayf.com.tr', 20);

  // Copyright
  addLine('© 2025 Digilayf Bilisim. All Rights Reserved.', 16, '#cccccc', 60);

  // Back to Menu button
  const backButton = this.add.text(centerX, currentY, 'BACK TO MENU', {
       fontFamily: 'Pixelify Sans',
      fontSize: this.scale.width < 800 ? '28px' : '48px',
      backgroundColor: '#00aaff',
      padding: { left: 20, right: 20, top: 10, bottom: 10 },
      color: '#ffffff'
  }).setOrigin(0.5).setInteractive();

  backButton.on('pointerover', () => {
      this.creditsBtn.setStyle({ backgroundColor: '#0088cc' });
    });

 backButton.on('pointerout', () => {
      this.creditsBtn.setStyle({ backgroundColor: '#00aaff' });
    });

  backButton.on('pointerdown', () => {
    this.scene.start('menuScene');
  });
}

update() {
   
    if (this.bg) {
      this.bg.tilePositionX += 0.5;
    }
  }

}



 const creditsScene = new CreditsScene();