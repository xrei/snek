import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'

export const mountUi = () =>
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
