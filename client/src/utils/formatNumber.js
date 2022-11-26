/**
 * Formats a given integer into a US-based number. 1000000.55 -> 1,000,000.55
 * @param {number} num = The unformatted integer to format
 * @returns {string} A formatted US-based number with commas and two decimal places.
 */
const formatNumber = num => {
	if (!num) return ''
	const formatted = num.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
	return formatted
}
export default formatNumber
