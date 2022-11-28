import {
	Box,
	Container,
	Typography,
} from '@mui/material'

const styles = {
	wrapper: {
		width: '100vw',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
	},
	list: {
		border: '1px solid #ccc',
		borderRadius: '8px',
		width: '100%',
		marginTop: '3rem',
	},
	listItem: {
		justifyContent: 'space-between',
	},
	icon: {
		marginRight: '1rem',
		width: 50,
		height: 50,
	},
}

const Web3Fallback = () => (
	<Box sx={styles.wrapper}>
		<Container maxWidth="md">
			<Typography gutterBottom variant="h2" component="h2">
				Maaf!
			</Typography>
			<Typography gutterBottom variant="h4" component="h3">
				Untuk memuat aplikasi, silahkan hubungkan akun metamask anda.
			</Typography>
			<Typography gutterBottom>
				Connect with one of our available wallet providers or find a new one not in our list.
			</Typography>
		</Container>
	</Box>
)

export default Web3Fallback
