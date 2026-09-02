
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {BaseProvider} from '../context/BaseContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
   <BaseProvider>
 <BrowserRouter>
  <App/>
 </BrowserRouter>
  </BaseProvider>
);
