import React from 'react';
import {Button,Toolbar,AppBar,TextField,Grid,IconButton,Drawer,Tooltip,Divider,List,ListItem,ListItemIcon} from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import theme from './theme';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import SpeedIcon from '@material-ui/icons/Speed';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';


const useStyles = (theme)=>
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
    notchedOutline: {},
    list_class:{
        maxHeight: 400,
        width: '100%',
        position: 'relative',
        overflow: 'auto',
    },
    formControl: {
        minWidth: '100px',
    },
    select_style:{
        color:'#03DAC5',
        icon: {
            fill: 'white',
        },

        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#03DAC5'
        },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'orange !important'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': 
        {   borderColor: 'orange !important',}
    },
    button:{
        background:'#03DAC5',
        '&$disabled_button':
        {   background: '#96FFF4'}
    },
    disabled_button:{},
    menu_dropdown_style:{
        border: "1px solid orange",
        borderRadius: "5%",
        backgroundColor:'#353535',
        color:'#03DAC5'
    },
    appBar:{
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: 200,
        flexShrink: 0,
    },
    drawerPaper:{
        width: 50,
        background: '#242527'
    },
});

class Main extends React.Component
{
    render()
    {
        return(
        <ThemeProvider theme={theme}>
            <header className="Settings-Style">
                <AppBar  style={{ background: '#242527' }} className={this.props.classes.appBar}>
                    <Toolbar variant="dense">
                        <Grid container direction="column"  spacing={2} xs={6} alignItems="left">
                            <TextField 
                                id="SearchSettingsTextField" 
                                label='Search Settings' 
                                variant='filled' /*fullWidth*/ 
                                style={{width:'100%',paddingLeft:'1px',paddingRight:'1px',borderRadius: 5}} 
                                size='small'
                                value={""}
                                onChange={
                                    e=>{
                                        
                                    }
                                }
                                InputProps={
                                {
                                    className: this.props.classes.textfield_text,
                                    endAdornment: 
                                    (
                                        <Button  color="primary"
                                        onClick={
                                            e=>{
                                                
                                            }
                                        }
                                        >Clear</Button>  
                                    ),
                                }}
                                className={this.props.classes.textfield_background}
                                InputLabelProps={
                                    {   className: this.props.classes.textfield_label}
                                }
                            />
                        </Grid>
                        <Grid container direction="row" spacing={2} xs={6} alignItems="center" justify="flex-end">
                            <IconButton color="primary">
                                <CenterFocusStrongIcon/>
                            </IconButton>
                            <IconButton color="primary">
                                <SpeedIcon/>
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" className={this.props.classes.drawer}
                 classes={{paper: this.props.classes.drawerPaper,}}>
                    <Toolbar variant="dense"/>
                    <Grid container direction="column"   xs={1} alignItems="center" justify="flex-start">
                    <Tooltip title="Add Node or Relation">
                        <IconButton color="primary">
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Search">
                        <IconButton color="primary">
                            <SearchIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Perform Operations">
                        <IconButton color="primary">
                            <AccountTreeIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Relation and Node Properties">
                        <IconButton color="primary">
                            <CategoryIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Collaborate">
                        <IconButton color="primary">
                            <GroupIcon/>
                        </IconButton>
                    </Tooltip>
                    </Grid>
                </Drawer>
            </header>
        </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Main);