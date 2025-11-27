import Phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	physics: {
		default: 'arcade',
		arcade: { debug: false }
	},
	scene: [PreloadScene, MenuScene, GameScene]
};

window.game = new Phaser.Game(config);

