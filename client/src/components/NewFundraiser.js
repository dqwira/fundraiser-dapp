import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import Notification from './Notification'
import { useWeb3 } from './Web3Provider'

const styles = {
	centered: {
		textAlign: 'center',
	},
	submitBtn: {
		marginTop: 2,
	},
	formCaption: {
		marginY: 3,
		textAlign: 'center',
		fontStyle: 'italic',
		color: '#555',
	},
}
const NewFundraiser = () => {
	const [name, setFundraiserName] = useState('')
	const [description, setFundraiserDescription] = useState('')
	const [website, setFundraiserWebsite] = useState('')
	const [image, setFundraiserImage] = useState('')
	const [address, setAddress] = useState('')
	const [successOpen, setSuccessOpen] = useState(false)
	const [successMsg, setSuccessMsg] = useState('')
	const { accounts, factory } = useWeb3()

	const handleSubmit = async () => {
		try {
			await factory.methods
				.createFundraiser(name, description, website, image, address)
				.send({ from: accounts[0] })

			setSuccessOpen(true)
			setSuccessMsg('Penggalangan dana berhasil dibuat')
			resetForm()
		} catch (err) {
			console.error(err)
		}
	}

	const resetForm = () => {
		setFundraiserName('')
		setFundraiserDescription('')
		setFundraiserWebsite('')
		setFundraiserImage('')
		setAddress('')
	}

	return (
		<>
			<Box sx={styles.centered}>
				<Typography gutterBottom variant="h2">
					Buat penggalangan dana baru
				</Typography>
				<Typography gutterBottom>
					Sebagai penggalang dana, anda dapat mengelola rincian penggalangan dana serta memilih alamat ETH penerima dana termasuk melakukan penarikan dana ke alamat ETH yang dipilih. 
				</Typography>
			</Box>
			<form>
				<TextField
					id="fundraiser-name-input"
					label="Nama Penggalangan Dana"
					variant="filled"
					margin="normal"
					value={name}
					onChange={e => setFundraiserName(e.target.value)}
					placeholder="Nama Penggalangan Dana"
					fullWidth
				/>
				<TextField
					id="fundraiser-description-input"
					label="Deskripsi"
					variant="filled"
					margin="normal"
					value={description}
					onChange={e => setFundraiserDescription(e.target.value)}
					placeholder="Deskripsi Penggalangan Dana"
					fullWidth
				/>
				<TextField
					id="fundraiser-website-input"
					label="Situs URL"
					variant="filled"
					margin="normal"
					value={website}
					onChange={e => setFundraiserWebsite(e.target.value)}
					placeholder="www.situspenggalangandana.com"
					fullWidth
				/>
				<TextField
					id="fundraiser-image-input"
					label="Gambar URL"
					variant="filled"
					margin="normal"
					value={image}
					onChange={e => setFundraiserImage(e.target.value)}
					placeholder="https://example.pengalangandana/gambar.png"
					fullWidth
				/>
				<TextField
					id="fundraiser-address-input"
					label="Alamat ETH Penerima dana"
					variant="filled"
					margin="normal"
					value={address}
					onChange={e => setAddress(e.target.value)}
					placeholder="0x0000000000000000000000000000000000000000"
					fullWidth
				/>
				<Button
					variant="contained"
					color="primary"
					size="large"
					onClick={handleSubmit}
					fullWidth
					sx={styles.submitBtn}
				>
					Buat Penggalangan Dana
				</Button>
			</form>
			<Typography gutterBottom sx={styles.formCaption} variant="body2">
				Semua form harus terisi, pastikan alamat ETH penerima dana valid.
			</Typography>
			{successOpen && <Notification open={successOpen} msg={successMsg} type="success" />}
		</>
	)
}

export default NewFundraiser
