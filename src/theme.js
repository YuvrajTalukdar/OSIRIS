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
                backgroundColor: 'black',
                color:'orange'
              },
            },
            listbox:{
                backgroundColor:'black',
                color:'#03DAC5'
            }
          }
          
      }
})

export default theme;