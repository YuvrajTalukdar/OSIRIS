import './App.css';
import Settings from './Settings';
import Main from './Main';
import {HashRouter,Route} from 'react-router-dom';

function App()
{   
    if(!process.env.NODE_ENV || process.env.NODE_ENV==="development")
    {
        return(
            <div>  
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
                    <div>  
                        <Route exact path="/" component={Main}/>
                        <Route exact path="/Settings" component={Settings}/>
                    </div>
                </switch>
            </HashRouter>
        );
    }
}

export default App;
