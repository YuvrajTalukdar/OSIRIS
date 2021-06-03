import React from 'react';
import {Grid,Dialog,DialogTitle,DialogActions,Button,Tooltip,IconButton,Drawer,Toolbar,Popover,Typography,Slider,DialogContent,TextField,Box} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CloseIcon from '@material-ui/icons/Close';

export class Change_Password_Dialog extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            change_pass_dialog:false,
            current_pass:'',
            current_pass_close_btn_show:'none',
            new_pass1:'',
            new_pass1_close_btn_show:'none',
            new_pass2:'',
            new_pass2_close_btn_show:'none',
        }
        this.change_password=this.change_password.bind(this);
    }

    change_password()
    {
        if(this.state.current_pass.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Enter the current Password !",
                alert_dialog_open:true
            });
        }
        else if(this.state.new_pass1.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Enter the new password !",
                alert_dialog_open:true
            });
        }
        else if(this.state.new_pass2.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Type the new password again !",
                alert_dialog_open:true
            });
        }
        else if(this.state.new_pass1.localeCompare(this.state.new_pass2)!=0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Password didnot match !",
                alert_dialog_open:true
            });
        }
        else
        {
            var data={
                current_pass:this.state.current_pass,
                new_pass:this.state.new_pass1,
            };
            window.ipcRenderer.send('change_password', data);
        }
    }

    render()
    {
        return(
            <Dialog
                open={this.state.change_pass_dialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style:{
                        backgroundColor:'#191919'
                    }
                }}>
                <DialogTitle color='primary'><span style={{color: '#03DAC5'}}>Change Password</span></DialogTitle>
                <DialogContent>
                    <TextField 
                        label='Current Password'
                        variant='outlined' 
                        size='small' 
                        value={this.state.current_pass}
                        type="password"
                        onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                        onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                        onChange={
                            e => 
                            {
                                var btn_visible='';
                                if(e.target.value.length>0)
                                {   btn_visible='block';}
                                else
                                {   btn_visible='none';}
                                this.setState({current_pass:e.target.value,current_pass_close_btn_show:btn_visible});
                            }}                                            
                        style={{width:300}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                            endAdornment: 
                            (
                                <Box display={this.state.current_pass_close_btn_show}> 
                                    <IconButton color='primary' size='small'
                                    onClick={e=>{this.setState({current_pass:"",current_pass_close_btn_show:'none'});}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box> 
                            ),
                        }}
                    />
                </DialogContent>
                <DialogContent>
                    <TextField 
                        label='New Password'
                        variant='outlined' 
                        size='small' 
                        value={this.state.new_pass1}
                        type="password"
                        onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                        onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                        onChange={
                            e => 
                            {
                                var btn_visible='';
                                if(e.target.value.length>0)
                                {   btn_visible='block';}
                                else
                                {   btn_visible='none';}
                                this.setState({new_pass1:e.target.value,new_pass1_close_btn_show:btn_visible});
                            }}                                            
                        style={{width:300}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                            endAdornment: 
                            (
                                <Box display={this.state.new_pass1_close_btn_show}> 
                                    <IconButton color='primary' size='small'
                                    onClick={e=>{this.setState({new_pass1:"",new_pass1_close_btn_show:'none'});}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box> 
                            ),
                        }}
                    />
                </DialogContent>
                <DialogContent>
                    <TextField 
                        label='Confirm Password'
                        variant='outlined' 
                        size='small' 
                        value={this.state.new_pass2}
                        type="password"
                        onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                        onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                        onChange={
                            e => 
                            {
                                var btn_visible='';
                                if(e.target.value.length>0)
                                {   btn_visible='block';}
                                else
                                {   btn_visible='none';}
                                this.setState({new_pass2:e.target.value,new_pass2_close_btn_show:btn_visible});
                            }}                                            
                        style={{width:300}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                            endAdornment: 
                            (
                                <Box display={this.state.new_pass2_close_btn_show}> 
                                    <IconButton color='primary' size='small'
                                    onClick={e=>{this.setState({new_pass2:"",new_pass2_close_btn_show:'none'});}}>
                                        <CloseIcon/>
                                    </IconButton>
                                </Box> 
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={e=>{this.change_password()}} color="primary">
                        Change Password
                    </Button>
                    <Button onClick={e=>{this.setState({change_pass_dialog:false,current_pass:'',new_pass1:'',new_pass2:''});}} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export class Speed_Menu extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            network_popup_top:100,
            network_popup_bottom:100,
            open_speed_popover:false,
            speed_popover_anchor:'',
            keyboard_zoom:0.05,
            mouse_zoom:1,
            navigation_speed:10,
        }
    }
    render()
    {
        return(
            <Popover
                open={this.state.open_speed_popover}
                anchorEl={this.state.speed_popover_anchor}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                onClose={e=>
                {
                    this.setState({open_speed_popover:false});
                    this.props.THIS.set_speed();
                }}>
                <div className="speedMenu">
                    <Typography color="primary">Keyboard Zoom</Typography>
                    <Slider
                        valueLabelDisplay="auto"
                        marks
                        min={0.01}
                        step={0.01}
                        max={0.1}
                        value={this.state.keyboard_zoom}
                        onChange={(e,value)=>{
                            this.setState({keyboard_zoom:value});
                        }}
                    />
                    <Typography color="primary">Mouse Wheel Zoom</Typography>
                    <Slider
                        valueLabelDisplay="auto"
                        marks
                        min={1}
                        step={1}
                        max={8}
                        value={this.state.mouse_zoom}
                        onChange={(e,value)=>{
                            this.setState({mouse_zoom:value});
                        }}
                    />
                    <Typography color="primary">Keyboard Navigation</Typography>
                    <Slider
                        valueLabelDisplay="auto"
                        marks
                        min={5}
                        step={5}
                        max={40}
                        value={this.state.navigation_speed}
                        onChange={(e,value)=>{
                            this.setState({navigation_speed:value});
                        }}
                    />
                </div>
            </Popover>
        );
    }
}

export class Side_Bar_Buttons extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            add_icon_color:'primary',
            operation_drawer_color:'primary',
            relation_node_properties_icon_color:'primary',
        }
    }
    render()
    {
        return(
            <Drawer variant="permanent" className={this.props.THIS.props.classes.drawer}
                 classes={{paper: this.props.THIS.props.classes.drawerPaper,}}>
                    <Toolbar variant="dense"/>
                <Grid container direction="column"   xs={1} alignItems="center" justify="flex-start">
                    <Tooltip title="Add Node or Relation">
                        <IconButton color={this.state.add_icon_color} onClick={()=>this.props.THIS.handle_drawer(0)}>
                            <AddIcon/>
                        </IconButton>
                    </Tooltip>
                    {/*
                    <Tooltip title="Search">
                        <IconButton color="primary">
                            <SearchIcon/>
                        </IconButton>
                    </Tooltip>
                    */}
                    <Tooltip title="Perform Operations">
                        <IconButton color="primary" color={this.state.operation_drawer_color} onClick={()=>this.props.THIS.handle_drawer(2)}>
                            <AccountTreeIcon/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Relation and Node Properties">
                        <IconButton color={this.state.relation_node_properties_icon_color} onClick={()=>this.props.THIS.handle_drawer(3)}>
                            <CategoryIcon/>
                        </IconButton>
                    </Tooltip>
                    {/*
                    <Tooltip title="Collaborate">
                        <IconButton color="primary">
                            <GroupIcon/>
                        </IconButton>
                    </Tooltip>
                    */}
                </Grid>
            </Drawer>  
        );
    }
}