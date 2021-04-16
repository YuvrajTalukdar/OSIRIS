import React from 'react';
import {Button,Toolbar,AppBar,TextField,Grid,IconButton,Drawer,Tooltip,Divider,List,ListItem,ListItemText,Box} from '@material-ui/core';
import {DialogActions,Dialog,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import theme from './theme';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import SpeedIcon from '@material-ui/icons/Speed';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ColorPicker from "material-ui-color-picker";

const useStyles = (theme)=>
({
    gridDrawer:
    {
        //width:'100%',
        //margin:'50px',
        paddingLeft:'52px',
        paddingRight:'2px',
        paddingTop:'2px'
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
    notchedOutline: {},
    list_class:{
        width: '100%',
        position: 'relative',
        overflow: 'auto',
    },
    properties_list_class:{
        height: "35vh",
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
});

var main_window_data_request_sent=false;
var type_data_added=false;

class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            /*Drawer Settings*/
            add_drawer_open:true,
            add_icon_color:'primary',
            search_drawer_open:false,
            operation_drawer_open:false,
            relation_node_properties_drawer_open:false,
            relation_node_properties_icon_color:'primary',
            color_picker_hex_value:"#03DAC5",
            collaborate_drawer_open:false,
            
            /*Node data */
            node_data_list:[],
            new_node_name:"",
            new_node_name_close_button_visible:'none',
            new_node_type:"",
            /*Relation Data*/
            relation_data_list:[],
            /*type data */
            /*Node Type */
            node_type_data_list:[],
            node_type_search_text:"",
            node_type_search_close_button_visible:"none",
            node_type_name:"",
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
        };
        this.handle_drawer=this.handle_drawer.bind(this);
        this.color_picker_handler=this.color_picker_handler.bind(this);
        this.add_main_window_data=this.add_main_window_data.bind(this);
        
        this.permission_dialog_options=this.permission_dialog_options.bind(this);
        this.permission_dialog_yes_clicked=this.permission_dialog_yes_clicked.bind(this);
        
        this.delete_node_type=this.delete_node_type.bind(this);
        this.add_node_type=this.add_node_type.bind(this);
        this.search_node_type=this.search_node_type.bind(this);

        this.add_relation_type=this.add_relation_type.bind(this);
        this.search_relation_type=this.search_relation_type.bind(this);
        this.delete_relation_type=this.delete_relation_type.bind(this);

        this.rgbToHex=this.rgbToHex.bind(this);
        this.getRndInteger=this.getRndInteger.bind(this);

        this.add_new_node=this.add_new_node.bind(this);
        this.add_new_node_body=this.add_new_node_body.bind(this);
        this.search_node_name=this.search_node_name.bind(this);
        this.delete_node=this.delete_node.bind(this);

        this.add_new_relation=this.add_new_relation.bind(this);

        this.listeners=this.listeners.bind(this);
        this.listeners();
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

    add_node_type()
    {
        const node_type_list=[...this.state.node_type_data_list];
        
        var found=false;
        for(var a=0;a<node_type_list.length;a++)
        {
            if(node_type_list[a].node_type.toUpperCase().localeCompare(this.state.node_type_name.toUpperCase())==0)
            {   found=true;break;}
        }
        if(!found)
        {
            var data={node_or_relation:0,type:this.state.node_type_name,color_code:""};
            window.ipcRenderer.send('add_node_relation_type',data);
            const newData={
                id:node_type_list[node_type_list.length-1].id+1,
                node_type:this.state.node_type_name.toUpperCase(),
                show:true,
            }
            node_type_list.push(newData);
            this.search_node_type("");
            this.setState({
                node_type_data_list:node_type_list
            })
        }
        else
        {
            if(this.state.node_type_name.length==0)
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a node type name!"});}
            else
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Node type already present!"});}
        }
    }

    delete_node_type_id=-1;
    delete_node_type_name="";
    delete_node_type()
    {
        const node_type_list=[...this.state.node_type_data_list];
        const new_node_type_list=node_type_list.filter(item=>item.id!=this.delete_node_type_id);
        
        var data={
            'id':this.delete_node_type_id,
            'node_or_relation':0
        }
        window.ipcRenderer.send('delete_node_relation_type',data);
        this.delete_node_type_id=-1;
        this.delete_node_type_name="";
        this.setState({
            node_type_data_list:new_node_type_list
        });
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
        {   this.delete_relation_type();}
        else if(this.permission_dialog_purpose_code==3)
        {   this.delete_node();}
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
            this.permission_dialog_purpose_code=0;
            this.setState({permission_dialog_open:false,permission_dialog_text:""});
        }
    }

    search_node_type(data)
    {
        if(data.length>0)
        {   this.setState({node_type_search_close_button_visible:"block"});}
        else
        {   this.setState({node_type_search_close_button_visible:"none"});}

        const node_type_list=[...this.state.node_type_data_list];
        for(var a=0;a<node_type_list.length;a++)
        {
            if(node_type_list[a].node_type.toUpperCase().includes(data.toUpperCase()))
            {   node_type_list[a].show=true;}
            else
            {   node_type_list[a].show=false;}
            this.setState({
                node_type_data_list:node_type_list
            });
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
        }
    }

    delete_relation_type_id=-1;
    delete_relation_type_name="";
    delete_relation_type()
    {
        const relation_type_list=[...this.state.relation_type_data_list];
        const new_relation_type_list=relation_type_list.filter(item=>item.id!=this.delete_relation_type_id);

        var data={
            'id':this.delete_relation_type_id,
            'node_or_relation':1
        }
        window.ipcRenderer.send('delete_node_relation_type',data);
        this.delete_relation_type_id=-1
        this.delete_relation_type_name="";
        this.setState({
            relation_type_data_list:new_relation_type_list
        });
    }

    search_relation_type(data)
    {
        if(data.length>0)
        {   this.setState({relation_type_search_close_button_visible:"block"});}
        else
        {   this.setState({relation_type_search_close_button_visible:"none"});}
        
        const relation_type_list=[...this.state.relation_type_data_list];
        for(var a=0;a<relation_type_list.length;a++)
        {
            if(relation_type_list[a].relation_type.toUpperCase().includes(data.toUpperCase()))
            {   relation_type_list[a].show=true;}
            else
            {   relation_type_list[a].show=false;}
            this.setState({
                relation_type_data_list:relation_type_list
            });
        }
    }

    add_relation_type()
    {
        const relation_type_list=[...this.state.relation_type_data_list];

        var found=false;
        for(var a=0;a<relation_type_list.length;a++)
        {
            if(relation_type_list[a].relation_type.toUpperCase().localeCompare(this.state.relation_type_name.toUpperCase())==0)
            {   found=true;break;}
        }
        if(!found)
        {
            var data={node_or_relation:1,type:this.state.relation_type_name,color_code:this.state.color_picker_hex_value};
            window.ipcRenderer.send('add_node_relation_type',data);
            const newData={
                id:relation_type_list[relation_type_list.length-1].id+1,
                relation_type:this.state.relation_type_name.toUpperCase(),
                color_code:this.state.color_picker_hex_value,
                show:true,
            }
            relation_type_list.push(newData);
            this.search_relation_type("");
            this.setState({
                relation_type_data_list:relation_type_list
            })
        }
        else
        {
            if(this.state.relation_type_name.length==0)
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a relation type name!"});}
            else
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Relation type already present!"});}
        }
    }

    delete_node_id=-1;
    delete_node_name="";
    delete_node()
    {
        const node_data_list=[...this.state.node_data_list];
        const new_node_data_list=node_data_list.filter(item=>item.node_id!=this.delete_node_id);

        window.ipcRenderer.send('delete_node',this.delete_node_id);

        this.delete_node_id=-1;
        this.delete_node_name="";

        this.setState({
            node_data_list:new_node_data_list
        });
    }

    search_node_name(data)
    {
        if(data.length>0)
        {   this.setState({new_node_name_close_button_visible:"block"});}
        else
        {   this.setState({new_node_name_close_button_visible:"none"});}

        const node_data_list=[...this.state.node_data_list];
        for(var a=0;a<node_data_list.length;a++)
        {
            if(node_data_list[a].node_name.toUpperCase().includes(data.toUpperCase()))
            {   node_data_list[a].show=true;}
            else
            {   node_data_list[a].show=false;}
            this.setState({
                node_data_list:node_data_list
            });
        }
    }

    add_new_node_body(last_entered_node)
    {
        const node_data_list=[...this.state.node_data_list];
        node_data_list.push(last_entered_node);
        this.setState({
            node_data_list:node_data_list
        });
    }

    add_new_node()
    {
        if(this.state.new_node_name.length==0)
        {
            this.setState({
                alert_dialog_text:"Node Name not entered!",
                alert_dialog_open:true
            });
        }
        else if(typeof this.state.new_node_type.node_type=='undefined')
        {
            this.setState({
                alert_dialog_text:"Node Type not selected!",
                alert_dialog_open:true
            });
        }
        else
        {   
            const node_data_list=[...this.state.node_data_list];
            var found=false;
            for(var a=0;a<node_data_list.length;a++)
            {
                if(node_data_list[a].node_name.toUpperCase().localeCompare(this.state.new_node_name.toUpperCase())==0)
                {   found=true;break;}
            }
            if(found)
            {   
                this.setState({
                    alert_dialog_text:"Node Name "+this.state.new_node_name+" already present!",
                    alert_dialog_open:true
                })
            }
            else
            {   
                var new_node={
                    'node_type_id':this.state.new_node_type.id,
                    'node_name':this.state.new_node_name
                };
                window.ipcRenderer.send('add_new_node',new_node);
            }
        
        }
    }

    add_new_relation()
    {
        
    }

    listeners()
    {
        window.ipcRenderer.on('last_entered_node',(event,data)=>
        {   this.add_new_node_body(data);});
    }

    render()
    {
        window.ipcRenderer.on('main_window_data_received',(event,data)=>
        {   this.add_main_window_data(data);});

        if(!main_window_data_request_sent)
        {
            var dummy="";
            window.ipcRenderer.send('get_main_window_data', dummy);
            main_window_data_request_sent=true;
        }
        return(
        <ThemeProvider theme={theme}>
            <header className="Settings-Style">
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
                {/*-----------------------------------------App Bar--------------------------------------------------- */ }
                <AppBar  style={{ background: '#242527',paddingLeft: 40 }} className={this.props.classes.appBar}>
                    <Toolbar variant="dense">
                        <Grid container direction="column"  spacing={2} xs={6} alignItems="left">
                            <TextField 
                                id="SearchSettingsTextField" 
                                label='Search Nodes' 
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
                {/*-------------------------------------------------Add panel------------------------------------------------------ */ }
                <Drawer variant="persistent"
                 anchor="left"
                 open={this.state.add_drawer_open}
                 className={this.props.classes.drawer}
                 classes={{paper: this.props.classes.drawerPaper2,}}>
                    <Toolbar variant="dense"/>
             
                    <Grid container direction="column" className={this.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                        <List className={this.props.classes.list_class}> 
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                New Node
                                </Typography>
                            </Grid>
                            <ListItem>
                                <TextField 
                                label='New Node Name'
                                variant='outlined' 
                                size='small' 
                                value={this.state.new_node_name}
                                onChange={
                                    e => {
                                        this.setState({new_node_name:e.target.value});
                                        this.search_node_name(e.target.value);
                                    }}                                            
                                style={{width:300}} 
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
                                        <Box display={this.state.new_node_name_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={
                                                e=>{
                                                    this.search_node_name("");
                                                    this.setState({new_node_name:""})
                                                }
                                            }>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box> 
                                    ),
                                }}/>
                            </ListItem>
                            <ListItem>
                                <List className={this.props.classes.properties_list_class}>
                                {
                                    this.state.node_data_list.map(item=>
                                    {
                                        if(item.show)
                                        {
                                            return(
                                                <ListItem button key={item.node_id}>
                                                    <ListItemText primary={<Typography type="body2" style={{ color:'#FFFFFF'}}>{item.node_name}</Typography>} />
                                                    <IconButton color='primary' size='small'
                                                    onClick={
                                                        e=>{
                                                            this.delete_node_id=item.node_id;
                                                            this.delete_node_name=item.node_name;
                                                            this.permission_dialog_purpose_code=3;
                                                            this.permission_dialog_options(1);
                                                        } 
                                                    }>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }
                                    })
                                }
                                </List>
                            </ListItem>
                            <ListItem>
                                <Autocomplete
                                size="small"
                                classes={this.props.classes}
                                options={this.state.node_type_data_list}
                                getOptionLabel={(option) => option.node_type}
                                style={{ width: 300 }}
                                value={this.state.new_node_type}
                                onChange={(event,value)=>
                                    {this.setState({new_node_type:value,});}}
                                renderInput=
                                {
                                    (params) => 
                                        <TextField 
                                        {...params} label="Node Type.." variant="outlined" 
                                        InputLabelProps=
                                        {{   
                                                ...params.InputLabelProps,
                                                className: this.props.classes.textfield_label
                                        }}
                                        />
                                }
                                />
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                                 onClick={e=>{this.add_new_node();}}>Add</Button>
                            </ListItem>
                            <Divider light classes={{root:this.props.classes.divider}}/>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption"
                                    >
                                    New Relation
                                    </Typography>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        From:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.classes}
                                    size="small"
                                    options={this.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: '85%' }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Source Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        To:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.classes}
                                    size="small"
                                    options={this.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: '85%' }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Destination Node.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="space-between" alignItems="center">
                                    <Typography
                                        color="primary"
                                        display="block"
                                        variant="caption">
                                        Type:
                                    </Typography>
                                    <Autocomplete
                                    id="combo-box-demo"
                                    classes={this.props.classes}
                                    size="small"
                                    options={this.state.relation_type_data_list}
                                    getOptionLabel={(option) => option.relation_type}
                                    style={{ width: '85%' }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField {...params} label="Relation Type.." variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button variant="contained" size="small" color="primary" style={{width:'100%'}}>Add</Button>
                            </ListItem>
                        </List>
                    </Grid>
                </Drawer>
                {/*----------------------------------------Relation & node properties-------------------------------------------------------- */ }
                <Drawer variant="persistent"
                 anchor="left"
                 open={this.state.relation_node_properties_drawer_open}
                 className={this.props.classes.drawer}
                 classes={{paper: this.props.classes.drawerPaper2,}}>
                    <Toolbar variant="dense"/>
                    <Grid container direction="column" className={this.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                        <List className={this.props.classes.list_class}> 
                            <Grid container direction="row" justify="center" alignItems="center">
                                <Typography
                                color="primary"
                                display="block"
                                variant="caption">
                                Node Type
                                </Typography>
                            </Grid>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField         
                                    label='Node Type' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '79%' }}
                                    onChange={
                                        e=>{
                                            this.setState({
                                                node_type_name:e.target.value
                                            });
                                        }
                                    }
                                    InputLabelProps={
                                    {   className: this.props.classes.textfield_label}}
                                    InputProps={{
                                        className: this.props.classes.valueTextField,
                                        classes:{
                                            root:this.props.classes.root,
                                            notchedOutline: this.props.classes.valueTextField,
                                            disabled: this.props.classes.valueTextField
                                        }
                                    }}/>
                                    <IconButton color='primary'
                                     onClick={e=>{this.add_node_type();}}>
                                        <AddIcon/>
                                    </IconButton>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField         
                                    label='Search Node Types' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '100%' }}
                                    value={this.state.node_type_search_text}
                                    onChange={
                                        e=>{
                                            this.setState({
                                                node_type_search_text:e.target.value
                                            });
                                            this.search_node_type(e.target.value);
                                        }
                                    }
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
                                            <Box display={this.state.node_type_search_close_button_visible}> 
                                                <IconButton color='primary' size='small'
                                                onClick={
                                                    e=>{
                                                        this.search_node_type("");
                                                        this.setState({node_type_search_text:""})
                                                    }
                                                }>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Box> 
                                        ),
                                    }}/>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <List className={this.props.classes.properties_list_class}>
                                {
                                    this.state.node_type_data_list.map(item=>
                                    {
                                        if(item.show)
                                        {
                                            return(
                                            <ListItem button key={item.id}>
                                                <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{item.node_type}</Typography>} />
                                                <IconButton color='primary' size='small'
                                                 onClick={
                                                    e=>{
                                                        this.delete_node_type_id=item.id;
                                                        this.delete_node_type_name=item.node_type;
                                                        this.permission_dialog_purpose_code=1;
                                                        this.permission_dialog_options(1);
                                                    } 
                                                 }>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItem>
                                            );
                                        }
                                    })
                                }
                                </List>
                            </ListItem>
                            <Divider light classes={{root:this.props.classes.divider}}/>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption">
                                    Relation Properties
                                    </Typography>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField         
                                    label='Relation Type' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '100%' }}
                                    value={this.state.relation_type_name}
                                    onChange={
                                        e=>{this.setState({relation_type_name:e.target.value});}
                                    }
                                    InputLabelProps={
                                    {   className: this.props.classes.textfield_label}}
                                    InputProps={{
                                        className: this.props.classes.valueTextField,
                                        classes:{
                                            root:this.props.classes.root,
                                            notchedOutline: this.props.classes.valueTextField,
                                            disabled: this.props.classes.valueTextField
                                        }
                                    }}/>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <div className="colorPickerStyle">
                                    <ColorPicker
                                        name="color"
                                        variant='outlined' 
                                        size="small"
                                        onChange={color => 
                                            {
                                                console.log(color);
                                                this.color_picker_handler(color);
                                            }}
                                        InputProps={{
                                            value:this.state.color_picker_hex_value, 
                                            style:{color:this.state.color_picker_hex_value},
                                            classes:{
                                                root:this.props.classes.root,
                                                notchedOutline: this.props.classes.valueTextField,
                                                disabled: this.props.classes.valueTextField
                                            }
                                        }}
                                        value={this.state.color_picker_hex_value}
                                    />
                                </div>
                            </ListItem>
                            <ListItem>
                            <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                            onClick={
                                e=>{this.add_relation_type();}
                            }>Add</Button>
                            </ListItem>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <TextField         
                                    label='Search Relation Types' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '100%' }}
                                    value={this.state.relation_type_search_text}
                                    onChange={
                                        e=>{
                                            this.setState({
                                                relation_type_search_text:e.target.value
                                            });
                                            this.search_relation_type(e.target.value);
                                        }
                                    }
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
                                            <Box display={this.state.relation_type_search_close_button_visible}> 
                                                <IconButton color='primary' size='small'
                                                onClick={
                                                    e=>{
                                                        this.search_relation_type("");
                                                        this.setState({relation_type_search_text:""})
                                                    }
                                                }>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Box> 
                                        ),
                                    }}/>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <List className={this.props.classes.properties_list_class}>
                                {   
                                    this.state.relation_type_data_list.map(item=>
                                    {
                                        if(item.show)
                                        {
                                            return(
                                            <ListItem button key={item.id}>
                                                <ListItemText primary={<Typography type="body2" style={{ color: item.color_code }}>{item.relation_type}</Typography>} />
                                                <IconButton color='primary' size='small'
                                                 onClick={
                                                    e=>{
                                                        this.delete_relation_type_id=item.id;
                                                        this.delete_relation_type_name=item.relation_type;
                                                        this.permission_dialog_purpose_code=2;
                                                        this.permission_dialog_options(1);
                                                    } 
                                                 }>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </ListItem>
                                            );
                                        }
                                    })
                                }
                                </List>
                            </ListItem>
                        </List>
                    </Grid>
                </Drawer>
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
            </header>
        </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Main);