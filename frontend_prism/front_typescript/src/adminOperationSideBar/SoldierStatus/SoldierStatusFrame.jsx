import { FormControl, Select, TableCell, TableHead, TableRow, Typography } from "@material-ui/core"
import React from "react"
import { Paper, Table, TableContainer, withStyles } from "@material-ui/core"
import { Major } from "../../HelperJS/Major";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getSoldiersByMajors } from "../../HelperJS/extract_info"
import SoldierSubmissions from "./SoldierSubmissions";

import {usersSubmissions} from "../CourseStatus/user_submissions"

//	boxShadow: "5px 2px 5px grey" for row
const useStyles = (theme) => ({

    wrapper: {
        overflowY: "hidden",
        display: "flex",
    },

    container: {
        overflowX: "scroll",

        height: "89vh",
        //height:"100%",

        borderStyle: "solid"
    },

    padding: {
        marginLeft: theme.spacing(30),
        marginBottom: theme.spacing(3)

    }


});

class SoldierStatusFrame extends React.Component {


    constructor(props) {
        super(props);

        this.majorSelector = this.majorSelector.bind(this)
        this.soldierSelector = this.soldierSelector.bind(this)


        this.selectedMajor = undefined
      

        this.state = {
            majors :[],
            soldiers: [],
            displayTable: false,
            selectedSoldier: undefined

        }
    }

    // given array of soldiers & sets array of id & first names
    processNewSoldiers(soldiersFromResponse) {

        let allMySoldiers = soldiersFromResponse

        let usersToTable = []
        let term
        // take neccessary fields only
        for (let user of allMySoldiers) {
            term = { personalId: user.personalId, firstName: user.firstName, lastName: user.lastName }
            usersToTable.push(term)
        }

        // server answer VS field value  by { id & personalId }
        usersToTable.sort(function (a, b) { return a.firstName.localeCompare(b.firstName) });
        this.setState({ soldiers: usersToTable })


    }


    getAllSoldiersMajor(selectedMajor) {

        // function expects array of major
        let major = []
        major.push(selectedMajor)
        
        getSoldiersByMajors(major).then((response) => {
            if (response !== undefined) {

                if (response.data !== undefined) {
                    // sets state soldier with id & first name only
                    this.processNewSoldiers(response.data)
                }
            }
        })

    }


    majorSelector(event) {

        this.selectedMajor = event.target.value

        if (this.selectedMajor != "None") {



            this.getAllSoldiersMajor(this.selectedMajor)

        }
        // remove selection from module
        this.setState({ soldier: undefined, soldiers:[]})

    }

    soldierSelector(event) {
        let selected = event.target.value
        this.setState({soldier:selected})

    }

    componentDidMount() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                // Retrieve the user info.
                user = user.data;
                if (user !== undefined) {
                    let majors_ = user["major"];


                    this.setState({
                        majors: majors_
                    });
                }
            }
        });
    }


    render() {

        let classes = this.props.classes

        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                <TableContainer className={classes.container} component={Paper}

                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '95%'
                    }}
                >


                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>

                                    <Typography>
                                        Select Major
                                    </Typography>

                                    <FormControl style={{ minWidth: 200 }}>
                                        <Select
                                            native
                                            value={undefined}
                                            onChange={this.majorSelector}
                                        >

                                            <option aria-label="None" value="None" />
                                            {(this.state.majors.includes(Major.Software)) ?
                                                <option value={Major.Software}>Software</option> : ''
                                            }
                                            {(this.state.majors.includes(Major.Reserach)) ?
                                                <option value={Major.Reserach}>Research</option> : ''
                                            }
                                            {(this.state.majors.includes(Major.Firmware)) ?
                                                <option value={Major.Firmware}>Firmware</option> : ''
                                            }
                                            {(this.state.majors.includes(Major.Validation)) ?
                                                <option value={Major.Validation}>Validation</option> : ''
                                            }



                                        </Select>
                                    </FormControl>

                                </TableCell>




                                <TableCell>


                                    <Typography>
                                        Select Student
                                                    </Typography>


                                    <FormControl style={{ minWidth: 200 }}>
                                        <Select
                                            native
                                            disabled={this.selectedMajor === undefined || this.selectedMajor === "None"}
                                            value={undefined}
                                            onChange={this.soldierSelector}
                                        >
                                        <option aria-label="None" value="None" />
                                        {this.state.soldiers.map((soldier, index)=>{
                                              return <option key={index} value={soldier.personalId}>{soldier.firstName + "-" + soldier.personalId + "-" + soldier.lastName}</option>
                                        })
                                        }





                                        </Select>
                                    </FormControl>



                                </TableCell>





                            </TableRow>
                        </TableHead>
                    </Table>



                    {this.state.soldier !== undefined && this.state.soldier !== "None" &&
                        <SoldierSubmissions
                            selectedMajor={this.selectedMajor}
                            selectedSoldier={this.state.soldier}
                            
                        >

                        </SoldierSubmissions>
                    }

                </TableContainer>


           



            </div>


        )


    }

}

export default withStyles(useStyles, { withTheme: true })(SoldierStatusFrame)
