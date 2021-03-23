import './App.css';
import Settings from './Settings';
import Main from './Main';
import {HashRouter,Route,Link} from 'react-router-dom';

function App()
{
    if(!process.env.NODE_ENV || process.env.NODE_ENV==="development")
    {
        return(
            <div className="App">  
                <Route exact path="/" component={Main}/>
                <Route exact path="/Settings" component={Settings}/>
            </div>
        );
    }
    else
    {
        return(
            <HashRouter>
                <switch>
                    <div className="App">  
                        <Route exact path="/" component={Main}/>
                        <Route exact path="/Settings" component={Settings}/>
                    </div>
                </switch>
            </HashRouter>
        );
    }
}

export default App;
