/**
 * Memformat bilangan bulat tertentu menjadi angka berbasis IDR
 * @param {number} num menampung bilangan yang belum diformat untuk diformat
 * @returns {string} men-format angka ke format IDR dan 2 angka setelah koma
 */
const formatNumber = num => {
	if (!num) return ''
	const formatted = num.toLocaleString('id-ID', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
	return formatted
}
export default formatNumber
