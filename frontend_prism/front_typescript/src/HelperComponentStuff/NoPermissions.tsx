import { Typography, withStyles, WithStyles } from "@material-ui/core";


const styles = {
	title: {
		fontFamily: 'monospace',
		marginTop: '30px',
		color: '#cc3300'
	},
};


function NoPermissions(props: WithStyles<typeof styles>) {

	const { classes } = props;

  	return (
		<div>
			<Typography variant='h5' align='center' className={classes.title}>
				<b>You Attempted To Access A Forbidden Route</b>
			</Typography>

			<Typography variant='h6' align='center' className={classes.title}>
				<b>Please Go Back</b>
			</Typography>
		</div>
	);
}

export default withStyles(styles)(NoPermissions);

