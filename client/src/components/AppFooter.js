import { Container, Link, Typography } from '@mui/material'

const styles = {
	footer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		paddingY: 1,
		backgroundColor: '#222',
		color: '#fff',
	},
}

const AppFooter = () => (
	<footer>
		<Container maxWidth="false" sx={styles.footer}>
			<Typography variant="caption">
				&copy; 2021 | Developed by&nbsp;
				<Link href="https://dco.dev/" underline="hover" color="#fff" target="_blank">
					Drew Cook
				</Link>
			</Typography>
		</Container>
	</footer>
)

export default AppFooter
