import React from 'react';
import {Button,Toolbar,AppBar,TextField,Grid,IconButton,Drawer,Tooltip,Divider,List,ListItem} from '@material-ui/core';
import theme from './theme';
import { ThemeProvider, withStyles } from '@material-ui/core/styles';
import SpeedIcon from '@material-ui/icons/Speed';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
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

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
    { title: 'Casablanca', year: 1942 },
    { title: 'City Lights', year: 1931 },
    { title: 'Psycho', year: 1960 },
    { title: 'The Green Mile', year: 1999 },
    { title: 'The Intouchables', year: 2011 },
    { title: 'Modern Times', year: 1936 },
    { title: 'Raiders of the Lost Ark', year: 1981 },
    { title: 'Rear Window', year: 1954 },
    { title: 'The Pianist', year: 2002 },
    { title: 'The Departed', year: 2006 },
    { title: 'Terminator 2: Judgment Day', year: 1991 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'Whiplash', year: 2014 },
    { title: 'Gladiator', year: 2000 },
    { title: 'Memento', year: 2000 },
    { title: 'The Prestige', year: 2006 },
    { title: 'The Lion King', year: 1994 },
    { title: 'Apocalypse Now', year: 1979 },
    { title: 'Alien', year: 1979 },
    { title: 'Sunset Boulevard', year: 1950 },
    { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
    { title: 'The Great Dictator', year: 1940 },
    { title: 'Cinema Paradiso', year: 1988 },
    { title: 'The Lives of Others', year: 2006 },
    { title: 'Grave of the Fireflies', year: 1988 },
    { title: 'Paths of Glory', year: 1957 },
    { title: 'Django Unchained', year: 2012 },
    { title: 'The Shining', year: 1980 },
    { title: 'WALL·E', year: 2008 },
    { title: 'American Beauty', year: 1999 },
    { title: 'The Dark Knight Rises', year: 2012 },
    { title: 'Princess Mononoke', year: 1997 },
    { title: 'Aliens', year: 1986 },
    { title: 'Oldboy', year: 2003 },
    { title: 'Once Upon a Time in America', year: 1984 },
    { title: 'Witness for the Prosecution', year: 1957 },
    { title: 'Das Boot', year: 1981 },
    { title: 'Citizen Kane', year: 1941 },
    { title: 'North by Northwest', year: 1959 },
    { title: 'Vertigo', year: 1958 },
    { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
    { title: 'Reservoir Dogs', year: 1992 },
    { title: 'Braveheart', year: 1995 },
    { title: 'M', year: 1931 },
    { title: 'Requiem for a Dream', year: 2000 },
    { title: 'Amélie', year: 2001 },
    { title: 'A Clockwork Orange', year: 1971 },
    { title: 'Like Stars on Earth', year: 2007 },
    { title: 'Taxi Driver', year: 1976 },
    { title: 'Lawrence of Arabia', year: 1962 },
    { title: 'Double Indemnity', year: 1944 },
    { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
    { title: 'Amadeus', year: 1984 },
    { title: 'To Kill a Mockingbird', year: 1962 },
    { title: 'Toy Story 3', year: 2010 },
    { title: 'Logan', year: 2017 },
    { title: 'Full Metal Jacket', year: 1987 },
    { title: 'Dangal', year: 2016 },
    { title: 'The Sting', year: 1973 },
    { title: '2001: A Space Odyssey', year: 1968 },
    { title: "Singin' in the Rain", year: 1952 },
    { title: 'Toy Story', year: 1995 },
    { title: 'Bicycle Thieves', year: 1948 },
    { title: 'The Kid', year: 1921 },
    { title: 'Inglourious Basterds', year: 2009 },
    { title: 'Snatch', year: 2000 },
    { title: '3 Idiots', year: 2009 },
    { title: 'Monty Python and the Holy Grail', year: 1975 },
  ];

class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            add_drawer_open:false,
            add_icon_color:'primary',
            search_drawer_open:false,
            operation_drawer_open:false,
            relation_node_properties_drawer_open:false,
            relation_node_properties_icon_color:'primary',
            collaborate_drawer_open:false,
            color_picker_hex_value:"#03DAC5"
        };
        this.handle_drawer=this.handle_drawer.bind(this);
        this.color_picker_handler=this.color_picker_handler.bind(this);
    }

    color_picker_handler(color)
    {
        this.setState({
            color_picker_hex_value:color
        });
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
                collaborate_drawer_open:false
            });
        }
    }

    render()
    {
        return(
        <ThemeProvider theme={theme}>
            <header className="Settings-Style">
                {/*-----------------------------------------App Bar--------------------------------------------------- */ }
                <AppBar  style={{ background: '#242527',paddingLeft: 40 }} className={this.props.classes.appBar}>
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
                                <Autocomplete
                                    size="small"
                                    classes={this.props.classes}
                                    options={top100Films}
                                    getOptionLabel={(option) => option.title}
                                    style={{ width: 300 }}
                                    renderInput=
                                    {
                                        (params) => 
                                            <TextField 
                                            {...params} label="New Node Name" variant="outlined" 
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
                                <Autocomplete
                                size="small"
                                classes={this.props.classes}
                                options={top100Films}
                                getOptionLabel={(option) => option.title}
                                style={{ width: 300 }}
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
                                <Button variant="contained" size="small" color="primary" style={{width:'100%'}}>Add</Button>
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
                                    options={top100Films}
                                    getOptionLabel={(option) => option.title}
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
                                    options={top100Films}
                                    getOptionLabel={(option) => option.title}
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
                                    options={top100Films}
                                    getOptionLabel={(option) => option.title}
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
                                    <IconButton color='primary'>
                                        <AddIcon/>
                                    </IconButton>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <List className={this.props.classes.properties_list_class}>

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
                            <Button variant="contained" size="small" color="primary" style={{width:'100%'}}>Add</Button>
                            </ListItem>
                            <ListItem>
                                <List className={this.props.classes.properties_list_class}>

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