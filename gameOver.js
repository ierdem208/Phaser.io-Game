class gameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'gameOver' });
  }

  create() {
    const { width, height } = this.scale;

    const gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
      fontFamily: 'Pixelify Sans',
      fontSize: '100px',
      fill: '#fff'
    }).setOrigin(0.5);

 

    const restartText = this.add.text(width / 2, height / 2 + 100, 'RESTART', {
      fontFamily: 'Pixelify Sans',
      fontSize: '50px',
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
      this.scene.stop();          // Stop GameOverScene
      this.scene.stop('gameScene');  // Stop your main game scene to reset
      this.scene.start('gameScene'); // Restart main game scene fresh
    });
  }

  
  
}