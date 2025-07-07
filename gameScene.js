class gameScene extends Phaser.Scene{
constructor(){
  super('gameScene');
}

preload() {
  // Load your assets here (adjust paths to your files)
  
  this.load.image('background', 'assets/background.png'); 
  this.load.image('hero', 'assets/hero.png');
  this.load.image('yosun', 'assets/yosun.png');
  this.load.image('seaweed', 'assets/seaweed1.png');
  this.load.image('oyster', 'assets/oyster.png');
  this.load.image('coin', 'assets/coin.png');
  this.load.image('enemy1', 'assets/enemy1.png');
  this.load.image('enemy2', 'assets/enemy2.png');
  this.load.image('enemy3', 'assets/enemy3.png');
  this.load.image('enemy4', 'assets/enemy4.png');
  this.load.image('enemy5', 'assets/enemy5.png');
  this.load.image('live', 'assets/live.png');
  this.load.image('live-empty', 'assets/live-empty.png');
  this.load.image('jellyfish', 'assets/jeyyfish.png');
  this.load.image('bubble', 'assets/bubbles.webp');
  this.load.spritesheet('shark', 'assets/shark/Walk.png', {
    frameWidth: 48,
    frameHeight: 48
  });
  
}

create() {
 
  
  this.bg = this.add.tileSprite(0, 0,  this.scale.width, this.scale.height, 'background').setOrigin(0);
 
    this.player = this.physics.add.sprite(300, this.scale.height / 2, 'hero');
    this.player.setCollideWorldBounds(true);

  
  //Enemies
  this.enemyKeys = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];
  this.enemies = this.physics.add.group();

  this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);

  this.enemySpeed = 300;
  this.speedIncreaseRate = 20;
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
        const enemy = this.enemies.create(this.scale.width + 50, laneY, key);
        enemy.body.allowGravity = false;
        enemy.setVelocityX(-this.enemySpeed);
        enemy.setDepth(1);
        enemy.setImmovable(true);
        enemy.setScale(1.2); 

      
    };


  this.time.addEvent({
    delay: 2000,
    callback: this.spawnEnemy,
    callbackScope: this,
    loop: true

});





this.spawnShark = () => {
  const y = Phaser.Math.Between(100, this.scale.height - 100);
  const shark = this.enemies.create(this.scale.width + 50, y, 'shark');
  shark.play('shark-swim');
  shark.setVelocityX(-600);
  shark.setFlipX(true);
  shark.body.allowGravity = false;
  shark.setImmovable(true);
  shark.setDepth(2);
  shark.setScale(4); 
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
    fontSize: '50px',
    fill: '#ff0000'
  }).setOrigin(0.5);

  this.time.delayedCall(2000, () => {
    warningText.destroy();
  });

  this.time.addEvent({
  delay: 400,
  loop: true,
  callback: () => {
    warningText.visible = !warningText.visible;
  }
});

});


//Jellyfish


this.spawnJellyfish = () => {
  
  const y = Phaser.Math.Between(100, this.scale.height - 100);
  const jellyfish = this.enemies.create(this.scale.width + 50, y, 'jellyfish').setScale(0.16);

  jellyfish.setVelocityX(-this.enemySpeed);
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
    if (this.enemySpeed < this.maxSpeed) {
      this.enemySpeed += this.speedIncreaseRate;
      console.log("Enemy speed:", this.enemySpeed);
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

  const seaweed = this.seaweedGroup.create(x, y, 'seaweed');
  seaweed.setOrigin(0, 1); 
  seaweed.setImmovable(true);
  seaweed.body.allowGravity = false;
  seaweed.setVelocityX(-this.enemySpeed); 
  seaweed.setDepth(0); 
  seaweed.setScale(0.8); 
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

  this.lives = 3;
  this.lifeIcons = [];

  for (let i = 0; i < 3; i++) {
    const icon = this.add.image(70 + i * 100, 50, 'live').setScale(1);
    this.lifeIcons.push(icon);
}



  //Coins

  this.coins = this.physics.add.group();
  this.coinCollider= this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

  this.spawnCoin = () => {
  const y = Phaser.Math.Between(100, this.scale.height - 50);  
  const coin = this.coins.create(this.scale.width + 50, y, 'coin');
  coin.setVelocityX(-this.enemySpeed);
  coin.body.allowGravity = false;
  coin.setImmovable(true);
  coin.setScale(0.5);
};

this.time.addEvent({
  delay: 1500, 
  callback: this.spawnCoin,
  callbackScope: this,
  loop: true
});
  
  this.score = 0;
  this.scoreText = this.add.text(this.scale.width - 50, 20, 'Points: 0', {
  fontFamily: 'Pixelify Sans',  
  fontSize: '40px',
  fill: '#ffff00',
  stroke: '#000',
  strokeThickness: 3
}).setOrigin(1, 0);;


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
  this.energyBarX = 800;
  this.energyBarY = 20;
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

    const y = Phaser.Math.Between(100, this.scale.height - 100);
  const oyster = this.oysters.create(this.scale.width + 50, y, 'oyster').setScale(0.16);

  oyster.setVelocityX(-this.enemySpeed);
  oyster.setImmovable(true);
  oyster.setScale(0.7);
  oyster.body.allowGravity = false;

  };

  this.time.addEvent({
  delay: 5000,
  callback: this.spawnOyster,
  callbackScope: this,
  loop: true
});
  








}



hitEnemy(player, enemy) {
    console.log(" HIT!");
    
    enemy.destroy();

    this.lives--;

     if (this.lifeIcons[this.lives]) {
        this.lifeIcons[this.lives].setTexture('live-empty');
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
  const bubble = this.bubbles.create(this.player.x + 30, this.player.y, 'bubble');
  bubble.setVelocityX(300);
  bubble.setScale(0.2);
  bubble.setCollideWorldBounds(false);
  bubble.body.allowGravity = false;
  this.currentEnergy--;
  this.drawEnergyBar();
 
}



update() {
 

   
    this.bg.tilePositionX += 0.008 * this.enemySpeed;

     if (this.cursors.up.isDown) {
        this.player.setVelocityY(-600);
    } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(600);
    } else {
        this.player.setVelocity(0);
    }

      if (this.cursors.left.isDown) {
    this.player.setVelocityX(-200);
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(200);
  } else {
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
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        gameScene,
        gameOver]
};

const game = new Phaser.Game(config);