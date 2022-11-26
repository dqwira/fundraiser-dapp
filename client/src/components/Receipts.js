import { Box, Divider, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const styles = {
	centered: {
		textAlign: 'center',
	},
	headline: {
		marginBottom: 3,
	},
	divider: {
		marginY: 3,
	},
	details: {
		display: 'flex',
		padding: 5,
		justifyContent: 'space-between',
	},
}

const Receipts = () => {
	const [donation, setDonation] = useState(null)
	const [date, setDate] = useState(null)
	const [fundName, setFundName] = useState('')
	const location = useLocation()

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (location.state) {
			const { donation, date, fundName } = location.state
			const formattedDate = new Date(parseInt(date))
			setDonation(donation)
			setDate(formattedDate.toLocaleDateString())
			setFundName(fundName)
		}
	}, [])
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<Box sx={styles.centered}>
				<Typography gutterBottom variant="h2">
					Donation Receipt
				</Typography>
				<Typography gutterBottom variant="h5" component="p" sx={styles.headline}>
					Thank you for your donation to {fundName}!
				</Typography>
				<Typography gutterBottom>
					<strong>Please review your receipt for this donation below.</strong>
				</Typography>
				<Divider sx={styles.divider} />
				<Box sx={styles.details}>
					<div>Date of Donation: {date}</div>
					<div>Donation Value: ${donation}</div>
				</Box>
			</Box>
		</>
	)
}

export default Receipts
