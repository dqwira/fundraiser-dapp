import Web3 from 'web3'
/*
	getWeb3 berisi beberapa kondisi untuk menverifikasi jenis jaringan yang dipakai
	ketika mencoba terhubung ke dapp
*/
const getWeb3 = () =>
	new Promise((resolve, reject) => {
		// Tunggu hingga pemuatan selesai untuk menghindari kondisi balapan dengan waktu injeksi web3
		window.addEventListener('load', async () => {
			// verifikasi jaringan web3 dengan versi terbaru (window.ethereum) dari provider (metamask)
			if (window.ethereum) {
				const web3 = new Web3(window.ethereum)
				try {
					await window.ethereum.request({ method: 'eth_requestAccounts' })
					resolve(web3)
				} catch (error) {
					reject(error)
				}
			}
			// verifikasi jaringan web3 dengan versi lama (window.web3) dari provider (metamask)
			else if (window.web3) {
				const web3 = window.web3
				console.log('Injected web3 detected.')
				resolve(web3)
			}
			// Kembali ke localhost menggunakan port konsol dev secara default ...
			else {
				const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545')
				const web3 = new Web3(provider)
				console.log('No web3 instance injected, using Local web3.')
				resolve(web3)
			}
		})
	})

export default getWeb3
