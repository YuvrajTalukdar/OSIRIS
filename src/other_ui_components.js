import React from 'react';
import {Grid,Tooltip,IconButton,Drawer,Toolbar} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

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