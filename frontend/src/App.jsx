import './App.css';
// import {Button} from '@chakra-ui/react';
import {Route} from 'react-router-dom';
import Homepage from "./Pages/Homepage";
import Chatpage from './Pages/Chatpage';
function App() {
  
  return (
    <div className='App'>
      <Route path='/' component={Homepage} exact></Route>
      <Route path='/chats' component={Chatpage}></Route>
    </div>
  )
}

export default App;


