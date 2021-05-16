import './App.css';
import Settings from './Settings';
import Main from './Main';
import Login from './Login';
import About from './About';
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
                <Route exact path="/About" component={About}/>
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
                        <Route exact path="/About" component={About}/>
                    </div>
                </switch>
            </HashRouter>
        );
    }
}

export default App;
