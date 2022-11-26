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
				Selamat Datang di Aplikasi Donasi Terdesentralisasi
			</Typography>
			<img src="/donasi.png" title="Fundraisers" alt="Fundraisers" width="200" height="200" />
		</Box>
		<Container maxWidth="sm" sx={styles.content}>
			<Typography sx={styles.p}>
				Aplikasi donasi terdesentralisasi ini hadir untuk membuat penggalangan dana dan melakukan donasi untuk 
				sesama yang membutuhkan, semua berbasis pada jaringan blockchain Ethereum dan tentunya menggunakan ether (mata uang ethereum) untuk melakukan donasi.
			</Typography>
			<Typography sx={styles.p}>
				Sebagai pembuat penggalangan dana, anda dapat mengelola dana dan detail penggalangan dana termasuk melakukan penarikan dana ke alamat ETH yang dipilih. User lain dapat melakukan donasi pada menu <strong>Donasi</strong> dan dapat melihat histori donasi yang disumbangkan.  
			</Typography>
			<Typography sx={styles.p}>
				Lihat daftar penggalangan dana yang sudah dibuat di menu <strong>Donasi</strong> dan anda dapat membuat penggalangan dana baru pada menu <strong>Buat</strong>.
			</Typography>
		</Container>
	</>
)

export default Home
