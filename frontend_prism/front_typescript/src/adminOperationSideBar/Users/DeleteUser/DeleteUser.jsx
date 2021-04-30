import React from "react";
import { withStyles } from '@material-ui/core/styles';
import CommanderMenu from "../../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../../GeneralComponent/main/MenuAppBar";

const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
});




class DeleteUser extends React.Component {

    render(){
        
        return (
            <MenuAppBar
                        role = "Commander" 
                        menu={
                            <CommanderMenu/>
                        } 
                        content= {
                            <h2> DELETE XXX</h2>
                        }>
                            
            </MenuAppBar>
        )
    }

}






export default withStyles(useStyles, { withTheme: true })(DeleteUser);