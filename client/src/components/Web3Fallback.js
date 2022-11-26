import {
	Box,
	Container,
	Link,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
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
				Uh Oh!
			</Typography>
			<Typography gutterBottom variant="h4" component="h3">
				You need an Ethereum wallet to use this app.
			</Typography>
			<Typography gutterBottom>
				Connect with one of our available wallet providers or find a new one not in our list.
			</Typography>
			<Container maxWidth="sm">
				<List disablePadding sx={styles.list}>
					<Link href="https://metamask.io/download/" underline="none" color="#111">
						<ListItem disablePadding divider>
							<ListItemButton>
								<ListItemIcon sx={styles.icon}>
									<img src="/metamask_icon.png" alt="MetaMask" title="MetaMask" />
								</ListItemIcon>
								<ListItemText primary="MetaMask" />
								<ListItemText
									secondary="Most Popular"
									secondaryTypographyProps={{ align: 'right' }}
								/>
							</ListItemButton>
						</ListItem>
					</Link>
					<Link href="https://www.coinbase.com/wallet" underline="none" color="#111">
						<ListItem disablePadding divider>
							<ListItemButton>
								<ListItemIcon sx={styles.icon}>
									<img
										src="/coinbasewallet_icon.png"
										alt="Coinbase Wallet"
										title="Coinbase Wallet"
									/>
								</ListItemIcon>
								<ListItemText primary="Coinbase Wallet" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link href="https://portis.io/" underline="none" color="#111">
						<ListItem disablePadding divider>
							<ListItemButton>
								<ListItemIcon sx={styles.icon}>
									<img src="/portis_icon.png" alt="Portis" title="Portis" />
								</ListItemIcon>
								<ListItemText primary="Portis" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link href="https://toruswallet.io/" underline="none" color="#111">
						<ListItem disablePadding divider>
							<ListItemButton>
								<ListItemIcon sx={styles.icon}>
									<img src="/torus_icon.svg" alt="Torus Labs" title="Torus Labs" />
								</ListItemIcon>
								<ListItemText primary="Torus" />
							</ListItemButton>
						</ListItem>
					</Link>
					<Link href="https://ethereum.org/en/wallets/find-wallet/" underline="none" color="#111">
						<ListItem disablePadding>
							<ListItemButton>
								<ListItemIcon sx={styles.icon}>
									<img src="/ethereum_icon.png" alt="Ethereum Wallets" title="Ethereum Wallets" />
								</ListItemIcon>
								<ListItemText primary="Find an Ethereum Wallets" />
							</ListItemButton>
						</ListItem>
					</Link>
				</List>
			</Container>
		</Container>
	</Box>
)

export default Web3Fallback
