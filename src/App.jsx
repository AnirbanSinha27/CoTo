import {BrowserRouter,Routes,Route} from 'react-router-dom';
import { HomePage,EditorPage } from './pages';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <div>
        <Toaster position='top-right'/>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/editor/:roomId' element={<EditorPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
