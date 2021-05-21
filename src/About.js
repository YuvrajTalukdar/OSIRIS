import React from 'react';
import theme from './theme';
import {Button,Grid,Box,Typography} from '@material-ui/core';
import { ThemeProvider, withStyles } from '@material-ui/core';
import logo from './osiris_icon2.png';

const useStyles = (theme)=>
({
    button:{
        background:'#03DAC5',
        '&$disabled_button':
        {   background: '#96FFF4'}
    },
    disabled_button:{},
});

class About extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            version:0.0,
            electron_version:0.0,
            chrome_version:0.0,
            node_version:0.0,
            v8_version:0.0,
        }
        this.github_link="https://github.com/YuvrajTalukdar/OSIRIS";
    }

    componentDidMount()
    {
        window.ipcRenderer.on('get_about_data',(event,data)=>
        {   this.setState({
                version:data.version,
                electron_version:data.electron_version,
                chrome_version:data.chrome_version,
                node_version:data.node_version,
                v8_version:data.v8_version
            });});

        window.ipcRenderer.send('get_about_data',"");
    }

    render()
    {
        return(
            <ThemeProvider theme={theme}>
                <header className="about">
                    <Grid container direction="column" xs={12} justify="space-between" alignItems="flex-start">
                        <Grid container direction="row" xs={12} justify="center" alignItems="center">
                            <Grid container direction="column" xs={12} justify="center" alignItems="center">
                                <Grid container direction="column" justify="center" alignItems="center">
                                    <img src={logo} style={{paddingTop:5}} width="50" height="50" />
                                </Grid>
                                <Typography
                                color="primary"
                                display="block"
                                variant="h5">
                                OSIRIS
                                </Typography>
                                <Typography
                                color="primary"
                                display="block"
                                variant="h7">
                                Open Source Information Research and Intelligence System
                                </Typography>
                                <Typography
                                color="primary"
                                display="block"
                                variant="body2">
                                Version {this.state.version}
                                </Typography>
                                <Typography
                                color="primary"
                                style={{paddingTop:10}}
                                display="block"
                                variant="caption">
                                This software is licensed under GNU General Public License v3(GPLv3).<br></br>
                                Github: {this.github_link}<br></br>
                                Author: Yuvraj Talukdar<br></br>
                                Electron: {this.state.electron_version}<br></br>
                                Chrome: {this.state.chrome_version}<br></br>
                                Node: {this.state.node_version}<br></br>
                                V8: {this.state.v8_version}<br></br>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" xs={12} justify="flex-end" alignItems="flex-end">
                            <Button variant="contained" size="small" color="primary" style={{width:130,margin:10}}
                                    classes={{root: this.props.classes.button, disabled: this.props.classes.disabled_button }}
                                    onClick={e=>{window.ipcRenderer.send('open_link',this.github_link);}}>Open Github Link
                            </Button>
                            <Button variant="contained" size="small" color="primary" style={{width:130,margin:10}}
                                    classes={{root: this.props.classes.button, disabled: this.props.classes.disabled_button }}
                                    onClick={e=>{window.ipcRenderer.send('close_about',"");}}>Close
                            </Button>
                        </Grid>
                    </Grid>
                </header>
            </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(About);