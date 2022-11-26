import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import FundriaserCard from './FundriaserCard'
import { useWeb3 } from './Web3Provider'

const styles = {
	centered: {
		textAlign: 'center',
	},
	spinner: {
		marginX: 'auto',
		marginY: 4,
	},
}

const Explore = () => {
	const [fundraisers, setFundraisers] = useState([])
	const [totalCount, setTotalCount] = useState(null)
	const [loading, setLoading] = useState(true)
	const [errorMsg, setErrorMsg] = useState(null)
	const { factory } = useWeb3()

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		init()
	}, [])

	useEffect(() => {
		displayContent()
	}, [loading, errorMsg, fundraisers])
	/* eslint-enable react-hooks/exhaustive-deps */

	const init = async () => {
		try {
			if (factory) fetchFundraisers()
		} catch (err) {
			console.error('Init Error:', err.message)
		}
	}

	const fetchFundraisers = async () => {
		setLoading(true)
		setErrorMsg(null)
		try {
			const newFunds = await factory.methods.fundraisers(10, 0).call()
			const newCount = await factory.methods.fundraisersCount().call()
			setFundraisers(newFunds)
			setTotalCount(newCount)
			setLoading(false)
		} catch (err) {
			console.error(err.message)
			setLoading(false)
			setErrorMsg('An error occurred while fetching fundraisers.')
		}
	}

	const displayContent = () => {
		if (loading)
			return (
				<Grid item xs={12} sx={styles.centered}>
					<CircularProgress size={30} sx={styles.spinner} />
				</Grid>
			)

		if (errorMsg)
			return (
				<Grid item xs={12} sx={styles.centered}>
					<Typography variant="overline" color="error">
						{errorMsg}
					</Typography>
				</Grid>
			)

		if (fundraisers.length > 0)
			return fundraisers.map((fund, idx) => (
				<Grid item xs={12} sm={6} lg={4} key={idx}>
					<FundriaserCard fundraiser={fund} />
				</Grid>
			))

		return (
			<Grid item xs={12} sx={styles.centered}>
				<Typography variant="overline">No fundraisers created yet.</Typography>
			</Grid>
		)
	}

	return (
		<>
			<Box sx={styles.centered}>
				<Typography gutterBottom variant="h2">
					Explore Fundraisers
					{totalCount && (
						<Typography gutterBottom>
							There are currently <strong>{totalCount}</strong> total fundraisers that you may
							donate to.
						</Typography>
					)}
				</Typography>
			</Box>
			<Grid container spacing={2}>
				{displayContent()}
			</Grid>
		</>
	)
}

export default Explore
