import React from 'react';
import {Button,TextField,Grid,IconButton,Box} from '@material-ui/core';
import {DialogActions,Dialog,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import theme from './theme';
import logo from './logo512.png';
import CloseIcon from '@material-ui/icons/Close';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

const useStyles = (theme)=>
({
    textfield_label:
    {   color: "#4CD6C9"},
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
    notchedOutline: {},
    button:{
        background:'#03DAC5',
        '&$disabled_button':
        {   background: '#96FFF4'}
    },
    outlinedButton:{
        borderColor:'#03DAC5',
        '&$disabled_button':
        {   borderColor: 'orange',color:'orange'}
    },
    disabled_button:{},
    inputRoot: {
        color: "#03DAC5",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#03DAC5"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "orange"
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "orange",color:'orange'
        },  
    },
    clearIndicator: {
        color: "#03DAC5",    
    },
    popupIndicator: {
        color: "#03DAC5"
    },
    typography: {
        paddingLeft:'10px'
    },
    track: {
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
});

class Login extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            db_dir_label:'Browse Database',
            db_dir:'',
            file_name:'',
            password:'',
            pass_textfield_close_button:'none',
            confirm_pass:'',
            confirm_pass_textfield_close_button:'none',
            confirm_pass_display:'none',
            create_button_disabled:false,
            login_button_disabled:true,
            login_create_button_text:'Login',

            //dialog box
            alert_dialog_open:false,
            alert_dialog_text:'',
        };
        this.login=this.login.bind(this);
        this.handle_login_create_mode=this.handle_login_create_mode.bind(this);
    }

    handle_login_create_mode(code)
    {   
        if(code==0)
        {
            this.setState({
                create_button_disabled:false,
                login_button_disabled:true,
                confirm_pass_display:'none',
                login_create_button_text:'Login',
                db_dir_label:'Browse Database',
                db_dir:''
            });
        }
        else if(code==1)
        {
            this.setState({
                create_button_disabled:true,
                login_button_disabled:false,
                confirm_pass_display:'block',
                login_create_button_text:'Create Database',
                db_dir_label:'Save Database to..',
                db_dir:''
            });
        }
    }

    login()
    {
        if(this.state.db_dir.length==0)
        {
            if(this.state.create_button_disabled==true)
            {
                this.setState({
                    alert_dialog_text:"Database save dir not selected !",
                    alert_dialog_open:true
                });
            }
            else
            {
                this.setState({
                    alert_dialog_text:"Database not selected !",
                    alert_dialog_open:true
                });
            }
        }
        else if(this.state.password.length==0)
        {
            this.setState({
                alert_dialog_text:"Password not entered !",
                alert_dialog_open:true
            });
        }
        else if(this.state.confirm_pass.length==0 && this.state.create_button_disabled==true)
        {
            this.setState({
                alert_dialog_text:"Enter the password again !",
                alert_dialog_open:true
            });
        }
        else if(this.state.create_button_disabled==true && this.state.password.localeCompare(this.state.confirm_pass)!=0)
        {
            this.setState({
                alert_dialog_text:"Password didnot match !",
                alert_dialog_open:true
            });
        }
        else
        {
            var login_create_code;
            if(this.state.create_button_disabled==true)
            {   login_create_code=1;}
            else
            {   login_create_code=0;}
            var data={
                file_name:this.state.file_name,
                db_dir:this.state.db_dir,
                password:this.state.password,
                login_create_code:login_create_code
            }
            window.ipcRenderer.send('login_create',data);
            if(login_create_code==1)
            {
                this.setState({
                    db_dir:'',
                    password:'',
                    confirm_pass:'',
                    confirm_pass_textfield_close_button:'none',
                    pass_textfield_close_button:'none',
                })
            }
        }
    }

    componentDidMount() 
    {
        window.ipcRenderer.on('odb_dir',(event,data)=>
        {   this.setState({db_dir:data.file_dir,file_name:data.file_name});});

        window.ipcRenderer.on('login_create_error',(event,data)=>
        {   
            this.setState({
                alert_dialog_text:data.error_statement,
                alert_dialog_open:true
            });
        });
    }

    render()
    {
        return(
            <ThemeProvider theme={theme}>
                <header className="login">
                    {/*Alert Dialog*/}
                    <Dialog
                        open={this.state.alert_dialog_open}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        PaperProps={{
                            style:{
                                backgroundColor:'#191919'
                            }
                        }}
                    >
                        <DialogTitle color='primary'><span style={{color: '#03DAC5'}}>Alert</span></DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <span style={{color: 'white'}}>{this.state.alert_dialog_text}</span>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={e=>{this.setState({alert_dialog_open:false,alert_dialog_text:""});}} color="primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Grid container direction="column" xs={12} spacing={5} justify="center" alignItems="center">
                        <Grid container direction="column" justify="center" alignItems="center">
                            <img src={logo} style={{padding:12}} width="100" height="100" />
                        </Grid>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Button variant="outlined" color="primary" style={{width:145,margin:5}}
                            disabled={this.state.create_button_disabled}
                            classes={{root: this.props.classes.outlinedButton,disabled: this.props.classes.disabled_button }}
                            onClick={e=>{this.handle_login_create_mode(1);}}>Create new DB</Button>
                            <Button variant="outlined" color="primary" style={{width:145,margin:5}}
                            disabled={this.state.login_button_disabled}
                            classes={{root: this.props.classes.outlinedButton,disabled: this.props.classes.disabled_button }}
                            onClick={e=>{this.handle_login_create_mode(0);}}>Login to DB</Button>
                        </Grid>
                        <Grid container direction="column" xs={12} spacing={5} justify="center" alignItems="center">
                            <TextField 
                            label={this.state.db_dir_label}
                            variant='outlined' 
                            size='small' 
                            value={this.state.db_dir}   
                            onChange={
                                e=>{this.setState({db_dir:e.target.value});}}                                     
                            style={{width:300,marginTop:30,marginBottom:10}} 
                            InputLabelProps={
                            {   className: this.props.classes.textfield_label}}
                            InputProps={{
                                className: this.props.classes.valueTextField,
                                classes:{
                                    root:this.props.classes.root,
                                    notchedOutline: this.props.classes.valueTextField,
                                    disabled: this.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <IconButton color='primary' size='small'
                                    onClick={
                                        e=>
                                        {
                                            if(this.state.create_button_disabled)
                                            {
                                                window.ipcRenderer.send('open_save_folder_picker',"");
                                            }
                                            else
                                            {   window.ipcRenderer.send('open_db_picker',"");} 
                                        }}>
                                        <CreateNewFolderIcon/>
                                    </IconButton>
                                ),
                            }}/>
                            <TextField 
                            label='Password'
                            variant='outlined' 
                            type="password"
                            size='small' 
                            value={this.state.password}
                            onChange={
                            e=>{
                                var dis;
                                if(e.target.value.length>0)
                                {   dis='block';}
                                else
                                {   dis='none';}
                                this.setState({
                                    password:e.target.value,
                                    pass_textfield_close_button:dis
                                });
                            }}                                            
                            style={{width:300,margin:10}} 
                            InputLabelProps={
                            {   className: this.props.classes.textfield_label}}
                            InputProps={{
                                className: this.props.classes.valueTextField,
                                classes:{
                                    root:this.props.classes.root,
                                    notchedOutline: this.props.classes.valueTextField,
                                    disabled: this.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <Box display={this.state.pass_textfield_close_button}> 
                                        <IconButton color='primary' size='small'
                                        onClick={
                                            e=>{
                                                this.setState({password:"",pass_textfield_close_button:'none'});
                                            }
                                        }>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                            <Box display={this.state.confirm_pass_display}>
                                <TextField 
                                label='Confirm Password'
                                variant='outlined' 
                                type="password"
                                size='small' 
                                value={this.state.confirm_pass}
                                onChange={
                                e=>{
                                    var dis;
                                    if(e.target.value.length>0)
                                    {   dis='block';}
                                    else
                                    {   dis='none';}
                                    this.setState({
                                        confirm_pass:e.target.value,
                                        confirm_pass_textfield_close_button:dis
                                    });
                                }}                                            
                                style={{width:300,margin:10}} 
                                InputLabelProps={
                                {   className: this.props.classes.textfield_label}}
                                InputProps={{
                                    className: this.props.classes.valueTextField,
                                    classes:{
                                        root:this.props.classes.root,
                                        notchedOutline: this.props.classes.valueTextField,
                                        disabled: this.props.classes.valueTextField
                                    },
                                    endAdornment: 
                                    (
                                        <Box display={this.state.confirm_pass_textfield_close_button}> 
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    this.setState({confirm_pass:"",confirm_pass_textfield_close_button:'none'});
                                                }
                                            }>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box> 
                                    ),
                                }}/>
                            </Box>
                            <Button variant="contained" size="small" color="primary" style={{width:300,margin:10}}
                            classes={{root: this.props.classes.button, disabled: this.props.classes.disabled_button }}
                            onClick={e=>{this.login();}}>{this.state.login_create_button_text}</Button>
                        </Grid>
                    </Grid>
                </header>
            </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Login);