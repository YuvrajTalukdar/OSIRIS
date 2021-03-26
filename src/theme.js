import {createMuiTheme} from '@material-ui/core';
import {colors} from '@material-ui/core';

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
            main:"#03DAC5",
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
        }
      }
})

export default theme;