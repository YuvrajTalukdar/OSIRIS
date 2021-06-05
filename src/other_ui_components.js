import React from 'react';
import {List,ListItem,Grid,Dialog,DialogTitle,DialogActions,Button,Tooltip,IconButton,Drawer,Toolbar,Popover,Typography,Slider,DialogContent,TextField,Box} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CloseIcon from '@material-ui/icons/Close';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

export class Attached_File_Save_UI extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            Attached_File_Save_Dialog:false,
            source_name_name:'',
            destination_node_name:'',
            relation_type:'',
            url_list:[],
            file_list:[],
            relation_id:-1,

            search_url_text:'',
            search_url_close_btn:'none',
            search_filename_text:'',
            search_filename_text_close_btn:'none'
        }
        this.search_url=this.search_url.bind(this);
        this.search_file=this.search_file.bind(this);
    }

    file_name_search_handler = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.search_file(this.state.search_filename_text);
        }, 250);
    }

    url_search_handler = () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.search_url(this.state.search_url_text);
        }, 250);
    }

    search_file(file_name)
    {
        let file_list=[...this.state.file_list];
        for(let a=0;a<file_list.length;a++)
        {
            if(file_name.length==0 || file_list[a].file_name.toUpperCase().includes(file_name.toUpperCase()))
            {   file_list[a].show=true;}
            else
            {   file_list[a].show=false;}
        }
        this.setState({file_list});
    }

    search_url(url)
    {
        let url_list=[...this.state.url_list];
        for(let a=0;a<url_list.length;a++)
        {
            if(url.length==0 || url_list[a].url.toUpperCase().includes(url.toUpperCase()))
            {   url_list[a].show=true;}
            else
            {   url_list[a].show=false;}
        }
        this.setState({url_list});
    }

    render()
    {
        return(
            <Dialog
                open={this.state.Attached_File_Save_Dialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"sm"}
                fullWidth={true}
                PaperProps={{
                    style:{
                        backgroundColor:'#191919'
                    }
                }}>
                <DialogTitle color='primary'><span style={{color: '#03DAC5'}}>Relation Viewer</span></DialogTitle>
                <DialogContent>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Typography
                            color="primary"
                            display="block"
                            variant="body1">
                            Source Node:
                        </Typography>
                        <TextField 
                        variant='outlined' 
                        size='small' 
                        value={this.state.source_name_name}
                        style={{width:'50%',marginBottom:15}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                        }}/>
                    </Grid>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Typography
                            color="primary"
                            display="block"
                            variant="body1">
                            Destination Node:
                        </Typography>
                        <TextField 
                        variant='outlined' 
                        size='small' 
                        value={this.state.destination_node_name}
                        style={{width:'50%',marginBottom:15}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                        }}/>
                    </Grid>
                    <Grid container direction="row" justify="space-between" alignItems="center">
                        <Typography
                            color="primary"
                            display="block"
                            variant="body1">
                            Relation Type:
                        </Typography>
                        <TextField 
                        variant='outlined' 
                        size='small' 
                        value={this.state.relation_type}
                        style={{width:'50%',marginBottom:15}} 
                        InputLabelProps={
                        {   className: this.props.THIS.props.classes.textfield_label}}
                        InputProps={{
                            className: this.props.THIS.props.classes.valueTextField,
                            classes:{
                                root:this.props.THIS.props.classes.root,
                                notchedOutline: this.props.THIS.props.classes.valueTextField,
                                disabled: this.props.THIS.props.classes.valueTextField
                            },
                        }}/>
                    </Grid>
                    <Grid container direction="row" justify="space-around" alignItems="center">
                        <Typography
                            color="primary"
                            display="block"
                            style={{marginBottom:15}} 
                            variant="body1">
                            URL List
                        </Typography>
                        <Typography
                            color="primary"
                            display="block"
                            style={{marginBottom:15}} 
                            variant="body1">
                            Attached File List
                        </Typography>
                    </Grid>
                    <Grid container direction="row" justify="space-around" alignItems="center">
                        <TextField         
                            variant='outlined' 
                            size='small'
                            label='Search URL'                                          
                            style={{ width: '49%',marginBottom:10}}
                            value={this.state.search_url_text}
                            onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e=>{
                                    let display='none';
                                    if(e.target.value.length>0)
                                    {   display='block'}
                                    this.setState({search_url_text:e.target.value,search_url_close_btn:display});
                                    this.url_search_handler();
                                }
                            }
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
                                    <Box display={this.state.search_url_close_btn}> 
                                        <IconButton color='primary' size='small'
                                        onClick={
                                            e=>{
                                                this.setState({search_url_text:"",search_url_close_btn:'none'});
                                                this.search_url("");
                                                }}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                        <TextField         
                            variant='outlined' 
                            size='small'     
                            label='Search File'                                     
                            style={{ width: '49%',marginBottom:10}}
                            value={this.state.search_filename_text}
                            onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e=>{
                                    let display='none';
                                    if(e.target.value.length>0)
                                    {   display='block'}
                                    this.setState({search_filename_text:e.target.value,search_filename_text_close_btn:display})
                                    this.file_name_search_handler();
                                }
                            }
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
                                    <Box display={this.state.search_filename_text_close_btn}> 
                                        <IconButton color='primary' size='small'
                                        onClick={
                                            e=>
                                            {
                                                this.setState({search_filename_text:"",search_filename_text_close_btn:'none'});
                                                this.search_file("");
                                            }}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                    </Grid>
                    <Grid container direction="row" justify="space-around" alignItems="center">
                        <List className={this.props.THIS.props.classes.properties_list_class2}> 
                        {
                            this.state.url_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                        <ListItem key={item.id}>
                                            <TextField         
                                            variant='outlined' 
                                            size='small'                                          
                                            style={{ width: '85%' }}
                                            value={item.url}
                                            onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                            onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                            InputLabelProps={
                                            {   className: this.props.THIS.props.classes.textfield_label}}
                                            InputProps={{
                                                className: this.props.THIS.props.classes.valueTextField,
                                                classes:{
                                                    root:this.props.THIS.props.classes.root,
                                                    notchedOutline: this.props.THIS.props.classes.valueTextField,
                                                    disabled: this.props.THIS.props.classes.valueTextField
                                                }
                                            }}/>
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>
                                                {
                                                    window.ipcRenderer.send('copy_text',item.url);
                                                    this.props.THIS.setState({snack_bar_text:'URL copied.',snack_bar_open:true});
                                                }}>
                                                <FileCopyIcon/>
                                            </IconButton>
                                            <IconButton color='primary' size='small'
                                            onClick={e=>{window.ipcRenderer.send('open_link',item.url);}}>
                                                <OpenInBrowserIcon/>
                                            </IconButton>
                                        </ListItem>
                                    )
                                }
                            })
                        }
                        </List>
                        <List className={this.props.THIS.props.classes.properties_list_class2}> 
                        {
                            this.state.file_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                        <ListItem key={item.id}>
                                            <TextField         
                                            variant='outlined' 
                                            size='small'                                          
                                            style={{ width: '85%' }}
                                            value={item.file_name}
                                            onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                            onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                            InputLabelProps={
                                            {   className: this.props.THIS.props.classes.textfield_label}}
                                            InputProps={{
                                                className: this.props.THIS.props.classes.valueTextField,
                                                classes:{
                                                    root:this.props.THIS.props.classes.root,
                                                    notchedOutline: this.props.THIS.props.classes.valueTextField,
                                                    disabled: this.props.THIS.props.classes.valueTextField
                                                }
                                            }}/>
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    let data={
                                                        relation_id:this.state.relation_id,
                                                        file_name:item.file_name
                                                    }
                                                    window.ipcRenderer.send('open_save_file_picker',data);
                                                }}>
                                                <SaveAltIcon/>
                                            </IconButton>
                                        </ListItem>
                                    )
                                }
                            })
                        }
                        </List>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e=>{this.setState({Attached_File_Save_Dialog:false,source_name_name:'',destination_node_name:'',relation_type:'',url_list:[],file_list:[]});}} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

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