import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Grid,List,ListItem,ListItemText,ThemeProvider} from '@material-ui/core';
import theme from './theme';
import { withStyles } from '@material-ui/core/styles';

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    }
});

var settings_data_request_sent=false;
var settings_added=false;

class Settings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            settings_num:[],
            settings_bool:[],
            save_button_disabled:true,
            search_text:""
        };
        this.add_settings=this.add_settings.bind(this);
        this.change_encryption_status=this.change_encryption_status.bind(this);
        this.enable_save_button=this.enable_save_button.bind(this);
    }
    add_settings(data)
    {
        if(!settings_added)
        {
            settings_added=true;
            const newData1={
                id: 1,
                name:'No of nodes in one node file: ',
                value:data.nodes_in_one_nodefile,
                orig_val:data.nodes_in_one_nodefile,
                display_this:true
            }
            const newData2={
                id: 2,
                name:'No of relations in one relation file: ',
                value:data.relation_in_one_file,
                orig_val:data.relation_in_one_file,
                display_this:true
            }
            const newData3={
                id: 3,
                name:'Percent of data in RAM: ',
                value:data.percent_of_nodes_in_mem,
                orig_val:data.percent_of_nodes_in_mem,
                display_this:true
            }
            const settings_num=[...this.state.settings_num];
            settings_num.push(newData1);
            settings_num.push(newData2);
            settings_num.push(newData3);
            
            const newData4={
                id: 0,
                name:'Encryption enabled: ',
                value:data.encryption_status,
                orig_val:data.encryption_status,
                display_this:true
            }
            const settings_bool=[...this.state.settings_bool];
            settings_bool.push(newData4);

            this.setState({
                settings_num,settings_bool
            });
        }
    }
    
    change_encryption_status()
    {
        const sett_bool=[...this.state.settings_bool];
        const newData={
            id: 0,
            name:'Encryption enabled: ',
            value:!sett_bool[0].value,
            orig_val:sett_bool[0].orig_val,
            display_this:true
       }
       var current_bool=!sett_bool[0].value;
       const settings_bool1=[];
       settings_bool1.push(newData);
       this.setState({
            settings_bool:settings_bool1
       });
       var bool_arr=[];
       bool_arr.push(current_bool);
       bool_arr.push(this.state.settings_bool[0].orig_val);
       this.enable_save_button(0,bool_arr);
    }

    enable_save_button(id,data)
    {
        var disable_save_button=true;
        
        if(id===0 && data[0]!==data[1])
        {   disable_save_button=false;}
    
        const settings_num1=[...this.state.settings_num];
        for(var a=0;a<settings_num1.length;a++)
        {
            if(id===settings_num1[a].id)
            {   
                if(data!==settings_num1[a].orig_val)
                {   disable_save_button=false;}
                settings_num1[a].value=data; 
            }
            if(settings_num1[a].value!==settings_num1[a].orig_val)
            {   disable_save_button=false;}
        }
        
        this.setState({
            settings_num:settings_num1
        });
        if(id!==0)
        {
            const settings_bool=[...this.state.settings_bool];
            for(a=0;a<settings_bool.length;a++)
            {
                if(settings_bool[a].orig_val!==settings_bool[a].value)
                {   disable_save_button=false;break;}
            }
        }
        
        if(this.state.save_button_disabled!==disable_save_button)
        {
            this.setState({
                save_button_disabled:disable_save_button
            })
        }
    }

    search_settings(data)
    {
        const settings_bool=[...this.state.settings_bool];
        for(var a=0;a<settings_bool.length;a++)
        {
            if(settings_bool[a].name.toUpperCase().includes(data.toUpperCase()))
            {   settings_bool[a].display_this=true;}
            else
            {   settings_bool[a].display_this=false;}
        }
        const settings_num=[...this.state.settings_num];
        for(a=0;a<settings_num.length;a++)
        {
            if(settings_num[a].name.toUpperCase().includes(data.toUpperCase()))
            {   settings_num[a].display_this=true;}
            else
            {   settings_num[a].display_this=false;}
        }
        this.setState({
            settings_num,settings_bool
        })
    }

    save_settings()
    {
        window.postMessage({    close_settings: 1});
    }

    render()
    {   
        window.ipcRenderer.on('settings_data_received',(event,data)=>
        {   this.add_settings(data);});

        if(!settings_data_request_sent)
        {
            var dummy="";
            window.ipcRenderer.send('get_settings_data', dummy);
            settings_data_request_sent=true;
        }
       
        return(
            <ThemeProvider theme={theme}>
                <header className='Settings-Style'>
                    <Grid container direction="column" spacing={2} xs={12} className={this.props.classes.grid} alignItems="center">
                        <Grid item container direction="row" justify="center" alignItems="flex-stat" >
                            <TextField 
                                id="SearchSettingsTextField" 
                                label='Search Settings' 
                                variant='filled' /*fullWidth*/ 
                                style={{width:'100%',paddingLeft:'1px',paddingRight:'1px',marginTop:'10px'}} 
                                size='small'
                                value={this.state.search_text}
                                onChange={
                                    e=>{
                                        this.setState({
                                            search_text:e.target.value
                                        });
                                        this.search_settings(e.target.value);
                                    }
                                }
                                InputProps={{
                                    className: this.props.classes.textfield_text,
                                    endAdornment: 
                                    (
                                        <Button  color="primary"
                                        onClick={
                                            e=>{
                                                this.search_settings("");
                                                this.setState({search_text:""});
                                            }
                                        }
                                        >Clear</Button>  
                                    ),
                                }
                                }
                                className={this.props.classes.textfield_background}
                                InputLabelProps={
                                    {   className: this.props.classes.textfield_label}
                                }/>
                        </Grid>
                        <Grid container direction ="column" xs={12} alignItems="center">
                            <div className={this.props.classes.FixedSizedList_props}>
                                <List className={this.props.classes.list_class}>   
                                {
                                    this.state.settings_bool.map(item=>
                                    {
                                        if(item.display_this)
                                        {
                                            return(
                                            <ListItem button key={item.id} >
                                                <ListItemText primary={` ${item.name}`} />
                                                <FormControl variant="outlined" 
                                                className={this.props.classes.formControl}
                                                size='small'>
                                                    <Select
                                                    labelId="encryption_status_select"
                                                    id="encryption_status_select"
                                                    size='small'
                                                    value={item.value}
                                                    onChange={this.change_encryption_status}
                                                    MenuProps={{classes:{paper: this.props.classes.menu_dropdown_style}}}
                                                    className={this.props.classes.select_style}
                                                    inputProps={{
                                                        classes: {
                                                            root: this.props.classes.select_style,
                                                            icon:this.props.classes.select_style
                                                        },
                                                    }}>
                                                        <MenuItem value={true}>True</MenuItem>
                                                        <MenuItem value={false}>False</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </ListItem>
                                            );
                                        }
                                    })
                                }
                                {
                                    this.state.settings_num.map(item=>
                                    {
                                        if(item.display_this)
                                        {
                                            return(
                                            <ListItem button key={item.id} >
                                                <ListItemText primary={` ${item.name}`} />
                                                <TextField 
                                                id={item.id}
                                                type='number'
                                                defaultValue={item.value}
                                                variant='outlined' 
                                                size='small' 
                                                onChange=
                                                {
                                                    e => 
                                                    {   this.enable_save_button(item.id,e.target.value);}
                                                }                                            
                                                style={{width:'100px'}} 
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
                                            </ListItem>
                                            );
                                        }
                                    })
                                }
                                </List>
                            </div>
                        </Grid>
                        <Grid item xs={12} spacing={0} container direction="row" alignContent="flex-end" justify="flex-end">
                            <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                                <Button id="saveButton" variant="contained" color="primary" style={{width:'70%'}} 
                                    disabled={this.state.save_button_disabled}
                                    classes={{ root: this.props.classes.button, disabled: this.props.classes.disabled_button }}
                                    onClick={()=>{
                                        console.log('test======'+window.isElectron)
                                        alert('test======'+window.isElectron)
                                    }}>Save</Button>
                            </Grid>
                            <Grid item xs={2} container direction="row" alignContent="flex-end" justify="flex-end">
                                <Button id="cancelButton" variant="contained" color="primary" style={{width:'70%'}}
                                onClick={()=>{this.save_settings()}}>Close</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </header>
            </ThemeProvider>
        );
    }
}

export default withStyles(useStyles)(Settings);