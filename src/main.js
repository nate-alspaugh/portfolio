import './style.css'
import './components/key-card.js'
import './components/main-nav.js'

document.querySelector('#app').innerHTML = `
  <main-nav></main-nav>
  <section class="hero">
    <div class="home-grid">
      <div class="home-grid__badge">
        <key-card></key-card>
      </div>
      <div class="home-grid__bio">
        <span>bio</span>
      </div>
      <div class="home-grid__work">
        <span>work</span>
      </div>
    </div>
  </section>
`;
