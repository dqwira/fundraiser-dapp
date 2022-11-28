import { Box, Container, Typography } from '@mui/material'

const styles = {
	headlines: {
		textAlign: 'center',
		marginBottom: 2,
	},
	content: {
		textAlign: 'center',
	},
	p: {
		marginBottom: 2,
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
				Aplikasi donasi terdesentralisasi ini merupakan aplikasi untuk membuat penggalangan dana dan melakukan donasi ke daftar penggalangan dana yang dipilih, semua aksi dan transaksi pada aplikasi ini berbasis pada jaringan blockchain Ethereum dan menggunakan ETH (mata uang ethereum) untuk melakukan donasi.
			</Typography>
			<Typography sx={styles.p}>
				Sebagai pembuat penggalangan dana, anda dapat mengatur dana yang terkumpul serta memodifikasi rincian pada  penggalangan dana yang anda buat. Pengguna lain dapat melakukan donasi pada penggalangan dana, dan anda bertindak sebagai kustodian pada penggalangan dana ini. Anda dapat menarik dana yang sudah terkumpul ke akun penerima dana yang dipilih.
			</Typography>
			<Typography sx={styles.p}>
				Lihat daftar penggalangan dana yang sudah dibuat di menu <strong>Donasi</strong> dan tekan tombol <strong>Buat</strong> untuk membuat penggalangan dana baru.
			</Typography>
		</Container>
	</>
)

export default Home
