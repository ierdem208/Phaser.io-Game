

class gameScene extends Phaser.Scene{
constructor(){
  super({
   key: 'gameScene',

   autoStart: false,
   clearBeforeRender: false,
  
  });

  
}



preload() {

 
const assets = LEVEL_CONFIG;

  // Background
  this.load.image(assets.background.key, assets.background.path);


  // Enemies
  for (const key in assets.enemies) {
    const enemy = assets.enemies[key];
    if (enemy.isSpriteSheet) {
      this.load.spritesheet(enemy.key, enemy.path, {
        frameWidth: enemy.frameWidth,
        frameHeight: enemy.frameHeight
      });
    } else {
      this.load.image(enemy.key, enemy.path);
    }
  }

  // Collectibles
  for (const key in assets.collectibles) {
    const item = assets.collectibles[key];
    this.load.image(item.key, item.path);
  }

  // Misc
  for (const key in assets.misc) {
    const item = assets.misc[key];
    this.load.image(item.key, item.path);
  }

  const buttons = LEVEL_CONFIG.ui.buttons;
  for (const key in buttons) {
  this.load.image(buttons[key].key, buttons[key].path);
  }
  
  this.load.audio('coinSound', 'assets/coinsound.wav');
  this.load.audio('shootingSound', 'assets/shootingSound.mp3');
  this.load.audio('gameOverSound', 'assets/gameOverSound.mp3');
  this.load.audio('bgMusic', 'assets/bgMusic.mp3');

  this.load.spritesheet('electricTrap', 'assets/electricTrap.png', {
  frameWidth: 96,  // set your frame width here
  frameHeight: 96  // set your frame height here
});
}


isMobile() {
        return this.scale.width < 900 || this.sys.game.device.input.touch;
    }

getScaleFactor() {
        const baseWidth = 1920;
        const currentWidth = this.scale.width;
        const scaleFactor = currentWidth / baseWidth;
        
        // Clamp the scale factor for mobile
        if (this.isMobile()) {
            return Math.max(0.3, Math.min(scaleFactor, 0.8));
        }
        return Math.max(0.6, Math.min(scaleFactor, 1.2));
    }

    // Helper function to get mobile-friendly font size
    getFontSize(baseSize) {
        const scaleFactor = this.getScaleFactor();
        return Math.max(16, Math.floor(baseSize * scaleFactor));
    }

create() {

  const scaleFactor = this.getScaleFactor();
  const isMobile = this.isMobile();

 this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, LEVEL_CONFIG.background.key).setOrigin(0,0).setScrollFactor(0);
 


 
  //window.addEventListener('resize', () => this.resizeGame());

  
  
    this.player = this.physics.add.sprite(this.scale.width * 0.3, this.scale.height * 0.5, LEVEL_CONFIG.misc.hero.key).setScale(LEVEL_CONFIG.misc.hero.scale * scaleFactor);
    this.player.setCollideWorldBounds(true);

    this.playerVerticalSpeed = 0;
    this.playerVerticalAcceleration = 50; 
    this.playerVerticalMaxSpeed = 600;    
    this.playerVerticalDamping = 0.9; 

  
  //Enemies
  this.enemyKeys = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
  this.enemies = this.physics.add.group();

  this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

  this.speedMultiplier = 1.0;
  this.baseSpeed = 300;
  this.maxSpeed = 800;

  const MAX_ENEMIES = isMobile ? 6 : 10;
  const MIN_GAP = isMobile ? 100 : 150;

  this.anims.create({
  key: 'shark-swim',
  frames: this.anims.generateFrameNumbers('shark', { start: 0, end: 3 }), 
  frameRate: 10,
  repeat: -1 
});

 const lanes = [
      this.scale.height * 0.3,
      this.scale.height * 0.5,
      this.scale.height * 0.7
    ];

  this.spawnEnemy = () => {

        console.log("Enemy spawned");
        if (this.enemies.getLength() >= MAX_ENEMIES) return;

        const canSpawn = this.enemies.getChildren().every(enemy => {
    return enemy.x < this.scale.width - MIN_GAP;
  });

  if (!canSpawn) return;


        const safeZone = 100;
        const laneY = Phaser.Utils.Array.GetRandom(lanes);
        //const y = Phaser.Math.Between(safeZone + 10, this.scale.height - 50);
        const key = Phaser.Utils.Array.GetRandom(this.enemyKeys);
        const config = LEVEL_CONFIG.enemies[key];

        const enemy = this.enemies.create(this.scale.width + 50, laneY, config.key);
        enemy.body.allowGravity = false;
        enemy.setVelocityX(-config.speed * this.speedMultiplier);
        enemy.setDepth(1);
        enemy.setImmovable(true);
        enemy.setScale(config.scale * scaleFactor); 
      
    };


  this.time.addEvent({
    delay: 1000,
    callback: this.spawnEnemy,
    callbackScope: this,
    loop: true

});

//SHARKS

this.spawnShark = () => {

  
  const sharkConfig = LEVEL_CONFIG.enemies.shark;
  const y = Phaser.Math.Between(100, this.scale.height - 100);
  const shark = this.enemies.create(this.scale.width + 50, y, 'shark');
  shark.play(sharkConfig.anim);
  shark.setVelocityX(-sharkConfig.speed * this.speedMultiplier);
  shark.setFlipX(sharkConfig.flipX);
  shark.body.allowGravity = false;
  shark.setImmovable(true);
  shark.setDepth(2);
  shark.setScale(sharkConfig.scale * scaleFactor); 
};

this.time.delayedCall(20000, () => {  
  this.sharkTimer = this.time.addEvent({
    delay: 5000, 
    callback: this.spawnShark,
    callbackScope: this,
    loop: true
  });

});

this.time.delayedCall(19500, () => {
  const warningText = this.add.text(this.scale.width / 2, 100, 'SHARKS INCOMING!', {
    fontFamily: 'Pixelify Sans',
    fontSize: this.getFontSize(64) + 'px',
    fill: '#ff0000'
  }).setOrigin(0.5);

  this.time.delayedCall(2000, () => {
    warningText.destroy();
  });

  const blinkTimer = this.time.addEvent({
  delay: 400,
  loop: true,
  callback: () => {
    if (warningText.active) {
      warningText.visible = !warningText.visible;
    }
  }
});

this.time.delayedCall(2000, () => {
  warningText.destroy();
  blinkTimer.remove(); // stop blinking after 2 seconds
});

});


//Jellyfish


this.spawnJellyfish = () => {
  
  const key = 'jellyfish';
  const jellyConfig = LEVEL_CONFIG.enemies[key];
  const y = Phaser.Math.Between(100, this.scale.height - 100);
  const jellyfish = this.enemies.create(this.scale.width + 50, y, jellyConfig.key).setScale(jellyConfig.scale * scaleFactor);

  jellyfish.setVelocityX(-jellyConfig.speed * this.speedMultiplier);
  jellyfish.setImmovable(true);
  jellyfish.setDepth(1);

  jellyfish.startY = y;
  jellyfish.amplitude = Phaser.Math.Between(20, 50);
  jellyfish.speed = Phaser.Math.FloatBetween(0.005, 0.01);
  jellyfish.time = 0;
};

this.time.addEvent({
  delay: 15000,  
  callback: () => {
    
    this.time.addEvent({
      delay: 4000,
      callback: this.spawnJellyfish,
      callbackScope: this,
      loop: true
    });
  },
  callbackScope: this,
  loop: false
});


this.time.addEvent({
  delay: 5000, 
  callback: () => {
    if (this.baseSpeed * this.baseSpeed < this.maxSpeed) {
      this.speedMultiplier += this.speedIncreaseRate;
       console.log('Speed multiplier increased:', this.speedMultiplier.toFixed(2));
    }
  },
  callbackScope: this,
  loop: true
});

  this.cursors = this.input.keyboard.createCursorKeys();
  

  //Seaweed
  this.seaweedGroup = this.physics.add.group();

  this.spawnSeaweed = () => {
  const x = this.scale.width + 50; 
  const y = this.scale.height - 40; 

  const seaweed = this.seaweedGroup.create(x, y, LEVEL_CONFIG.misc.seaweed.key);
  seaweed.setOrigin(0, 1); 
  seaweed.setImmovable(true);
  seaweed.body.allowGravity = false;
  seaweed.setVelocityX(-this.baseSpeed * this.speedMultiplier); 
  seaweed.setDepth(0); 
  seaweed.setScale(isMobile ? 0.5 : 0.8); 
};

this.time.addEvent({
  delay: Phaser.Math.Between(7000, 10000),
  callback: () => {
    this.spawnSeaweed();
  },
  callbackScope: this,
  loop: true,
});

 

  //Lives

  this.lives = 5;
  this.lifeIcons = [];

  for (let i = 0; i < 5; i++) {
    const icon = this.add.image(70 + i * 100, 50, LEVEL_CONFIG.misc.live.key).setScale(isMobile ? LEVEL_CONFIG.misc.live.scale * 0.7 : LEVEL_CONFIG.misc.live.scale);
    this.lifeIcons.push(icon);
}


  //Coins

  this.coins = this.physics.add.group();
  this.coinCollider= this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

  this.coinSound = this.sound.add('coinSound', {
    volume: 0.5
  });

  this.gameOverSound = this.sound.add('gameOverSound', {
  volume: 1 // Volume ranges from 0 (silent) to 1 (full volume)
});

this.spawnCoinPattern = () => {
  const coinConfig = LEVEL_CONFIG.collectibles.coin;
  const pattern = Phaser.Math.Between(2, 4); // 1 = single, 2 = line, 3 = stack
  
  const baseX = this.scale.width + 50;

  const safeZoneTop = 300;
  const safeZoneBottom = this.scale.height - 100;
  let baseY;
  do{
    baseY = Phaser.Math.Between(100, this.scale.height - 100);
  } while (baseY < safeZoneTop || baseY > safeZoneBottom);


  const spacing = 40; // space between coins
  const coinCount = Phaser.Math.Between(3, 6); // number of coins in a pattern

  for (let i = 0; i < coinCount; i++) {
    let x = baseX;
    let y = baseY;

    if (pattern === 2) {
      // horizontal line
      x += i * spacing;
    } else if (pattern === 3) {
      // vertical stack
      x += i * spacing;
       y -= i * spacing;
    } else if (pattern === 4) {
       x += i * spacing;
      y += (i % 2 === 0) ? -spacing : spacing;
    }

    const enemyOverlap = this.enemies.getChildren().some(enemy => {
      const distX = Math.abs(enemy.x - x);
      const distY = Math.abs(enemy.y - y);
      const minDistX = enemy.width / 2 + coinConfig.width / 2 + 20; // 20px buffer
      const minDistY = enemy.height / 2 + coinConfig.height / 2 + 20;
      return distX < minDistX && distY < minDistY;
    });

    if (!enemyOverlap && y > safeZoneTop && y < safeZoneBottom) {
    const coin = this.coins.create(x, y, coinConfig.key);
    coin.setVelocityX(-this.baseSpeed * this.speedMultiplier);
    coin.body.allowGravity = false;
    coin.setImmovable(true);
    coin.setScale(coinConfig.scale * scaleFactor);
    } else {

    }
  }



};


this.time.addEvent({
  delay: 1500, 
  callback: this.spawnCoinPattern,
  callbackScope: this,
  loop: true
});
  
  this.score = 0;
  this.scoreText = this.add.text(this.scale.width - 50, 20, 'Points: 0', {
  fontFamily: 'Pixelify Sans',  
  fontSize: this.scale.width < 800 ? '24px' : '40px',
  fill: '#ffff00',
  stroke: '#000',
  strokeThickness: 3
}).setOrigin(1, 0).setPosition(this.scale.width - 90, this.scale.height * 0.03);




//shooting bubbles
this.bubbles = this.physics.add.group();
this.maxEnergy = 10;
this.currentEnergy = this.maxEnergy;
this.energyBarWidth = 200;

this.shootingSound = this.sound.add('shootingSound');

this.physics.add.overlap(this.bubbles, this.enemies, (bubble, enemy) => {
  bubble.destroy();
  enemy.destroy();
});

this.input.keyboard.on('keydown-SPACE', () => {
  console.log('Spacebar pressed via event!');
  this.shootBubble();
});

this.maxEnergy = 10;
  this.currentEnergy = this.maxEnergy;
  this.pixelSize = 30;
  this.energyBarX = this.scale.width * 0.5 - (this.maxEnergy * (this.pixelSize + 2)) / 2;
  this.energyBarY = this.scale.height * 0.03;
  this.energyBar = this.add.graphics();

  this.drawEnergyBar = function() {
    this.energyBar.clear();
    for (let i = 0; i < this.maxEnergy; i++) {
      if (i < Math.floor(this.currentEnergy)) {
        this.energyBar.fillStyle(0xffd500, 1);
      } else {
        this.energyBar.fillStyle(0x555555, 1);
      }
      this.energyBar.fillRect(this.energyBarX + i * (this.pixelSize + 2), this.energyBarY, this.pixelSize, this.pixelSize);
      this.energyBar.lineStyle(1, 0x000000, 1);
      this.energyBar.strokeRect(this.energyBarX + i * (this.pixelSize + 2), this.energyBarY, this.pixelSize, this.pixelSize);
    }
  };
  this.drawEnergyBar();


  //colecting oysters

  this.oysters = this.physics.add.group();
  this.physics.add.overlap(this.player, this.oysters, (player, oyster) => {
    oyster.destroy();

  if (this.currentEnergy < this.maxEnergy) {
    this.currentEnergy += 1;
    this.drawEnergyBar();
  }

  }, null, this);
  this.spawnOyster = () => {

  const oysterConf = LEVEL_CONFIG.collectibles.oyster;
  const y = Phaser.Math.Between(100, this.scale.height - 100);
  const oyster = this.oysters.create(this.scale.width + 50, y, oysterConf.key).setScale(oysterConf.scale * scaleFactor);

  oyster.setVelocityX(-this.baseSpeed * this.speedMultiplier);
  oyster.setImmovable(true);
  oyster.body.allowGravity = false;

  };

  this.time.addEvent({
  delay: 5000,
  callback: this.spawnOyster,
  callbackScope: this,
  loop: true
});
  

//Speeding up
this.time.addEvent({
  delay: 5000,
  callback: () => {
    this.speedMultiplier += 0.1;
    console.log('Speed multiplier increased:', this.speedMultiplier.toFixed(2));
  },
  callbackScope: this,
  loop: true
});


this.touchInput = {
    up: false,
    down: false,
    left: false,
    right: false
  };
  
if (this.isMobile()) {
  this.setupTouchControls();
}

  this.scale.on('resize', this.handleResize, this);



//Electric trap

this.traps = this.physics.add.group();
this.anims.create({
  key: 'electricTrapAnim',
  frames: this.anims.generateFrameNumbers('electricTrap', { start: 0, end: 9 }), 
  repeat: -1 // loop forever
});


  this.physics.add.overlap(this.player, this.traps, this.hitTrap, null, this);

this.time.addEvent({
  delay: 10000, // every 10 seconds
  callback: () => {
  const trapX = this.scale.width * 0.5; // 20% from the left
const trapY = this.scale.height * 0.7; // 100px from the bottom
this.spawnElectricTrap(trapX, trapY);

  },
  callbackScope: this,
  loop: true
});


}


spawnElectricTrap(x, y) {
  const scaleFactor = this.getScaleFactor(); // or just 1 if you don't use scaling
 const trap = this.traps.create(x, y, 'electricTrap');
 trap.setScale(this.scale.width < 600 ? 0.5 : 4);

  trap.play('electricTrapAnim');

  trap.body.allowGravity = false;
  trap.setImmovable(true);

 

  // Remove trap after 3 seconds (or however long you want it active)
  this.time.delayedCall(2000, () => {
    trap.destroy();
  });

  return trap;
}

hitTrap(player, trap) {
  console.log("Zapped!");
  trap.destroy(); // optional if you want one-time trap
  
  this.lives--;
  const gameTime = Math.floor((this.time.now - this.startTime) / 1000);

  if (this.lifeIcons[this.lives]) {
    this.lifeIcons[this.lives].setTexture(LEVEL_CONFIG.misc.liveEmpty.key);
  }

  if (this.lives <= 0) {
    if (this.gameOverSound) this.gameOverSound.play();
    this.physics.pause();
    this.scene.pause();
    this.scene.launch('gameOver', {
  score: this.score,
  time: Math.floor(this.time.now / 1000) // game time in seconds
});
  }
}

setupTouchControls() {
  const scaleFactor = this.getScaleFactor();
  const buttons = LEVEL_CONFIG.ui.buttons;

  

  const createBtn = (key, dir) => {
    const btn = this.add.image(0, 0, buttons[key].key)
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(100)
      .setAlpha(0.8)
      .setScale(buttons[key].scale * scaleFactor);

    if (dir) {
      btn.on('pointerdown', () => this.touchInput[dir] = true);
      btn.on('pointerup', () => this.touchInput[dir] = false);
      btn.on('pointerout', () => this.touchInput[dir] = false);
    }

    return btn;
  };

  this.btnUp = createBtn('up', 'up');
  this.btnDown = createBtn('down', 'down');
  this.btnLeft = createBtn('left', 'left');
  this.btnRight = createBtn('right', 'right');
  this.btnShoot = createBtn('shoot'); // no direction, just fires

  this.btnShoot.on('pointerdown', () => this.shootBubble());

  this.startTime = this.time.now;

  // Initial resize call to position them right
  this.handleResize();

}


  
         
  handleResize() {
        const scaleFactor = this.getScaleFactor();
        const isMobile = this.isMobile();

        // Resize background
if (this.bg) {
    this.bg.setSize(this.scale.width, this.scale.height);
  }        

        // Resize player
        if (this.player) {
            this.player.setScale(LEVEL_CONFIG.misc.hero.scale * scaleFactor);
        }

        // Resize UI elements
        if (this.scoreText) {
            this.scoreText.setPosition(
                this.scale.width - (isMobile ? 20 : 90), 
                this.scale.height * 0.03
            );
            this.scoreText.setStyle({
                fontSize: this.getFontSize(isMobile ? 40 : 40) + 'px'
            });


        if (this.lifeIcons && this.lifeIcons.length > 0) {
          const iconSpacing = this.scale.width * 0.05; // space between icons based on screen width
          const iconStartX = this.scale.width * 0.05; // start a bit from the left
          const iconY = this.scale.height * 0.07;

          const scaleFactor = this.getScaleFactor();

          for (let i = 0; i < this.lifeIcons.length; i++) {
            const icon = this.lifeIcons[i];
            icon.setPosition(iconStartX + i * iconSpacing, iconY);
            icon.setScale(LEVEL_CONFIG.misc.live.scale * scaleFactor);
          }
        }
        }

        // Resize touch controls
       // Touch button resizing and repositioning
              if (this.btnUp) {
            const scaleFactor = this.getScaleFactor();
            const margin = 160 * scaleFactor;

            // Left bottom corner
            const leftX = margin;
            const bottomY = this.scale.height - margin;

            this.btnLeft.setPosition(leftX, bottomY - margin + 60);
            this.btnRight.setPosition(leftX + margin, bottomY - margin + 60);
            this.btnUp.setPosition(leftX + margin / 2, bottomY - margin);
            this.btnDown.setPosition(leftX + margin / 2, bottomY);

            // Right side for shoot button
            this.btnShoot.setPosition(this.scale.width - margin, this.scale.height - margin );
          }

        // Redraw energy bar
        if (this.energyBar) {
            this.pixelSize = isMobile ? 30 : 80;
            this.energyBarX = this.scale.width * 0.5 - (this.maxEnergy * (this.pixelSize + 2)) / 2;
            this.energyBarY = this.scale.height * 0.05;
            this.drawEnergyBar();
        }
    }

    
hitEnemy(player, enemy) {
    console.log(" HIT!");
    

    enemy.destroy();
    const gameTime = Math.floor((this.time.now - this.startTime) / 1000);

    this.lives--;

     if (this.lifeIcons[this.lives]) {
        this.lifeIcons[this.lives].setTexture(LEVEL_CONFIG.misc.liveEmpty.key);
    }

    if (this.lives <= 0){
      if (this.gameOverSound) this.gameOverSound.play();
      this.physics.pause();
      this.scene.pause();           
      this.scene.launch('gameOver', {
  score: this.score,
  time: gameTime
});
    

    }
}


  collectCoin(player, coin){
    coin.destroy();

    this.score += 100;
    this.scoreText.setText('Points: ' + this.score);

      if (this.coinSound) {
    this.coinSound.play();
  }
    
}


 shootBubble() {
  console.log('shooting bubble');

   if (this.currentEnergy <= 0) {
    
    return;  
  }
  const bubbleConf = LEVEL_CONFIG.misc.bubble;
  const bubble = this.bubbles.create(this.player.x + 30, this.player.y, bubbleConf.key);
  bubble.setVelocityX(bubbleConf.speed);
  bubble.setScale(bubbleConf.scale);
  bubble.setCollideWorldBounds(false);
  bubble.body.allowGravity = false;
  this.currentEnergy--;
  this.drawEnergyBar();
  
     if (this.shootingSound) {
    this.shootingSound.play();
  }
    
 
}




update() {
 

   
    this.bg.tilePositionX += 0.008 * this.baseSpeed;

     if (this.cursors.up.isDown) {
  this.playerVerticalSpeed -= this.playerVerticalAcceleration;
} else if (this.cursors.down.isDown) {
  this.playerVerticalSpeed += this.playerVerticalAcceleration;
} else {
  this.playerVerticalSpeed *= this.playerVerticalDamping;
}

this.playerVerticalSpeed = Phaser.Math.Clamp(
  this.playerVerticalSpeed,
  -this.playerVerticalMaxSpeed,
  this.playerVerticalMaxSpeed
);

this.player.setVelocityY(this.playerVerticalSpeed);

      if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
  } else {
    this.player.setVelocityX(0);
  }


if (this.touchInput.up) {
  this.playerVerticalSpeed -= this.playerVerticalAcceleration;
} else if (this.touchInput.down) {
  this.playerVerticalSpeed += this.playerVerticalAcceleration;
}

if (this.touchInput.left) {
  this.player.setVelocityX(-200);
} else if (this.touchInput.right) {
  this.player.setVelocityX(200);
} else if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
  this.player.setVelocityX(0);
}

    this.enemies.getChildren().forEach(enemy => {

  if (enemy.texture.key === 'jellyfish') {
    enemy.time += enemy.speed * 16; 
    enemy.y = enemy.startY + Math.sin(enemy.time) * enemy.amplitude;
  }


    if (enemy.x < -enemy.width) {
        enemy.destroy();
    }
});


this.seaweedGroup.getChildren().forEach(seaweed => {
  if (seaweed.x < -seaweed.width) {
    seaweed.destroy();
  }
});

}

}


var config = {
    type: Phaser.AUTO,
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,  // Scale to fit screen
      
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 1920,
        height: 1000,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    scene: [
        menuScene,
        gameScene,
        gameOver,
        creditsScene
      ]

    
};

const game = new Phaser.Game(config);