import './tailwind.css'
import './style.css'

//import { animate, init } from './app/js/index.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <h1>Tile Editor</h1>
  <div class="flex flex-row gap-4">
    <div class="flex flex-col gap-4">
      <form class="grid-form" name="load-atlas">
        <label for="atlas-spritesheet">Spritesheet</label>
        <input
          type="file"
          id="atlas-spritesheet"
          name="spritesheet"
          accept=".png,.gif,.bmp,.tif,.tiff|image/*"
          required
        />
        <label for="atlas-metadata">Metadata</label>
        <input
          type="file"
          name="metadata"
          accept="application/json"
          required
        />
        <label for="level-metadata">Level</label>
        <input type="file" name="level" accept="application/json" required />
        <button type="submit">Update</button>
      </form>
      <canvas class="render-atlas"></canvas>
    </div>
    <div class="flex flex-col">
      <canvas class="render-level"></canvas>
    </div>
  </div>
`

init();
animate();