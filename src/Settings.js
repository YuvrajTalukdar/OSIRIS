import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Grid,Paper} from '@material-ui/core';

const useStyles = makeStyles((theme)=>
({
    grid:
    {
        //width:'100%',
        //margin:'10px',
        //padding:'8px'
    }
}));

function Settings()
{
    const classes = useStyles();
    return(
        <header className='Settings-App-Header'>
        <Grid container direction="column" spacing={2} xs={12} className={classes.grid} >
            <Grid item xs={12} container direction="row" justify="center" alignItems="flex-stat" >
                <TextField 
                    id="SearchSettingsTextField" 
                    label='Search Settings' 
                    variant='filled' /*fullWidth*/ 
                    style={{width:'100%',paddingLeft:'1px',paddingRight:'1px',marginTop:'10px'}} 
                    size='small'/>
            </Grid>
            <Grid item xs={12} spacing={0} container direction="row" alignContent="flex-end" justify="flex-end">
                <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                    <Button id="saveButton" variant="contained" color="primary" style={{width:'70%'}}>Save</Button>
                </Grid>
                <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                    <Button id="cancelButton" variant="contained" color="secondary" style={{width:'70%'}}>Cancel</Button>
                </Grid>
            </Grid>
        </Grid>
        </header>
    );
}

export default Settings;