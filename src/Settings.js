import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Grid,List,ListItem,ListItemText,ThemeProvider} from '@material-ui/core';
import theme from './theme';
import {FixedSizeList} from 'react-window';
import { orange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme)=>
({
    grid:
    {
        //width:'100%',
        //margin:'10px',
        //padding:'8px'
    },
    textfield_background:
    {   background: "#394458"},
    textfield_text:
    {   color: "#03DAC5"},
    textfield_label:
    {   color: "#4CD6C9"},
    FixedSizedList_props:
    {   
        width: '100%',
        height: 400,
        paddingBottom:'20px'
    },
    valueTextField:
    {
        borderColor: '#03DAC5',//textfield border color
        color: "#03DAC5", //textfield input color
    },
    root:
    {
        '&:hover $valueTextField': 
        {   borderColor: 'orange !important',},//textfield hover border color
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": 
        {   borderColor: "orange"}//textfield border color when focused 
    },
    focused: {},
    notchedOutline: {}
}));

function RenderRow(props) 
{   const classes = useStyles();
    const { index, style } = props;
    
    return(
        <ListItem button style={style} key={index}>
            <ListItemText primary={`Item ${index + 1}`} />
            <TextField 
            variant='outlined' 
            size='small' 
            style={{width:'100px'}} 
            InputLabelProps={
            {   className: classes.textfield_label}}
            InputProps={{
                className: classes.valueTextField,
                classes:{
                    root:classes.root,
                    notchedOutline: classes.valueTextField,
                    disabled: classes.valueTextField
                }
            }}/>
        </ListItem>
    );
}

try
{
    window.ipcRenderer.on('settings:data',(event,data)=>
    {
        alert("data="+data[1]);
    });
}
catch(exception)
{}

function Settings()
{   
    const classes = useStyles();
    //const props.classes=classes
    return(
        <ThemeProvider theme={theme}>
            <header className='Settings-Style'>
                <Grid container direction="column" spacing={2} xs={12} className={classes.grid} alignItems="center">
                    <Grid item container direction="row" justify="center" alignItems="flex-stat" >
                        <TextField 
                            id="SearchSettingsTextField" 
                            label='Search Settings' 
                            variant='filled' /*fullWidth*/ 
                            style={{width:'100%',paddingLeft:'1px',paddingRight:'1px',marginTop:'10px'}} 
                            size='small'
                            InputProps={{
                                className: classes.textfield_text
                            }}
                            className={classes.textfield_background}
                            InputLabelProps={
                                {   className: classes.textfield_label}
                            }/>
                    </Grid>
                    <Grid container direction ="column" xs={12} alignItems="center">
                        <div className={classes.FixedSizedList_props}>
                            
                            <FixedSizeList height={400} width={'100%'} itemSize={46} itemCount={200}>
                            {RenderRow}
                            </FixedSizeList>
                        </div>
                    </Grid>
                    <Grid item xs={12} spacing={0} container direction="row" alignContent="flex-end" justify="flex-end">
                        <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                            <Button id="saveButton" variant="contained" color="primary" style={{width:'70%'}} 
                                onClick={()=>{
                                    console.log('test======'+window.isElectron)
                                    alert('test======'+window.isElectron)
                                }}>Save</Button>
                        </Grid>
                        <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                            <Button id="cancelButton" variant="contained" color="primary" style={{width:'70%'}}
                            onClick={()=>{
                                window.postMessage({    close_settings: 1});
                            }}>Cancel</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </header>
        </ThemeProvider>
    );
}

export default Settings;