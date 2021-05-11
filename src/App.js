import './App.css';
import Settings from './Settings';
import Main from './Main';
import Login from './Login';
import {HashRouter,Route} from 'react-router-dom';

function App()
{   
    if(!process.env.NODE_ENV || process.env.NODE_ENV==="development")
    {
        return(
            <div>  
                <Route exact path="/" component={Main}/>
                <Route exact path="/Settings" component={Settings}/>
                <Route exact path="/Login" component={Login}/>
            </div>
        );
    }
    else
    {
        return(
            <HashRouter>
                <switch>
                    <div>  
                        <Route exact path="/" component={Main}/>
                        <Route exact path="/Settings" component={Settings}/>
                        <Route exact path="/Login" component={Login}/>
                    </div>
                </switch>
            </HashRouter>
        );
    }
}

export default App;
