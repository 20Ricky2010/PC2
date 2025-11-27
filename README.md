# PC2 - Phaser Game

Correr local:

```powershell
npm install
npm run dev
# open http://localhost:5173/
```

Notas:
- Haz clic en `JUGAR` dentro del menú para iniciar el juego.
- Controles: mueve el mouse de izquierda a derecha o usa las flechas (eje X).
- Background (road.png) se debería mover en Y, pero al ser una imagen simetrica no se nota.
- Se cambiaron tiempos para que sea más facil el probarlo, los enemigos hacen spawn cada 3 segundos y luego cuando salen van apareciendo más rapido.
- Al perder la pantalla de gameover aparece luego de 1 segundo y luego de 3 segundos se regresa al menú.
