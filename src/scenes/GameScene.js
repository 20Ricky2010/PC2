import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init() {
        this.width = this.scale.width;
        this.height = this.scale.height;
        this.spawnInterval = 3000; // ms (3 seconds) - spawn enemies every 3s
        this.spawnTimerEvent = null;
        this.lives = 3;
        this.maxLives = 5;
        this.hudIcons = [];
        this.gameOverShown = false;
    }

    preload() {
        this.load.image('road', 'assets/road.png');
        this.load.image('player', 'assets/car.png');
        this.load.image('enemy', 'assets/obstacle.png');

        // simple fallback textures are created in PreloadScene if missing
    }

    create() {
        // background
        this.roadKey = this.textures.exists('road') ? 'road' : 'road';
        this.road = this.add.tileSprite(this.width / 2, this.height / 2, this.width, this.height, this.roadKey);

        // player vehicle at bottom
        this.playerKey = this.textures.exists('player') ? 'player' : 'player';
        this.player = this.physics.add.sprite(this.width / 2, this.height - 80, this.playerKey);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(40, 80, true);

        // groups for enemies and friendly vehicles
        this.enemies = this.physics.add.group();
        this.vehicles = this.physics.add.group();

        // HUD
        this.createHUD(this.lives);

        // input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointermove', (pointer) => { this.pointerX = pointer.x; });

        // collisions
        this.physics.add.overlap(this.player, this.enemies, this.playerHitByEnemy, null, this);
        this.physics.add.overlap(this.player, this.vehicles, this.playerCollectVehicle, null, this);

        // spawn timer
        this.startSpawnTimer();

        this.isDead = false;
    }

    createHUD(count) {
        // clear existing icons
        this.hudIcons.forEach(i => i.destroy());
        this.hudIcons = [];
        for (let i = 0; i < count; i++) {
            const x = 16 + i * 36;
            const y = 16;
            const icon = this.add.image(x, y, this.playerKey).setOrigin(0, 0).setScale(0.45);
            this.hudIcons.push(icon);
        }
    }

    startSpawnTimer() {
        if (this.spawnTimerEvent) this.spawnTimerEvent.remove(false);
        this.spawnTimerEvent = this.time.addEvent({
            delay: this.spawnInterval,
            loop: true,
            callback: this.spawnEntity,
            callbackScope: this
        });
    }

    spawnEntity() {
        const x = Phaser.Math.Between(48, this.width - 48);
        // always spawn an enemy (obstacle) that falls down
        const sprite = this.physics.add.sprite(x, -80, 'enemy');
        sprite.setVelocityY(Phaser.Math.Between(120, 220));
        sprite.setData('type', 'enemy');
        sprite.setCollideWorldBounds(false);
        sprite.body.checkCollision.up = false;
        this.enemies.add(sprite);
    }

    playerHitByEnemy(player, enemy) {
        if (this.isDead) return;
        enemy.destroy();
        this.lives = Math.max(0, this.lives - 1);
        const icon = this.hudIcons.pop();
        if (icon) icon.destroy();
        if (this.lives <= 0) this.handlePlayerDeath();
    }

    playerCollectVehicle(player, vehicle) {
        if (this.isDead) return;
        vehicle.destroy();
        if (this.lives < this.maxLives) {
            this.lives += 1;
            const x = 16 + (this.hudIcons.length) * 36;
            const icon = this.add.image(x, 16, this.playerKey).setOrigin(0, 0).setScale(0.45);
            this.hudIcons.push(icon);
        }
    }

    handlePlayerDeath() {
        this.isDead = true;
        this.enemies.clear(true, true);
        this.vehicles.clear(true, true);
        if (this.player) this.player.destroy();
        this.hudIcons.forEach(i => i.destroy());
        this.hudIcons = [];
        if (this.spawnTimerEvent) this.spawnTimerEvent.remove(false);
        this.time.delayedCall(4000, () => this.showGameOver());
    }

    showGameOver() {
        this.gameOverShown = true;
        this.add.text(this.width / 2, this.height / 2, 'GameOver', { font: '48px Arial', fill: '#ff6666' }).setOrigin(0.5);
        this.time.delayedCall(5000, () => this.scene.start('MenuScene'));
    }

    update(time, delta) {
        if (this.road) this.road.tilePositionY -= 2.2;
        if (this.isDead) return;

        const speed = 300;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        } else if (this.pointerX !== undefined) {
            const targetX = Phaser.Math.Clamp(this.pointerX, 48, this.width - 48);
            const dx = targetX - this.player.x;
            this.player.setVelocityX(Phaser.Math.Clamp(dx * 8, -speed, speed));
        } else {
            this.player.setVelocityX(0);
        }

        // check offscreen sprites
        this.vehicles.children.each((child) => {
            if (child && child.y > this.height + 50) {
                child.destroy();
                // reduce spawn interval by 200ms until minimum 4000ms
                this.spawnInterval = Math.max(4000, this.spawnInterval - 200);
                this.startSpawnTimer();
            }
        }, this);

        this.enemies.children.each((child) => {
            if (child && child.y > this.height + 80) child.destroy();
        }, this);
    }
}
