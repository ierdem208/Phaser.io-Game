

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
  
}

create() {

   this.bg = this.add.tileSprite(0, 0,  this.scale.width, this.scale.height, LEVEL_CONFIG.background.key).setOrigin(0);
  const isMobile = this.scale.width < 900;
 
  window.addEventListener('resize', () => this.resizeGame());

  
  
 
 
    this.player = this.physics.add.sprite(this.scale.width * 0.3, this.scale.height * 0.5, LEVEL_CONFIG.misc.hero.key).setScale(isMobile ? LEVEL_CONFIG.misc.hero.scale * 0.6 : LEVEL_CONFIG.misc.hero.scale);
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

  const MAX_ENEMIES = 5; 
  const MIN_GAP = 150;

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
        enemy.setScale(isMobile ? config.scale * 0.6 : config.scale); 
      
    };


  this.time.addEvent({
    delay: 2000,
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
  shark.setScale(isMobile ? sharkConfig.scale * 0.6 : sharkConfig.scale); 
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
    fontFamily: this.scale.width < 800 ? '24px' : '40px',
    fontSize: '50px',
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
  const jellyfish = this.enemies.create(this.scale.width + 50, y, jellyConfig.key).setScale(isMobile ? jellyConfig.scale * 0.6 : jellyConfig.scale);

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
      this.speedMultplier += this.speedIncreaseRate;
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
  const y = this.scale.height + 30; 

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
    coin.setScale(isMobile ? coinConfig.scale * 0.6 : coinConfig.scale);
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
        this.energyBar.fillStyle(0x0000ff, 1);
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
  const oyster = this.oysters.create(this.scale.width + 50, y, oysterConf.key).setScale(isMobile ? oysterConf.scale * 0.6 : oysterConf.scale);

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

if (this.sys.game.device.input.touch) {
  this.setupTouchControls();
}

}

setupTouchControls() {
  const isMobile = this.scale.width < 900;
  const buttons = LEVEL_CONFIG.ui.buttons;

  this.touchInput = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  const createButton = (config, direction) => {
    const btn = this.add.image(config.x, config.y, config.key)
      .setInteractive()
      .setScale(isMobile ? config.scale * 0.6 : config.scale)
      .setScrollFactor(0)
      .setDepth(100)
      .setAlpha(0.8);

    btn.on('pointerdown', () => this.touchInput[direction] = true);
    btn.on('pointerup', () => this.touchInput[direction] = false);
    btn.on('pointerout', () => this.touchInput[direction] = false);

    return btn;
  };

  this.btnUp = createButton(buttons.up, 'up');
  this.btnDown = createButton(buttons.down, 'down');
  this.btnLeft = createButton(buttons.left, 'left');
  this.btnRight = createButton(buttons.right, 'right');

  // Shoot button (fire instantly on press)

    this.btnShoot = this.add.image(buttons.shoot.x, buttons.shoot.y, buttons.shoot.key)
    .setInteractive()
    .setScale(buttons.shoot.scale)
    .setScrollFactor(0)
    .setDepth(100)
    .setAlpha(0.8)
    .setPosition(this.scale.width - 150, this.scale.height - 170);

  this.btnShoot.on('pointerdown', () => this.shootBubble());

}



hitEnemy(player, enemy) {
    console.log(" HIT!");
    
    enemy.destroy();

    this.lives--;

     if (this.lifeIcons[this.lives]) {
        this.lifeIcons[this.lives].setTexture(LEVEL_CONFIG.misc.liveEmpty.key);
    }

    if (this.lives <= 0){
        
      this.physics.pause();
      this.scene.pause();           
      this.scene.launch('gameOver'); 
    

    }
}


  collectCoin(player, coin){
    coin.destroy();

    this.score += 100;
    this.scoreText.setText('Points: ' + this.score);

    
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
 
}

resizeGame(gameSize, baseSize, displaySize, resolution) {
  const width = gameSize ? gameSize.width : this.scale.width;
  const height = gameSize ? gameSize.height : this.scale.height;

  

  if (this.bg) {
    this.bg.setSize(width, height);
  }

if (this.btnUp) this.btnUp.setPosition(this.scale.width - 80, this.scale.height - 200);
if (this.btnDown) this.btnDown.setPosition(this.scale.width - 80, this.scale.height - 100);
if (this.btnLeft) this.btnLeft.setPosition(80, this.scale.height - 100);
if (this.btnRight) this.btnRight.setPosition(160, this.scale.height - 100);
if (this.btnShoot) this.btnShoot.setPosition(width - 100, height - 150);


  if (this.scoreText) this.scoreText.setPosition(width - 90, height * 0.03);
  if (this.energyBar) this.drawEnergyBar(); 
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
    width: window.innerWidth * window.devicePixelRatio,
    height: window.innerHeight * window.devicePixelRatio,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        menuScene,
        gameScene,
        gameOver]

    
};

const game = new Phaser.Game(config);