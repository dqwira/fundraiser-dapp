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
				&copy; 2022 | Project Blockchain&nbsp;
				<Link href="https://github.com/Raguna9/aplikasi-donasi-blockchain/tree/projectakhir" underline="hover" color="#fff" target="_blank">
					Tim 1
				</Link>
			</Typography>
		</Container>
	</footer>
)

export default AppFooter
