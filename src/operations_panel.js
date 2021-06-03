import {Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,Box,FormControl,Select,MenuItem} from '@material-ui/core';
import ColorPicker from "material-ui-color-picker";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

export function add_operations_func(CLASS)
{}

export class Add_Operations_Panel extends React.Component
{   
    constructor(props) {
        super(props);
        this.state=
        {
            operation_drawer_open:false,

            search_operation_text:'',
            search_operations_text_close_btn:'none',
            operation_list:[
                {name:"Shortest Path",display:'block'},
                {name:"Network",display:'block'},
                {name:"Clustering",display:'block'}
            ],

            cluster_name:'',
            cluster_name_close_btn:'none',
            clustering_node:'',
            clustering_node_list:[],
            cluster_color:"#03DAC5",
            clustering_select_node_width:'100%',
            clustering_type:0,
            clustering_id_mode:'none',

            mst_node:undefined,
            mst_node_list:[],

            shortest_path_node_source:'',
            shortest_path_node_destination:'',
        }
        this.search_operation=this.search_operation.bind(this);
        this.create_cluster=this.create_cluster.bind(this);
        this.find_MST=this.find_MST.bind(this);
    }
    
    find_shortest_path()
    {
        if(this.state.shortest_path_node_source==null || this.state.shortest_path_node_source.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Source Node not entered !",
                alert_dialog_open:true
            });
        }
        else if(this.state.shortest_path_node_destination==null || this.state.shortest_path_node_destination.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Destination Node not entered !",
                alert_dialog_open:true
            });
        }
        else
        {
            let data={
                source:this.state.shortest_path_node_source,
                destination:this.state.shortest_path_node_destination
            }
            window.ipcRenderer.send('find_shortest_path',data);
        }
    }

    find_MST()
    {
        if(this.state.mst_node_list==null || this.state.mst_node_list.length<2)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Add at least 2 nodes for finding MST !",
                alert_dialog_open:true
            });
        }
        else
        {   window.ipcRenderer.send('find_mst',this.state.mst_node_list);}
    }

    search_operation(op_name)
    {
        let operation_list=[...this.state.operation_list];
        for(let a=0;a<operation_list.length;a++)
        {
            if(op_name.length==0 || operation_list[a].name.toUpperCase().includes(op_name.toUpperCase()))
            {   operation_list[a].display='block';}
            else
            {   operation_list[a].display='none';}
        }
        this.setState({operation_list});
    }

    create_cluster()
    {
        if(this.state.cluster_name.length==0)
        {
            this.props.THIS.setState({
                alert_dialog_text:"Cluster Name is empty !",
                alert_dialog_open:true
            });
        }
        else
        {
            if(this.state.clustering_type==0)
            {
                if(this.state.clustering_node==null || this.state.clustering_node.length==0)
                {
                    this.props.THIS.setState({
                        alert_dialog_text:"Select a Node !",
                        alert_dialog_open:true
                    });
                }
                else
                {   this.props.THIS.cluster_by_connection(this.state.clustering_node.node_id,this.state.cluster_name,this.state.cluster_color);}
            }
            else if(this.state.clustering_type==1)
            {
                if(this.state.clustering_node_list==null || this.state.clustering_node_list.length==0)
                {
                    this.props.THIS.setState({
                        alert_dialog_text:"Add atleast 1 node to cluster list !",
                        alert_dialog_open:true
                    });
                }
                else
                {   this.props.THIS.cluster_by_id(this.state.clustering_node_list,this.state.cluster_name,this.state.cluster_color);}
            }
        }
    }

    render()
    {
        return(
            <Drawer variant="persistent"
                anchor="left"
                open={this.state.operation_drawer_open}
                className={this.props.THIS.props.classes.drawer}
                classes={{paper: this.props.THIS.props.classes.drawerPaper2,}}>
                <Toolbar variant="dense"/>
                <Grid container direction="column" className={this.props.THIS.props.classes.gridDrawer} xs={12} alignItems="center" justify="flex-start">
                    <TextField         
                    label='Search Operations' 
                    variant='outlined' 
                    size='small'                                          
                    style={{ width: '90%',marginBottom:5}}
                    value={this.state.search_operation_text}
                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                    onChange={
                        e=>{
                            let display_close_btn;
                            if(e.target.value.length>0)
                            {   display_close_btn='block';}
                            else
                            {   display_close_btn='none';}
                            this.setState({
                                search_operations_text_close_btn:display_close_btn,
                                search_operation_text:e.target.value
                            });
                            this.search_operation(e.target.value);
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
                            <Box display={this.state.search_operations_text_close_btn}> 
                                <IconButton color='primary' size='small'
                                onClick={
                                    e=>{
                                        this.search_operation("");
                                        this.setState({
                                            search_operation_text:"",
                                            search_operations_text_close_btn:'none'
                                        })
                                    }
                                }>
                                    <CloseIcon/>
                                </IconButton>
                            </Box> 
                        ),
                    }}/>
                    <List className={this.props.THIS.props.classes.list_class}> 
                        <Divider light style={{paddingTop:1}} classes={{root:this.props.THIS.props.classes.divider}}/>
                        <Box display={this.state.operation_list[0].display}>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption">
                                        {this.state.operation_list[0].name}
                                    </Typography>
                                    <Autocomplete
                                    size="small"
                                    classes={this.props.THIS.props.classes}
                                    options={this.props.THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: 300, marginTop:15,marginBottom:15}}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    value={this.state.shortest_path_node_source}
                                    onChange={(event,value)=>
                                        {
                                            this.setState({shortest_path_node_source:value});
                                        }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField 
                                            {...params} label="Source Node" variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                    <Autocomplete
                                    size="small"
                                    classes={this.props.THIS.props.classes}
                                    options={this.props.THIS.state.node_data_list}
                                    getOptionLabel={(option) => option.node_name}
                                    style={{ width: 300,marginBottom:15 }}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    value={this.state.shortest_path_node_destination}
                                    onChange={(event,value)=>{this.setState({shortest_path_node_destination:value});}}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField 
                                            {...params} label="Destination Node" variant="outlined" 
                                            InputLabelProps=
                                            {{   
                                                    ...params.InputLabelProps,
                                                    className: this.props.THIS.props.classes.textfield_label
                                            }}
                                            />
                                    }
                                    />
                                    <Button variant="contained" size="small" color="primary" style={{width:'100%',marginBottom:5}}
                                    onClick={e=>{this.find_shortest_path();}}
                                    classes={{root: this.props.THIS.props.classes.button}}>
                                        Find Shortest Path
                                    </Button>
                                </Grid>
                            </ListItem>
                            <Divider light style={{paddingTop:1}} classes={{root:this.props.THIS.props.classes.divider}}/>
                        </Box>
                        <Box display={this.state.operation_list[1].display}>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption">
                                        {this.state.operation_list[1].name}
                                    </Typography>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <IconButton color='primary' size="small"
                                            onClick={
                                                e=>
                                                {   if(this.state.mst_node!=undefined /*|| this.state.mst_node.length==0*/)
                                                    {
                                                        let mst_node_list=[...this.state.mst_node_list];
                                                        let found=false;
                                                        for(let a=0;a<mst_node_list.length;a++)
                                                        {
                                                            if(mst_node_list[a].node_id==this.state.mst_node.node_id)
                                                            {   found=true;break;}
                                                        }
                                                        if(!found)
                                                        {
                                                            mst_node_list.push(this.state.mst_node);
                                                            this.setState({mst_node_list});
                                                        }
                                                    }
                                                }}>
                                            <AddIcon/>
                                        </IconButton>
                                        <Autocomplete
                                        size="small"
                                        classes={this.props.THIS.props.classes}
                                        options={this.props.THIS.state.node_data_list}
                                        getOptionLabel={(option) => option.node_name}
                                        style={{ width:'86%', marginTop:15,marginBottom:15 }}
                                        onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                        onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                        value={this.state.mst_node}
                                        onChange={(event,value)=>
                                            {
                                                this.setState({mst_node:value});
                                            }}
                                        renderInput=
                                        {
                                            (params) => 
                                                <TextField 
                                                {...params} label="Add Node" variant="outlined" 
                                                InputLabelProps=
                                                {{   
                                                        ...params.InputLabelProps,
                                                        className: this.props.THIS.props.classes.textfield_label
                                                }}
                                                />
                                        }
                                        />
                                    </Grid>
                                    <List className={this.props.THIS.props.classes.properties_list_class}> 
                                    {
                                        this.state.mst_node_list.map(item=>
                                        {
                                            return(
                                                <ListItem button key={item.node_id}>
                                                    <TextField         
                                                    variant='outlined' 
                                                    size='small'                                          
                                                    style={{ width: '85%'}}
                                                    value={item.node_name}
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
                                                            let mst_node_list=[...this.state.mst_node_list];
                                                            let new_mst_list=mst_node_list.filter(item2=>item2.node_id!=item.node_id);
                                                            this.setState({mst_node_list:new_mst_list});
                                                        }}>
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                </ListItem>
                                            );
                                        })
                                    }
                                    </List>
                                    <Button variant="contained" size="small" color="primary" style={{width:'100%',marginBottom:5}}
                                    onClick={e=>{this.find_MST();}}
                                    classes={{root: this.props.THIS.props.classes.button}}>
                                        Find Network
                                    </Button>
                                </Grid>
                            </ListItem>
                            <Divider light style={{paddingTop:1}} classes={{root:this.props.THIS.props.classes.divider}}/>
                        </Box>
                        <Box display={this.state.operation_list[2].display}>
                            <ListItem>
                                <Grid container direction="row" justify="center" alignItems="center">
                                    <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption">
                                        {this.state.operation_list[2].name}
                                    </Typography>
                                    <FormControl variant="outlined" 
                                    className={this.props.THIS.props.classes.formControl}
                                    size='small'>
                                        <Select
                                        labelId="encryption_status_select"
                                        id="encryption_status_select"
                                        size='small'
                                        value={this.state.clustering_type}
                                        onChange={e=>
                                        {   
                                            let width,mode;
                                            if(e.target.value==0)
                                            {   width="100%";mode='none';}
                                            else
                                            {   width="86%";mode='block'}
                                            this.setState({
                                                clustering_type:e.target.value,
                                                clustering_select_node_width:width,
                                                clustering_id_mode:mode
                                            });
                                        }}
                                        style={{width:'100%',marginTop:15,marginBottom:15 }}
                                        MenuProps={{classes:{paper: this.props.THIS.props.classes.menu_dropdown_style}}}
                                        className={this.props.THIS.props.classes.select_style}
                                        inputProps={{
                                            classes: {
                                                root: this.props.THIS.props.classes.select_style,
                                                icon:this.props.THIS.props.classes.select_style
                                            },
                                        }}>
                                            <MenuItem value={0}>By Connection</MenuItem>
                                            <MenuItem value={1}>By Name</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className="colorPickerStyle">
                                        <ColorPicker
                                            name="color"
                                            variant='outlined' 
                                            size="small"
                                            style={{marginBottom:15}}
                                            onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                            onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                            onChange={color => {this.setState({cluster_color:color});}}
                                            InputProps={{
                                                value:this.state.cluster_color, 
                                                style:{color:this.state.cluster_color},
                                                classes:{
                                                    root:this.props.THIS.props.classes.root,
                                                    notchedOutline: this.props.THIS.props.classes.valueTextField,
                                                    disabled: this.props.THIS.props.classes.valueTextField
                                                }
                                            }}
                                            value={this.state.cluster_color}
                                        />
                                    </div>
                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <Box display={this.state.clustering_id_mode}>
                                            <IconButton color='primary' size="small"
                                                onClick={
                                                    e=>
                                                    {   if(this.state.clustering_node!=undefined)
                                                        {
                                                            let clustering_node_list=[...this.state.clustering_node_list];
                                                            let found=false;
                                                            for(let a=0;a<clustering_node_list.length;a++)
                                                            {
                                                                if(clustering_node_list[a].node_id==this.state.clustering_node.node_id)
                                                                {   found=true;break;}
                                                            }
                                                            if(!found)
                                                            {
                                                                clustering_node_list.push(this.state.clustering_node);
                                                                this.setState({
                                                                    clustering_node:undefined,
                                                                    clustering_node_list
                                                                });
                                                            }
                                                        }
                                                    }}>
                                                <AddIcon/>
                                            </IconButton>
                                        </Box>
                                        <Autocomplete
                                        size="small"
                                        classes={this.props.THIS.props.classes}
                                        options={this.props.THIS.state.node_data_list}
                                        getOptionLabel={(option) => option.node_name}
                                        style={{ width:this.state.clustering_select_node_width,marginBottom:15 }}
                                        onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                        onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                        value={this.state.clustering_node}
                                        onChange={(event,value)=>
                                            {
                                                this.setState({clustering_node:value});
                                            }}
                                        renderInput=
                                        {
                                            (params) => 
                                                <TextField 
                                                {...params} label="Select Node.." variant="outlined" 
                                                InputLabelProps=
                                                {{   
                                                        ...params.InputLabelProps,
                                                        className: this.props.THIS.props.classes.textfield_label
                                                }}
                                                />
                                        }
                                        />
                                    </Grid>
                                    <Box display={this.state.clustering_id_mode} style={{ width: '100%' }}>
                                        <List className={this.props.THIS.props.classes.properties_list_class}> 
                                        {
                                            this.state.clustering_node_list.map(item=>
                                            {
                                                return(
                                                    <ListItem button key={item.node_id}>
                                                        <TextField         
                                                        variant='outlined' 
                                                        size='small'                                          
                                                        style={{ width: '85%' }}
                                                        value={item.node_name}
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
                                                                let clustering_node_list=[...this.state.clustering_node_list];
                                                                let new_mst_list=clustering_node_list.filter(item2=>item2.node_id!=item.node_id);
                                                                this.setState({clustering_node_list:new_mst_list});
                                                            }}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </ListItem>
                                                );
                                            })
                                        }
                                        </List>
                                    </Box>
                                    <TextField         
                                    label='Cluster Name' 
                                    variant='outlined' 
                                    size='small'                                          
                                    style={{ width: '100%',marginBottom:15}}
                                    value={this.state.cluster_name}
                                    onFocus={e=>{this.props.THIS.enable_keyboard_navigation(false);}}
                                    onBlur={e=>{this.props.THIS.enable_keyboard_navigation(true);}}
                                    onChange={
                                        e=>{
                                            let visible='block';
                                            if(e.target.value.length==0)
                                            {   visible='none';}
                                            this.setState({cluster_name:e.target.value,cluster_name_close_btn:visible});
                                        }}
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
                                            <Box display={this.state.cluster_name_close_btn}> 
                                                <IconButton color='primary' size='small'
                                                onClick={e=>
                                                {this.setState({cluster_name:"",cluster_name_close_btn:'none'});}}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </Box> 
                                        ),
                                    }}/>
                                    <Button variant="contained" size="small" color="primary" style={{width:'100%',marginBottom:15}}
                                    onClick={e=>{this.create_cluster();}}
                                    classes={{root: this.props.THIS.props.classes.button}}>
                                        Create Cluster
                                    </Button>
                                </Grid>
                            </ListItem>
                        </Box>
                    </List>
                </Grid>
            </Drawer>
        );
    }
}