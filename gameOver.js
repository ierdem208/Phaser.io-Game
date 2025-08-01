class gameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'gameOver' });
  }

  create(data) {

      if (bgMusic && bgMusic.isPlaying) {
    bgMusic.stop();
  }
    const { width, height } = this.scale;
    const { score, time } = data;

    const centerX = width / 2;
const centerY = height / 2;
const scale = this.getScaleFactor();


    const gameOverText = this.add.text(centerX, centerY - 150 * scale,  'GAME OVER', {
      fontFamily: 'Pixelify Sans',
      fontSize:  this.getFontSize(100) + 'px',
      fill: '#fff'
    }).setOrigin(0.5);

 

    const restartText = this.add.text(width / 2, height / 2 + 100 * scale, 'RESTART', {
      fontFamily: 'Pixelify Sans',
      fontSize:  this.getFontSize(50) + 'px',
      fill: '#00ffff',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive();

    this.time.addEvent({
  delay: 400,
  loop: true,
  callback: () => {
    gameOverText.visible = !gameOverText.visible;
  }
});

    restartText.on('pointerdown', () => {
         if (bgMusic) {
      bgMusic.play();  // restart music here
    }
      this.scene.stop();          // Stop GameOverScene
      this.scene.stop('gameScene');  // Stop your main game scene to reset
      this.scene.start('gameScene'); // Restart main game scene fresh
    });


this.add.text(centerX, centerY - 20 * scale, `Score: ${score}`, {
      fontFamily: 'Pixelify Sans',
      fontSize:  this.getFontSize(36) + 'px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Time Text
    this.add.text(centerX, centerY + 30 * scale, `Time: ${time} seconds`, {
      fontFamily: 'Pixelify Sans',
      fontSize:  this.getFontSize(28) + 'px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Back to Menu Button
    const button = this.add.text(centerX, centerY + 170 * scale, 'BACK TO MENU', {
      fontFamily: 'Pixelify Sans',
      fontSize:  this.getFontSize(50) + 'px',
      fill: '#00ffff',
      backgroundColor: '#000',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

   button.on('pointerdown', () => {
  this.scene.stop('gameScene'); // just in case
  this.scene.stop();            // stop gameOver
  if (bgMusic) {
      bgMusic.play();  // restart music when going back to menu
    }
    this.scene.start('menuScene');
});
  
  }

  getScaleFactor() {
  const baseWidth = 1200; // same base as your main game
  const currentWidth = this.scale.width;
  let scaleFactor = currentWidth / baseWidth;

  // Clamp scale factor for small and large screens
  if (currentWidth < 900) {
    scaleFactor = Phaser.Math.Clamp(scaleFactor, 0.4, 0.6);
  } else {
    scaleFactor = Phaser.Math.Clamp(scaleFactor, 0.7, 1.2);
  }
  return scaleFactor;
}

getFontSize(baseSize) {
  return Math.max(16, Math.floor(baseSize * this.getScaleFactor()));
}

  
  
}