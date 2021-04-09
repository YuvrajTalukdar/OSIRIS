import {createMuiTheme} from '@material-ui/core';
//import {colors} from '@material-ui/core';

const theme = createMuiTheme(
{
    palette:
    {
        primary:
        {   
            main:"#03DAC5",
            contrastText:"#000000"
        },
        secondary:
        {   
            main:"#FFA500",
            contrastText:"#000000"
        }
    },
    typography: 
    {
        button: 
        {   textTransform: "none"}
    },
    overrides: {
        MuiCssBaseline: {
          '@global': {
            '*': {
              'scrollbar-width': 'thin',
            },
            '*::-webkit-scrollbar': {
              width: '4px',
              height: '4px',
            }
          }
        },
        MuiAutocomplete: {
            option: {
              '&[data-focus="true"]': {
                backgroundColor: '#191919',
                color:'orange'
              },
            },
            listbox:{
                backgroundColor:'#191919',
                color:'#03DAC5',
                border:'1px solid orange'
            }, 
            noOptions:{
                backgroundColor:'#191919',
                color:'red',
                border:'1px solid orange'
            },
        }      
    }
})

export default theme;