import { Box, Container, Typography } from '@mui/material'

const styles = {
	headlines: {
		textAlign: 'center',
		marginBottom: 4,
	},
	content: {
		textAlign: 'center',
	},
	p: {
		marginBottom: 3,
	},
}

const Home = () => (
	<>
		<Box sx={styles.headlines}>
			<Typography gutterBottom variant="h2">
				Welcome to Fundraisers DApp
			</Typography>
			<img src="/logo.png" title="Fundraisers" alt="Fundraisers" width="200" height="200" />
			<Typography gutterBottom variant="h4" component="h3">
				Create positive change in the world!
			</Typography>
		</Box>
		<Container maxWidth="sm" sx={styles.content}>
			<Typography sx={styles.p}>
				This decentralized application is a space for creating fundraisers and making donations to
				them, all on the Ethereum blockchain. You should already have a wallet connected to this
				site, and therefore, you will be able to participate in both creating and donating to
				fundraisers.
			</Typography>
			<Typography sx={styles.p}>
				As a creator of a fundraiser, you will be able to manage the funds of that fundraiser. Other
				users can make donations in the form of Ether to your fund, and you will act as a custodian
				for these funds. You may withdraw the funds out to be donated directly into a beneficiary
				account.
			</Typography>
			<Typography sx={styles.p}>
				Check out some of the causes created by other users on the <strong>Explore</strong> page, or
				set up a new fundraiser by clicking the <strong>Create</strong> link.
			</Typography>
			<Typography variant="body2">
				<em>
					Please ensure your wallet has authorized this domain, is connected, and is on one of the
					supported testnets: Rinkeby, Kovan, Ropsten, or Goerli.
					<br />
					This application does not run on Ethereum Mainnet.
				</em>
			</Typography>
		</Container>
	</>
)

export default Home
