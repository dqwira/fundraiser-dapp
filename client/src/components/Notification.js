import { Close } from '@mui/icons-material'
import { Alert, IconButton, Snackbar } from '@mui/material'
import { useState } from 'react'

const Notification = props => {
	const { msg, open, type } = props
	const [isOpen, setIsOpen] = useState(open)

	const handleClose = (event, reason) => {
		if (reason === 'clickaway') return
		setIsOpen(false)
	}

	const action = (
		<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
			<Close fontSize="small" />
		</IconButton>
	)

	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={5000}
			onClose={handleClose}
			action={action}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
		>
			<Alert onClose={handleClose} severity={type}>
				{msg}
			</Alert>
		</Snackbar>
	)
}

export default Notification
