import {Button,Toolbar,Typography,TextField,Grid,IconButton,Drawer,Divider,List,ListItem,ListItemText,Box,FormControl,Select,MenuItem} from '@material-ui/core';
import ColorPicker from "material-ui-color-picker";
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';

export function add_node_relation_props_func(CLASS)
{
    CLASS.prototype.add_node_type = add_node_type;
    CLASS.prototype.delete_node_type = delete_node_type;
    CLASS.prototype.search_node_type = search_node_type;

    CLASS.prototype.Delete_Relation_Type = Delete_Relation_Type;
    CLASS.prototype.search_relation_type = search_relation_type;
    CLASS.prototype.add_relation_type = add_relation_type;
    CLASS.prototype.relation_type_add_button_enabler = relation_type_add_button_enabler;
}

function add_node_type()
{
    if(this.state.node_type_name.length!=0)
    {
        const node_type_list=[...this.state.node_type_data_list];
        
        var found=false;
        for(var a=0;a<node_type_list.length;a++)
        {   
            if(node_type_list[a].node_type.toUpperCase().localeCompare(this.state.node_type_name.toUpperCase())==0)
            {   found=true;break;}
        }
        var work_done=false;
        if(!found)
        {
            var data={
                node_or_relation:0,
                type:this.state.node_type_name.toUpperCase(),
                color_code:'',
                vectored:false,
            };
            window.ipcRenderer.send('add_node_relation_type',data);
            var id;
            if(node_type_list.length==0)
            {   id=0;}
            else
            {   id=node_type_list[node_type_list.length-1].id+1;}
            const newData={
                id:id,
                node_type:this.state.node_type_name.toUpperCase(),
                show:true,
            }
            node_type_list.push(newData);
            work_done=true;
        }
        else
        {   
            if(this.state.node_type_name_edit.length>0)
            {
                var data={
                    node_or_relation:0,
                    id:node_type_list[a].id,
                    type:this.state.node_type_name_edit.toUpperCase(),
                    color_code:'',
                    vectored:false,
                };
                window.ipcRenderer.send('edit_node_relation_type',data);
                node_type_list[a].node_type=this.state.node_type_name_edit.toUpperCase();
                this.change_node_type(data);
                work_done=true;
            }
            else
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter the New Node Type Name!"});}
        }
        if(work_done)
        {
            this.search_node_type("");
            this.setState({
                node_type_data_list:node_type_list
            });
        }
    }
    else
    {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a node type name!"});}
}

function delete_node_type()
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
    this.search_node_type("");
    this.setState({
        node_type_data_list:new_node_type_list
    });
}

function search_node_type(data)
{
    if(data.length>0)
    {   this.setState({node_type_search_close_button_visible:"block"});}
    else
    {   this.setState({node_type_search_close_button_visible:"none",node_type_name:"",});}

    const node_type_list=[...this.state.node_type_data_list];
    var match_count=0;
    for(var a=0;a<node_type_list.length;a++)
    {
        if(node_type_list[a].node_type.toUpperCase().includes(data.toUpperCase()))
        {   
            node_type_list[a].show=true;
            match_count++;
            this.match_found_at2=a;
        }
        else
        {   node_type_list[a].show=false;}
    }
    var type_matched=false;
    if(match_count==1)
    {
        if(node_type_list[this.match_found_at2].node_type.toUpperCase().localeCompare(data.toUpperCase())==0)
        {   type_matched=true;}
    }
    if(type_matched)
    {
        this.setState({
            node_type_data_list:node_type_list,
            disable_add_node_type_button:true,
            add_node_type_button_text:'Save Changes',
            edit_node_type_box_visible:'block',
            edit_node_type_name_close_button_visible:'block',
            node_type_name_edit:data,
            edit_node_type:node_type_list[this.match_found_at2],
        });
    }
    else
    {
        this.setState({
            node_type_data_list:node_type_list,
            disable_add_node_type_button:false,
            add_node_type_button_text:'Add',
            edit_node_type_box_visible:'none',
            edit_node_type_name_close_button_visible:'none',
            node_type_name_edit:'',
            edit_node_type:undefined,
        });
    }
}

function Delete_Relation_Type()
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
    this.search_relation_type("");
    this.setState({
        relation_type_data_list:new_relation_type_list,
        relation_type_name:''
    });
}

function relation_type_add_button_enabler(new_relation_name,color_code,vectored)
{
    var button_enabled=false;
    if(this.state.edit_relation_type_obj.relation_type.toUpperCase().localeCompare(new_relation_name.toUpperCase())!=0)
    {   button_enabled=true;}
    if(!button_enabled)
    {
        if(this.state.edit_relation_type_obj.color_code.toUpperCase().localeCompare(color_code.toUpperCase())!=0)
        {   button_enabled=true;}
    }
    if(!button_enabled)
    {
        if(this.state.edit_relation_type_obj.vectored!=vectored)
        {   button_enabled=true;}
    }
    this.setState({disabled_add_relation_type_button:!button_enabled});
}

function search_relation_type(data)
{
    if(data.length>0)
    {   this.setState({relation_type_close_button_visible:"block",edit_relation_type_close_button_visible:'block'});}
    else
    {   this.setState({relation_type_close_button_visible:"none"});}
    
    const relation_type_list=[...this.state.relation_type_data_list];
    var match_count=0;
    for(var a=0;a<relation_type_list.length;a++)
    {
        if(relation_type_list[a].relation_type.toUpperCase().includes(data.toUpperCase()))
        {   
            relation_type_list[a].show=true;
            match_count++;
            this.match_found_at3=a;
        }
        else
        {   relation_type_list[a].show=false;}
    }
    var type_matched=false;
    if(match_count==1)
    {
        if(relation_type_list[this.match_found_at3].relation_type.toUpperCase().localeCompare(data.toUpperCase())==0)
        {   type_matched=true;}
    }
    if(type_matched)
    {
        this.setState({
            relation_type_data_list:relation_type_list,
            edit_relation_type_box_visible:'block',
            edit_relation_type_close_button_visible:'block',
            edit_relation_type:data,
            edit_relation_type_obj:relation_type_list[this.match_found_at3],
            color_picker_hex_value:relation_type_list[this.match_found_at3].color_code,
            vectored_relation:relation_type_list[this.match_found_at3].vectored,
            relation_type_add_button_text:'Save Changes',
            disabled_add_relation_type_button:true,
        });
    }
    else
    {
        this.setState({
            relation_type_data_list:relation_type_list,
            edit_relation_type_box_visible:'none',
            edit_relation_type_close_button_visible:'none',
            edit_relation_type:'',
            edit_relation_type_obj:undefined,
            color_picker_hex_value:this.rgbToHex(this.getRndInteger(0,255),this.getRndInteger(0,255),this.getRndInteger(0,255)),
            vectored_relation:false,
            relation_type_add_button_text:'Add',
            disabled_add_relation_type_button:false,
        });
    }
}

function add_relation_type()
{
    if(this.state.relation_type_name.length!=0)
    {
        const relation_type_list=[...this.state.relation_type_data_list];

        var found=false;
        for(var a=0;a<relation_type_list.length;a++)
        {
            if(relation_type_list[a].relation_type.toUpperCase().localeCompare(this.state.relation_type_name.toUpperCase())==0)
            {   found=true;break;}
        }
        var work_done=false;
        if(!found)
        {
            var data={
                node_or_relation:1,
                type:this.state.relation_type_name,
                color_code:this.state.color_picker_hex_value,
                vectored:this.state.vectored_relation
            };
            window.ipcRenderer.send('add_node_relation_type',data);
            var id;
            if(relation_type_list.length==0)
            {   id=0;}
            else
            {   id=relation_type_list[relation_type_list.length-1].id+1;}
            const newData={
                id:id,
                relation_type:this.state.relation_type_name.toUpperCase(),
                color_code:this.state.color_picker_hex_value,
                show:true,
                vectored:this.state.vectored_relation
            }
            relation_type_list.push(newData);
            work_done=true;
        }
        else
        {
            if(this.state.edit_relation_type.length>0)
            {
                var data={
                    node_or_relation:1,
                    id:relation_type_list[a].id,
                    type:this.state.edit_relation_type.toUpperCase(),
                    color_code:this.state.color_picker_hex_value,
                    vectored:this.state.vectored_relation,
                };
                window.ipcRenderer.send('edit_node_relation_type',data);
                relation_type_list[a].relation_type=data.type;
                relation_type_list[a].color_code=data.color_code;
                relation_type_list[a].vectored=data.vectored;
                this.change_relation_type(data);
                work_done=true;
            }
            else
            {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter the New Relation Type Name!"});}
        }
        if(work_done)
        {
            this.search_relation_type("");
            this.setState({
                relation_type_name:'',
                relation_type_data_list:relation_type_list
            });
        }
    }
    else
    {   this.setState({alert_dialog_open:true,alert_dialog_text:"Enter a relation type name!"});}
}

export function relation_node_properties_panel(THIS)
{
    return(
        <Drawer variant="persistent"
            anchor="left"
            open={THIS.state.relation_node_properties_drawer_open}
            className={THIS.props.classes.drawer}
            classes={{paper: THIS.props.classes.drawerPaper2,}}>
            <Toolbar variant="dense"/>
            <Grid container direction="column" className={THIS.props.classes.gridDrawer} xs={12} alignItems="flex-start" justify="flex-start">
                <List className={THIS.props.classes.list_class}> 
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
                            style={{ width: '100%' }}
                            value={THIS.state.node_type_name}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e=>{
                                    THIS.setState({
                                        node_type_name:e.target.value,
                                    });
                                    THIS.search_node_type(e.target.value);
                                }
                            }
                            InputLabelProps={
                            {   className: THIS.props.classes.textfield_label}}
                            InputProps={{
                                className: THIS.props.classes.valueTextField,
                                classes:{
                                    root:THIS.props.classes.root,
                                    notchedOutline: THIS.props.classes.valueTextField,
                                    disabled: THIS.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <Box display={THIS.state.node_type_search_close_button_visible}> 
                                        <IconButton color='primary' size='small'
                                        onClick={
                                            e=>{
                                                THIS.search_node_type("");
                                                THIS.setState({node_type_name:""})
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
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Box display={THIS.state.edit_node_type_box_visible}>
                                <TextField         
                                label='New Node Type Name' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '100%' }}
                                value={THIS.state.node_type_name_edit}
                                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                onChange={
                                    e=>{
                                        var visible;
                                        if(e.target.value.length==0)
                                        {   visible='none';}
                                        else
                                        {   visible='block';}
                                        var dis_ad_no_ty_btn=false;
                                        if(e.target.value.toUpperCase().localeCompare(THIS.state.node_type_name.toUpperCase())==0)
                                        {   dis_ad_no_ty_btn=true;}
                                        THIS.setState({
                                            node_type_name_edit:e.target.value,
                                            disable_add_node_type_button:dis_ad_no_ty_btn,
                                            edit_node_type_name_close_button_visible:visible
                                        });
                                    }
                                }
                                InputLabelProps={
                                {   className: THIS.props.classes.textfield_label}}
                                InputProps={{
                                    className: THIS.props.classes.valueTextField,
                                    classes:{
                                        root:THIS.props.classes.root,
                                        notchedOutline: THIS.props.classes.valueTextField,
                                        disabled: THIS.props.classes.valueTextField
                                    },
                                    endAdornment: 
                                    (
                                        <Box display={THIS.state.edit_node_type_name_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={e=>{THIS.setState({node_type_name_edit:'',edit_node_type_name_close_button_visible:'none'})}}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box> 
                                    ),
                                }}/>
                            </Box>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                            onClick={
                                e=>{    THIS.add_node_type();}}
                            classes={{root: THIS.props.classes.button, disabled: THIS.props.classes.disabled_button }}
                            disabled={THIS.state.disable_add_node_type_button}>{THIS.state.add_node_type_button_text}
                        </Button>
                    </ListItem>
                    <ListItem>
                        <List className={THIS.props.classes.properties_list_class}>
                        {
                            THIS.state.node_type_data_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                    <ListItem button key={item.id}>
                                        <ListItemText primary={<Typography type="body2" style={{ color: '#FFFFFF' }}>{item.node_type}</Typography>} 
                                        onClick={e=>
                                        {
                                            THIS.setState({node_type_name:item.node_type});
                                            THIS.search_node_type(item.node_type);
                                        }}/>
                                        <IconButton color='primary' size='small'
                                            onClick={
                                            e=>{
                                                THIS.delete_node_type_id=item.id;
                                                THIS.delete_node_type_name=item.node_type;
                                                THIS.permission_dialog_purpose_code=1;
                                                THIS.permission_dialog_options(1);
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
                    <Divider light style={{paddingTop:1}} classes={{root:THIS.props.classes.divider}}/>
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
                            value={THIS.state.relation_type_name}
                            onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                            onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                            onChange={
                                e=>{
                                    THIS.setState({relation_type_name:e.target.value});
                                    THIS.search_relation_type(e.target.value);
                                }
                            }
                            InputLabelProps={
                            {   className: THIS.props.classes.textfield_label}}
                            InputProps={{
                                className: THIS.props.classes.valueTextField,
                                classes:{
                                    root:THIS.props.classes.root,
                                    notchedOutline: THIS.props.classes.valueTextField,
                                    disabled: THIS.props.classes.valueTextField
                                },
                                endAdornment: 
                                (
                                    <Box display={THIS.state.relation_type_close_button_visible}> 
                                        <IconButton color='primary' size='small'
                                        onClick={e=>
                                        {
                                            THIS.setState({relation_type_name:"",relation_type_close_button_visible:'none'});
                                            THIS.search_relation_type("");
                                        }}>
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                ),
                            }}/>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="center" alignItems="center">
                            <Box display={THIS.state.edit_relation_type_box_visible}>
                                <TextField         
                                label='New Relation Type Name' 
                                variant='outlined' 
                                size='small'                                          
                                style={{ width: '100%' }}
                                value={THIS.state.edit_relation_type}
                                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                onChange={
                                    e=>{
                                        var visible;
                                        if(e.target.value.length==0)
                                        {   visible='none';}
                                        else
                                        {   visible='block';}
                                        THIS.setState({edit_relation_type:e.target.value,edit_relation_type_close_button_visible:visible});
                                        THIS.relation_type_add_button_enabler(e.target.value,THIS.state.color_picker_hex_value,THIS.state.vectored_relation);
                                    }
                                }
                                InputLabelProps={
                                {   className: THIS.props.classes.textfield_label}}
                                InputProps={{
                                    className: THIS.props.classes.valueTextField,
                                    classes:{
                                        root:THIS.props.classes.root,
                                        notchedOutline: THIS.props.classes.valueTextField,
                                        disabled: THIS.props.classes.valueTextField
                                    },
                                    endAdornment: 
                                    (
                                        <Box display={THIS.state.edit_relation_type_close_button_visible}> 
                                            <IconButton color='primary' size='small'
                                            onClick={e=>
                                            {
                                                THIS.setState({edit_relation_type:"",edit_relation_type_close_button_visible:'none'});
                                                THIS.relation_type_add_button_enabler("",THIS.state.color_picker_hex_value,THIS.state.vectored_relation);
                                            }}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </Box> 
                                    ),
                                }}/>
                            </Box>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <div className="colorPickerStyle">
                            <ColorPicker
                                name="color"
                                variant='outlined' 
                                size="small"
                                onFocus={e=>{THIS.enable_keyboard_navigation(false);}}
                                onBlur={e=>{THIS.enable_keyboard_navigation(true);}}
                                onChange={color => 
                                {
                                    THIS.color_picker_handler(color);
                                    if(THIS.state.disabled_add_relation_type_button)
                                    {   THIS.relation_type_add_button_enabler(THIS.state.edit_relation_type,""+color,THIS.state.vectored_relation);}
                                }}
                                InputProps={{
                                    value:THIS.state.color_picker_hex_value, 
                                    style:{color:THIS.state.color_picker_hex_value},
                                    classes:{
                                        root:THIS.props.classes.root,
                                        notchedOutline: THIS.props.classes.valueTextField,
                                        disabled: THIS.props.classes.valueTextField
                                    }
                                }}
                                value={THIS.state.color_picker_hex_value}
                            />
                        </div>
                    </ListItem>
                    <ListItem>
                        <Grid container direction="row" justify="space-between" alignItems="center">
                            <Grid xs={6}>
                                <Typography
                                    color="primary"
                                    display="block"
                                    variant="caption">
                                    Vectored Relation:
                                </Typography>
                            </Grid>
                            <Grid xs={6}>
                                <FormControl variant="outlined" 
                                className={THIS.props.classes.formControl}
                                size='small'>
                                    <Select
                                    labelId="encryption_status_select"
                                    id="encryption_status_select"
                                    size='small'
                                    value={THIS.state.vectored_relation}
                                    onChange={e=>
                                    {
                                        THIS.setState({vectored_relation:e.target.value});
                                        if(THIS.state.edit_relation_type_obj!=undefined)
                                        {   THIS.relation_type_add_button_enabler(THIS.state.edit_relation_type,THIS.state.color_picker_hex_value,e.target.value);}
                                    }}
                                    style={{width:'100%' }}
                                    MenuProps={{classes:{paper: THIS.props.classes.menu_dropdown_style}}}
                                    className={THIS.props.classes.select_style}
                                    inputProps={{
                                        classes: {
                                            root: THIS.props.classes.select_style,
                                            icon:THIS.props.classes.select_style
                                        },
                                    }}>
                                        <MenuItem value={true}>True</MenuItem>
                                        <MenuItem value={false}>False</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" size="small" color="primary" style={{width:'100%'}}
                        onClick={
                            e=>{THIS.add_relation_type();}}
                            classes={{root: THIS.props.classes.button, disabled: THIS.props.classes.disabled_button }}
                            disabled={THIS.state.disabled_add_relation_type_button}>
                            {THIS.state.relation_type_add_button_text}
                        </Button>
                    </ListItem>
                    <ListItem>
                        <List className={THIS.props.classes.properties_list_class}>
                        {   
                            THIS.state.relation_type_data_list.map(item=>
                            {
                                if(item.show)
                                {
                                    return(
                                    <ListItem button key={item.id}>
                                        <ListItemText primary={<Typography type="body2" style={{ color: item.color_code }}>{item.relation_type}</Typography>} 
                                        onClick={E=>
                                        {
                                            THIS.setState({relation_type_name:item.relation_type});
                                            THIS.search_relation_type(item.relation_type);
                                        }}/>
                                        <IconButton color='primary' size='small'
                                            onClick={
                                            e=>{
                                                THIS.delete_relation_type_id=item.id;
                                                THIS.delete_relation_type_name=item.relation_type;
                                                THIS.permission_dialog_purpose_code=2;
                                                THIS.permission_dialog_options(1);
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
    );
}