import './style.css'
import './components/key-card.js'
// import './components/tweaker-panel.js'

document.querySelector('#app').innerHTML = `
  <section class="hero">
    <key-card></key-card>
  </section>
`;
