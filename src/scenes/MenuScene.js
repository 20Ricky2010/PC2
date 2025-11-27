import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
	constructor() {
		super('MenuScene');
	}

	preload() {
		// ensure road asset is considered (PreloadScene generated it or loaded it)
		this.load.image('road_placeholder', 'assets/road.png');
	}

	create() {
		const w = this.scale.width;
		const h = this.scale.height;
		const roadKey = this.textures.exists('road') ? 'road' : 'road';

		this.road = this.add.tileSprite(w / 2, h / 2, w, h, roadKey);

		// show user's name
		this.add.text(w / 2, h * 0.2, 'Ricardo Rivas', { font: '36px Arial', fill: '#ffffff' }).setOrigin(0.5);

		// play button
		const playBtn = this.add.text(w / 2, h * 0.55, 'JUGAR', { font: '28px Arial', fill: '#000' })
			.setOrigin(0.5)
			.setPadding(12)
			.setStyle({ backgroundColor: '#f2c14e' })
			.setInteractive({ useHandCursor: true })
			.on('pointerdown', () => this.scene.start('GameScene'));

		this.add.text(w / 2, h * 0.75, 'Mueve con teclas ← → o sigue el mouse (X solamente)', { font: '14px Arial', fill: '#ddd' }).setOrigin(0.5);
	}

	update() {
		if (this.road) this.road.tilePositionY -= 1.2;
	}
}

export default MenuScene;

