import AICurlingGame from './AICurlingGame'

const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    width: 100%; min-height: 100vh; margin: 0; padding: 0;
    background: #111827;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    overflow-x: hidden;
  }
  body { font-family: 'Open Sans', 'Segoe UI', system-ui, sans-serif; }
`

export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <AICurlingGame />
    </>
  )
}
