import React,{createRef} from 'react';
import {Button,Toolbar,AppBar,TextField,Grid,IconButton,Drawer,Tooltip,Popover,Typography,Slider} from '@material-ui/core';
import {DialogActions,Dialog,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import theme from './theme';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import SpeedIcon from '@material-ui/icons/Speed';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

import {add_node_relation_props_func,relation_node_properties_panel} from './relation_and_node_properites_panel.js';
import {add_add_panel_func,add_panel} from './add_panel.js'
import {add_network_func,Add_Network} from './network.js';

const useStyles = (theme)=>
({
    gridDrawer:
    {
        paddingLeft:'52px',
        paddingRight:'2px',
        paddingTop:'2px'
    },
    textfield_background:
    {   background: "#00404B"},
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
    notchedOutline: {},
    list_class:{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
    },
    properties_list_class:{
        height: "25vh",
        width: '100%',
        position: 'relative',
        overflow: 'auto',
        border:'1px solid #03DAC5'
    },
    formControl: {
        minWidth: '100%',
    },
    formControl2: {
        minWidth: '70%',
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
    drawerPaper:{//for the item side pannel
        width: 50,
        background: '#242527'
    },
    drawerPaper2:{//for each item drawer 
        width: 320,
        background: '#191919',
    },
    divider:{
        background:'#03DAC5'
    },
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

var type_data_added=false;

class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            /*Drawer Settings*/
            add_drawer_open:false,
            add_icon_color:'primary',
            search_drawer_open:false,
            operation_drawer_open:false,
            relation_node_properties_drawer_open:true,
            relation_node_properties_icon_color:'primary',
            color_picker_hex_value:"#03DAC5",
            collaborate_drawer_open:false,
            
            /*Node data */
            node_data_list:[],
            new_node_name:"",
            new_node_name_close_button_visible:'none',
            new_node_type:"",
            add_button_text:'Add',
            disable_add_button:false,
            matched_node:undefined,
            edit_node_name_box_visible:'none',
            edit_node_name_close_button:'none',
            edit_node_name:'',

            /*Relation Data*/
            relation_data_list:[],
            source_node:"",
            destination_node:"",
            new_relation_type:"",
            source_url:"",
            source_url_close_button_visible:'none',
            source_url_list:[],
            file_dir:"",
            file_dir_list:[],
            grouped_relation_search:"",//will bw used later
            edit_relation_id:'',
            edit_mode_on:false,
            relation_add_button_text:'Add',
            disable_relation_add_button:false,
            vectored_relation:false,
            /*type data */
                /*Node Type */
            node_type_data_list:[],
            node_type_name_edit:"",
            node_type_search_close_button_visible:"none",
            node_type_name:"",
            edit_node_type_box_visible:'none',
            add_node_type_button_text:'Add',
            disable_add_node_type_button:false,
            edit_node_type:undefined,
            edit_node_type_name_close_button_visible:'none',
                /*Relation Type */
            relation_type_data_list:[],
            relation_type_search_text:"",
            relation_type_search_close_button_visible:"none",
            relation_type_name:"",
            /*Dialog Box Settings*/
            permission_dialog_open:false,
            permission_dialog_text:"",
            alert_dialog_open:false,
            alert_dialog_text:"",
            /*Other UI components*/
            //search_node_bar:'', 
            net_ref:createRef(),
            open_network_popup:false,
            network_popup_top:100,
            network_popup_bottom:100,
            open_speed_popover:false,
            speed_popover_anchor:'',
            keyboard_zoom:0.05,
            mouse_zoom:1,
            navigation_speed:10,

            context_menu_list:[],
        };
        this.network = {};

        this.context_node_id=-1;
        this.context_node_name="";

        this.context_edge_id=-1;
        this.source_node_name="";
        this.destination_node_name="";
        
        //this.ctrlKey=false;

        this.handle_drawer=this.handle_drawer.bind(this);
        this.color_picker_handler=this.color_picker_handler.bind(this);
        this.add_main_window_data=this.add_main_window_data.bind(this);
        
        this.permission_dialog_options=this.permission_dialog_options.bind(this);
        this.permission_dialog_yes_clicked=this.permission_dialog_yes_clicked.bind(this);

        this.rgbToHex=this.rgbToHex.bind(this);
        this.getRndInteger=this.getRndInteger.bind(this);

        add_node_relation_props_func(Main);
        add_add_panel_func(Main);
        add_network_func(Main);
    }

    add_relation_ref=createRef();
    add_node_ref=createRef();
    
    delete_node_type_id=-1;
    delete_node_type_name="";

    delete_relation_type_id=-1;
    delete_relation_type_name="";
    
    delete_node_id=-1;
    delete_node_name="";

    delete_relation_id=-1;
    delete_relation_source_node_name="";
    delete_relation_destination_node="";
    delete_relation_type="";

    match_found_at=-1;//for edit node
    match_found_at2=-1;//for edit node type

    source_node_id=-1;
    destination_node_id=-1;
    relation_type_id=-1;
    url_list=[];
    source_local=[];

    reset_context_menu_settings()
    {
        this.context_node_id=-1;
        this.context_node_name="";

        this.context_edge_id=-1;
        this.source_node_name="";
        this.destination_node_name="";
    }

    sleep(time) 
    {   return new Promise((resolve) => setTimeout(resolve, time));}

    scroll_to_location(drawer_id,section_id)
    {   
        if(!this.check_if_drawer_is_open(drawer_id))
        {   this.handle_drawer(drawer_id);}
        if(section_id==0)
        {
            this.add_node_ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            this.search_node_name(this.context_node_name);
            this.setState({
                new_node_name:this.context_node_name,
                source_node:'',
                destination_node:'',
                new_relation_type:''
            });
            this.edit_relation_switch_toggle(false);
        }
        else if(section_id==1)
        {
            this.add_relation_ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            this.search_node_name("");
            var obj=this.get_node_indexes_from_edge_id(this.context_edge_id);
            this.setState({
                new_node_name:"",
                source_node:this.state.node_data_list[obj.from_node_index],
                destination_node:this.state.node_data_list[obj.to_node_index],
                new_relation_type:obj.relation_type
            });
            this.edit_relation_switch_toggle(true);   
        }
        this.reset_context_menu_settings();
    }

    color_picker_handler(color)
    {
        this.setState({
            color_picker_hex_value:color
        });
    }

    rgbToHex(r, g, b) 
    {   return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);}

    getRndInteger(min, max) 
    {   return Math.floor(Math.random() * (max - min) ) + min;}

    check_if_drawer_is_open(drawer_id)
    {
        if(drawer_id==0)
        {   return this.state.add_drawer_open;}
        else if(drawer_id==1)
        {   return this.state.search_drawer_open;}
        else if(drawer_id==2)
        {   return this.state.operation_drawer_open;}
        else if(drawer_id==3)
        {   return this.state.relation_node_properties_drawer_open;}
        else if(drawer_id==4)
        {   return this.state.collaborate_drawer_open;}
    }

    handle_drawer(drawer_id)
    {
        if(drawer_id==0)
        {
            var color;
            if(this.state.add_drawer_open)
            {   color='primary';}
            else
            {   color='secondary'}
            this.setState({
                add_drawer_open:!this.state.add_drawer_open,
                add_icon_color:color,
                search_drawer_open:false,
                operation_drawer_open:false,
                relation_node_properties_drawer_open:false,
                relation_node_properties_icon_color:'primary',
                collaborate_drawer_open:false,
            });
        }
        else if(drawer_id==3)
        {
            var color;
            if(this.state.relation_node_properties_drawer_open)
            {   color='primary';}
            else
            {   color='secondary'}
            this.setState({
                add_drawer_open:false,
                add_icon_color:'primary',
                search_drawer_open:false,
                operation_drawer_open:false,
                relation_node_properties_drawer_open:!this.state.relation_node_properties_drawer_open,
                relation_node_properties_icon_color:color,
                collaborate_drawer_open:false,

                color_picker_hex_value:this.rgbToHex(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255))
            });
        }
    }

    permission_dialog_purpose_code=0;
    permission_dialog_yes_clicked()
    {
        this.setState({
            permission_dialog_open:false,
        });
        if(this.permission_dialog_purpose_code==1)
        {   this.delete_node_type();}
        else if(this.permission_dialog_purpose_code==2)
        {   this.Delete_Relation_Type();}
        else if(this.permission_dialog_purpose_code==3)
        {   this.delete_node();}
        else if(this.permission_dialog_purpose_code==4)
        {   this.delete_relation();}
        this.permission_dialog_purpose_code=0;
    }

    permission_dialog_options(option)
    {   
        if(option===1)
        {   
            if(this.permission_dialog_purpose_code==1)
            {   this.setState({permission_dialog_open:true,permission_dialog_text:"Do you want to delete the Node Type '"+this.delete_node_type_name+"' ?"});}
            else if(this.permission_dialog_purpose_code==2)
            {   this.setState({permission_dialog_open:true,permission_dialog_text:"Do you want to delete the Relation Type '"+this.delete_relation_type_name+"' ?"});}
            else if(this.permission_dialog_purpose_code==3)
            {   this.setState({permission_dialog_open:true,permission_dialog_text:"Do you want to delete the Node '"+this.delete_node_name+"' ?"});}
            else if(this.permission_dialog_purpose_code==4)
            {   this.setState({permission_dialog_open:true,permission_dialog_text:"Do you want to delete the relation '"+this.delete_relation_source_node_name+"' to '"+this.delete_relation_destination_node+"' of type: '"+this.delete_relation_type+"' ?"});}
        }
        else if(option===0)
        {   
            if(this.permission_dialog_purpose_code==1)
            {
                this.delete_node_type_id=-1;
                this.delete_node_type_name="";
            }
            else if(this.permission_dialog_purpose_code==2)
            {
                this.delete_relation_type_id=-1;
                this.delete_relation_type_name="";
            }
            else if(this.permission_dialog_purpose_code==3)
            {
                this.delete_node_id=-1;
                this.delete_node_name="";
            }
            else if(this.permission_dialog_purpose_code==4)
            {
                this.delete_relation_id=-1;
                this.delete_relation_source_node_name="";
                this.delete_relation_destination_node="";
                this.delete_relation_type="";
            }
            this.permission_dialog_purpose_code=0;
            this.setState({permission_dialog_open:false,permission_dialog_text:""});
        }
    }

    add_main_window_data(data)
    {
        if(!type_data_added)
        {
            type_data_added=true;
            var a;
            for(a=0;a<data.node_type_list.length;a++)
            {   data.node_type_list[a].show=true;}
            for(a=0;a<data.relation_type_list.length;a++)
            {   data.relation_type_list[a].show=true;}

            for(a=0;a<data.node_list.length;a++)
            {   data.node_list[a].show=true;}
            
            this.setState({
                node_type_data_list:data.node_type_list,
                relation_type_data_list:data.relation_type_list,
                node_data_list:data.node_list,
                relation_data_list:data.relation_list
            });
            this.create_full_network();
        }
    }
    
    componentDidMount() 
    {  
        window.ipcRenderer.on('test_upper',(event,data)=>
        {   
            var a=0;
            var text="";
            for(a=0;a<this.state.relation_data_list.length;a++)
            {
                text+=("id="+this.state.relation_data_list[a].relation_id+" s="+this.state.relation_data_list[a].source_node_id+" d="+this.state.relation_data_list[a].destination_node_id+"\n")
            }
            alert(text);
            alert("fin="+this.state.relation_data_list.length)
        });

        window.ipcRenderer.on('last_entered_relation',(event,data)=>
        {   this.add_new_relation_body(data);});

        window.ipcRenderer.on('last_entered_node',(event,data)=>
        {   this.add_new_node_body(data);});

        window.ipcRenderer.on('add_file_dir',(event,data)=>
        {   this.add_file_dir(data);});

        this.init_network();

        /*document.onkeydown=function(e){
            if(e.ctrlkey==true && this.ctrlKey==false)
            {   this.ctrlKey=true;}
        }
        document.onkeyup=function(e){
            if(e.key.localeCompare("Control")==0 && this.ctrlKey==true)
            {   this.ctrlKey=false;}
        }*/
    }
    
    render()
    {
        window.ipcRenderer.on('main_window_data_received',(event,data)=>
        {   this.add_main_window_data(data);});

        var dummy="";
        window.ipcRenderer.send('get_main_window_data', dummy);
        
        return(
        <ThemeProvider theme={theme}>
            <header className="Main_Style">
                {/*-----------------------------------------Dialogs----------------------------------------------------- */ }
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
                {/*Permission Dialog*/}
                <Dialog
                    open={this.state.permission_dialog_open}
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
                            <span style={{color: 'white'}}>{this.state.permission_dialog_text}</span>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={e=>{this.permission_dialog_yes_clicked()}} color="primary">
                            Yes
                        </Button>
                        <Button onClick={e=>{this.permission_dialog_options(0);}} color="primary">
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
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
                    this.set_speed();
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
                {/*-----------------------------------------App Bar--------------------------------------------------- */ }
                <AppBar  style={{ background: '#242527',paddingLeft: 40 }} className={this.props.classes.appBar}>
                    <Toolbar variant="dense">
                        <Grid container direction="column"  spacing={2} xs={6} alignItems="left">
                        <Autocomplete  
                        classes={this.props.classes}
                        options={this.state.node_data_list}
                        getOptionLabel={(option) => option.node_name}
                        style={{ width:'100%',paddingLeft:'1px',paddingRight:'1px'}}
                        size="small"
                        //value={this.state.search_node_bar}
                        onChange={(event,value)=>
                            {
                                //this.setState({search_node_bar:value});
                                if(value!=null)
                                {   this.focus_on_node(value.node_id);}
                            }}
                        renderInput=
                        {
                            (params) => 
                                <TextField 
                                {...params} 
                                label="Search Nodes" variant="filled" 
                                className={this.props.classes.textfield_background}
                                InputLabelProps=
                                {{   
                                    ...params.InputLabelProps,
                                    className: this.props.classes.textfield_label
                                }}
                                />
                        }
                        />
                        </Grid>
                        <Grid container direction="row" spacing={2} xs={6} alignItems="center" justify="flex-end">
                            <Tooltip title="Center Focus">
                                <IconButton color="primary"
                                onClick={
                                    e=>{this.center_focus();}
                                }>
                                    <CenterFocusStrongIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Navigation Speed">
                                <IconButton color="primary"
                                onClick={
                                    e=>{
                                        //window.ipcRenderer.send('test_lower',"");
                                        this.setState(
                                        {
                                            open_speed_popover:true,
                                            speed_popover_anchor:e.target,
                                        });
                                    }
                                }>
                                    <SpeedIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Toolbar>
                </AppBar>
                {/*-------------------------------------------------Add panel------------------------------------------------------ */ }
                {add_panel(this)}
                {/*----------------------------------------Relation & node properties-------------------------------------------------------- */ }
                {relation_node_properties_panel(this)}
                {/*------------------------------------------------Side Bar-------------------------------------------------------- */ }
                <Drawer variant="permanent" className={this.props.classes.drawer}
                 classes={{paper: this.props.classes.drawerPaper,}}>
                    <Toolbar variant="dense"/>
                    <Grid container direction="column"   xs={1} alignItems="center" justify="flex-start">
                        <Tooltip title="Add Node or Relation">
                            <IconButton color={this.state.add_icon_color} onClick={()=>this.handle_drawer(0)}>
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
                            <IconButton color={this.state.relation_node_properties_icon_color} onClick={()=>this.handle_drawer(3)}>
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
                {Add_Network(this)}
            </header>
        </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Main);