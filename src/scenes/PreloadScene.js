import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // load the main game assets
        this.load.image('road', 'assets/road.png');
        this.load.image('player', 'assets/car.png');
        this.load.image('enemy', 'assets/obstacle.png');
    }

    create() {
        // generate fallbacks if assets are missing to avoid runtime errors
        const w = this.sys.game.config.width || 800;
        const h = this.sys.game.config.height || 600;

        if (!this.textures.exists('road')) {
            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0x333333, 1);
            g.fillRect(0, 0, w, h);
            g.lineStyle(6, 0xffff66, 1);
            for (let y = 0; y < h; y += 60) g.lineBetween(w / 2, y + 10, w / 2, y + 30);
            g.generateTexture('road', w, h);
        }

        if (!this.textures.exists('player')) {
            const p = this.make.graphics({ x: 0, y: 0, add: false });
            p.fillStyle(0x1e90ff, 1);
            p.fillRoundedRect(0, 0, 64, 96, 10);
            p.generateTexture('player', 64, 96);
        }

        if (!this.textures.exists('enemy')) {
            const e = this.make.graphics({ x: 0, y: 0, add: false });
            e.fillStyle(0xff4d4d, 1);
            e.fillRoundedRect(0, 0, 48, 80, 8);
            e.generateTexture('enemy', 48, 80);
        }

        this.scene.start('MenuScene');
    }
}

export default PreloadScene;
