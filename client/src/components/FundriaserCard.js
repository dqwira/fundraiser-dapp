import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import CryptoCompare from 'cryptocompare'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FundraiserContract from '../contracts/Fundraiser.json'
import formatNumber from '../utils/formatNumber'
import { useWeb3 } from './Web3Provider'

const styles = {
	media: {
		width: '100%',
		backgroundColor: '#333',
		height: 300,
		borderBottom: '1px solid #ccc',
	},
	viewMoreBtn: {
		justifyContent: 'flex-end',
		padding: 3,
	},
	ethAmount: {
		fontWeight: 500,
		fontSize: '0.9rem',
		color: '#a1a1a1',
	},
}

const FundraiserCard = props => {
	const { fundraiser } = props
	const [contract, setContract] = useState(null)
	const [exchangeRate, setExchangeRate] = useState(1)
	const { web3 } = useWeb3()

	const [fund, setFund] = useState({
		name: null,
		description: null,
		imageURL: null,
		url: null,
		donationsCount: null,
		donationAmountETH: null,
		donationAmountUSD: null,
	})

	const init = async () => {
		try {
			// Get contract for given fundraiser contract address
			const instance = new web3.eth.Contract(FundraiserContract.abi, fundraiser)
			setContract(instance)
			// Read contract data and construct fundraiser details and donations data
			const name = await instance.methods.name().call()
			const description = await instance.methods.description().call()
			const imageURL = await instance.methods.imageURL().call()
			const url = await instance.methods.url().call()
			const donationsCount = await instance.methods.donationsCount().call()
			const donationAmount = await instance.methods.totalDonations().call()
			const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether')
			// Get exchange rate from API
			const xRate = await CryptoCompare.price('ETH', ['USD'])
			setExchangeRate(xRate)
			const donationAmountUSD = xRate.USD * donationAmountETH
			setFund({
				name,
				description,
				imageURL,
				url,
				donationsCount,
				donationAmountETH,
				donationAmountUSD,
			})
		} catch (err) {
			console.error(err)
		}
	}

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (fundraiser) init(fundraiser)
	}, [fundraiser])
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<Card>
			<CardMedia sx={styles.media} component="img" image={fund.imageURL} title="Fundraiser Image" />
			<CardContent>
				<Typography gutterBottom variant="h5" component="h2">
					{fund.name}
				</Typography>
				<Typography variant="h5" color="textSecondary" component="p">
					Amount Raised: ${formatNumber(fund.donationAmountUSD)}
				</Typography>
				<Typography sx={styles.ethAmount}>({fund.donationAmountETH} ETH)</Typography>
				<Typography variant="h6" color="textSecondary" component="p">
					Total Donations: {fund.donationsCount}
				</Typography>
			</CardContent>
			<CardActions sx={styles.viewMoreBtn}>
				<Link
					className="donation-receipt-link"
					to={`/fund/${fundraiser}`}
					state={{
						fund,
						fundraiser,
						factory: contract,
						exchangeRate,
					}}
				>
					<Button variant="contained" color="primary" size="small">
						View Details
					</Button>
				</Link>
			</CardActions>
		</Card>
	)
}

export default FundraiserCard
