import React,{createRef} from 'react';
import {Button,Snackbar,SnackbarContent,Toolbar,AppBar,TextField,Grid,IconButton,Tooltip} from '@material-ui/core';
import {DialogActions,Dialog,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import theme from './theme';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import SpeedIcon from '@material-ui/icons/Speed';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import {add_node_relation_props_func,Relation_Node_Properties_Panel} from './relation_and_node_properites_panel.js';
import {add_add_panel_func,Add_Panel} from './add_panel.js'
import {add_network_func,Add_Network} from './network.js';
import {add_operations_func,Add_Operations_Panel} from './operations_panel.js'
import {Side_Bar_Buttons,Speed_Menu,Change_Password_Dialog,Attached_File_Save_UI} from './other_ui_components.js';

const useStyles = (theme)=>
({
    gridDrawer:
    {
        paddingLeft:'52px',
        paddingRight:'2px',
        paddingTop:'10px'
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
        border:'1px solid #03DAC5',
        marginBottom:15,
    },
    properties_list_class2:{
        height: "25vh",
        width: '49%',
        position: 'relative',
        overflow: 'auto',
        border:'1px solid #03DAC5',
        marginBottom:15,
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

class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            /*Drawer Settings*/
            //search_drawer_open:false,
            //collaborate_drawer_open:false,
            /*Node data */
            node_data_list:[],
            /*Relation Data*/
            relation_data_list:[],
            /*type data */
            node_type_data_list:[],/*Node Type */
            relation_type_data_list:[],/*Relation Type */
            /*Dialog Box Settings*/
            permission_dialog_open:false,
            permission_dialog_text:"",
            alert_dialog_open:false,
            alert_dialog_text:"",
            /*Other UI components*/
            open_network_popup:false,
            snack_bar_text:'',
            snack_bar_open:false
        };

        this.net_ref=createRef();
        this.context_menu_list=[];
        this.network = {};
        this.color_changed_node_id=[];
        this.cluster_id_list=[];
        this.cluster_id_with_nodes=[];

        this.context_node_id=-1;
        this.context_node_name="";

        this.context_edge_id=-1;
        this.source_node_name="";
        this.destination_node_name="";
        
        //this.ctrlKey=false;

        this.handle_drawer=this.handle_drawer.bind(this);
        this.add_main_window_data=this.add_main_window_data.bind(this);
        
        this.permission_dialog_options=this.permission_dialog_options.bind(this);
        this.permission_dialog_yes_clicked=this.permission_dialog_yes_clicked.bind(this);

        this.rgbToHex=this.rgbToHex.bind(this);
        this.getRndInteger=this.getRndInteger.bind(this);
        this.get_filename_from_path=this.get_filename_from_path.bind(this);

        add_node_relation_props_func(Main);
        add_operations_func(Main);
        add_add_panel_func(Main);
        add_network_func(Main);
    }

    add_relation_ref=createRef();
    add_node_ref=createRef();
    add_panel_ref=createRef();
    properties_panel_ref=createRef();
    operations_panel_ref=createRef();
    side_bar_ref=createRef();
    speed_menu_ref=createRef();
    password_dialog_ref=createRef();
    attached_file_dialog_ref=createRef();
    //CURRENTLY THE TYPE IDS CA BE SHIFTED IN THE PROPERTIES PANEL, BUT MAYBE IN FUTURE THEY MIGHT BE REQUIRED FOR COMMUNICATING WITH THE NETWORK
    delete_node_type_id=-1;
    delete_node_type_name="";

    delete_relation_type_id=-1;
    delete_relation_type_name="";
    //DELETE IDS CANNOT BE SHIFTER FROM HERE
    delete_node_id=-1;
    delete_node_name="";

    delete_relation_id=-1;
    delete_relation_source_node_name="";
    delete_relation_destination_node="";
    delete_relation_type="";

    source_node_id=-1;
    destination_node_id=-1;
    relation_type_id=-1;

    get_filename_from_path(path)
    {
        let file_name="";
        for(let a=path.length-1;a>=0;a--)
        {
            if(path[a].localeCompare("/")!=0)
            {   file_name=path[a]+file_name;}
            else
            {   break;}
        }
        return file_name;
    }

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
            this.add_panel_ref.current.search_node_name(this.context_node_name);
            this.add_panel_ref.current.setState({
                new_node_name:this.context_node_name,
                source_node:'',
                destination_node:'',
                new_relation_type:''
            });
            this.add_panel_ref.current.edit_relation_switch_toggle(false);
        }
        else if(section_id==1)
        {
            this.add_relation_ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            this.add_panel_ref.current.search_node_name("");
            var obj=this.get_node_indexes_from_edge_id(this.context_edge_id);
            this.add_panel_ref.current.setState({
                new_node_name:"",
                source_node:this.state.node_data_list[obj.from_node_index],
                destination_node:this.state.node_data_list[obj.to_node_index],
                new_relation_type:obj.relation_type
            });
            this.add_panel_ref.current.edit_relation_switch_toggle(true);   
        }
        this.reset_context_menu_settings();
    }

    rgbToHex(r, g, b) 
    {   return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);}

    getRndInteger(min, max) 
    {   return Math.floor(Math.random() * (max - min) ) + min;}

    check_if_drawer_is_open(drawer_id)
    {
        if(drawer_id==0)
        {   return this.add_panel_ref.current.state.add_drawer_open;}
        //else if(drawer_id==1)
        //{   return this.state.search_drawer_open;}
        else if(drawer_id==2)
        {   return this.operations_panel_ref.current.state.operation_drawer_open;}
        else if(drawer_id==3)
        {   return this.properties_panel_ref.current.state.relation_node_properties_drawer_open;}
        //else if(drawer_id==4)
        //{   return this.state.collaborate_drawer_open;}
        else
        {   return false;}
    }

    handle_drawer(drawer_id)
    {
        if(drawer_id==0)
        {
            var color;
            if(this.add_panel_ref.current.state.add_drawer_open)
            {   color='primary';}
            else
            {   color='secondary'}
            this.side_bar_ref.current.setState({
                add_icon_color:color,
                operation_drawer_color:'primary',
                relation_node_properties_icon_color:'primary',
            });
            this.add_panel_ref.current.setState({add_drawer_open:!this.add_panel_ref.current.state.add_drawer_open,});
            this.operations_panel_ref.current.setState({operation_drawer_open:false,});
            this.properties_panel_ref.current.setState({relation_node_properties_drawer_open:false,});
        }
        else if(drawer_id==2)
        {
            var color;
            if(this.operations_panel_ref.current.state.operation_drawer_open)
            {   color='primary';}
            else
            {   color='secondary'}
            this.side_bar_ref.current.setState({
                add_icon_color:'primary',
                operation_drawer_color:color,
                relation_node_properties_icon_color:'primary',
            });
            this.add_panel_ref.current.setState({add_drawer_open:false,});
            this.operations_panel_ref.current.setState({operation_drawer_open:!this.operations_panel_ref.current.state.operation_drawer_open,});
            this.properties_panel_ref.current.setState({relation_node_properties_drawer_open:false,});
            this.operations_panel_ref.current.setState({cluster_color:this.rgbToHex(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255))});
        }
        else if(drawer_id==3)
        {
            var color;
            if(this.properties_panel_ref.current.state.relation_node_properties_drawer_open)
            {   color='primary';}
            else
            {   color='secondary'}
            this.side_bar_ref.current.setState({
                add_icon_color:'primary',
                operation_drawer_color:'primary',
                relation_node_properties_icon_color:color,
            });
            this.add_panel_ref.current.setState({add_drawer_open:false,});
            this.operations_panel_ref.current.setState({operation_drawer_open:false,});
            this.properties_panel_ref.current.setState({ relation_node_properties_drawer_open:!this.properties_panel_ref.current.state.relation_node_properties_drawer_open,});
            this.properties_panel_ref.current.setState({color_picker_hex_value:this.rgbToHex(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255))});
        }
    }

    permission_dialog_purpose_code=0;
    permission_dialog_yes_clicked()
    {
        this.setState({
            permission_dialog_open:false,
        });
        if(this.permission_dialog_purpose_code==1)
        {   this.properties_panel_ref.current.delete_node_type();}
        else if(this.permission_dialog_purpose_code==2)
        {   this.properties_panel_ref.current.Delete_Relation_Type();}
        else if(this.permission_dialog_purpose_code==3)
        {   this.add_panel_ref.current.delete_node();}
        else if(this.permission_dialog_purpose_code==4)
        {   this.add_panel_ref.current.delete_relation();}
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
    
    componentDidMount() 
    {  
        window.ipcRenderer.on('file_saved',(event,data)=>
        {   this.setState({snack_bar_text:'File '+data+' Saved.',snack_bar_open:true})});

        window.ipcRenderer.on('attach_failed_files',(event,data)=>
        {  
            let msg="Failed to attach the following files:- ";
            for(let a=0;a<data.length;a++)
            {   msg=msg+(a+1)+". "+data[a].file_name+", ";}
            msg=msg+" because they are larger than 100 MB."
            this.setState({
                alert_dialog_text:msg,
                alert_dialog_open:true
            });
        });

        window.ipcRenderer.on('find_mst',(event,data)=>
        {   this.highlight_mst(data,this.operations_panel_ref.current.state.mst_node_list);});

        window.ipcRenderer.on('shortest_path',(event,data)=>
        {   this.highlight_path(data,this.operations_panel_ref.current.state.shortest_path_node_source,this.operations_panel_ref.current.state.shortest_path_node_destination);});

        window.ipcRenderer.on('main_window_data_received',(event,data)=>
        {   this.add_main_window_data(data);});

        window.ipcRenderer.on('last_entered_relation',(event,data)=>
        {   this.add_new_relation_body(data);});

        window.ipcRenderer.on('last_entered_node',(event,data)=>
        {   this.add_new_node_body(data);});

        window.ipcRenderer.on('add_file_dir',(event,data)=>
        {   this.add_panel_ref.current.add_file_dir(data);});

        window.ipcRenderer.on('change_pass_dialog',(event,data)=>
        {   this.password_dialog_ref.current.setState({
            change_pass_dialog:true,
            current_pass:'',
            new_pass1:'',
            new_pass2:'',
            new_pass1_close_btn_show:'none',
            new_pass2_close_btn_show:'none',
            current_pass_close_btn_show:'none'
        })});

        window.ipcRenderer.on('password_change_status',(event,data)=>
        {      
            if(data.error_code!=-1)
            {
                this.setState({
                    alert_dialog_text:data.error_statement,
                    alert_dialog_open:true
                });
            }
            else
            {   
                this.password_dialog_ref.current.setState({change_pass_dialog:false,current_pass:'',new_pass1:'',new_pass2:''});
                this.setState({snack_bar_text:'Pasword Changed.',snack_bar_open:true});
            }
        });

        var dummy="";
        window.ipcRenderer.send('get_main_window_data', dummy);

        this.init_network();
    }

    render()
    {
        return(
        <ThemeProvider theme={theme}>
            <header className="Main_Style">
                <Snackbar open={this.state.snack_bar_open} autoHideDuration={3000}
                onClose={e=>{this.setState({snack_bar_text:'',snack_bar_open:false})}}>
                    <SnackbarContent style={{backgroundColor:'#191919',color: '#03DAC5'}}
                    message={this.state.snack_bar_text}/>
                </Snackbar>
                {/*-----------------------------------------Dialogs----------------------------------------------------- */ }
                {/*Attached File Save UI*/}
                <Attached_File_Save_UI THIS={this} ref={this.attached_file_dialog_ref}/>
                {/*Password change dialog*/}
                <Change_Password_Dialog THIS={this} ref={this.password_dialog_ref}/>
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
                <Speed_Menu THIS={this} ref={this.speed_menu_ref}/>
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
                        onFocus={e=>{this.enable_keyboard_navigation(false);}}
                        onBlur={e=>{this.enable_keyboard_navigation(true);}}
                        onChange={(event,value)=>
                            {
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
                                        this.speed_menu_ref.current.setState(
                                        {
                                            open_speed_popover:true,
                                            speed_popover_anchor:e.target,
                                        });
                                    }
                                }>
                                    <SpeedIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close Database">
                                <IconButton color="primary"
                                onClick={e=>{window.ipcRenderer.send('close_db',"");}}>
                                    <PowerSettingsNewIcon/>
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Toolbar>
                </AppBar>
                {/*-------------------------------------------------Add panel------------------------------------------------------ */ }
                <Add_Panel THIS={this} ref={this.add_panel_ref}/>
                {/*---------------------------------------------Operations Panel-----------------------------------------------------*/}
                <Add_Operations_Panel THIS={this} ref={this.operations_panel_ref}/>
                {/*----------------------------------------Relation & node properties-------------------------------------------------------- */ }
                <Relation_Node_Properties_Panel THIS={this} ref={this.properties_panel_ref}/>
                {/*------------------------------------------------Side Bar-------------------------------------------------------- */ }
                <Side_Bar_Buttons THIS={this} ref={this.side_bar_ref}/>
                {Add_Network(this)}
            </header>
        </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Main);