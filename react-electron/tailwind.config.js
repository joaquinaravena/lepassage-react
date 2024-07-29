module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'panel-background': '#F7F9FC', // Un gris muy claro, casi blanco
        'tab-bar': '#B4BCC8',          // Un gris claro con un toque de azul
        'options-panel': '#E4E9F0',    // Un azul pálido
        'text-border': '#2D3A4A',      // Un azul oscuro, más suave que el negro
        'button-accent': '#9AB2D8',    // Un azul más suave y claro
        'selected-tab': '#6C63FF',     // Un morado vibrante y moderno
        'search-bar': '#F0F4F8',       // Un gris claro con un toque de azul, similar al color de fondo del panel
      }
    },
  },
  plugins: [],
}
