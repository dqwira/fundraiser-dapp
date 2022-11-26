import { Launch } from '@mui/icons-material'
import {
	Box,
	Button,
	CardMedia,
	CircularProgress,
	Divider,
	FilledInput,
	FormControl,
	Grid,
	InputAdornment,
	InputLabel,
	Link as Anchor,
	TextField,
	Typography,
} from '@mui/material'
import CryptoCompare from 'cryptocompare'
import { Fragment, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FundraiserContract from '../contracts/Fundraiser.json'
import formatNumber from '../utils/formatNumber'
import Notification from './Notification'
import { useWeb3 } from './Web3Provider'

const styles = {
	centered: {
		textAlign: 'center',
	},
	spinner: {
		marginX: 'auto',
		marginY: 4,
	},
	media: {
		width: '100%',
		backgroundColor: '#333',
		height: 300,
		borderBottom: '1px solid #ccc',
	},
	verticalSpacing: {
		marginY: 3,
	},
	ethAmount: {
		fontWeight: 500,
		fontSize: '0.9rem',
		color: '#a1a1a1',
	},
	donationRow: {
		paddingY: 3,
		display: 'flex',
		justifyContent: 'space-between',
	},
	ownerActionBtn: {
		marginTop: 1,
	},
	updateDetailsBtn: {
		marginRight: 1,
		marginY: 1,
	},
}

// TODO: Create live reloading UX when updating donations
const FundraisersDetails = () => {
	const location = useLocation()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [fund, setFund] = useState(null)
	const [exchangeRate, setExchangeRate] = useState(null)
	const [userAcct, setUserAcct] = useState(null)
	const [isOwner, setIsOwner] = useState(false)
	const [userDonations, setUserDonations] = useState(null)
	const [details, setDetails] = useState(null)
	const [beneficiary, setNewBeneficiary] = useState('')
	const [donateAmount, setDonateAmount] = useState('')
	const [donateAmountEth, setDonateAmountEth] = useState('')
	const [donationAmount, setDonationAmount] = useState('')
	const [donationCount, setDonationCount] = useState('')
	const [donationAmountEth, setDonationAmountEth] = useState(0)
	const [editedDetails, setEditedDetails] = useState({
		name: null, //details.name,
		description: null, //details.description,
		imageURL: null, //details.imageURL,
		url: null, //details.url,
	})
	const [isEditingDetails, setIsEditingDetails] = useState(false)
	const [successOpen, setSuccessOpen] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const [failureOpen, setFailureOpen] = useState(false)
	const [failureMsg, setFailureMsg] = useState('')
	const { web3, accounts } = useWeb3()

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		init()
	}, [])

	useEffect(async () => {
		try {
			const newUserAcct = accounts[0]

			if (newUserAcct !== userAcct && fund) {
				if (!loading) setLoading(true)
				setError(null)

				// Set new user account
				setUserAcct(newUserAcct)

				// Get user donations
				const myDonations = await fund.methods.myDonations().call({ from: newUserAcct })
				setUserDonations(myDonations)

				// Check if user is fund owner
				const ownerAcct = await fund.methods.owner().call()
				setIsOwner(ownerAcct.toLowerCase() === newUserAcct.toLowerCase())

				setLoading(false)
			}
		} catch (err) {
			setError('Failed to get fundraiser details.')
			console.error(err)
			setLoading(false)
		}
	}, accounts)
	/* eslint-enable react-hooks/exhaustive-deps */

	const init = async () => {
		try {
			// Set user account
			const userAccount = accounts[0]
			setUserAcct(userAccount)

			// Get contract for given fundraiser contract address
			const fundAddress = location.pathname.split('/')[2]
			const fundContract = new web3.eth.Contract(FundraiserContract.abi, fundAddress)
			setFund(fundContract)

			// Get and set fundraiser details
			const name = await fundContract.methods.name().call()
			const description = await fundContract.methods.description().call()
			const imageURL = await fundContract.methods.imageURL().call()
			const url = await fundContract.methods.url().call()
			const xRate = await CryptoCompare.price('ETH', ['USD'])
			const donationAmount = await fundContract.methods.totalDonations().call()
			const donationsCount = await fundContract.methods.donationsCount().call()
			const donationAmountETH = await web3.utils.fromWei(donationAmount, 'ether')
			const donationAmountUSD = xRate.USD * donationAmountETH
			setExchangeRate(xRate)
			setDonationAmount(donationAmountUSD)
			setDonationAmountEth(donationAmountETH)
			setDonationCount(donationsCount)
			setDetails({
				name,
				description,
				imageURL,
				url,
			})
			setEditedDetails({
				name,
				description,
				imageURL,
				url,
			})

			// Get user donations
			const myDonations = await fundContract.methods.myDonations().call({ from: userAccount })
			setUserDonations(myDonations)

			// Check if user is fund owner
			const ownerAcct = await fundContract.methods.owner().call()
			setIsOwner(ownerAcct.toLowerCase() === userAccount.toLowerCase())

			setLoading(false)
		} catch (err) {
			setError('Failed to get fundraiser details.')
			console.error(err)
			setLoading(false)
		}
	}

	const onSuccess = msg => {
		// Reset local state if not default
		if (isEditingDetails) setIsEditingDetails(false)
		if (donateAmount !== '') setDonateAmount('')
		if (beneficiary !== '') setNewBeneficiary('')
		// Gather data again
		init()
		// Show notification
		setSuccessOpen(true)
		setSuccessMsg(msg)
		setTimeout(() => {
			setSuccessOpen(false)
			setSuccessMsg('')
		}, 5500)
	}

	const onFailure = msg => {
		// Reset local state if not default
		if (isEditingDetails) setIsEditingDetails(false)
		if (donateAmount !== '') setDonateAmount('')
		if (beneficiary !== '') setNewBeneficiary('')
		// Show notification
		setFailureOpen(true)
		setFailureMsg(msg)
		setTimeout(() => {
			setFailureOpen(false)
			setFailureMsg('')
		}, 5500)
	}

	const handleDonationChange = e => {
		const value = e.target.value
		const ethValue = value / exchangeRate.USD || 0
		setDonateAmount(value)
		setDonateAmountEth(ethValue)
	}

	const handleDonate = async () => {
		try {
			const ethAmount = donateAmount / exchangeRate.USD || 0
			const donation = web3.utils.toWei(ethAmount.toString())
			await fund.methods.donate().send({
				from: userAcct,
				value: donation,
				gas: 650000,
			})
			onSuccess('Donation accepted')
		} catch (err) {
			onFailure('Failed to make donation')
			console.error(err)
		}
	}

	const handleSetBeneficiary = async () => {
		try {
			await fund.methods.setBeneficiary(beneficiary).send({
				from: userAcct,
			})
			onSuccess('Fundraiser beneficiary has been changed')
		} catch (err) {
			onFailure('Failed to set beneficiary')
			console.error(err)
		}
	}

	const handleWithdrawal = async () => {
		try {
			await fund.methods.withdraw().send({
				from: userAcct,
			})
			onSuccess('Available funds withdrawn and deposited to beneficiary')
		} catch (err) {
			onFailure('Failed to make withdrawal')
			console.error(err)
		}
	}

	const handleEditDetails = async () => {
		try {
			const { name, description, url, imageURL } = editedDetails
			await fund.methods.updateDetails(name, description, url, imageURL).send({
				from: userAcct,
				gas: 650000,
			})
			onSuccess('Fundraiser details updated')
		} catch (err) {
			onFailure('Failed to edit details')
			console.error(err)
		}
	}

	const handleCancelEditDetails = async () => {
		setIsEditingDetails(false)
		setEditedDetails({
			name: details.name,
			description: details.description,
			imageURL: details.imageURL,
			url: details.url,
		})
	}

	const displayMyDonations = () => {
		if (userDonations === null) return null

		// Construct donations list
		const totalDonations = userDonations.values.length
		let donationsList = []
		for (let i = 0; i < totalDonations; i++) {
			const ethAmount = web3.utils.fromWei(userDonations.values[i])
			const userDonation = exchangeRate.USD * ethAmount
			const donationDate = userDonations.dates[i]
			donationsList.push({
				donationAmountUSD: formatNumber(userDonation),
				donationAmountETH: ethAmount,
				date: donationDate,
			})
		}

		if (donationsList.length === 0)
			return (
				<Box>
					<Typography gutterBottom variant="body2">
						You haven't made any donations to this fundraiser yet.
					</Typography>
				</Box>
			)

		return donationsList.map(donation => (
			<Fragment key={donation.date}>
				<Box sx={styles.donationRow}>
					<Box>
						<Typography>${donation.donationAmountUSD}</Typography>
						<Typography sx={styles.ethAmount}>({donationAmountEth} ETH)</Typography>
					</Box>
					<Link
						className="donation-receipt-link"
						to="/receipts"
						state={{
							donation: donation.donationAmount,
							date: donation.date,
							fundName: details.name,
						}}
					>
						<Button variant="outlined" color="primary" size="small">
							Request Receipt
						</Button>
					</Link>
				</Box>
				<Divider light />
			</Fragment>
		))
	}

	if (loading)
		return (
			<Grid item xs={12} sx={styles.centered}>
				<CircularProgress size={30} sx={styles.spinner} />
			</Grid>
		)

	if (error)
		return (
			<Grid item xs={12} sx={styles.centered}>
				<Typography variant="overline" color="error">
					{error}
				</Typography>
			</Grid>
		)

	if (!details) return null

	if (details)
		return (
			<>
				<Link className="back-button" to="/explore">
					<Button variant="contained" color="primary">
						Back to list
					</Button>
				</Link>
				<Box sx={styles.verticalSpacing}>
					<Typography variant="h2" gutterBottom>
						{details.name}
					</Typography>
					<Typography variant="h5" color="textSecondary" component="p">
						Amount Raised: ${formatNumber(donationAmount)}
					</Typography>
					<Typography sx={styles.ethAmount}>({donationAmountEth} ETH)</Typography>
					<Typography variant="h6" color="textSecondary" component="p">
						Total Donations: {donationCount}
					</Typography>
				</Box>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<CardMedia
							sx={styles.media}
							component="img"
							image={details.imageURL}
							title="Fundraiser Image"
						/>
						<Typography sx={styles.verticalSpacing}>{details.description}</Typography>
						<Typography sx={styles.verticalSpacing}>
							<Anchor href={details.url} underline="none" color="inherit">
								<Button color="primary" endIcon={<Launch />}>
									View Website
								</Button>
							</Anchor>
						</Typography>
						<Divider />
						<Box sx={styles.verticalSpacing}>
							<Typography gutterBottom variant="h6">
								Make a Donation
							</Typography>
							<FormControl variant="filled" fullWidth margin="normal">
								<InputLabel htmlFor="donation-amount-input">Donation Amount</InputLabel>
								<FilledInput
									id="donation-amount-input"
									value={donateAmount}
									placeholder="0.00"
									onChange={e => handleDonationChange(e)}
									startAdornment={<InputAdornment position="start">$</InputAdornment>}
									fullWidth
								/>
							</FormControl>
							<Typography sx={styles.ethAmount}>({donateAmountEth} ETH)</Typography>
							<Button
								onClick={handleDonate}
								variant="contained"
								color="primary"
								sx={{ marginY: 1 }}
							>
								Donate
							</Button>
						</Box>
					</Grid>
					<Grid item xs={12} md={5}>
						<Box sx={styles.verticalSpacing}>
							<Typography gutterBottom variant="h6">
								My Donations
							</Typography>
							{displayMyDonations()}
						</Box>
						{isOwner && (
							<>
								<Typography gutterBottom variant="h5">
									Owner Actions
								</Typography>
								<Typography gutterBottom>
									As the owner of this fundraiser, you have a couple actions available to perform.
								</Typography>
								<Box sx={styles.verticalSpacing}>
									<Typography variant="h6">Update Details</Typography>
									<Typography gutterBottom>
										Edit the details of your fundraiser, including the name, description, website
										URL, and image URL.
									</Typography>
									{!isEditingDetails ? (
										<Button
											variant="contained"
											color="secondary"
											onClick={() => setIsEditingDetails(true)}
											sx={styles.ownerActionBtn}
										>
											Edit
										</Button>
									) : (
										<>
											<Button
												variant="contained"
												color="secondary"
												onClick={handleEditDetails}
												sx={styles.updateDetailsBtn}
											>
												Update
											</Button>
											<Button
												variant="outlined"
												color="secondary"
												onClick={handleCancelEditDetails}
											>
												Cancel
											</Button>
											<TextField
												id="fundraiser-name-input"
												label="Name"
												variant="filled"
												margin="normal"
												value={editedDetails.name}
												onChange={e => setEditedDetails({ ...editedDetails, name: e.target.value })}
												placeholder="Fundraiser Name"
												fullWidth
											/>
											<TextField
												id="fundraiser-description-input"
												label="Description"
												variant="filled"
												margin="normal"
												value={editedDetails.description}
												onChange={e =>
													setEditedDetails({ ...editedDetails, description: e.target.value })
												}
												placeholder="Fundraiser Description"
												fullWidth
											/>
											<TextField
												id="fundraiser-website-input"
												label="Website URL"
												variant="filled"
												margin="normal"
												value={editedDetails.url}
												onChange={e => setEditedDetails({ ...editedDetails, url: e.target.value })}
												placeholder="Fundraiser Website URL"
												fullWidth
											/>
											<TextField
												id="fundraiser-image-input"
												label="Image URL"
												variant="filled"
												margin="normal"
												value={editedDetails.imageURL}
												onChange={e =>
													setEditedDetails({ ...editedDetails, imageURL: e.target.value })
												}
												placeholder="Fundraiser Image"
												fullWidth
											/>
										</>
									)}
								</Box>
								<Box sx={styles.verticalSpacing}>
									<Typography variant="h6">Set Beneficiary</Typography>
									<Typography>
										Set a new beneficiary wallet address for this fundraiser. The beneficiary wallet
										will receive all of the funds when withdrawn.
									</Typography>
									<FormControl variant="filled" fullWidth margin="normal">
										<InputLabel htmlFor="set-beneficiary-input">Beneficiary ETH Address</InputLabel>
										<FilledInput
											id="set-beneficiary-input"
											value={beneficiary}
											placeholder="0x0000000000000000000000000000000000000000"
											onChange={e => setNewBeneficiary(e.target.value)}
											fullWidth
										/>
									</FormControl>
									<Button
										variant="contained"
										color="secondary"
										onClick={handleSetBeneficiary}
										sx={styles.ownerActionBtn}
									>
										Set Beneficiary
									</Button>
								</Box>
								<Box sx={styles.verticalSpacing}>
									<Typography gutterBottom variant="h6">
										Withdraw Funds
									</Typography>
									<Typography gutterBottom>
										You may withdraw all of the funds currently tied to this fundraiser. The funds
										will be directly deposited into the beneficiary's wallet.
									</Typography>
									<Button
										variant="contained"
										color="secondary"
										onClick={handleWithdrawal}
										sx={styles.ownerActionBtn}
									>
										Withdrawal
									</Button>
								</Box>
							</>
						)}
					</Grid>
				</Grid>
				{successOpen && <Notification open={successOpen} msg={successMsg} type="success" />}
				{failureOpen && <Notification open={failureOpen} msg={failureMsg} type="error" />}
			</>
		)
}

export default FundraisersDetails
