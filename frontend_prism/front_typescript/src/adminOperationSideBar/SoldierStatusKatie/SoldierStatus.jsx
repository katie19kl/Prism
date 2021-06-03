import React from "react"
import { Button, withStyles } from "@material-ui/core";
import { blue, purple } from "@material-ui/core/colors";
import { Link } from "react-router-dom";
import MenuAppBar from '../../GeneralComponent/main/MenuAppBar';
import CommanderMenu from '../../GeneralComponent/admin/CommanderMenu';
import Role from "../../Roles/Role";


const useStyles = (theme) => ({

    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },
    myFont1: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        color: purple[400],
    },
    myFont2: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
        color: blue[300],
    },
    nav: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(10),
    },
    title: {
        marginRight: theme.spacing(8),
        fontFamily: "Comic Sans MS, Comic Sans, cursive",
    },

});


class SoldierStatus extends React.Component {

    constructor(props) {
        super(props);

        this.personalId = "12345678";
        this.major = "research";
        this.module = "1- Complexity";
        this.subject = "1.1- np";

        this.postfix = this.personalId + "/" + this.major + "/" + this.module + "/" + this.subject;
    }

    render() {

        return (
            <MenuAppBar
            role={Role.Commander}
            menu={
                <CommanderMenu />
            }
            content={
                <div>

                    <Link 
                    to={"/admin/soldier_status/" + this.postfix} 
                    style={{ textDecoration: 'none', color: 'inherit' }}>

                        <Button variant="contained" color="primary" size="medium">
                            Go to the Soldier Submission Status
                        </Button>
                    </Link>


                </div>
            } />
        );
    }

}

export default withStyles(useStyles, { withTheme: true })(SoldierStatus);