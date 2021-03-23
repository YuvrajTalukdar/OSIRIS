import React from 'react';
import Button from '@material-ui/core/Button';
import logo from './logo.svg';

function Main()
{
    return(
        <div>
            <header className="App-header">
                <Button variant="contained" color="secondary">
                    Click Me!
                </Button>
                <img src={logo} className="App-logo" alt="logo"/>
            </header>
        </div>
    );
}

export default Main;