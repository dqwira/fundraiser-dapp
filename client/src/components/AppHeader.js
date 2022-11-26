import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'

const styles = {
	logoWrapper: {
		flexGrow: 1,
	},
	logoInner: {
		display: 'flex',
		alignItems: 'center',
	},
	logoText: {
		marginLeft: 1,
		color: '#333',
	},
}

const AppHeader = () => (
	<AppBar position="static" color="default" enableColorOnDark>
		<Toolbar>
			<Link href="/" underline="none" sx={styles.logoWrapper}>
				<Box sx={styles.logoInner}>
					<img src="/logo.png" alt="Fundraisers" title="Fundraisers Icon" width="40" height="40" />
					<Typography variant="h5" component="h1" sx={styles.logoText}>
						Fundraisers DApp
					</Typography>
				</Box>
			</Link>
			<Typography>
				<NavLink className="nav-link" to="explore">
					Explore
				</NavLink>
			</Typography>
			<Typography>
				<NavLink className="nav-link" to="new">
					{/* <Button color="primary" variant="contained"> */}
					Create
					{/* </Button> */}
				</NavLink>
			</Typography>
		</Toolbar>
	</AppBar>
)

export default AppHeader
