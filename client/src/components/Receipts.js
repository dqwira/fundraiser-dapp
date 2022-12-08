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
			const formattedDate = new Date(parseInt(date * 1000))
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
					Resi Donasi
				</Typography>
				<Typography gutterBottom variant="h5" component="p" sx={styles.headline}>
					Terimakasih sudah berdonasi ke {fundName}!
				</Typography>
				<Typography gutterBottom>
					<strong>Berikut resi anda dari donasi ini</strong>
				</Typography>
				<Divider sx={styles.divider} />
				<Box sx={styles.details}>
					<div>Tanggal Donasi : {date}</div>
					<div>Nominal Donasi : Rp. {donation}</div>
				</Box>
			</Box>
		</>
	)
}

export default Receipts